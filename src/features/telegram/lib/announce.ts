import "server-only";

import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site-url";

import { READ_POST_LABEL } from "../constants";
import { telegramChannel } from "./channel";

const REQUEST_TIMEOUT_MS = 8000;

export type AnnounceResult = "sent" | "skipped" | "failed";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Posts a new article to the Telegram channel; skipped when not configured */
export async function announcePost(post: {
  slug: string;
  title: string;
  description: string;
}): Promise<AnnounceResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !telegramChannel) return "skipped";
  // Local posts would link to localhost from the real channel
  if (process.env.NODE_ENV === "development") {
    console.info(`[telegram] Skipped in development: ${post.slug}`);
    return "skipped";
  }

  const url = absoluteUrl(routes.post(post.slug));
  const text = [
    `<b>${escapeHtml(post.title)}</b>`,
    escapeHtml(post.description),
    `<a href="${escapeHtml(url)}">${READ_POST_LABEL}</a>`,
  ].join("\n\n");

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: `@${telegramChannel.username}`,
          text,
          parse_mode: "HTML",
          // Large preview card built from the post's Open Graph image
          link_preview_options: { url, prefer_large_media: true },
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        cache: "no-store",
      },
    );
    if (!response.ok) {
      // Telegram explains the problem (e.g. bot not an admin) in "description"
      const body = (await response.json().catch(() => null)) as {
        description?: string;
      } | null;
      console.error(
        "Telegram sendMessage failed",
        response.status,
        body?.description,
      );
      return "failed";
    }
    return "sent";
  } catch (error) {
    console.error("Telegram request failed", error);
    return "failed";
  }
}
