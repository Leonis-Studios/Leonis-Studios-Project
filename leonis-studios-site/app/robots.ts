import type { MetadataRoute } from "next";
import siteConfig from "@/site.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow:     "/",
        disallow:  "/studio",
      },
      {
        // AI assistant / answer-engine crawlers — explicitly allowed
        // for AEO/GEO visibility, even though the wildcard rule above
        // already covers them (some engines prefer an explicit block).
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-SearchBot",
          "PerplexityBot",
          "Google-Extended",
        ],
        allow:    "/",
        disallow: "/studio",
      },
      {
        // ByteDance/TikTok crawler — blocked, feeds TikTok's own
        // training/search rather than a citation engine.
        userAgent: "Bytespider",
        disallow:  "/",
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
