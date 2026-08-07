// sanity/schemaTypes/blogPage.ts
//
// Singleton document for the /blog index page's own copy
// (section header + empty state) — same pattern as aboutPage.ts.
// Post content itself lives on the "post" document type; this
// is just the page-level wrapper text around the list.

import { defineField, defineType } from "sanity";

export const blogPageSchema = defineType({
  name:  "blogPage",
  title: "Blog Page Settings",
  type:  "document",
  icon:  () => "🗺️",
  fields: [
    defineField({
      name:        "eyebrow",
      title:       "Eyebrow Label",
      type:        "string",
      description: 'Small tracked-out label above the headline, e.g. "Journal"',
    }),
    defineField({
      name:        "headline",
      title:       "Headline",
      type:        "string",
      description: 'e.g. "Latest dispatches."',
    }),
    defineField({
      name:        "intro",
      title:       "Intro Paragraph",
      type:        "text",
      rows:        2,
      description: "Short paragraph shown next to the headline",
    }),
    defineField({
      name:        "emptyStateMessage",
      title:       "Empty State Message",
      type:        "string",
      description: "Shown on the blog index when there are zero published posts",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Blog Page Settings" }),
  },
});
