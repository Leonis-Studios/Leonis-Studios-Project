"use client";

import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { FEATURED_CASE_STUDIES_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { CaseStudyCard } from "@/lib/types";

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
    <section className="py-24" style={{background: "#e8e8e8"}}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Section header ───────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-px bg-crimson" />
              <span
                className="text-crimson text-xs tracking-[0.25em] uppercase"
                style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
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

        {/* ── Project cards ────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link
              key={project._id}
              href={`/work/${project.slug}`}
              className="group block bg-white border border-neutral-200 hover:border-crimson transition-colors duration-300"
            >
              {/* Cover image */}
              <div className="aspect-video bg-neutral-100 overflow-hidden">
                {project.coverImage?.url ? (
  <Image
    src={project.coverImage.url}
    alt={project.coverImage.alt}
    width={800}
    height={450}
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
  />
) : (
  <div className="w-full h-full flex items-center justify-center">
    <div className="w-12 h-12 bg-neutral-200" />
  </div>
)}
              </div>

              {/* Card content */}
              <div className="p-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p
                      className="text-neutral-600 text-xs tracking-[0.15em] uppercase mb-2"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                    >
                      {project.client} · {project.year}
                    </p>
                    <h3
                      className="text-black group-hover:text-crimson transition-colors duration-300"
                      style={{
                        fontFamily:    "var(--font-display)",
                        fontSize:      "clamp(18px, 2vw, 24px)",
                        fontWeight:    700,
                        letterSpacing: "-0.015em",
                      }}
                    >
                      {project.title}
                    </h3>
                  </div>
                  <span className="text-crimson text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200 shrink-0">
                    ↗
                  </span>
                </div>

                <p
                  className="text-neutral-600 text-sm leading-relaxed mb-6"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
                >
                  {project.summary}
                </p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-white border border-neutral-200 text-neutral-600 text-xs tracking-wideset"
                        style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}