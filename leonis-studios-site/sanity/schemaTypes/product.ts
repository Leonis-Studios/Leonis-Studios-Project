// sanity/schemaTypes/product.ts
//
// A Leonis Studios–owned product: a software app (Vellis) or a game.
// One type for both, split by `kind`, because the page anatomy is the
// same (pitch, store buttons, waitlist, support, privacy) and only the
// URL prefix and a few labels differ:
//
//   kind "app"  → /apps/[slug]
//   kind "game" → /games/[slug]
//
// Endorsed-brand model: each product keeps its own name and identity,
// shown as "by Leonis Studios" on its page, while the studio owns the
// page, the waitlist list, and the support address.
//
// Renaming a product: change `name` freely. Changing `slug` changes the
// public URL, so add a redirect in next.config.ts for the old slug
// (store listings and shared links may still point at it).

import { defineField, defineType, defineArrayMember } from "sanity";
import { faqBlockArrayMember } from "./objects/faqBlock";

export const productSchema = defineType({
  name: "product",
  title: "Product (App / Game)",
  type: "document",
  icon: () => "📱",

  groups: [
    { name: "basics", title: "Basics", default: true },
    { name: "launch", title: "Launch & Stores" },
    { name: "content", title: "Page Content" },
    { name: "support", title: "Support & Privacy" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    // ── Basics ──────────────────────────────────────────────
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      group: "basics",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "basics",
      options: { source: "name", maxLength: 64 },
      description:
        "The URL segment (/apps/<slug>). Changing it after launch breaks links — add a redirect.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      group: "basics",
      options: {
        list: [
          { title: "App", value: "app" },
          { title: "Game", value: "game" },
        ],
        layout: "radio",
      },
      initialValue: "app",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "basics",
      description:
        'One line that holds the search phrase this product most wants to rank for (e.g. "The workout tracker built around progress"). Keep it aligned with the store subtitle.',
      validation: (Rule) => Rule.required().max(90),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      group: "basics",
      description:
        'Standalone 1–2 sentence answer to "what is this?". Used on cards, the meta description fallback, and llms.txt.',
      validation: (Rule) => Rule.required().max(220),
    }),
    defineField({
      name: "primaryKeyword",
      title: "Primary Keyword",
      type: "string",
      group: "basics",
      description:
        "The one search phrase this product owns. Give every product a different one so they don't compete.",
    }),
    defineField({
      name: "icon",
      title: "App Icon",
      type: "image",
      group: "basics",
      description: "Square, at least 512×512.",
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),
    defineField({
      name: "category",
      title: "Store Category",
      type: "string",
      group: "basics",
      description: "Used for structured data (schema.org applicationCategory).",
      options: {
        list: [
          { title: "Health & Fitness", value: "HealthApplication" },
          { title: "Education", value: "EducationalApplication" },
          { title: "Game", value: "GameApplication" },
          { title: "Productivity", value: "BusinessApplication" },
          { title: "Lifestyle", value: "LifestyleApplication" },
          { title: "Utilities", value: "UtilitiesApplication" },
        ],
      },
    }),
    defineField({
      name: "featured",
      title: "Show on Home Page",
      type: "boolean",
      group: "basics",
      description:
        'Featured products appear in the home page "Products we\'ve built" strip.',
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      group: "basics",
      initialValue: 10,
    }),

    // ── Launch & Stores ─────────────────────────────────────
    defineField({
      name: "status",
      title: "Launch Status",
      type: "string",
      group: "launch",
      description:
        "Drives the page's call to action: waitlist before launch, store buttons once live.",
      options: {
        list: [
          { title: "In development (waitlist only)", value: "development" },
          { title: "Pre-order / pre-registration open", value: "preorder" },
          { title: "Live on the stores", value: "live" },
          { title: "Retired (page kept, no CTA)", value: "retired" },
        ],
        layout: "radio",
      },
      initialValue: "development",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "platforms",
      title: "Platforms",
      type: "array",
      group: "launch",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "iOS", value: "iOS" },
          { title: "Android", value: "Android" },
          { title: "Web", value: "Web" },
        ],
      },
    }),
    defineField({
      name: "appStoreUrl",
      title: "App Store URL",
      type: "url",
      group: "launch",
      description:
        "Works for pre-orders too — Apple uses the same listing URL.",
    }),
    defineField({
      name: "playStoreUrl",
      title: "Google Play URL",
      type: "url",
      group: "launch",
      description: "Works for pre-registration too.",
    }),
    defineField({
      name: "webAppUrl",
      title: "Web App URL",
      type: "url",
      group: "launch",
    }),
    defineField({
      name: "isFree",
      title: "Free to Download",
      type: "boolean",
      group: "launch",
      initialValue: true,
    }),
    defineField({
      name: "priceLabel",
      title: "Price Label",
      type: "string",
      group: "launch",
      description:
        'Shown on the page, e.g. "Free" or "Free, with optional Pro".',
    }),
    defineField({
      name: "waitlistSegmentId",
      title: "Waitlist Segment ID (Resend)",
      type: "string",
      group: "launch",
      description:
        'Resend segment that waitlist signups join. Leave blank to hide the waitlist form. One segment per product; one shared "players" segment can be reused across games.',
    }),
    defineField({
      name: "waitlistPitch",
      title: "Waitlist Pitch",
      type: "string",
      group: "launch",
      description:
        'One line above the email field, e.g. "Get early access and a launch-day email."',
    }),
    defineField({
      name: "launchDate",
      title: "Planned Launch Date",
      type: "date",
      group: "launch",
      description: "Optional. Shown only if set.",
    }),

    // ── Page Content ────────────────────────────────────────
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      description: "A device shot or key art. Shows the result, not a menu.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "heroVideo",
      title: "Hero Screen Recording",
      type: "productVideo",
      group: "content",
      description:
        "Optional portrait clip that plays inside the hero phone frame (silent loop). Overrides the first screenshot. Ignored if a Hero Image is set.",
    }),
    defineField({
      name: "pillars",
      title: "Pillars",
      type: "array",
      group: "content",
      description:
        "The 3–4 things this product does better than the alternatives. Lead each description with the outcome.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: "sections",
      title: "Page Sections",
      type: "array",
      group: "content",
      description:
        "Build the middle of the page: feature blocks (with an optional image or video) and galleries. Drag to reorder.",
      of: [
        defineArrayMember({ type: "productFeature" }),
        defineArrayMember({ type: "productGallery" }),
      ],
    }),
    defineField({
      name: "screenshots",
      title: "Screenshots",
      type: "array",
      group: "content",
      description:
        "Portrait phone screenshots, same order as the store listing. First two carry the pitch.",
      of: [
        defineArrayMember({
          type: "image",
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Long Description",
      type: "array",
      group: "content",
      description:
        "Optional deeper write-up (how it works, who it's for). Use question-shaped H2s.",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (Rule) => Rule.uri({ allowRelative: true }),
                  },
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      group: "content",
      description:
        'Questions people actually search ("Can I import my routine into Vellis?"). Marked up as FAQPage structured data.',
      of: [faqBlockArrayMember],
    }),

    // ── Support & Privacy ───────────────────────────────────
    defineField({
      name: "supportEmail",
      title: "Support Email",
      type: "string",
      group: "support",
      description:
        "On the Leonis domain (e.g. support@leonisstudios.com). Falls back to the site email.",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "privacyAnchor",
      title: "Privacy Policy Anchor",
      type: "string",
      group: "support",
      description:
        'Section id on /privacy for this product (e.g. "vellis" → /privacy#vellis). Defaults to the slug.',
    }),

    // ── SEO ─────────────────────────────────────────────────
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],

  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],

  preview: {
    select: { title: "name", kind: "kind", status: "status", media: "icon" },
    prepare({ title, kind, status, media }) {
      return {
        title,
        subtitle: [kind, status].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
