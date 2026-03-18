// sanity/schemaTypes/service.ts
//
// A schema defines the shape of a content type in Sanity —
// what fields exist, what type they are, and how they appear
// in the studio editor.
//
// defineType  — creates the document type (like a database table)
// defineField — defines each field inside the document
//
// Field types used here:
//   string  → single line text input
//   text    → multi-line text input
//   slug    → URL-safe string, auto-generated from another field
//   array   → a list — here, a list of strings
//   number  → numeric input
//   boolean → toggle switch

import { defineField, defineType } from "sanity";

export const serviceSchema = defineType({
  name:  "service",
  title: "Service",
  type:  "document",
  icon:  () => "⚡",

  fields: [
    defineField({
      name:        "name",
      title:       "Service Name",
      type:        "string",
      description: 'e.g. "Web Design & Development"',
      validation:  (Rule) => Rule.required(),
    }),

    defineField({
      name:  "slug",
      title: "Slug",
      type:  "slug",
      // Sanity auto-generates the slug from the name field
      // when you click the Generate button in the studio
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name:        "tagline",
      title:       "Tagline",
      type:        "string",
      description: 'Short line shown on service cards, e.g. "Sites that work as hard as you do"',
    }),

    defineField({
      name:        "description",
      title:       "Description",
      type:        "text",
      rows:        4,
      validation:  (Rule) => Rule.required(),
    }),

    defineField({
      name:        "features",
      title:       "Features",
      type:        "array",
      description: "What is included in this service",
      of:          [{ type: "string" }],
    }),

    defineField({
      name:        "price",
      title:       "Starting Price (USD)",
      type:        "number",
      description: "Leave blank to show 'Custom quote'",
    }),

    defineField({
      name:         "featured",
      title:        "Featured Service",
      type:         "boolean",
      description:  "Featured services appear on the home page",
      initialValue: false,
    }),

    defineField({
      name:         "order",
      title:        "Display Order",
      type:         "number",
      description:  "Lower numbers appear first. Use 1, 2, 3...",
      initialValue: 99,
    }),
  ],

  // Controls how each document is labelled in the studio list
  preview: {
    select: {
      title:    "name",
      subtitle: "tagline",
    },
  },
});