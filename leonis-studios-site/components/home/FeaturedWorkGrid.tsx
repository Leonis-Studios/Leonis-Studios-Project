"use client";

import { useState }       from "react";
import Link               from "next/link";
import Image              from "next/image";
import type { CaseStudyCard } from "@/lib/types";
import { colors }             from "@/lib/colors";
import { tokens }             from "@/lib/tokens";

export default function FeaturedWorkGrid({ projects }: { projects: CaseStudyCard[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {projects.map((project) => {
        const hovered = hoveredId === project._id;
        return (
          <Link
            key={project._id}
            href={`/work/${project.slug}`}
            className="block"
            style={{
              background:  colors.bgCard,
              border:      hovered ? `1px solid ${colors.accent}` : `1px solid ${colors.bgMuted}`,
              transition:  "border-color 0.3s",
              textDecoration: "none",
            }}
            onMouseEnter={() => setHoveredId(project._id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Cover image */}
            <div
              className="aspect-video overflow-hidden"
              style={{ background: colors.bgMuted }}
            >
              {project.coverImage?.url ? (
                <Image
                  src={project.coverImage.url}
                  alt={project.coverImage.alt}
                  width={800}
                  height={450}
                  className="w-full h-full object-cover"
                  style={{
                    transform:  hovered ? "scale(1.05)" : "scale(1)",
                    transition: "transform 0.5s",
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-12 h-12" style={{ background: colors.borderLight }} />
                </div>
              )}
            </div>

            {/* Card content */}
            <div className="p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p
                    className="text-xs tracking-[0.15em] uppercase mb-2"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: tokens.weightUI,
                      color:      colors.textSecondary,
                    }}
                  >
                    {project.client} · {project.year}
                  </p>
                  <h3
                    style={{
                      fontFamily:    "var(--font-display)",
                      fontSize:      tokens.fontSizes.h3,
                      fontWeight:    tokens.weightHeading,
                      letterSpacing: "-0.015em",
                      color:         hovered ? colors.accent : colors.bgDark,
                      transition:    "color 0.3s",
                    }}
                  >
                    {project.title}
                  </h3>
                </div>
                <span
                  className="text-xl shrink-0"
                  style={{
                    color:      colors.accent,
                    transform:  hovered ? "translate(2px, -2px)" : "translate(0, 0)",
                    transition: "transform 0.2s",
                    display:    "inline-block",
                  }}
                >
                  ↗
                </span>
              </div>

              <p
                className="text-sm leading-relaxed mb-6"
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: tokens.weightBody,
                  color:      colors.textSecondary,
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
                        background: colors.bgCard,
                        border:     `1px solid ${colors.bgMuted}`,
                        color:      colors.textSecondary,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
