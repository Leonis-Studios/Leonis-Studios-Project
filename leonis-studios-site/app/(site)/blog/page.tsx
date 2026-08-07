// app/(site)/blog/page.tsx
//
// The /blog index page. Server Component — fetches all posts
// plus the blogPage settings singleton (editable header/empty-state
// copy) from Sanity, and passes both to CaravanTrail, which supplies
// its own section header, so this page has no separate hero.
// Linked from the Navbar via site.config.ts.

import type { Metadata } from "next";
import { client }        from "@/sanity/lib/client";
import { ALL_POSTS_QUERY, BLOG_PAGE_QUERY } from "@/sanity/lib/queries";
import type { PostCard, BlogPageSettings }  from "@/lib/types";
import CaravanTrail         from "@/components/blog/CaravanTrail";
import siteConfig           from "@/site.config";
import { colors }           from "@/lib/colors";

const blogDescription =
  "Insights on web design, Next.js development, and SEO from the Leonis Studios team.";

export const metadata: Metadata = {
  title:       `Blog — ${siteConfig.name}`,
  description: blogDescription,
  keywords: [
    "Leonis Studios blog",
    "web design insights",
    "Next.js development blog",
    "SEO tips",
    "website growth strategy",
  ],
  openGraph: {
    title:       `Blog — ${siteConfig.name}`,
    description: blogDescription,
    url:  `${siteConfig.url}/blog`,
    type: "website",
  },
  twitter: {
    card:        "summary_large_image",
    title:       `Blog — ${siteConfig.name}`,
    description: blogDescription,
  },
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
};

export default async function BlogPage() {
  const posts: PostCard[] = await client
    .fetch(ALL_POSTS_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => []);

  const pageSettings: BlogPageSettings | null = await client
    .fetch(BLOG_PAGE_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => null);

  // ── JSON-LD structured data ──────────────────────────────
  const jsonLd = {
    "@context": "https://schema.org",
    "@type":    "CollectionPage",
    name:       "Blog — Leonis Studios",
    description: blogDescription,
    url:        `${siteConfig.url}/blog`,
    hasPart:    posts.map((p) => ({
      "@type":       "BlogPosting",
      headline:      p.title,
      description:   p.excerpt,
      datePublished: p.publishedAt,
      url:           `${siteConfig.url}/blog/${p.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* The Navbar is fixed + transparent-until-scrolled, with nav text
          styled for a dark background — every other page opens on a dark
          hero to stay legible under it. CaravanTrail is light, so this
          plain dark strip (nav height only, no content) stands in for
          that without reintroducing a duplicate header. */}
      <div className="pt-40" style={{ background: colors.bgDark }}>
        <CaravanTrail
          posts={posts}
          eyebrow={pageSettings?.eyebrow}
          headline={pageSettings?.headline}
          intro={pageSettings?.intro}
          emptyStateMessage={pageSettings?.emptyStateMessage}
        />
      </div>
    </>
  );
}
