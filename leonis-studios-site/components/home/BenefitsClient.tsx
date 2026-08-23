"use client";
// "use client" is required here because this component uses:
//   - useRef + IntersectionObserver (to trigger the sand-curtain reveal on scroll)
//   - useState + useEffect + canvas (to animate the reveal)
// Copy comes in as props from the Server Component parent (Benefits.tsx),
// which fetches it from Sanity — see homePage.benefitsSection in the schema.
// This is a one-shot reveal animation, distinct from SandGutter's continuous
// ambient gutter grains — it does not use or modify SandGutter.

import { useRef, useEffect, useState } from "react";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";
import type { HomePageData } from "@/lib/types";

const DEFAULT_BENEFITS = [
  {
    title: "Found in search, not just online",
    description:
      "We build sites that rank on Google the right way, with technical SEO, real content, and pages built to be found by the people already searching for what you do.",
  },
  {
    title: "Built for AI answer engines",
    description:
      "Tools like ChatGPT and Perplexity are answering questions your customers used to Google. We structure your content so those tools can actually find you and recommend you.",
  },
  {
    title: "Visible everywhere people search",
    description:
      "Search has spread across maps, voice, social, and AI chat, not just a results page. We set your site up to show up across all of it, wherever your customers are looking.",
  },
  {
    title: "Design built around your business",
    description:
      "No templates stretched to fit. Every site starts from your brand, your customers, and what you actually sell, then gets designed and built from there.",
  },
  {
    title: "A site that keeps earning its place",
    description:
      "Launch day is the start, not the finish. We keep an eye on performance, uptime, and content so your site stays fast and current long after it goes live.",
  },
];

// One simple line icon per card position — not CMS-editable, matches the
// fixed 5-item layout (3 + 2 rows).
const ICON_PATHS: React.ReactNode[] = [
  // Search / SEO
  <g key="search">
    <circle cx="10.5" cy="10.5" r="6" />
    <line x1="15.2" y1="15.2" x2="20" y2="20" />
  </g>,
  // Chat / AI answer engines
  <g key="chat">
    <path d="M4 6.5C4 5.1 5.1 4 6.5 4h11C18.9 4 20 5.1 20 6.5v7c0 1.4-1.1 2.5-2.5 2.5H10l-4.5 4v-4H6.5C5.1 16 4 14.9 4 13.5v-7Z" />
    <line x1="8" y1="8.5" x2="16" y2="8.5" />
    <line x1="8" y1="11.5" x2="13" y2="11.5" />
  </g>,
  // Globe / everywhere search
  <g key="globe">
    <circle cx="12" cy="12" r="8" />
    <ellipse cx="12" cy="12" rx="3.4" ry="8" />
    <line x1="4" y1="12" x2="20" y2="12" />
  </g>,
  // Ruler / custom design
  <g key="design">
    <path d="M4 16.5 15.5 5a1.5 1.5 0 0 1 2.12 0l1.38 1.38a1.5 1.5 0 0 1 0 2.12L7.5 20 4 20.5 4 16.5Z" />
    <line x1="13" y1="7.5" x2="15.5" y2="10" />
    <line x1="10.5" y1="10" x2="13" y2="12.5" />
  </g>,
  // Shield-check / ongoing care
  <g key="shield">
    <path d="M12 3.5 19 6v5.2c0 4.4-2.9 7.6-7 9.3-4.1-1.7-7-4.9-7-9.3V6l7-2.5Z" />
    <path d="M9 11.8l2 2 4-4.2" />
  </g>,
];

function BenefitIcon({ index }: { index: number }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={colors.accent}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[index % ICON_PATHS.length]}
    </svg>
  );
}

interface RevealGrain {
  x:            number;
  startY:       number;
  travel:       number;
  r:            number;
  baseAlpha:    number;
  delay:        number;
  fallDuration: number;
  swayAmp:      number;
  swayFreq:     number;
}

const REVEAL_COLOR = "180,110,0"; // dark gold — reads against the light dune surface

function makeRevealGrains(w: number, h: number): RevealGrain[] {
  const count = Math.round((w * h) / 1400);
  const grains: RevealGrain[] = [];
  for (let i = 0; i < count; i++) {
    grains.push({
      x:            Math.random() * w,
      startY:       Math.random() * h * 0.9,
      travel:       h * (0.5 + Math.random() * 0.7),
      r:            0.6 + Math.random() * 1.6,
      baseAlpha:    0.18 + Math.random() * 0.4,
      delay:        Math.random() * 550,
      fallDuration: 500 + Math.random() * 500,
      swayAmp:      Math.random() * 4,
      swayFreq:     0.004 + Math.random() * 0.006,
    });
  }
  return grains;
}

export default function BenefitsClient({
  benefitsSection,
}: {
  benefitsSection?: HomePageData["benefitsSection"];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [revealed, setRevealed]   = useState(false);
  const [showCanvas, setShowCanvas] = useState(true);
  const [skipAnimation, setSkipAnimation] = useState(false);

  const eyebrow  = benefitsSection?.eyebrow  || "Why Leonis";
  const headline = benefitsSection?.headline || "Built to be found.";
  const subtext  =
    benefitsSection?.subtext ||
    "Search does not work the way it used to. We design and build with all of it in mind, from Google to the AI tools people now ask instead.";
  const items = benefitsSection?.items?.length ? benefitsSection.items : DEFAULT_BENEFITS;

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setSkipAnimation(true);
      setRevealed(true);
      setShowCanvas(false);
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!triggered || skipAnimation) return;

    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = section.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width  = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const grains = makeRevealGrains(w, h);
    const maxFallEnd = Math.max(...grains.map((g) => g.delay + g.fallDuration));
    const start = performance.now();
    let rafId = 0;

    // Content starts fading/sliding in slightly after the sand starts moving,
    // so it reads as "uncovered" rather than appearing simultaneously.
    const revealTimer = window.setTimeout(() => setRevealed(true), 180);

    function frame(now: number) {
      const elapsed = now - start;
      ctx!.clearRect(0, 0, w, h);

      for (const g of grains) {
        const local = elapsed - g.delay;
        if (local <= 0) {
          ctx!.beginPath();
          ctx!.arc(g.x, g.startY, g.r, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${REVEAL_COLOR},${g.baseAlpha.toFixed(3)})`;
          ctx!.fill();
          continue;
        }
        const t = Math.min(local / g.fallDuration, 1);
        const y = g.startY + g.travel * t;
        const alpha = g.baseAlpha * (1 - t);
        if (alpha > 0.004) {
          const x = g.x + Math.sin(elapsed * g.swayFreq) * g.swayAmp;
          ctx!.beginPath();
          ctx!.arc(x, y, g.r, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${REVEAL_COLOR},${alpha.toFixed(3)})`;
          ctx!.fill();
        }
      }

      if (elapsed < maxFallEnd + 200) {
        rafId = requestAnimationFrame(frame);
      } else {
        setShowCanvas(false);
      }
    }

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(revealTimer);
    };
  }, [triggered, skipAnimation]);

  const rowOffsets = ["lg:translate-y-6", "lg:-translate-y-4", "lg:translate-y-2"];

  return (
    <section
      ref={sectionRef}
      aria-label="Why work with Leonis Studios"
      className="py-24 pb-28"
      style={{ background: colors.duneBg, position: "relative", zIndex: 1, overflow: "hidden" }}
    >
      <style>{`
        @keyframes benefitContentIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Dune ridge-line background — two low-opacity contour paths ── */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0, pointerEvents: "none" }}
        preserveAspectRatio="none"
        viewBox="0 0 1440 600"
      >
        <path
          d="M0 380 C 220 320, 380 420, 620 360 S 1040 300, 1440 380 L1440 600 L0 600 Z"
          fill="rgba(180,110,0,0.12)"
        />
        <path
          d="M0 460 C 260 410, 460 480, 760 430 S 1180 390, 1440 460 L1440 600 L0 600 Z"
          fill="rgba(180,110,0,0.08)"
        />
      </svg>

      {/* ── Sand-curtain reveal canvas — one-shot, removed after animating ── */}
      {showCanvas && !skipAnimation && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      )}

      <div
        className="max-w-7xl mx-auto px-6 lg:px-12 relative"
        style={{ zIndex: 1, opacity: revealed || skipAnimation ? 1 : 0 }}
      >
        {/* ── Section header ───────────────────────────────── */}
        <div
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6"
          style={{
            animation:
              revealed && !skipAnimation ? "benefitContentIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both" : undefined,
          }}
        >
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-px" style={{ background: colors.accent }} />
              <span
                className="text-xs tracking-[0.25em] uppercase"
                style={{ fontFamily: "var(--font-display)", fontWeight: tokens.weightUI, color: colors.accent }}
              >
                {eyebrow}
              </span>
            </div>
            <h2
              style={{
                fontFamily:    "var(--font-display)",
                fontSize:      "clamp(36px, 5.5vw, 70px)",
                fontWeight:    tokens.weightDisplay,
                lineHeight:    0.95,
                letterSpacing: "-0.025em",
                color:         colors.duneHeadline,
              }}
            >
              {headline}
            </h2>
          </div>
          <p
            className="text-sm leading-relaxed max-w-xs"
            style={{ fontFamily: "var(--font-body)", fontWeight: tokens.weightBody, color: colors.duneMuted }}
          >
            {subtext}
          </p>
        </div>

        {/* ── Row 1 — 3 cards, undulating offset ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {items.slice(0, 3).map((item, i) => (
            <div
              key={item.title}
              className={rowOffsets[i % rowOffsets.length]}
              style={{
                animation:
                  revealed && !skipAnimation
                    ? `benefitContentIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.08}s both`
                    : undefined,
              }}
            >
              <BenefitCard item={item} index={i} />
            </div>
          ))}
        </div>

        {/* ── Row 2 — 2 cards, centered + narrower ────────────── */}
        {items.length > 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-3xl mx-auto mt-8">
            {items.slice(3, 5).map((item, i) => (
              <div
                key={item.title}
                style={{
                  animation:
                    revealed && !skipAnimation
                      ? `benefitContentIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + i * 0.08}s both`
                      : undefined,
                }}
              >
                <BenefitCard item={item} index={i + 3} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function BenefitCard({
  item,
  index,
}: {
  item: { title: string; description: string };
  index: number;
}) {
  return (
    <div
      className="h-full p-12 flex flex-col"
      style={{
        background:  colors.duneSurface,
        border:      `1px solid ${colors.duneDivider}`,
        borderTop:   `3px solid ${colors.bgDark}`,
      }}
    >
      <div
        className="w-12 h-12 flex items-center justify-center mb-6 shrink-0"
        style={{ background: colors.bgDark }}
      >
        <BenefitIcon index={index} />
      </div>
      <h3
        className="mb-3"
        style={{
          fontFamily:    "var(--font-display)",
          fontSize:      tokens.fontSizes.h3Compact,
          fontWeight:    tokens.weightHeading,
          letterSpacing: "-0.015em",
          color:         colors.bgDark,
        }}
      >
        {item.title}
      </h3>
      <p
        className="text-sm leading-relaxed"
        style={{ fontFamily: "var(--font-body)", fontWeight: tokens.weightBody, color: colors.textSubtle }}
      >
        {item.description}
      </p>
    </div>
  );
}
