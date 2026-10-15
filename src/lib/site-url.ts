/**
 * Public site address used for canonical URLs, sitemap, RSS and social previews.
 * NEXT_PUBLIC_SITE_URL overrides it; on Vercel the custom domain is used.
 */
const productionUrl = "https://www.parztech.am";

function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  }
  if (process.env.VERCEL) {
    return productionUrl;
  }
  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}
