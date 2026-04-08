import { colors } from "@/lib/colors";

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
      `}</style>

      {/* Background geometric detail */}
      <div
        className="absolute top-0 right-0 w-[40vw] h-full pointer-events-none"
        aria-hidden="true"
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

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
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
              fontWeight: 500,
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
            fontSize: "clamp(48px, 9vw, 112px)",
            fontWeight: 800,
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
            fontSize: "clamp(15px, 1.4vw, 18px)",
            fontWeight: 300,
            color: colors.textSecondary,
            maxWidth: "500px",
            lineHeight: 1.75,
            opacity: 0,
            animation:
              "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards",
          }}
        >
          {subheading ??
            "Leonis Studios is a one-person web design studio based in New York. We build high-performance websites for businesses that care about doing things properly."}
        </p>
      </div>
    </section>
  );
}
