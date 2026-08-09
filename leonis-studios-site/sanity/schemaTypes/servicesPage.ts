import { defineField, defineType } from "sanity";

// Singleton — every field is optional so each section falls back
// to its own hardcoded default until an editor fills this in.
export const servicesPageSchema = defineType({
  name:  "servicesPage",
  title: "Services Page",
  type:  "document",
  icon:  () => "🛠️",
  fields: [
    // ── Hero ──────────────────────────────────────────
    defineField({
      name:  "hero",
      title: "Hero",
      type:  "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string", description: 'e.g. "What We Offer"' }),
        defineField({ name: "headlineLine1", title: "Headline Line 1", type: "string", description: 'e.g. "Services Built"' }),
        defineField({ name: "headlineAccent", title: "Headline Accent", type: "string", description: 'e.g. "to Perform." — rendered in gold' }),
        defineField({ name: "subheading", title: "Subheading", type: "text", rows: 3 }),
        defineField({
          name:        "categories",
          title:       "Category Tags",
          type:        "array",
          description: "Short tags shown under the hero copy",
          of:          [{ type: "string" }],
        }),
      ],
    }),

    // ── Packages section header ────────────────────────
    defineField({
      name:  "packagesSection",
      title: "Packages Section",
      type:  "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string", description: 'e.g. "Website Packages"' }),
        defineField({ name: "headline", title: "Headline", type: "string", description: 'e.g. "Choose Your Package"' }),
        defineField({ name: "subtext", title: "Subtext", type: "text", rows: 2 }),
      ],
    }),

    // ── Retainers section header ───────────────────────
    defineField({
      name:  "retainersSection",
      title: "Retainers Section",
      type:  "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string", description: 'e.g. "Ongoing Growth"' }),
        defineField({ name: "headline", title: "Headline", type: "string", description: 'e.g. "Monthly Retainers"' }),
        defineField({ name: "subtext", title: "Subtext", type: "text", rows: 2 }),
      ],
    }),

    // ── Add-ons section header ─────────────────────────
    defineField({
      name:  "addonsSection",
      title: "Add-Ons Section",
      type:  "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string", description: 'e.g. "Add-On Services"' }),
        defineField({ name: "headline", title: "Headline", type: "string", description: 'e.g. "Extend Your Project"' }),
        defineField({ name: "subtext", title: "Subtext", type: "text", rows: 2 }),
      ],
    }),

    // ── CTA section ─────────────────────────────────────
    defineField({
      name:  "ctaSection",
      title: "CTA Section",
      type:  "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string", description: 'e.g. "Ready to Start?"' }),
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({ name: "subtext", title: "Subtext", type: "text", rows: 2 }),
        defineField({ name: "primaryCtaLabel", title: "Primary CTA Label", type: "string", description: 'e.g. "Get In Touch"' }),
        defineField({ name: "secondaryCtaLabel", title: "Secondary CTA Label", type: "string", description: 'e.g. "See Our Work"' }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Services Page" }),
  },
});
