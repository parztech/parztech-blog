import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";

/** Lets Android show the brand icon on the home screen and in tab switchers */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    lang: "hy",
    start_url: routes.home,
    display: "standalone",
    background_color: siteConfig.themeColor.light,
    theme_color: siteConfig.themeColor.light,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      // Full-bleed variant: Android crops it into its own icon shape
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
