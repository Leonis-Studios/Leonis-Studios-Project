import { defineType, defineField } from "sanity";

export const faqItemSchema = defineType({
  name:  "faqItem",
  title: "FAQ Item",
  type:  "document",
  icon:  () => "❓",

  fields: [
    defineField({
      name:        "question",
      title:       "Question",
      type:        "string",
      validation:  (Rule) => Rule.required(),
    }),
    defineField({
      name:        "answer",
      title:       "Answer",
      type:        "text",
      rows:        5,
      validation:  (Rule) => Rule.required(),
    }),
    defineField({
      name:  "category",
      title: "Category",
      type:  "string",
      options: {
        list: [
          { title: "General",   value: "general"   },
          { title: "Pricing",   value: "pricing"   },
          { title: "Process",   value: "process"   },
          { title: "Technical", value: "technical" },
        ],
      },
    }),
    defineField({
      name:         "order",
      title:        "Display Order",
      type:         "number",
      initialValue: 0,
      description:  "Lower numbers appear first.",
    }),
    defineField({
      name:         "active",
      title:        "Active",
      type:         "boolean",
      initialValue: true,
      description:  "Uncheck to hide this FAQ from the website.",
    }),
  ],

  preview: {
    select: {
      title:    "question",
      subtitle: "category",
    },
  },
});
