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
        defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string", description: 'e.g. "Web Studio · Est. 2026"' }),
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
                defineField({ name: "label", title: "Label", type: "string", description: 'e.g. "Client Served"' }),
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
  ],
  preview: {
    prepare: () => ({ title: "Home Page" }),
  },
});
