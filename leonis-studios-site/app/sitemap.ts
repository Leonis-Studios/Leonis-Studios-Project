import type { MetadataRoute } from "next";
import { client }             from "@/sanity/lib/client";
import siteConfig             from "@/site.config";

// Fetches slug + last-modified date for each case study
const CASE_STUDY_DATES_QUERY = `
  *[_type == "caseStudy"] { "slug": slug.current, _updatedAt }
`;

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
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const studies: { slug: string; _updatedAt: string }[] = await client.fetch(
      CASE_STUDY_DATES_QUERY,
      {},
      { next: { revalidate: 3600 } }
    );

    dynamicRoutes = studies.map((s) => ({
      url:             `${siteConfig.url}/work/${s.slug}`,
      lastModified:    new Date(s._updatedAt),
      changeFrequency: "monthly" as const,
      priority:        0.6,
    }));
  } catch {
    // Sanity unavailable at build time — static routes still work fine
  }

  return [...staticRoutes, ...dynamicRoutes];
}
