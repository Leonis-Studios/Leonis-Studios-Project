// components/blog/CaravanTrail.tsx
//
// Server Component — no interactivity, so no "use client".
// Indexed, list-style blog index: italic serif numerals connected
// by a dotted "trail" line, sand/antique-gold palette. Self-contained
// and reusable — pass it posts (and optionally header copy) from
// anywhere. Header/empty-state copy is Sanity-editable via the
// blogPage singleton (see BLOG_PAGE_QUERY); the strings below are
// just the fallback defaults when that doc doesn't exist yet.

import Link from "next/link";
import Image from "next/image";
import type { PostCard } from "@/lib/types";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";

interface CaravanTrailProps {
  posts: PostCard[];
  eyebrow?: string;
  headline?: string;
  intro?: string;
  emptyStateMessage?: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Three offset dot-grid layers (each a single radial-gradient dot
// tiled via background-size, not repeating-radial-gradient — that
// radiates concentric rings from one origin instead of tiling) —
// tinted antique gold + navy over the warm paper tone for a grainy,
// speckled surface instead of a flat fill, echoing the SandGutter
// grain palette without a canvas per row.
const speckleBackground = {
  backgroundColor: colors.bgPaper,
  backgroundImage: `
    radial-gradient(circle, rgba(180,110,0,0.35) 0.5px, transparent 0.5px),
    radial-gradient(circle, rgba(20,33,61,0.22) 0.5px, transparent 0.5px),
    radial-gradient(circle, rgba(180,110,0,0.22) 0.5px, transparent 0.5px)
  `,
  backgroundSize: "6px 6px, 9px 9px, 13px 13px",
  backgroundPosition: "0 0, 3px 5px, 6px 2px",
};

export default function CaravanTrail({
  posts,
  eyebrow = "Journal",
  headline = "Latest dispatches.",
  intro = "Notes on web design, development, and growth, filed from the road, one stop at a time.",
  emptyStateMessage = "No dispatches yet, check back soon.",
}: CaravanTrailProps) {
  return (
    <section style={{ background: colors.bgSand }} className="py-24">
      <style>{`
        .trail-row {
          position: relative;
          border-bottom: 1px solid ${colors.borderWarm};
        }
        .trail-row:last-child {
          border-bottom: none;
        }
        .trail-connector {
          position: absolute;
          left: 22px;
          top: 0;
          bottom: 0;
          border-left: 2px dotted rgba(180,110,0,0.45);
          pointer-events: none;
        }
        .trail-link:focus-visible {
          outline: 2px solid ${colors.antiqueGold};
          outline-offset: 4px;
        }
        .trail-title {
          transition: color 0.25s ease;
        }
        .trail-link:hover .trail-title,
        .trail-link:focus-visible .trail-title {
          color: ${colors.antiqueGold};
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* ── Section header ──────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-px" style={{ background: colors.antiqueGold }} />
              <span
                className="text-xs tracking-[0.25em] uppercase"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: tokens.weightUI,
                  color: colors.antiqueGold,
                }}
              >
                {eyebrow}
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: tokens.weightDisplay,
                lineHeight: 0.95,
                letterSpacing: "-0.025em",
                color: colors.bgDark,
              }}
            >
              {headline}
            </h2>
          </div>

          <p
            className="max-w-sm"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: tokens.fontSizes.body,
              fontWeight: tokens.weightBody,
              color: colors.textMuted,
              lineHeight: 1.75,
            }}
          >
            {intro}
          </p>
        </div>

        {/* ── The trail ────────────────────────────────────────── */}
        {posts.length === 0 ? (
          <div className="py-16 text-center" style={{ borderTop: `1px solid ${colors.borderWarm}` }}>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "16px",
                fontWeight: tokens.weightBody,
                color: colors.textMuted,
              }}
            >
              {emptyStateMessage}
            </p>
          </div>
        ) : (
          <ol className="flex flex-col">
            {posts.map((post, index) => {
              const num = String(index + 1).padStart(2, "0");
              const readTime = Math.max(1, post.readTimeMinutes || 1);

              const isLast = index === posts.length - 1;

              return (
                <li key={post._id} className="trail-row">
                  {!isLast && <span className="trail-connector" aria-hidden="true" />}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="trail-link group relative z-10 flex items-center gap-6 lg:gap-8 py-8"
                  >
                    {/* Index numeral */}
                    <div className="shrink-0" style={{ width: "44px" }}>
                      <span
                        aria-hidden="true"
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontStyle: "italic",
                          fontWeight: 500,
                          fontSize: "26px",
                          color: colors.antiqueGold,
                          lineHeight: 1,
                          background: colors.bgSand,
                        }}
                      >
                        {num}
                      </span>
                    </div>

                    {/* Thumbnail */}
                    <div
                      className="shrink-0 overflow-hidden"
                      style={{ width: "88px", height: "88px", ...speckleBackground }}
                    >
                      {post.coverImage?.url && (
                        <Image
                          src={post.coverImage.url}
                          alt={post.coverImage.alt ?? post.title}
                          width={post.coverImage.width ?? 176}
                          height={post.coverImage.height ?? 176}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Title + excerpt */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="trail-title"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: tokens.fontSizes.h3Compact,
                          fontWeight: tokens.weightHeading,
                          letterSpacing: "-0.01em",
                          color: colors.bgDark,
                        }}
                      >
                        {post.title}
                      </h3>
                      <p
                        className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "14px",
                          fontWeight: tokens.weightBody,
                          color: colors.textMuted,
                        }}
                      >
                        {post.excerpt}
                      </p>

                      {/* Meta — mobile: below title. Desktop: hidden here, shown in right column. */}
                      <div
                        className="mt-3 flex items-center gap-3 lg:hidden"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: tokens.weightUI,
                          fontSize: "11px",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: colors.textMuted,
                        }}
                      >
                        <span>{formatDate(post.publishedAt)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{readTime} min read</span>
                        <span aria-hidden="true" style={{ color: colors.antiqueGold, fontSize: "14px" }}>
                          →
                        </span>
                      </div>
                    </div>

                    {/* Meta — desktop only, right-aligned */}
                    <div
                      className="hidden lg:flex shrink-0 items-center gap-4"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: tokens.weightUI,
                        fontSize: "12px",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: colors.textMuted,
                      }}
                    >
                      <span className="whitespace-nowrap">{formatDate(post.publishedAt)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="whitespace-nowrap">{readTime} min read</span>
                      <span
                        aria-hidden="true"
                        className="group-hover:translate-x-1 transition-transform duration-200"
                        style={{ color: colors.antiqueGold, fontSize: "18px" }}
                      >
                        →
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
