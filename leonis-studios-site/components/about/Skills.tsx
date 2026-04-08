import { colors } from "@/lib/colors";

interface Props {
  techStack?: string[];
}

const DEFAULT_TECHNOLOGIES = [
  "Next.js",
  "TypeScript",
  "React",
  "Tailwind CSS",
  "Framer Motion",
  "Sanity CMS",
  "Vercel",
  "Resend",
  "PostgreSQL",
  "Git",
];

const services = [
  "Web Design",
  "Frontend Development",
  "CMS Integration",
  "SEO Optimization",
  "Performance Audits",
  "Site Maintenance",
  "Analytics Setup",
  "Email Infrastructure",
];

export default function Skills({ techStack }: Props) {
  const technologies = (techStack && techStack.length > 0) ? techStack : DEFAULT_TECHNOLOGIES;

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
              fontWeight: 500,
              color:      colors.textSubtle,
            }}
          >
            Stack &amp; Services
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Technologies */}
          <div>
            <h3
              className="mb-8"
              style={{
                fontFamily:    "var(--font-display)",
                fontSize:      "clamp(18px, 2vw, 24px)",
                fontWeight:    700,
                letterSpacing: "-0.015em",
                color:         colors.bgDark,
              }}
            >
              Technologies
            </h3>
            <div className="flex flex-wrap gap-3">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontFamily:    "var(--font-display)",
                    fontSize:      "12px",
                    fontWeight:    600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    color:         colors.bgDark,
                    border:        `1px solid ${colors.bgDark}`,
                    padding:       "8px 16px",
                    display:       "inline-block",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3
              className="mb-8"
              style={{
                fontFamily:    "var(--font-display)",
                fontSize:      "clamp(18px, 2vw, 24px)",
                fontWeight:    700,
                letterSpacing: "-0.015em",
                color:         colors.bgDark,
              }}
            >
              Services
            </h3>
            <div className="flex flex-wrap gap-3">
              {services.map((service) => (
                <span
                  key={service}
                  style={{
                    fontFamily:    "var(--font-display)",
                    fontSize:      "12px",
                    fontWeight:    600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    color:         colors.textSubtle,
                    border:        `1px solid ${colors.textSubtle}`,
                    padding:       "8px 16px",
                    display:       "inline-block",
                  }}
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
