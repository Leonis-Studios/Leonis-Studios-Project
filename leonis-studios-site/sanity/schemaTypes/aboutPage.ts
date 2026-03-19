import { defineField, defineType, defineArrayMember } from "sanity";

export const aboutPageSchema = defineType({
  name:  "aboutPage",
  title: "About Page",
  type:  "document",
  icon:  () => "📖",
  __experimental_actions: ["update", "publish"],
  fields: [
    // ── Hero section ──────────────────────────────────
    defineField({
      name:        "heroHeadline",
      title:       "Hero Headline",
      type:        "string",
      description: "Large heading at top of about page",
    }),
    defineField({
      name:        "heroSubheading",
      title:       "Hero Subheading",
      type:        "text",
      rows:        2,
      description: "1-2 sentences below the headline",
    }),

    // ── Story section ─────────────────────────────────
    defineField({
      name:        "storyHeadline",
      title:       "Story Section Headline",
      type:        "string",
      description: 'e.g. "The Studio"',
    }),
    defineField({
      name:        "storyBody",
      title:       "Story Body",
      type:        "array",
      description: "Rich text — your studio story, who you are, how Leonis started",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal",    value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Bold",   value: "strong" },
              { title: "Italic", value: "em" },
            ],
          },
        }),
      ],
    }),

    // ── Profile photo ─────────────────────────────────
    defineField({
      name:    "profilePhoto",
      title:   "Profile Photo",
      type:    "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name:  "alt",
          title: "Alt Text",
          type:  "string",
        }),
      ],
    }),

    // ── Values ────────────────────────────────────────
    defineField({
      name:        "values",
      title:       "Values / Principles",
      type:        "array",
      description: "The numbered values shown in the What We Stand For section",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title",       title: "Value Name",  type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        }),
      ],
    }),

    // ── Approach ──────────────────────────────────────
    defineField({
      name:  "approachHeadline",
      title: "Approach Section Headline",
      type:  "string",
    }),
    defineField({
      name:        "approachBody",
      title:       "Approach Body",
      type:        "text",
      rows:        4,
      description: "How you work with clients",
    }),

    // ── Tech stack ────────────────────────────────────
    defineField({
      name:        "techStack",
      title:       "Tech Stack",
      type:        "array",
      description: "Technologies listed in the stack section",
      of:          [{ type: "string" }],
    }),

    // ── CTA ───────────────────────────────────────────
    defineField({
      name:        "ctaHeadline",
      title:       "CTA Headline",
      type:        "string",
      description: 'e.g. "Ready to work together?"',
    }),
    defineField({
      name:    "ctaSubtext",
      title:   "CTA Subtext",
      type:    "string",
    }),
  ],
  preview: {
    prepare: () => ({ title: "About Page" }),
  },
});
