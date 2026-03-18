// No "use client" needed — this is purely CSS animation,
// no JavaScript or browser APIs required.

export default function Marquee() {
  const items = [
    "Web Design",
    "Next.js Development",
    "SEO Optimization",
    "Branding & Identity",
    "Monthly Maintenance",
    "Performance Auditing",
  ];

  // We duplicate the items array so the marquee loops
  // seamlessly — when the first set scrolls out of view,
  // the identical second set is already in place.
  const doubled = [...items, ...items];

  return (
    <div
      className="bg-crimson border-y border-crimson py-4 overflow-hidden"
      aria-hidden="true"
    >
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
              className="text-white text-xs tracking-[0.2em] uppercase px-8"
            >
              {item}
            </span>
            <span className="text-white/50 text-xs">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}