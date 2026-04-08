// app/(site)/work/page.tsx
//
// The /work index page. Server Component — fetches all case
// studies from Sanity and passes them down to the client-side
// WorkGrid which handles filtering. Keeping data fetching here
// means the initial HTML is fully populated for SEO.

import type { Metadata } from "next";
import { client }        from "@/sanity/lib/client";
import { ALL_CASE_STUDIES_QUERY } from "@/sanity/lib/queries";
import type { CaseStudyCard }     from "@/lib/types";
import WorkGrid                   from "@/components/work/WorkGrid";
import siteConfig                 from "@/site.config";
import { colors }                 from "@/lib/colors";
import { tokens }                 from "@/lib/tokens";

export const metadata: Metadata = {
  title:       `Work — ${siteConfig.name}`,
  description: "Browse case studies from Leonis Studios — web design, Next.js development, SEO, and more.",
};

export default async function WorkPage() {
  const projects: CaseStudyCard[] = await client.fetch(
    ALL_CASE_STUDIES_QUERY,
    {},
    { next: { revalidate: 3600 } }
  );

  // ── JSON-LD structured data ──────────────────────────────
  const jsonLd = {
    "@context": "https://schema.org",
    "@type":    "CollectionPage",
    name:       "Our Work — Leonis Studios",
    description: metadata.description,
    url:        `${siteConfig.url}/work`,
    hasPart:    projects.map((p) => ({
      "@type":     "CreativeWork",
      name:        p.title,
      description: p.summary,
      url:         `${siteConfig.url}/work/${p.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ──────────────────────────────────────────────
          Dark header to match the home Hero section's palette.
          Animations use the same inline <style> + opacity:0
          pattern used throughout this codebase.
      ──────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-32 pt-40"
        style={{ background: colors.bgDark }}
      >
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Background geometric detail */}
        <div
          className="absolute top-0 right-0 w-[40vw] h-full pointer-events-none"
          style={{ opacity: 0.35 }}
          aria-hidden="true"
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-px"
            style={{ background: colors.accent, opacity: 0.2 }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 left-12 w-48 h-48"
            style={{ border: `1px solid ${colors.surfaceDark}` }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          {/* Eyebrow label */}
          <div
            className="flex items-center gap-4 mb-8"
            style={{
              opacity:   0,
              animation: "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards",
            }}
          >
            <div className="w-8 h-px" style={{ background: colors.accent }} />
            <span
              className="text-xs tracking-[0.25em] uppercase"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: tokens.weightUI,
                color:      colors.accent,
              }}
            >
              Case Studies
            </span>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontFamily:    "var(--font-display)",
              fontSize:      "clamp(48px, 9vw, 112px)",
              fontWeight:    tokens.weightDisplay,
              lineHeight:    0.92,
              letterSpacing: "-0.03em",
              color:         colors.bgLight,
              maxWidth:      "800px",
              opacity:       0,
              animation:     "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards",
            }}
          >
            Selected<br />
            <span style={{ color: colors.accent }}>Work.</span>
          </h1>

          {/* Description */}
          <p
            className="mt-8"
            style={{
              fontFamily: "var(--font-body)",
              fontSize:   "clamp(15px, 1.4vw, 18px)",
              fontWeight: tokens.weightBody,
              color:      colors.textSecondary,
              maxWidth:   "460px",
              lineHeight: 1.75,
              opacity:    0,
              animation:  "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards",
            }}
          >
            Every project is a collaboration. Here&apos;s a look at what
            we&apos;ve built — from brand-new launches to full-site rebuilds.
          </p>

        </div>
      </section>

      {/* ── Project grid ────────────────────────────────────── */}
      <WorkGrid projects={projects} />
    </>
  );
}
