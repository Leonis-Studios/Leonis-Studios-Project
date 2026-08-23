"use client";
// "use client" is required here because each row uses useInViewOnce +
// useSandReveal (IntersectionObserver + canvas) for its per-row erosion reveal.
// Props-only component — no data fetching of its own — matches the precedent
// set by BenefitsClient.tsx / Skills.tsx.

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

export default function Values({ eyebrow: eyebrowProp, values }: Props) {
  const eyebrow = eyebrowProp || "What We Stand For";
  const items = (values && values.length > 0) ? values : DEFAULT_VALUES;

  return (
    <section
      className="py-24 lg:py-32"
      style={{ background: colors.bgLight, borderTop: `1px solid ${colors.borderLight}`, position: "relative", zIndex: 1, overflow: "hidden" }}
    >
      <SandGutter seed={0} />
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-16">
          <div style={{ width: "32px", height: "1px", background: colors.textSubtle }} />
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: tokens.weightUI,
              color:      colors.textSubtle,
            }}
          >
            {eyebrow}
          </span>
        </div>

        {/* Values list */}
        <div>
          {items.map((value, index) => (
            <ValueRow key={index} value={value} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}

// Each row erodes its own ghost numeral into view — drifting sand grains
// scour it clear as the row scrolls in, rather than all four numerals
// appearing at once.
function ValueRow({ value, index }: { value: Value; index: number }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>(0.5);
  const { canvasRef, showCanvas } = useSandReveal({
    trigger:       inView,
    containerRef:  ref,
    color:         "180,110,0",
    mode:          "drift",
    density:       700,
    delayRange:    [0, 150],
    durationRange: [450, 750],
  });

  return (
    <div
      style={{
        position:     "relative",
        padding:      "32px 0 32px 0",
        borderBottom: `1px solid ${colors.borderLight}`,
        overflow:     "hidden",
      }}
    >
      {/* Large decorative number — eroded into view, sand-sweep canvas overlays it */}
      <div
        ref={ref}
        aria-hidden="true"
        style={{
          position:      "absolute",
          left:          "-10px",
          top:           "8px",
          width:         "150px",
          height:        "96px",
          zIndex:        0,
          pointerEvents: "none",
          overflow:      "hidden",
        }}
      >
        <span
          style={{
            position:      "absolute",
            inset:         0,
            fontFamily:    "var(--font-display)",
            fontSize:      "80px",
            fontWeight:    tokens.weightDisplay,
            lineHeight:    1,
            color:         colors.bgMuted,
            opacity:       inView ? 0.6 : 0,
            letterSpacing: "-0.03em",
            userSelect:    "none",
            transition:    "opacity 0.7s ease 0.1s",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        {showCanvas && (
          <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />
        )}
      </div>

      {/* Content sits above the number via z-index */}
      <div
        style={{
          position:            "relative",
          zIndex:              1,
          display:             "grid",
          gridTemplateColumns: "1fr 2fr",
          gap:                 "0 48px",
          alignItems:          "start",
          paddingLeft:         "0px",
          opacity:             inView ? 1 : 0,
          transform:           inView ? "translateY(0)" : "translateY(10px)",
          transition:          "opacity 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s",
        }}
      >
        <h3
          style={{
            fontFamily:    "var(--font-display)",
            fontSize:      tokens.fontSizes.h3,
            fontWeight:    tokens.weightHeading,
            color:         colors.bgDark,
            letterSpacing: "-0.015em",
            margin:        0,
            paddingTop:    "4px",
          }}
        >
          {value.title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize:   tokens.fontSizes.body,
            fontWeight: tokens.weightBody,
            color:      colors.textSubtle,
            lineHeight: 1.7,
            margin:     0,
          }}
        >
          {value.description}
        </p>
      </div>
    </div>
  );
}
