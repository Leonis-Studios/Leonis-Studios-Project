// sanity/schemaTypes/objects/faqBlock.ts
//
// Content-local FAQ — an inline repeatable field for AEO snippet
// targeting on individual posts/case studies. Distinct from the
// `faqItem` document type, which powers the global home-page FAQ.

import { defineField, defineType, defineArrayMember } from "sanity";

export const faqBlockSchema = defineType({
  name:  "faqBlockItem",
  title: "FAQ Item",
  type:  "object",
  fields: [
    defineField({
      name:       "question",
      title:      "Question",
      type:       "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name:       "answer",
      title:      "Answer",
      type:       "text",
      rows:       4,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "question", subtitle: "answer" },
  },
});

// The array field definition itself, for reuse on post.ts/caseStudy.ts:
//   defineField({ name: "faq", title: "FAQ", type: "array", of: [faqBlockArrayMember] })
export const faqBlockArrayMember = defineArrayMember({ type: "faqBlockItem" });
