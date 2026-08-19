// sanity/schemaTypes/author.ts
//
// Referenced by post.author. Kept as its own document type (not an
// inline object) so authors can be reused across posts and carry
// enough detail for Person/Article structured data (GEO).

import { defineField, defineType } from "sanity";

export const authorSchema = defineType({
  name:  "author",
  title: "Author",
  type:  "document",
  icon:  () => "🖋️",
  fields: [
    defineField({
      name:       "name",
      title:      "Name",
      type:       "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name:       "slug",
      title:      "Slug",
      type:       "slug",
      options:    { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name:  "bio",
      title: "Bio",
      type:  "text",
      rows:  4,
    }),
    defineField({
      name:  "image",
      title: "Photo",
      type:  "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name:  "alt",
          title: "Alt Text",
          type:  "string",
        }),
      ],
    }),
    defineField({
      name:        "sameAs",
      title:       "Social / Profile Links",
      type:        "array",
      description: "e.g. LinkedIn, X/Twitter, GitHub — used for Person structured data",
      of:          [{ type: "url" }],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "bio", media: "image" },
  },
});
