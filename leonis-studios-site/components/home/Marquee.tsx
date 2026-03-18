export default function Marquee() {
  const items = [
    "Web Design",
    "Next.js Development",
    "SEO Optimization",
    "Branding & Identity",
    "Monthly Maintenance",
    "Performance Auditing",
  ];

  const doubled = [...items, ...items];

  return (
    <div
      className="py-5 overflow-hidden"
      style={{ background: "#c41e3a", minHeight: "48px" }}
      aria-hidden="true"
    >
      {/* ── Keyframe defined inline ───────────────────────────
          Defining it here guarantees it's available regardless
          of how Tailwind v4 processes globals.css at build time.
      ──────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      <div
        className="flex whitespace-nowrap"
        style={{ animation: "marquee 30s linear infinite" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            <span
              className="text-xs tracking-[0.2em] uppercase px-8"
              style={{
                color: i % 2 === 0 ? "#ffffff" : "rgba(255,255,255,0.6)",
              }}
            >
              {item}
            </span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px" }}>
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
