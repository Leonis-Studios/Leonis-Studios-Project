// sanity/schemaTypes/caseStudy.ts
//
// New field types introduced here:
//
//   image     → a Sanity-hosted image with optional hotspot
//               (hotspot lets editors pick the focal point
//               so images crop correctly at all sizes)
//
//   reference → a pointer to another document. Here, services[]
//               is an array of references to service documents.
//               In GROQ you use -> to "follow" the reference
//               and fetch the linked document's fields.
//
//   array of blocks → Portable Text. Sanity's rich text format.
//               Structured content (headings, paragraphs, lists,
//               links, inline images). Rendered in Next.js with
//               the @portabletext/react package.

import { defineField, defineType, defineArrayMember } from "sanity";

export const caseStudySchema = defineType({
  name:  "caseStudy",
  title: "Case Study",
  type:  "document",
  icon:  () => "📁",

  fields: [
    defineField({
      name:       "title",
      title:      "Project Title",
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
      name:       "client",
      title:      "Client Name",
      type:       "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name:       "year",
      title:      "Year",
      type:       "number",
      validation: (Rule) => Rule.min(2020).max(2100),
    }),

    defineField({
      name:       "summary",
      title:      "Summary",
      type:       "text",
      rows:       3,
      description: "1-2 sentences shown on the Work grid card",
      validation: (Rule) => Rule.required().max(200),
    }),

    defineField({
      name:  "services",
      title: "Services Provided",
      type:  "array",
      of: [
        defineArrayMember({
          // reference links to a service document.
          // In the studio you get a searchable picker.
          // In GROQ: services[]->{ name, slug }
          type: "reference",
          to:   [{ type: "service" }],
        }),
      ],
    }),

    defineField({
      name:  "tags",
      title: "Tags",
      type:  "array",
      of:    [{ type: "string" }],
      options: { layout: "tags" },
    }),

    defineField({
      name:  "coverImage",
      title: "Cover Image",
      type:  "image",
      options: {
        // Hotspot lets you set a focal point on the image
        // so it always crops to the right area
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
      name:  "liveUrl",
      title: "Live Site URL",
      type:  "url",
    }),

    defineField({
      name:  "body",
      title: "Case Study Body",
      type:  "array",
      // Portable Text — each paragraph/heading/list is a "block"
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
        // Images can also be embedded inside the body
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
      name:        "results",
      title:       "Results & Metrics",
      type:        "array",
      description: 'Key outcomes, e.g. { label: "Traffic Growth", value: "3×" }',
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "value", title: "Value", type: "string" }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        }),
      ],
    }),

    defineField({
      name:         "featured",
      title:        "Featured Project",
      type:         "boolean",
      description:  "Featured projects appear on the home page",
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title:    "title",
      subtitle: "client",
      media:    "coverImage",
    },
  },
});