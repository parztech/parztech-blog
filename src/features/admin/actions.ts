"use server";

import { and, eq, isNull, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import {
  posts,
  postStatuses,
  reactions,
  type PostRow,
  type PostStatus,
} from "@/db/schema";
import { MAX_TAGS } from "@/features/admin/constants";
import { SLUG_PATTERN } from "@/features/admin/lib/slug";
import { requireAdmin } from "@/features/auth/require-admin";
import { categories } from "@/features/blog/config/categories";
import { renderMarkdown } from "@/features/blog/lib/markdown";
import { announcePost } from "@/features/telegram/lib/announce";
import { routes } from "@/lib/routes";

const postInput = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, "Վերնագիրը պարտադիր է"),
  slug: z
    .string()
    .trim()
    .regex(
      SLUG_PATTERN,
      "Հասցեն կարող է պարունակել միայն լատինատառ, թվեր և գծիկ",
    ),
  description: z.string().trim().min(1, "Նկարագրությունը պարտադիր է"),
  content: z.string().min(1, "Բովանդակությունը պարտադիր է"),
  category: z.enum(categories.map((c) => c.slug) as [string, ...string[]]),
  tags: z.array(z.string().trim().min(1)).max(MAX_TAGS),
  featured: z.boolean(),
  status: z.enum(postStatuses),
});

export type PostInput = z.infer<typeof postInput>;

export type SaveResult =
  | {
      ok: true;
      id: string;
      status: PostStatus;
      /** Set when this first publish could not be posted to Telegram */
      telegramFailed?: boolean;
    }
  | { ok: false; error: string };

// Public pages, sitemap and RSS are prerendered; refreshing the root layout
// invalidates all of them (exact-path calls for the .xml routes have no effect)
function refreshSite() {
  revalidatePath(routes.home, "layout");
}

/** The DB unique index is the source of truth, which also covers concurrent saves */
function isSlugTaken(error: unknown) {
  for (let e = error; e instanceof Error; e = e.cause) {
    if (e.message.includes("UNIQUE constraint failed: posts.slug")) return true;
  }
  return false;
}

/** Inserts or updates the post; isFirstPublish is true only the first time it goes live */
async function writePost(
  id: string | undefined,
  data: Omit<PostInput, "id">,
  isPublishing: boolean,
): Promise<{ row: PostRow | undefined; isFirstPublish: boolean }> {
  if (!id) {
    const [row] = await db
      .insert(posts)
      .values({ ...data, publishedAt: isPublishing ? new Date() : null })
      .returning();
    return { row, isFirstPublish: isPublishing };
  }

  const update = db.update(posts).set(data).where(eq(posts.id, id)).returning();
  if (!isPublishing) {
    const [row] = await update;
    return { row, isFirstPublish: false };
  }

  // publishedAt is set only while still empty, so the original date survives
  // re-publishing, and only one of several concurrent saves gets the claim back.
  // A batch is atomic: if the update fails (e.g. slug taken), the claim rolls back.
  const [claimed, [row]] = await db.batch([
    db
      .update(posts)
      .set({ publishedAt: sql`unixepoch()` })
      .where(and(eq(posts.id, id), isNull(posts.publishedAt)))
      .returning({ id: posts.id }),
    update,
  ]);
  return { row, isFirstPublish: claimed.length > 0 };
}

export async function savePost(input: PostInput): Promise<SaveResult> {
  await requireAdmin();

  const parsed = postInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  const { id, ...data } = parsed.data;
  const isPublishing = data.status === "published";

  try {
    const { row, isFirstPublish } = await writePost(id, data, isPublishing);
    if (!row) return { ok: false, error: "Հոդվածը չի գտնվել" };

    refreshSite();

    const announcement = isFirstPublish ? await announcePost(row) : "skipped";
    return {
      ok: true,
      id: row.id,
      status: row.status,
      telegramFailed: announcement === "failed",
    };
  } catch (error) {
    if (isSlugTaken(error)) {
      return { ok: false, error: "Այս հասցեով հոդված արդեն կա" };
    }
    throw error;
  }
}

export async function deletePost(id: string) {
  await requireAdmin();
  // Explicit cleanup in case SQLite foreign-key enforcement is off
  await db.batch([
    db.delete(reactions).where(eq(reactions.postId, id)),
    db.delete(posts).where(eq(posts.id, id)),
  ]);
  refreshSite();
}

export async function previewMarkdown(markdown: string) {
  await requireAdmin();
  return (await renderMarkdown(markdown)).html;
}
