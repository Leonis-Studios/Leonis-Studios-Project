// components/shared/ContentFAQ.tsx
//
// Content-local FAQ section for post/case-study detail pages.
// Same accordion chrome as components/home/FAQ.tsx, reused here
// for a per-page faq[] array instead of the global faqItem docs.
// Caller is responsible for emitting the matching FAQPage JSON-LD
// from the same data — see blog/[slug] and work/[slug] pages.

import FAQList from "@/components/home/FAQList";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";
import type { FaqBlockItem } from "@/lib/types";

export default function ContentFAQ({
  items,
  eyebrow = "FAQ",
  headline = "Frequently Asked Questions",
}: {
  items: FaqBlockItem[];
  eyebrow?: string;
  headline?: string;
}) {
  if (!items || items.length === 0) return null;

  return (
    <section
      className="py-20"
      style={{ background: colors.bgLight, position: "relative", zIndex: 1 }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-8 h-px" style={{ background: colors.accent }} />
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{
              color:      colors.accent,
              fontFamily: "var(--font-display)",
              fontWeight: tokens.weightUI,
            }}
          >
            {eyebrow}
          </span>
        </div>
        <h2
          className="mb-10"
          style={{
            fontFamily:    "var(--font-display)",
            fontSize:      "clamp(28px, 4vw, 44px)",
            fontWeight:    tokens.weightDisplay,
            lineHeight:    0.95,
            letterSpacing: "-0.025em",
            color:         colors.textBody,
          }}
        >
          {headline}
        </h2>
        <FAQList items={items} />
      </div>
    </section>
  );
}
