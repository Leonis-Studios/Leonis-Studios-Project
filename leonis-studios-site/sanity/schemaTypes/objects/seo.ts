// sanity/schemaTypes/objects/seo.ts
//
// Reusable SEO override object. Attach as an optional `seo` field
// on any publicly-routable document/singleton. Every sub-field is
// optional — the frontend always falls back to a content-derived
// default (title, excerpt/summary, etc.) via GROQ coalesce(), so
// editors who skip this panel still get correct metadata.

import { defineField, defineType } from "sanity";

export const seoSchema = defineType({
  name:  "seo",
  title: "SEO",
  type:  "object",
  options: {
    collapsible: true,
    collapsed:   true,
  },
  fields: [
    defineField({
      name:        "metaTitle",
      title:       "Meta Title Override",
      type:        "string",
      description: "Overrides the page title in search results. Leave blank to use the page's own title.",
      validation:  (Rule) => Rule.max(60).warning("Longer titles may be truncated in search results"),
    }),
    defineField({
      name:        "metaDescription",
      title:       "Meta Description Override",
      type:        "text",
      rows:        3,
      description: "Overrides the page description in search results. Leave blank to use the page's excerpt/summary.",
      validation:  (Rule) => Rule.max(160).warning("Longer descriptions may be truncated in search results"),
    }),
    defineField({
      name:  "ogImage",
      title: "Social Share Image",
      type:  "image",
      options: { hotspot: true },
      description: "Overrides the image shown when this page is shared on social media. Leave blank to use the page's cover image or the site default.",
    }),
    defineField({
      name:        "canonicalUrl",
      title:       "Canonical URL Override",
      type:        "url",
      description: "Only needed if this content is a duplicate of another URL. Leave blank in almost all cases.",
    }),
    defineField({
      name:         "noindex",
      title:        "Hide from Search Engines",
      type:         "boolean",
      description:  "Prevents this page from being indexed by search engines. Use for thin, duplicate, or draft-only content.",
      initialValue: false,
    }),
  ],
});
