import { defineField, defineType, defineArrayMember } from "sanity";

// Singleton — every field is optional so each home page section
// falls back to its own hardcoded default until an editor fills
// this in. See lib/types.ts HomePageData for the fallback contract.
export const homePageSchema = defineType({
  name:  "homePage",
  title: "Home Page",
  type:  "document",
  icon:  () => "🏠",
  fields: [
    // ── Hero ──────────────────────────────────────────
    defineField({
      name:  "hero",
      title: "Hero",
      type:  "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string", description: 'e.g. "Web Design & Search Growth Studio"' }),
        defineField({ name: "headlineLine1", title: "Headline Line 1", type: "string", description: 'e.g. "Bold."' }),
        defineField({ name: "headlineLine2", title: "Headline Line 2", type: "string", description: 'e.g. "Digital."' }),
        defineField({ name: "headlineAccent", title: "Headline Accent Word", type: "string", description: 'e.g. "Craft." — rendered in gold' }),
        defineField({ name: "subcopy", title: "Subcopy", type: "text", rows: 3 }),
        defineField({ name: "primaryCtaLabel", title: "Primary CTA Label", type: "string", description: 'e.g. "Start a Project"' }),
        defineField({ name: "secondaryCtaLabel", title: "Secondary CTA Label", type: "string", description: 'e.g. "View Our Work"' }),
        defineField({
          name:  "stats",
          title: "Stats",
          type:  "array",
          description: "The numbers shown at the bottom of the hero",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "value", title: "Value", type: "string", description: 'e.g. "01", "100%", "4"' }),
                defineField({ name: "label", title: "Label", type: "string", description: 'e.g. "Project Success Rate"' }),
              ],
              preview: { select: { title: "value", subtitle: "label" } },
            }),
          ],
        }),
      ],
    }),

    // ── Marquee ───────────────────────────────────────
    defineField({
      name:  "marquee",
      title: "Marquee",
      type:  "object",
      fields: [
        defineField({
          name:        "items",
          title:       "Scrolling Items",
          type:        "array",
          description: "Short phrases scrolling in the gold strip below the hero",
          of:          [{ type: "string" }],
        }),
      ],
    }),

    // ── Benefits section ────────────────────────────────
    defineField({
      name:  "benefitsSection",
      title: "Benefits Section",
      type:  "object",
      description: "Sits above Services. Sells the outcome — search visibility, AI answer engines, custom design — before the pricing grid.",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string", description: 'e.g. "Why Leonis"' }),
        defineField({ name: "headline", title: "Headline", type: "string", description: 'e.g. "Built to be found."' }),
        defineField({ name: "subtext", title: "Subtext", type: "text", rows: 2 }),
        defineField({
          name:  "items",
          title: "Benefit Items",
          type:  "array",
          description: "5 works best for the two-row layout (3 + 2), but any count will lay out.",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
              ],
              preview: { select: { title: "title", subtitle: "description" } },
            }),
          ],
          initialValue: [
            {
              title: "Ranks on Google for what you sell",
              description: "We handle the technical SEO, page structure, and content so your site shows up when someone searches for exactly what you offer. Those people are already looking to buy.",
            },
            {
              title: "Recommended by ChatGPT and AI search",
              description: "More people now ask ChatGPT, Perplexity, or Google's AI Overviews who to hire. We structure your content and schema so those tools understand your business and name it in their answers.",
            },
            {
              title: "Answers the questions customers ask",
              description: "Clear, direct answers to the things your customers type and say out loud, written so featured snippets and voice assistants can quote you word for word.",
            },
            {
              title: "Designed to turn visitors into leads",
              description: "Modern, custom design with an obvious next step on every page. Strong calls to action and quick forms mean nothing stands between a visitor and your inbox.",
            },
            {
              title: "Fast, modern, and ready to grow",
              description: "Built on Next.js with 95+ performance scores, so pages load quickly on any phone. After launch we keep tuning rankings and content so the leads keep coming.",
            },
          ],
        }),
      ],
    }),

    // ── Services section header ────────────────────────
    defineField({
      name:  "servicesSection",
      title: "Services Section",
      type:  "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string", description: 'e.g. "What We Do"' }),
        defineField({ name: "headline", title: "Headline", type: "string", description: 'e.g. "Our Services"' }),
        defineField({ name: "subtext", title: "Subtext", type: "text", rows: 2 }),
      ],
    }),

    // ── How It Works ────────────────────────────────────
    defineField({
      name:  "howItWorks",
      title: "How It Works",
      type:  "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string", description: 'e.g. "How It Works"' }),
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({ name: "subtext", title: "Subtext", type: "text", rows: 2 }),
        defineField({
          name:  "steps",
          title: "Steps",
          type:  "array",
          description: "The numbered process steps — number is automatic based on order",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
              ],
              preview: { select: { title: "title", subtitle: "description" } },
            }),
          ],
        }),
        defineField({ name: "bottomCtaLabel", title: "Bottom CTA Label", type: "string", description: 'e.g. "Start Your Project"' }),
      ],
    }),

    // ── Featured Work section header ───────────────────
    defineField({
      name:  "featuredWorkSection",
      title: "Featured Work Section",
      type:  "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string", description: 'e.g. "Selected Work"' }),
        defineField({ name: "headline", title: "Headline", type: "string", description: 'e.g. "Recent Projects"' }),
      ],
    }),

    // ── FAQ section header ─────────────────────────────
    defineField({
      name:  "faqSection",
      title: "FAQ Section",
      type:  "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string", description: 'e.g. "FAQ"' }),
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
      ],
    }),

    // ── CTA section ─────────────────────────────────────
    defineField({
      name:  "ctaSection",
      title: "CTA Section",
      type:  "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string", description: 'e.g. "Ready to start?"' }),
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({ name: "subtext", title: "Subtext", type: "text", rows: 2 }),
        defineField({ name: "primaryCtaLabel", title: "Primary CTA Label", type: "string", description: 'e.g. "Get In Touch"' }),
        defineField({ name: "secondaryCtaLabel", title: "Secondary CTA Label", type: "string", description: 'e.g. "See Our Work"' }),
      ],
    }),

    // ── SEO ─────────────────────────────────────────────
    defineField({
      name:  "seo",
      title: "SEO",
      type:  "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home Page" }),
  },
});
