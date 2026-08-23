"use client";
// "use client" is required here because each card uses useInViewOnce +
// useSandReveal (IntersectionObserver + canvas) for its own crystallizing
// reveal, and the section shell uses useInViewOnce to fade in the header
// and fault-line vein. Props-only component — no data fetching of its own —
// matches the precedent set by BenefitsClient.tsx / Skills.tsx.
//
// Redesign concept: values are cut gems embedded in a bedrock stratum —
// dark surfaceDark section (SandGutter seed 1, matching HowItWorks/AboutCTA),
// a faint fault-line vein running behind the grid, and each card carved with
// two clipped gem corners + a faceted diamond number-badge that catches a
// one-shot light glint on hover.
//
// All entrance/interaction motion here is transition-driven off plain state
// (opacity/transform/border-color), not `animation:` keyframes toggled by a
// conditional. A CSS animation with no explicit fill-mode reverts to its
// element's *unanimated* resting style the instant it stops being applied —
// on `:hover` end, or once a finite-iteration animation completes — so a
// glint sweep with no resting opacity:0 snaps back to fully opaque instead
// of disappearing. Transitions have no such "return to default" edge case:
// the target value IS the resting value. The one deliberately animation-based
// bit (the badge glint) is mounted only while playing and unmounts itself
// via onAnimationEnd, so there's nothing left to snap back.

import { useState } from "react";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";
import SandGutter from "@/components/SandGutter";
import { useInViewOnce } from "@/lib/hooks/useInViewOnce";
import { useSandReveal } from "@/lib/hooks/useSandReveal";

interface Value {
  title:       string;
  description: string;
}

interface Props {
  eyebrow?: string;
  values?: Value[];
}

const DEFAULT_VALUES: Value[] = [
  {
    title:       "Craft",
    description: "Every pixel, every line of code, every word on the page is deliberate. Good enough isn't good enough.",
  },
  {
    title:       "Transparency",
    description: "No hidden scope creep. No vague timelines. You'll always know what's being built, when, and why.",
  },
  {
    title:       "Performance",
    description: "Fast sites rank higher, convert better, and create better impressions. Performance is a feature, not an afterthought.",
  },
  {
    title:       "Partnership",
    description: "I don't disappear after launch. Your growth is the measure of whether the work succeeded.",
  },
];

// Cuts the top-right and bottom-left corners — a heavier, two-facet version
// of ClientPromise's single-corner "leo-promise-card" cut.
const GEM_CLIP = "polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 26px 100%, 0 calc(100% - 26px))";
const BADGE_CLIP = "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)";

export default function Values({ eyebrow: eyebrowProp, values }: Props) {
  const eyebrow = eyebrowProp || "What We Stand For";
  const items = (values && values.length > 0) ? values : DEFAULT_VALUES;
  const { ref: headRef, inView: headIn } = useInViewOnce<HTMLDivElement>(0.3);

  return (
    <section
      className="py-24 lg:py-32"
      style={{ background: colors.surfaceDark, borderTop: `1px solid ${colors.borderDark}`, position: "relative", zIndex: 1, overflow: "hidden" }}
    >
      <SandGutter seed={1} />
      <style>{`
        @keyframes gemBadgeGlint {
          from { transform: translateX(-160%) rotate(20deg); opacity: 0; }
          20%  { opacity: 1; }
          to   { transform: translateX(220%) rotate(20deg); opacity: 0; }
        }
        .leo-gem-card {
          position: relative;
          overflow: hidden;
        }
        .leo-gem-card::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.45s ease;
          background: linear-gradient(120deg, transparent 25%, rgba(252,163,17,0.14) 48%, transparent 70%);
        }
        @media (prefers-reduced-motion: no-preference) {
          .leo-gem-card:hover::before { opacity: 1; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Section label */}
        <div
          ref={headRef}
          className="flex items-center gap-4 mb-16"
          style={{
            opacity:    headIn ? 1 : 0,
            transform:  headIn ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div style={{ width: "32px", height: "1px", background: colors.accent }} />
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: tokens.weightUI,
              color:      colors.accent,
            }}
          >
            {eyebrow}
          </span>
        </div>

        {/* Fault-line vein — decorative geological cross-section behind the gem grid */}
        <div
          aria-hidden="true"
          style={{
            position:   "absolute",
            inset:      0,
            top:        "180px",
            zIndex:     0,
            pointerEvents: "none",
            opacity:    headIn ? 1 : 0,
            transition: "opacity 1.6s ease 0.2s",
          }}
        >
          <svg
            className="w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 400 300"
            style={{ width: "100%", height: "100%" }}
          >
            <path d="M0,60 L90,110 L170,70 L260,140 L340,95 L400,150" stroke="rgba(252,163,17,0.16)" strokeWidth="0.6" fill="none" />
            <path d="M0,190 L100,230 L190,195 L280,245 L400,210" stroke="rgba(252,163,17,0.10)" strokeWidth="0.6" fill="none" />
          </svg>
        </div>

        {/* Gem grid — values crystallize in as clipped, faceted cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
          style={{ position: "relative", zIndex: 1 }}
        >
          {items.map((value, index) => (
            <GemCard
              key={index}
              value={value}
              index={index}
              offset={index % 2 === 1}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

function GemCard({ value, index, offset }: { value: Value; index: number; offset: boolean }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>(0.3);
  const { canvasRef, showCanvas } = useSandReveal({
    trigger:       inView,
    containerRef:  ref,
    color:         "252,163,17",
    mode:          "drift",
    density:       900,
    delayRange:    [0, 150],
    durationRange: [450, 750],
  });
  const [hovered, setHovered]   = useState(false);
  const [glinting, setGlinting] = useState(false);

  function handleEnter() {
    setHovered(true);
    if (!glinting && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGlinting(true);
    }
  }

  return (
    <div
      ref={ref}
      className={`leo-gem-card ${offset ? "lg:mt-14" : ""}`}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setHovered(false)}
      style={{
        clipPath:   GEM_CLIP,
        padding:    "40px 36px 36px 36px",
        background: "linear-gradient(155deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
        border:     `1px solid rgba(252,163,17,0.2)`,
        opacity:    inView ? 1 : 0,
        transform:  !inView
          ? "translateY(22px) scale(0.97)"
          : hovered ? "translateY(-5px) scale(1)" : "translateY(0) scale(1)",
        transition: `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${inView ? index * 90 : 0}ms, transform 0.45s cubic-bezier(0.16,1,0.3,1)`,
      }}
    >
      {showCanvas && (
        <canvas ref={canvasRef} aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }} />
      )}

      {/* Faceted number badge */}
      <div
        aria-hidden="true"
        style={{
          position:  "relative",
          width:     "48px",
          height:    "48px",
          marginBottom: "22px",
          clipPath:  BADGE_CLIP,
          background: "linear-gradient(150deg, #fca311 0%, rgba(252,163,17,0.55) 100%)",
          display:   "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow:  "hidden",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize:   "14px",
            fontWeight: tokens.weightUI,
            color:      colors.surfaceDark,
            letterSpacing: "-0.02em",
            position:   "relative",
            zIndex:     1,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        {/* Mounted only while playing — unmounts itself on completion so there's
            no resting frame left to snap back to opaque. */}
        {glinting && (
          <span
            aria-hidden="true"
            onAnimationEnd={() => setGlinting(false)}
            style={{
              position:  "absolute",
              inset:     0,
              background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.75) 45%, transparent)",
              animation: "gemBadgeGlint 0.9s cubic-bezier(0.16,1,0.3,1) 1",
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      <h3
        style={{
          fontFamily:    "var(--font-display)",
          fontSize:      tokens.fontSizes.h3,
          fontWeight:    tokens.weightHeading,
          color:         colors.bgLight,
          letterSpacing: "-0.015em",
          margin:        "0 0 12px 0",
          position:      "relative",
          zIndex:        1,
        }}
      >
        {value.title}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize:   tokens.fontSizes.body,
          fontWeight: tokens.weightBody,
          color:      colors.textSecondaryLight,
          lineHeight: 1.7,
          margin:     0,
          position:   "relative",
          zIndex:     1,
        }}
      >
        {value.description}
      </p>
    </div>
  );
}
