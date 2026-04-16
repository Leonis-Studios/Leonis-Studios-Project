import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";
import SandGutter from "@/components/SandGutter";

interface Value {
  title:       string;
  description: string;
}

interface Props {
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

export default function Values({ values }: Props) {
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
            What We Stand For
          </span>
        </div>

        {/* Values list */}
        <div>
          {items.map((value, index) => (
            <div
              key={index}
              style={{
                position:     "relative",
                padding:      "32px 0 32px 0",
                borderBottom: `1px solid ${colors.borderLight}`,
                overflow:     "hidden",
              }}
            >
              {/* Large decorative number — absolute, behind content */}
              <span
                aria-hidden="true"
                style={{
                  position:      "absolute",
                  left:          "-10px",
                  top:           "8px",
                  fontFamily:    "var(--font-display)",
                  fontSize:      "80px",
                  fontWeight:    tokens.weightDisplay,
                  lineHeight:    1,
                  color:         colors.bgMuted,
                  opacity:       0.6,
                  letterSpacing: "-0.03em",
                  userSelect:    "none",
                  zIndex:        0,
                  pointerEvents: "none",
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

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
          ))}
        </div>

      </div>
    </section>
  );
}
