// Server Component — fetches the scrolling item list from Sanity
// (homePage.marquee.items), falling back to the defaults below.

import { client } from "@/sanity/lib/client";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";
import type { HomePageData } from "@/lib/types";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";

const DEFAULT_ITEMS = [
  "Web Design",
  "Next.js Development",
  "SEO Optimization",
  "AEO Optimization",
  "Branding & Identity",
  "Online Presence Growth",
  "Monthly Maintenance",
  "Performance Auditing",
];

// Minimum number of items rendered in the strip — repeated enough
// that it never runs out of content on very wide viewports (1440p+/
// ultrawide) before looping, even if an editor sets a short list.
// translateX must move by exactly 100 / REPEAT % so the loop is seamless.
const MIN_RENDERED = 24;

export default async function Marquee() {
  const homePage: HomePageData | null = await client
    .fetch(HOME_PAGE_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => null);

  const items = homePage?.marquee?.items?.length ? homePage.marquee.items : DEFAULT_ITEMS;
  const REPEAT = Math.max(3, Math.ceil(MIN_RENDERED / items.length));
  const repeated = Array.from({ length: REPEAT }, () => items).flat();

  return (
    <div
      className="py-5 overflow-hidden"
      style={{ background: colors.accent, minHeight: "48px" }}
      aria-hidden="true"
    >
      {/* ── Keyframe defined inline ───────────────────────────
          Defining it here guarantees it's available regardless
          of how Tailwind v4 processes globals.css at build time.
      ──────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-${100 / REPEAT}%); }
        }
      `}</style>

      <div
        className="flex whitespace-nowrap"
        style={{ animation: "marquee 45s linear infinite", width: "max-content" }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className="flex items-center"
            style={{ fontFamily: "var(--font-display)", fontWeight: tokens.weightUI }}
          >
            <span
              className="text-xs tracking-[0.2em] uppercase px-8"
              style={{
                color: i % 2 === 0 ? colors.bgLight : "rgba(255,255,255,0.6)",
              }}
            >
              {item}
            </span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px" }}>
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
