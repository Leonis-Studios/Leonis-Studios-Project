// sanity/schemaTypes/post.ts
//
// Blog post schema. Mirrors caseStudy.ts's field conventions
// (image with required alt + hotspot, Portable Text body with
// the same block/mark config) so blog content editing feels
// identical to case study editing.

import { defineField, defineType, defineArrayMember } from "sanity";
import { faqBlockArrayMember } from "./objects/faqBlock";

export const postSchema = defineType({
  name:  "post",
  title: "Blog Post",
  type:  "document",
  icon:  () => "📝",

  fields: [
    defineField({
      name:       "title",
      title:      "Title",
      type:       "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name:       "slug",
      title:      "Slug",
      type:       "slug",
      options:    { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name:       "excerpt",
      title:      "Excerpt",
      type:       "text",
      rows:       3,
      description: "1-2 sentences shown on the Blog index card, and used as the page meta description",
      validation: (Rule) => Rule.required().max(160),
    }),

    defineField({
      name:  "coverImage",
      title: "Cover Image",
      type:  "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name:       "alt",
          title:      "Alt Text",
          type:       "string",
          description: "Describe the image for accessibility and SEO",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    defineField({
      name:       "publishedAt",
      title:      "Published At",
      type:       "datetime",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name:  "author",
      title: "Author",
      type:  "reference",
      to:    [{ type: "author" }],
    }),

    defineField({
      name:  "tags",
      title: "Tags",
      type:  "array",
      of:    [{ type: "string" }],
      options: { layout: "tags" },
    }),

    defineField({
      name:  "seo",
      title: "SEO",
      type:  "seo",
    }),

    defineField({
      name:  "body",
      title: "Body",
      type:  "array",
      // Portable Text — same config as caseStudy.body
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal",    value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Quote",     value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold",   value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name:   "link",
                type:   "object",
                title:  "Link",
                fields: [
                  { name: "href", type: "url", title: "URL" },
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt",     type: "string", title: "Alt Text" }),
            defineField({ name: "caption", type: "string", title: "Caption" }),
          ],
        }),
      ],
    }),

    defineField({
      name:  "faq",
      title: "FAQ",
      type:  "array",
      description: "Optional Q&A pairs shown at the end of the post and marked up as FAQPage structured data.",
      of:    [faqBlockArrayMember],
    }),

    defineField({
      name:         "featured",
      title:        "Featured Post",
      type:         "boolean",
      description:  "Featured posts can be surfaced first on the Blog index",
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title:    "title",
      subtitle: "excerpt",
      media:    "coverImage",
    },
  },
});
