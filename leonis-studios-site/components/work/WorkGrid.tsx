"use client";

// components/work/WorkGrid.tsx
//
// Client component — needs useState for the active filter.
// Receives all projects from the server page as props so
// there is no client-side data fetching.

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { CaseStudyCard } from "@/lib/types";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";

interface WorkGridProps {
  projects: CaseStudyCard[];
}

export default function WorkGrid({ projects }: WorkGridProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  // Build the filter list from every tag that appears across
  // all projects. "All" is always first.
  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags ?? [])));
  const filters = ["All", ...allTags];

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.tags?.includes(activeFilter));

  return (
    <section style={{ background: colors.bgLight }} className="py-24">
      {/* CSS hover rules for card border + title colour.
          Tailwind hover:border-crimson is unreliable in v4
          because the custom token isn't always available as a
          utility class, so we define the rule ourselves. */}
      <style>{`
        .work-card {
          border: 1px solid ${colors.borderDark};
          transition: border-color 0.3s ease;
        }
        .work-card:hover {
          border-color: ${colors.accent};
        }
        .work-card:hover .work-card-title {
          color: ${colors.accent};
        }
        .work-card-title {
          transition: color 0.3s ease;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* ── Filter bar ──────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "12px",
                fontWeight: tokens.weightUI,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background:
                  activeFilter === filter ? colors.accent : "transparent",
                color:
                  activeFilter === filter ? colors.bgLight : colors.textMuted,
                border: `1px solid ${activeFilter === filter ? colors.accent : colors.borderDark}`,
                padding: "8px 20px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* ── Grid ────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "16px",
                fontWeight: tokens.weightBody,
                color: colors.textMuted,
              }}
            >
              No projects match that filter yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((project) => (
              <Link
                key={project._id}
                href={`/work/${project.slug}`}
                className="work-card group block"
              >
                {/* ── Cover image ──────────────────────────────── */}
                <div
                  className="aspect-video overflow-hidden"
                  style={{ background: colors.surfaceDark }}
                >
                  {project.coverImage?.url ? (
                    <Image
                      src={project.coverImage.url}
                      alt={project.coverImage.alt ?? project.title}
                      width={project.coverImage.width ?? 800}
                      height={project.coverImage.height ?? 450}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div
                        className="w-12 h-12"
                        style={{ background: colors.borderDark }}
                      />
                    </div>
                  )}
                </div>

                {/* ── Card content ─────────────────────────────── */}
                <div className="p-8" style={{ background: colors.bgCard }}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      {/* Client · Year */}
                      <p
                        className="text-xs tracking-[0.15em] uppercase mb-2"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: tokens.weightUI,
                          color: colors.textMuted,
                        }}
                      >
                        {project.client} · {project.year}
                      </p>

                      {/* Title */}
                      <h3
                        className="work-card-title"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: tokens.fontSizes.h3,
                          fontWeight: tokens.weightHeading,
                          letterSpacing: "-0.015em",
                          color: colors.bgDark,
                        }}
                      >
                        {project.title}
                      </h3>
                    </div>

                    {/* Arrow */}
                    <span
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200 shrink-0"
                      style={{ color: colors.accent, fontSize: "20px" }}
                    >
                      ↗
                    </span>
                  </div>

                  {/* Summary */}
                  <p
                    className="text-sm leading-relaxed mb-6"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: tokens.weightBody,
                      color: colors.textMuted,
                    }}
                  >
                    {project.summary}
                  </p>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs"
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: tokens.weightUI,
                            border: `1px solid ${colors.borderDark}`,
                            color: colors.textMuted,
                          }}
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
        )}
      </div>
    </section>
  );
}
