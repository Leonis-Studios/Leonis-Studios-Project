"use client";
// "use client" is required here because this component uses:
//   - useInViewOnce (IntersectionObserver, to trigger the reveal on scroll)
//   - useEffect (prefers-reduced-motion check)
// The quote and body are rendered server-side by Story.tsx (which keeps the
// CMS Portable Text body off the client bundle) and passed in as children —
// this component only owns the reveal chrome around them: a bedrock/quartz
// motif (sedimentary strata bands + a one-shot glint sweep across the quote).

import { useEffect, useState } from "react";
import { colors } from "@/lib/colors";
import { useInViewOnce } from "@/lib/hooks/useInViewOnce";

export default function StoryReveal({
  quote,
  body,
}: {
  quote: React.ReactNode;
  body:  React.ReactNode;
}) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>(0.2);
  const [reduced, setReduced] = useState(false);
  const [glintDone, setGlintDone] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const revealed = inView || reduced;

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start"
      style={{ position: "relative" }}
    >
      <style>{`
        @keyframes storyGlint {
          from { transform: translateX(-140%) skewX(-12deg); opacity: 0; }
          15%  { opacity: 0.9; }
          to   { transform: translateX(220%) skewX(-12deg); opacity: 0; }
        }
      `}</style>

      {/* Sedimentary strata — decorative bedrock bands behind the sticky quote */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-40px -24px auto -24px",
          height: "260px",
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute", left: 0, right: "18%", top: "10%", height: "14px",
            background: colors.bgMuted,
            opacity: revealed ? 0.5 : 0,
            transition: "opacity 1s ease 0.1s",
          }}
        />
        <div
          style={{
            position: "absolute", left: "8%", right: 0, top: "42%", height: "10px",
            background: "rgba(252,163,17,0.14)",
            opacity: revealed ? 1 : 0,
            transition: "opacity 1s ease 0.3s",
          }}
        />
        <div
          style={{
            position: "absolute", left: 0, right: "30%", top: "68%", height: "16px",
            background: colors.borderLight,
            opacity: revealed ? 0.6 : 0,
            transition: "opacity 1s ease 0.5s",
          }}
        />
      </div>

      {/* Pull quote */}
      <div className="lg:sticky lg:top-32" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ position: "relative", overflow: "hidden" }}>
          {quote}
          {/* Mounted only while playing — unmounts itself on completion so
              there's no resting frame that could snap back to fully opaque
              over the quote text (a CSS animation with no fill-mode reverts
              to its unanimated resting style, not to invisible, once it
              stops applying). */}
          {revealed && !reduced && !glintDone && (
            <span
              aria-hidden="true"
              onAnimationEnd={() => setGlintDone(true)}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: "60%",
                background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.55) 45%, transparent)",
                animation: "storyGlint 1.1s cubic-bezier(0.16,1,0.3,1) 0.6s 1",
                pointerEvents: "none",
              }}
            />
          )}
        </div>
      </div>

      {/* Story paragraphs */}
      <div
        className="flex flex-col gap-6"
        style={{
          position: "relative",
          zIndex: 1,
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s",
        }}
      >
        {body}
      </div>
    </div>
  );
}
