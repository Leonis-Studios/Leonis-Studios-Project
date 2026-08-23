import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";

interface Props {
  headline?: string;
  subheading?: string;
}

export default function AboutHero({ headline, subheading }: Props) {
  return (
    <section
      className="relative overflow-hidden py-32 pt-40"
      style={{ background: colors.bgDark }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sunriseGlowIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes sunrisePulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 0.8;  transform: scale(1.06); }
        }
        .sunrise-glow {
          animation: sunriseGlowIn 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
        }
        @media (prefers-reduced-motion: no-preference) {
          .sunrise-glow { animation-name: sunriseGlowIn, sunrisePulse; animation-duration: 1.6s, 6s; animation-delay: 0.2s, 1.8s; animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1), ease-in-out; animation-iteration-count: 1, infinite; animation-fill-mode: both, none; }
        }
      `}</style>

      {/* Sunrise glow — warm gold bloom rising behind the geometric detail */}
      <div
        aria-hidden="true"
        className="sunrise-glow absolute pointer-events-none"
        style={{
          left:      "-10vw",
          bottom:    "-20vh",
          width:     "60vw",
          height:    "60vw",
          maxWidth:  "620px",
          maxHeight: "620px",
          background: `radial-gradient(circle, rgba(252,163,17,0.22) 0%, rgba(252,163,17,0.08) 45%, transparent 72%)`,
          zIndex: 0,
        }}
      />
      {/* Horizon line */}
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          bottom: "22%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(252,163,17,0.35) 35%, rgba(252,163,17,0.35) 65%, transparent)",
          zIndex: 0,
        }}
      />

      {/* Background geometric detail */}
      <div
        className="absolute top-0 right-0 w-[40vw] h-full pointer-events-none"
        aria-hidden="true"
        style={{ zIndex: 0 }}
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-px"
          style={{ background: colors.accent, opacity: 0.2 }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 left-12 w-48 h-48"
          style={{ border: `1px solid ${colors.surfaceDark}` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 left-20 w-32 h-32"
          style={{ border: `1px solid ${colors.surfaceDark}`, opacity: 0.5 }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12" style={{ position: "relative", zIndex: 1 }}>
        {/* Eyebrow label */}
        <div
          className="flex items-center gap-4 mb-8"
          style={{
            opacity: 0,
            animation:
              "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards",
          }}
        >
          <div className="w-8 h-px" style={{ background: colors.accent }} />
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: tokens.weightUI,
              color: colors.accent,
            }}
          >
            About
          </span>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(52px, 9.5vw, 118px)",
            fontWeight: tokens.weightDisplay,
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            color: colors.bgLight,
            maxWidth: "800px",
            opacity: 0,
            animation:
              "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards",
          }}
        >
          {headline ?? (
            <>
              The studio
              <br />
              <span style={{ color: colors.accent }}>behind the work.</span>
            </>
          )}
        </h1>

        {/* Subheading */}
        <p
          className="mt-8"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: tokens.fontSizes.bodyLarge,
            fontWeight: tokens.weightBody,
            color: colors.textSecondary,
            maxWidth: "500px",
            lineHeight: 1.75,
            opacity: 0,
            animation:
              "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards",
          }}
        >
          {subheading ??
            "Leonis Studios is a one-person web design studio based in New York. We build fast, high-performance websites and make sure they get found, on Google, in AI search, and everywhere your customers are already looking."}
        </p>
      </div>
    </section>
  );
}
