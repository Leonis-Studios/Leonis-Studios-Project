import { PortableText } from "@portabletext/react";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  storyBody?: any[];
}

const paragraphStyle = {
  fontFamily: "var(--font-body)",
  fontSize:   tokens.fontSizes.body,
  fontWeight: tokens.weightBody,
  color:      colors.textBody,
  lineHeight: 1.8,
} as const;

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p style={paragraphStyle}>{children}</p>
    ),
  },
};

export default function Story({ storyBody }: Props) {
  return (
    <section
      className="py-24 lg:py-32"
      style={{ background: colors.bgLight }}
    >
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
            Our Story
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Pull quote */}
          <div className="lg:sticky lg:top-32">
            <blockquote
              style={{
                fontFamily:    "var(--font-display)",
                fontSize:      "clamp(26px, 3.5vw, 44px)",
                fontWeight:    tokens.weightDisplay,
                lineHeight:    1.1,
                letterSpacing: "-0.025em",
                color:         colors.bgDark,
              }}
            >
              Bold work. No fluff.
              <br />
              <span style={{ color: colors.textSubtle }}>No compromise.</span>
            </blockquote>
            <div className="mt-8 w-12 h-px" style={{ background: colors.textSubtle }} />
          </div>

          {/* Story paragraphs */}
          <div className="flex flex-col gap-6">
            {storyBody && storyBody.length > 0 ? (
              <PortableText value={storyBody} components={portableTextComponents} />
            ) : (
              <>
                <p style={paragraphStyle}>
                  My name is Hassan Shirazi. I started Leonis Studios because I kept
                  seeing the same problem: businesses settling for generic templates,
                  slow sites, and agencies that disappear after launch.
                </p>
                <p style={paragraphStyle}>
                  The name comes from Leo — the lion. It&apos;s a symbol of precision,
                  courage, and doing things with intention. That&apos;s the philosophy
                  behind everything this studio produces: work that is deliberate,
                  built to perform, and built to last.
                </p>
                <p style={paragraphStyle}>
                  Leonis Studios is intentionally small. One person handles every
                  project — design, development, SEO, and ongoing maintenance. That
                  means no account managers, no hand-offs, no diluted output. You
                  work directly with the person building your site, from first call
                  to final deployment.
                </p>
                <p style={paragraphStyle}>
                  The clients I work with are small businesses, founders, and growing
                  brands who understand that a great website is an investment — not
                  a cost. If you value craft and want a site that actually works for
                  your business, we&apos;ll get along fine.
                </p>
              </>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
