import { defineField, defineType } from "sanity";

export const serviceSchema = defineType({
  name:  "service",
  title: "Service",
  type:  "document",
  icon:  () => "⚡",

  fields: [
    // ── Identity ──────────────────────────────────────
    defineField({
      name:        "name",
      title:       "Service Name",
      type:        "string",
      description: 'e.g. "Growth Website Package"',
      validation:  (Rule) => Rule.required(),
    }),

    defineField({
      name:    "slug",
      title:   "Slug",
      type:    "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name:        "category",
      title:       "Category",
      type:        "string",
      description: "Groups services into sections on the pricing page",
      options: {
        list: [
          { title: "Website Package (one-time)", value: "package" },
          { title: "Monthly Retainer",           value: "retainer" },
          { title: "SEO Standalone",             value: "seo" },
          { title: "Add-on",                     value: "addon" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name:        "tier",
      title:       "Tier",
      type:        "string",
      description: "The tier level within its category",
      options: {
        list: [
          { title: "Starter",   value: "starter" },
          { title: "Growth",    value: "growth" },
          { title: "Studio",    value: "studio" },
          { title: "Essential", value: "essential" },
          { title: "Authority", value: "authority" },
          { title: "N/A",       value: "na" },
        ],
        layout: "radio",
      },
    }),

    defineField({
      name:        "tagline",
      title:       "Tagline",
      type:        "string",
      description: 'Short line describing who this is for, e.g. "For solo entrepreneurs and landing pages"',
    }),

    defineField({
      name:        "description",
      title:       "Description",
      type:        "text",
      rows:        3,
      description: "2-3 sentences about what this service delivers",
      validation:  (Rule) => Rule.required(),
    }),

    // ── Pricing ───────────────────────────────────────
    defineField({
      name:        "startingPrice",
      title:       "Starting Price (USD)",
      type:        "number",
      description: "The minimum price shown as 'From $X'. Leave blank to show price label only.",
    }),

    defineField({
      name:        "priceLabel",
      title:       "Price Label",
      type:        "string",
      description: "Overrides the auto-generated price display if set.",
      options: {
        list: [
          { title: "From $X (auto)",       value: "" },
          { title: "Let's talk",           value: "Let's talk" },
          { title: "Custom quote",         value: "Custom quote" },
          { title: "Included in packages", value: "Included in packages" },
        ],
      },
    }),

    defineField({
      name:        "billingPeriod",
      title:       "Billing Period",
      type:        "string",
      description: "Shown after the price",
      options: {
        list: [
          { title: "One-time",  value: "one-time" },
          { title: "Per month", value: "per month" },
          { title: "Per page",  value: "per page" },
          { title: "N/A",       value: "" },
        ],
      },
    }),

    // ── Features ──────────────────────────────────────
    defineField({
      name:        "features",
      title:       "What's Included",
      type:        "array",
      description: "Bullet point list of deliverables",
      of:          [{ type: "string" }],
    }),

    defineField({
      name:        "notIncluded",
      title:       "Not Included (greyed out)",
      type:        "array",
      description: "Items shown as greyed out — helps clients understand tier differences",
      of:          [{ type: "string" }],
    }),

    // ── Pairing ───────────────────────────────────────
    defineField({
      name:        "recommendedRetainer",
      title:       "Recommended Monthly Retainer",
      type:        "reference",
      description: "For website packages — which retainer tier pairs with this package?",
      to:          [{ type: "service" }],
    }),

    // ── Display ───────────────────────────────────────
    defineField({
      name:         "featured",
      title:        "Featured / Highlighted",
      type:         "boolean",
      description:  "Highlighted as the recommended or most popular option",
      initialValue: false,
    }),

    defineField({
      name:         "order",
      title:        "Display Order",
      type:         "number",
      description:  "Lower numbers appear first within each category",
      initialValue: 99,
    }),

    defineField({
      name:         "active",
      title:        "Active",
      type:         "boolean",
      description:  "Uncheck to hide this service without deleting it",
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title:    "name",
      subtitle: "category",
    },
    prepare({ title, subtitle }: { title: string; subtitle: string }) {
      const labels: Record<string, string> = {
        package:  "📦 Website Package",
        retainer: "🔄 Monthly Retainer",
        seo:      "🔍 SEO Standalone",
        addon:    "➕ Add-on",
      };
      return {
        title,
        subtitle: labels[subtitle] ?? subtitle,
      };
    },
  },
});
