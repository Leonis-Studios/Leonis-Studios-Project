// app/(site)/blog/[slug]/page.tsx
//
// Individual blog post page. Server Component — all data is
// fetched at request / build time. generateStaticParams
// pre-renders every slug at build time. generateMetadata
// provides dynamic title + OG data per post.
// Cloned from app/(site)/work/[slug]/page.tsx's pattern for
// visual + SEO consistency with the case study detail page.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import {
  POST_BY_SLUG_QUERY,
  ALL_POST_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import type { Post } from "@/lib/types";
import siteConfig from "@/site.config";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";

// ── Static params ──────────────────────────────────────────────
export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(
    ALL_POST_SLUGS_QUERY,
  );
  return slugs.map(({ slug }) => ({ slug }));
}

// ── Metadata ───────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post: Post | null = await client.fetch(
    POST_BY_SLUG_QUERY,
    { slug },
    { next: { revalidate: 3600 } },
  );

  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} — ${siteConfig.name}`,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteConfig.url}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      images: post.coverImage?.url
        ? [{ url: post.coverImage.url, width: 1200, height: 630 }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: `${siteConfig.url}/blog/${post.slug}`,
    },
  };
}

// ── Page ───────────────────────────────────────────────────────
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post: Post | null = await client.fetch(
    POST_BY_SLUG_QUERY,
    { slug },
    { next: { revalidate: 3600 } },
  );

  if (!post) notFound();

  // ── JSON-LD structured data ──────────────────────────────
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage?.url ?? undefined,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt ?? post.publishedAt,
    author: post.author
      ? { "@type": "Person", name: post.author }
      : { "@type": "Organization", name: siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Blog", item: `${siteConfig.url}/blog` },
      { "@type": "ListItem", position: 2, name: post.title, item: `${siteConfig.url}/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* ── Back link + cover ─────────────────────────────────── */}
      <div style={{ background: colors.bgDark }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase transition-colors duration-200"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: tokens.weightUI,
              color: colors.textSecondary,
            }}
          >
            <span>←</span>
            <span>All Posts</span>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-12">
          <p
            className="text-xs tracking-[0.2em] uppercase mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: tokens.weightUI,
              color: colors.accent,
            }}
          >
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {post.author ? ` · ${post.author}` : ""}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 6vw, 72px)",
              fontWeight: tokens.weightDisplay,
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
              color: colors.bgLight,
              maxWidth: "820px",
            }}
          >
            {post.title}
          </h1>
          {post.excerpt && (
            <p
              className="mt-6"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: tokens.fontSizes.bodyLarge,
                fontWeight: tokens.weightBody,
                color: colors.textSecondaryLight,
                maxWidth: "560px",
                lineHeight: 1.75,
              }}
            >
              {post.excerpt}
            </p>
          )}
        </div>

        {post.coverImage?.url && (
          <div
            className="w-full aspect-video overflow-hidden"
            style={{ background: colors.surfaceDark }}
          >
            <Image
              src={post.coverImage.url}
              alt={post.coverImage.alt ?? post.title}
              width={post.coverImage.width ?? 1600}
              height={post.coverImage.height ?? 900}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}
      </div>

      {/* ── Content area ──────────────────────────────────────── */}
      <div style={{ background: colors.bgLight }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              {post.body && post.body.length > 0 ? (
                <div className="prose-leonis">
                  <PortableText value={post.body} />
                </div>
              ) : (
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "16px",
                    fontWeight: tokens.weightBody,
                    color: colors.textMuted,
                  }}
                >
                  Full post coming soon.
                </p>
              )}
            </div>

            <aside>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-col gap-6">
                  <div>
                    <p
                      className="text-xs tracking-[0.2em] uppercase mb-2"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: tokens.weightUI,
                        color: colors.textMuted,
                      }}
                    >
                      Tags
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs"
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: tokens.weightUI,
                            border: `1px solid ${colors.borderLight}`,
                            color: colors.textSubtle,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>

      {/* ── Next post CTA ──────────────────────────────────────── */}
      <div
        className="py-16 text-center"
        style={{
          background: colors.bgDark,
          borderTop: `1px solid ${colors.surfaceDark}`,
        }}
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-3 text-xs tracking-[0.15em] uppercase transition-colors duration-200"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: tokens.weightUI,
            color: colors.textSecondary,
          }}
        >
          <span>← Back to All Posts</span>
        </Link>
      </div>
    </>
  );
}
