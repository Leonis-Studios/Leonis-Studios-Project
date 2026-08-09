import { defineField, defineType } from "sanity";

// Singleton — every field is optional so the hero falls back to
// its own hardcoded default until an editor fills this in.
// Email/location live on siteSettings, not here.
export const contactPageSchema = defineType({
  name:  "contactPage",
  title: "Contact Page",
  type:  "document",
  icon:  () => "✉️",
  fields: [
    defineField({
      name:  "hero",
      title: "Hero",
      type:  "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string", description: 'e.g. "Contact"' }),
        defineField({ name: "headlineLine1", title: "Headline Line 1", type: "string", description: 'e.g. "Start a"' }),
        defineField({ name: "headlineAccent", title: "Headline Accent", type: "string", description: 'e.g. "Project." — rendered in gold' }),
        defineField({ name: "subheading", title: "Subheading", type: "text", rows: 3 }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Contact Page" }),
  },
});
