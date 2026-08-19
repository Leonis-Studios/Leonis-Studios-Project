// app/(site)/blog/[slug]/page.tsx
//
// Individual blog post page. Server Component — all data is
// fetched at request / build time. generateStaticParams
// pre-renders every slug at build time. generateMetadata
// provides dynamic title + OG data per post.
// Cloned from app/(site)/work/[slug]/page.tsx's pattern for
// visual + SEO consistency with the case study detail page.

import type { Metadata } from "next";
import type { Article, BreadcrumbList, FAQPage, WithContext } from "schema-dts";
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
import JsonLd from "@/components/JsonLd";
import ContentFAQ from "@/components/shared/ContentFAQ";

// Triple radial-gradient "speckle" texture — copied verbatim from
// components/blog/CaravanTrail.tsx so the sidebar card matches the
// grain of the /blog index page's thumbnails.
const speckleBackground = {
  backgroundColor: colors.duneSurface,
  backgroundImage: `
    radial-gradient(circle, rgba(180,110,0,0.35) 0.5px, transparent 0.5px),
    radial-gradient(circle, rgba(20,33,61,0.22) 0.5px, transparent 0.5px),
    radial-gradient(circle, rgba(180,110,0,0.22) 0.5px, transparent 0.5px)
  `,
  backgroundSize: "6px 6px, 9px 9px, 13px 13px",
  backgroundPosition: "0 0, 3px 5px, 6px 2px",
};

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

  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.excerpt;
  const ogImage = post.seoImage ?? post.coverImage?.url;

  return {
    // Root layout's title template already appends " — {name}".
    title,
    description,
    keywords: post.tags,
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${siteConfig.url}/blog/${post.slug}`,
    },
    robots: post.noindex ? { index: false, follow: true } : undefined,
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
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage?.url ?? undefined,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt ?? post.publishedAt,
    author: post.author
      ? {
          "@type": "Person",
          name: post.author.name,
          ...(post.author.sameAs?.length ? { sameAs: post.author.sameAs } : {}),
        }
      : { "@type": "Organization", name: siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
  } as const;
  const jsonLd = jsonLdData as unknown as WithContext<Article>;

  const breadcrumbLd: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Blog", item: `${siteConfig.url}/blog` },
      { "@type": "ListItem", position: 2, name: post.title, item: `${siteConfig.url}/blog/${post.slug}` },
    ],
  };

  const faqLd: WithContext<FAQPage> | null = post.faq && post.faq.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbLd} />
      {faqLd && <JsonLd data={faqLd} />}

      {/* ── Back link + cover ─────────────────────────────────── */}
      <div style={{ background: colors.duneBg }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase transition-colors duration-200"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: tokens.weightUI,
              color: colors.duneHeadline,
            }}
          >
            <span>←</span>
            <span>All Posts</span>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-12">
          {/* Kicker — navy chip / amber text, per Dune palette rule that
              amber only ever appears as text on a dark chip background */}
          <p
            className="inline-block text-xs tracking-[0.2em] uppercase mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: tokens.weightUI,
              background: colors.duneKickerBg,
              color: colors.duneKickerText,
              padding: "6px 14px",
            }}
          >
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {post.author?.name ? ` · ${post.author.name}` : ""}
            {post.readTimeMinutes ? ` · ${Math.max(1, post.readTimeMinutes)} min read` : ""}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 6vw, 72px)",
              fontWeight: tokens.weightDisplay,
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
              color: colors.duneHeadline,
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
                color: colors.duneBody,
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
            className="relative w-full aspect-video overflow-hidden"
            style={{ background: colors.duneSurface }}
          >
            <Image
              src={post.coverImage.url}
              alt={post.coverImage.alt ?? post.title}
              width={post.coverImage.width ?? 1600}
              height={post.coverImage.height ?? 900}
              className="w-full h-full object-cover"
              priority
            />
            {/* Reading-time badge — the one deliberate glass moment on this
                page. Dark navy-tinted frost (not white) so it reads
                consistently over any cover photo. */}
            {post.readTimeMinutes && (
              <div
                className="absolute"
                style={{
                  bottom: "16px",
                  right: "16px",
                  padding: "6px 12px",
                  background: "rgba(20,33,61,0.35)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  border: "1px solid rgba(252,163,17,0.25)",
                  fontFamily: "var(--font-display)",
                  fontSize: "11px",
                  fontWeight: tokens.weightUI,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: colors.accent,
                }}
              >
                {Math.max(1, post.readTimeMinutes)} min read
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Content area ──────────────────────────────────────── */}
      <div style={{ background: colors.duneBg, position: "relative", zIndex: 1, overflow: "hidden" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              {post.body && post.body.length > 0 ? (
                <div className="prose-leonis prose-desert">
                  <PortableText value={post.body} />
                </div>
              ) : (
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "16px",
                    fontWeight: tokens.weightBody,
                    color: colors.duneMuted,
                  }}
                >
                  Full post coming soon.
                </p>
              )}
            </div>

            <aside>
              <div
                className="flex flex-col gap-6 p-8"
                style={{ ...speckleBackground, border: `1px solid ${colors.duneDivider}` }}
              >
                {/* Published */}
                <div>
                  <p
                    className="text-xs tracking-[0.2em] uppercase mb-1"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: tokens.weightUI,
                      color: colors.duneMuted,
                    }}
                  >
                    Published
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      fontSize: "16px",
                      color: colors.duneBody,
                    }}
                  >
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* Reading Time */}
                {post.readTimeMinutes && (
                  <div>
                    <p
                      className="text-xs tracking-[0.2em] uppercase mb-1"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: tokens.weightUI,
                        color: colors.duneMuted,
                      }}
                    >
                      Reading Time
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontStyle: "italic",
                        fontSize: "16px",
                        color: colors.duneBody,
                      }}
                    >
                      {Math.max(1, post.readTimeMinutes)} min read
                    </p>
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div>
                    <p
                      className="text-xs tracking-[0.2em] uppercase mb-2"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: tokens.weightUI,
                        color: colors.duneMuted,
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
                            background: colors.duneChipBg,
                            color: colors.duneChipText,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {post.faq && post.faq.length > 0 && (
        <ContentFAQ items={post.faq} />
      )}

      {/* ── Next post CTA ──────────────────────────────────────── */}
      <div
        className="py-16 text-center"
        style={{
          background: colors.duneBg,
          borderTop: `1px solid ${colors.duneDivider}`,
        }}
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-3 text-xs tracking-[0.15em] uppercase transition-colors duration-200"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: tokens.weightUI,
            color: colors.duneHeadline,
          }}
        >
          <span>← Back to All Posts</span>
        </Link>
      </div>
    </>
  );
}
