import { defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: () => "⚙️",
  // Prevents creating more than one — singleton pattern
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      description: "e.g. Leonis Studios",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Short tagline shown in browser tab and meta",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description: "150-160 characters. Used as default description for SEO.",
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "email",
      title: "Contact Email",
      type: "string",
      description: "hello@leonisstudios.com",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "e.g. New Jersey, USA",
    }),
    defineField({
      name: "social",
      title: "Social Links",
      type: "object",
      fields: [
        defineField({ name: "twitter", title: "Twitter / X URL", type: "url" }),
        defineField({ name: "github", title: "GitHub URL", type: "url" }),
        defineField({ name: "linkedin", title: "LinkedIn URL", type: "url" }),
        defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
