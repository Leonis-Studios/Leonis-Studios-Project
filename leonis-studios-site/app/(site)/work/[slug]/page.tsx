// app/(site)/work/[slug]/page.tsx
//
// Individual case study detail page.
// Server Component — all data is fetched at request / build time.
// generateStaticParams pre-renders every slug at build time.
// generateMetadata provides dynamic title + OG data per project.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import {
  CASE_STUDY_BY_SLUG_QUERY,
  ALL_CASE_STUDY_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import type { CaseStudy } from "@/lib/types";
import siteConfig from "@/site.config";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";

// ── Static params ──────────────────────────────────────────────
// Next.js calls this at build time to pre-render every slug.
export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(
    ALL_CASE_STUDY_SLUGS_QUERY,
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
  const project: CaseStudy | null = await client.fetch(
    CASE_STUDY_BY_SLUG_QUERY,
    { slug },
    { next: { revalidate: 3600 } },
  );

  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} — ${siteConfig.name}`,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.coverImage?.url
        ? [{ url: project.coverImage.url, width: 1200, height: 630 }]
        : [],
    },
  };
}

// ── Page ───────────────────────────────────────────────────────
export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project: CaseStudy | null = await client.fetch(
    CASE_STUDY_BY_SLUG_QUERY,
    { slug },
    { next: { revalidate: 3600 } },
  );

  if (!project) notFound();

  // ── JSON-LD structured data ──────────────────────────────
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description: project.summary,
    image: project.coverImage?.url ?? undefined,
    datePublished: String(project.year),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: `${siteConfig.url}/work/${project.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Back link + cover ─────────────────────────────────
          Dark strip at the top holds the navigation and the
          full-width cover image so it bleeds edge-to-edge.
      ──────────────────────────────────────────────────────── */}
      <div style={{ background: colors.bgDark }}>
        {/* Back navigation */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-8">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase transition-colors duration-200"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: tokens.weightUI,
              color: colors.textSecondary,
            }}
          >
            <span>←</span>
            <span>All Work</span>
          </Link>
        </div>

        {/* Project title block */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-12">
          <p
            className="text-xs tracking-[0.2em] uppercase mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: tokens.weightUI,
              color: colors.accent,
            }}
          >
            {project.client} · {project.year}
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
            {project.title}
          </h1>
          {project.summary && (
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
              {project.summary}
            </p>
          )}
        </div>

        {/* Full-width cover image */}
        {project.coverImage?.url && (
          <div
            className="w-full aspect-video overflow-hidden"
            style={{ background: colors.surfaceDark }}
          >
            <Image
              src={project.coverImage.url}
              alt={project.coverImage.alt ?? project.title}
              width={project.coverImage.width ?? 1600}
              height={project.coverImage.height ?? 900}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}
      </div>

      {/* ── Content area ──────────────────────────────────────
          Off-white section with the two-column layout.
          Left: Portable Text body copy.
          Right: sidebar with meta, services, results.
      ──────────────────────────────────────────────────────── */}
      <div style={{ background: colors.bgLight }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* ── Body copy ──────────────────────────────────── */}
            <div className="lg:col-span-2">
              {project.body && project.body.length > 0 ? (
                <div className="prose-leonis">
                  <PortableText value={project.body} />
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
                  Full case study coming soon.
                </p>
              )}
            </div>

            {/* ── Sidebar ────────────────────────────────────── */}
            <aside>
              {/* Results / metrics — shown first if they exist */}
              {project.results && project.results.length > 0 && (
                <div
                  className="mb-10 pb-10"
                  style={{ borderBottom: `1px solid ${colors.borderLight}` }}
                >
                  <p
                    className="text-xs tracking-[0.2em] uppercase mb-6"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: tokens.weightUI,
                      color: colors.textMuted,
                    }}
                  >
                    Results
                  </p>
                  <div className="flex flex-col gap-6">
                    {project.results.map((r) => (
                      <div key={r.label}>
                        <p
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(28px, 4vw, 44px)",
                            fontWeight: tokens.weightDisplay,
                            lineHeight: 1,
                            letterSpacing: "-0.02em",
                            color: colors.textSubtle,
                          }}
                        >
                          {r.value}
                        </p>
                        <p
                          className="mt-1 text-xs tracking-[0.12em] uppercase"
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: tokens.weightUI,
                            color: colors.textMuted,
                          }}
                        >
                          {r.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project meta */}
              <div className="flex flex-col gap-6">
                {/* Client */}
                <div>
                  <p
                    className="text-xs tracking-[0.2em] uppercase mb-1"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: tokens.weightUI,
                      color: colors.textMuted,
                    }}
                  >
                    Client
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "15px",
                      fontWeight: tokens.weightHeading,
                      color: colors.bgDark,
                    }}
                  >
                    {project.client}
                  </p>
                </div>

                {/* Year */}
                <div>
                  <p
                    className="text-xs tracking-[0.2em] uppercase mb-1"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: tokens.weightUI,
                      color: colors.textMuted,
                    }}
                  >
                    Year
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "15px",
                      fontWeight: tokens.weightHeading,
                      color: colors.bgDark,
                    }}
                  >
                    {project.year}
                  </p>
                </div>

                {/* Services */}
                {project.services && project.services.length > 0 && (
                  <div>
                    <p
                      className="text-xs tracking-[0.2em] uppercase mb-2"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: tokens.weightUI,
                        color: colors.textMuted,
                      }}
                    >
                      Services
                    </p>
                    <div className="flex flex-col gap-1">
                      {project.services.map((s) => (
                        <p
                          key={s.slug}
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "14px",
                            fontWeight: tokens.weightSecondary,
                            color: colors.textSubtle,
                          }}
                        >
                          {s.name}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Live URL */}
                {project.liveUrl && (
                  <div>
                    <p
                      className="text-xs tracking-[0.2em] uppercase mb-1"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: tokens.weightUI,
                        color: colors.textMuted,
                      }}
                    >
                      Live Site
                    </p>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm transition-colors duration-200"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: tokens.weightUI,
                        color: colors.accent,
                      }}
                    >
                      <span>Visit site</span>
                      <span>↗</span>
                    </a>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* ── Next project CTA ──────────────────────────────────── */}
      <div
        className="py-16 text-center"
        style={{
          background: colors.bgDark,
          borderTop: `1px solid ${colors.surfaceDark}`,
        }}
      >
        <Link
          href="/work"
          className="inline-flex items-center gap-3 text-xs tracking-[0.15em] uppercase transition-colors duration-200"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: tokens.weightUI,
            color: colors.textSecondary,
          }}
        >
          <span>← Back to All Work</span>
        </Link>
      </div>
    </>
  );
}
