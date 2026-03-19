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
      style={{ background: "#f2f2f0", borderTop: "1px solid #cccccc" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-16">
          <div style={{ width: "32px", height: "1px", background: "#c41e3a" }} />
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              color:      "#c41e3a",
            }}
          >
            What We Stand For
          </span>
        </div>

        {/* Values list */}
        <style>{`
          .value-row {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          @media (min-width: 1024px) {
            .value-row {
              display: grid;
              grid-template-columns: 80px 1fr 2fr;
              gap: 3rem;
              align-items: center;
            }
          }
        `}</style>
        <div>
          {items.map((value, i) => (
            <div
              key={value.title}
              className="value-row py-10"
              style={{
                borderTop:    i === 0 ? "1px solid #cccccc" : undefined,
                borderBottom: "1px solid #cccccc",
              }}
            >
              {/* Number */}
              <span
                style={{
                  fontFamily:    "var(--font-display)",
                  fontSize:      "clamp(36px, 5vw, 64px)",
                  fontWeight:    800,
                  letterSpacing: "-0.03em",
                  lineHeight:    1,
                  color:         "#cccccc",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Name */}
              <h3
                style={{
                  fontFamily:    "var(--font-display)",
                  fontSize:      "clamp(20px, 2.5vw, 30px)",
                  fontWeight:    800,
                  letterSpacing: "-0.02em",
                  color:         "#0a0a0a",
                }}
              >
                {value.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize:   "clamp(14px, 1.2vw, 16px)",
                  fontWeight: 400,
                  color:      "#3d3d3d",
                  lineHeight: 1.8,
                }}
              >
                {value.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
