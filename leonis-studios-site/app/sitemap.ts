import type { MetadataRoute }                            from "next";
import { client }                                         from "@/sanity/lib/client";
import { CASE_STUDY_DATES_QUERY, POST_DATES_QUERY }       from "@/sanity/lib/queries";
import siteConfig                                         from "@/site.config";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url:             siteConfig.url,
      lastModified:    now,
      changeFrequency: "weekly",
      priority:        1.0,
    },
    {
      url:             `${siteConfig.url}/work`,
      lastModified:    now,
      changeFrequency: "weekly",
      priority:        0.8,
    },
    {
      url:             `${siteConfig.url}/services`,
      lastModified:    now,
      changeFrequency: "weekly",
      priority:        0.9,
    },
    {
      url:             `${siteConfig.url}/about`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.7,
    },
    {
      url:             `${siteConfig.url}/contact`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.7,
    },
    {
      url:             `${siteConfig.url}/blog`,
      lastModified:    now,
      changeFrequency: "weekly",
      priority:        0.7,
    },
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const studies: { slug: string; _updatedAt: string; noindex: boolean }[] = await client.fetch(
      CASE_STUDY_DATES_QUERY,
      {},
      { next: { revalidate: 3600 } }
    );

    dynamicRoutes = studies
      .filter((s) => !s.noindex)
      .map((s) => ({
        url:             `${siteConfig.url}/work/${s.slug}`,
        lastModified:    new Date(s._updatedAt),
        changeFrequency: "monthly" as const,
        priority:        0.6,
      }));
  } catch {
    // Sanity unavailable at build time — static routes still work fine
  }

  let postRoutes: MetadataRoute.Sitemap = [];

  try {
    const posts: { slug: string; _updatedAt: string; noindex: boolean }[] = await client.fetch(
      POST_DATES_QUERY,
      {},
      { next: { revalidate: 3600 } }
    );

    postRoutes = posts
      .filter((p) => !p.noindex)
      .map((p) => ({
        url:             `${siteConfig.url}/blog/${p.slug}`,
        lastModified:    new Date(p._updatedAt),
        changeFrequency: "monthly" as const,
        priority:        0.6,
      }));
  } catch {
    // Sanity unavailable at build time — static routes still work fine
  }

  return [...staticRoutes, ...dynamicRoutes, ...postRoutes];
}
