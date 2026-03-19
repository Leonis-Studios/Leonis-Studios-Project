"use client";

import { useState }       from "react";
import Link               from "next/link";
import Image              from "next/image";
import type { CaseStudyCard } from "@/lib/types";

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
              background:  "#ffffff",
              border:      hovered ? "1px solid #c41e3a" : "1px solid #e8e8e8",
              transition:  "border-color 0.3s",
              textDecoration: "none",
            }}
            onMouseEnter={() => setHoveredId(project._id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Cover image */}
            <div
              className="aspect-video overflow-hidden"
              style={{ background: "#e8e8e8" }}
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
                  <div className="w-12 h-12" style={{ background: "#cccccc" }} />
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
                      fontWeight: 500,
                      color:      "#888888",
                    }}
                  >
                    {project.client} · {project.year}
                  </p>
                  <h3
                    style={{
                      fontFamily:    "var(--font-display)",
                      fontSize:      "clamp(18px, 2vw, 24px)",
                      fontWeight:    700,
                      letterSpacing: "-0.015em",
                      color:         hovered ? "#c41e3a" : "#0a0a0a",
                      transition:    "color 0.3s",
                    }}
                  >
                    {project.title}
                  </h3>
                </div>
                <span
                  className="text-xl shrink-0"
                  style={{
                    color:      "#c41e3a",
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
                  fontWeight: 300,
                  color:      "#888888",
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
                        fontWeight: 500,
                        background: "#ffffff",
                        border:     "1px solid #e8e8e8",
                        color:      "#888888",
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
