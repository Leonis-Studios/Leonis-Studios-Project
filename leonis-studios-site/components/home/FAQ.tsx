import type { FAQPage, WithContext } from "schema-dts";
import { client }          from "@/sanity/lib/client";
import { FAQ_ITEMS_QUERY, HOME_PAGE_QUERY } from "@/sanity/lib/queries";
import type { FaqItem, HomePageData } from "@/lib/types";
import SandGutter          from "@/components/SandGutter";
import JsonLd               from "@/components/JsonLd";
import { colors }          from "@/lib/colors";
import { tokens }          from "@/lib/tokens";
import FAQList             from "./FAQList";

export default async function FAQ() {
  const items: FaqItem[] = await client
    .fetch(FAQ_ITEMS_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => []);

  if (!items.length) return null;

  const homePage: HomePageData | null = await client
    .fetch(HOME_PAGE_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => null);

  const eyebrow  = homePage?.faqSection?.eyebrow  || "FAQ";
  const headline = homePage?.faqSection?.headline || "Frequently asked questions";
  const intro    = homePage?.faqSection?.intro    || "Everything you need to know about working with Leonis Studios — from pricing and timelines to process and ongoing support.";

  // FAQPage schema — parsed by Google, Bing, and AI assistants for AEO
  const faqSchema: WithContext<FAQPage> = {
    "@context":  "https://schema.org",
    "@type":     "FAQPage",
    mainEntity:  items.map((item) => ({
      "@type": "Question",
      name:    item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text:    item.answer,
      },
    })),
  };

  return (
    <section
      className="py-24 bg-white"
      style={{ position: "relative", zIndex: 1, overflow: "hidden" }}
    >
      <JsonLd data={faqSchema} />

      {/* White background → seed 0 gives dark gold particles (readable on white) */}
      <SandGutter seed={0} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-8 h-px" style={{ background: colors.accent }} />
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{
              color:       colors.accent,
              fontFamily:  "var(--font-display)",
              fontWeight:  tokens.weightUI,
            }}
          >
            {eyebrow}
          </span>
        </div>

        {/* Heading + intro — two-column on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <h2
            style={{
              fontFamily:    "var(--font-display)",
              fontSize:      "clamp(36px, 5.5vw, 70px)",
              fontWeight:    tokens.weightDisplay,
              lineHeight:    0.95,
              letterSpacing: "-0.025em",
              color:         colors.textBody,
            }}
          >
            {headline}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize:   tokens.fontSizes.bodyLarge,
              fontWeight: tokens.weightBody,
              color:      colors.textSubtle,
              lineHeight: 1.75,
              alignSelf:  "end",
            }}
          >
            {intro}
          </p>
        </div>

        {/* Accordion — client component handles open/close state */}
        <FAQList items={items} />
      </div>
    </section>
  );
}
