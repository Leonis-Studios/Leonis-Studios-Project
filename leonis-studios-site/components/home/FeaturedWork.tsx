// Server Component — fetches data directly from Sanity.
// Hover interactivity is handled by the child FeaturedWorkGrid client component.

import Link                            from "next/link"; // used for "View All Work" header link
import { client }                      from "@/sanity/lib/client";
import { FEATURED_CASE_STUDIES_QUERY } from "@/sanity/lib/queries";
import type { CaseStudyCard }          from "@/lib/types";
import FeaturedWorkGrid                from "@/components/home/FeaturedWorkGrid";
import { colors }                      from "@/lib/colors";

export default async function FeaturedWork() {
  const projects: CaseStudyCard[] = await client.fetch(
    FEATURED_CASE_STUDIES_QUERY,
    {},
    { next: { revalidate: 3600 } }
  );

  // If no featured projects yet, show nothing.
  // This lets the page render cleanly while the CMS
  // is still being populated.
  if (!projects.length) return null;

  return (
    <section className="py-24" style={{background: colors.bgMuted}}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Section header ───────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-px" style={{ background: colors.accent }} />
              <span
                className="text-xs tracking-[0.25em] uppercase"
                style={{ color: colors.accent, fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                Selected Work
              </span>
            </div>
            <h2
              style={{
                fontFamily:    "var(--font-display)",
                fontSize:      "clamp(32px, 5vw, 64px)",
                fontWeight:    800,
                lineHeight:    0.95,
                letterSpacing: "-0.025em",
                color:         "var(--color-black)",
              }}
            >
              Recent Projects
            </h2>
          </div>
          <Link
            href="/work"
            className="text-neutral-600 hover:text-black text-xs tracking-[0.15em] uppercase transition-colors duration-200 flex items-center gap-2 group self-end"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            <span>View All Work</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
        </div>

        {/* ── Project cards (client component handles hover) ── */}
        <FeaturedWorkGrid projects={projects} />

      </div>
    </section>
  );
}
