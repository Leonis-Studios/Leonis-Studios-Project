// sanity/schemaTypes/objects/productMedia.ts
//
// Media + page-builder section types for product (app/game) pages.
//
//   productImage    — image with alt + caption
//   productVideo    — uploaded clip (mp4/webm) OR a YouTube link,
//                     with poster, caption, orientation, autoplay-as-loop
//   productFeature  — section: heading + copy + optional image/video.
//                     No media → renders as a text-only block.
//   productGallery  — section: grid or rail of images/videos.
//                     No items → section is skipped.
//
// Sections render in the order editors arrange them, between the
// pillars and the store screenshots.

import { defineArrayMember, defineField, defineType } from "sanity";

const toneField = defineField({
  name: "tone",
  title: "Background",
  type: "string",
  description: "Leave on Auto to alternate light/dark down the page.",
  options: {
    list: [
      { title: "Auto", value: "auto" },
      { title: "Light", value: "light" },
      { title: "Gray", value: "muted" },
      { title: "Dark", value: "dark" },
    ],
    layout: "radio",
    direction: "horizontal",
  },
  initialValue: "auto",
});

export const productImageSchema = defineType({
  name: "productImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
  ],
});

export const productVideoSchema = defineType({
  name: "productVideo",
  title: "Video",
  type: "object",
  icon: () => "🎬",
  fields: [
    defineField({
      name: "file",
      title: "Video File",
      type: "file",
      options: { accept: "video/mp4,video/webm,video/quicktime" },
      description:
        "Short clip, ideally under 20 MB. MP4 (H.264) plays everywhere.",
    }),
    defineField({
      name: "youtubeUrl",
      title: "…or YouTube URL",
      type: "url",
      description: "Use for long trailers. Ignored if a file is uploaded.",
      validation: (Rule) => Rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "poster",
      title: "Poster Image",
      type: "image",
      description:
        "Frame shown before playback. Strongly recommended for uploaded clips.",
    }),
    defineField({
      name: "alt",
      title: "Description",
      type: "string",
      description: "What the clip shows, for screen readers.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({
      name: "orientation",
      title: "Orientation",
      type: "string",
      options: {
        list: [
          { title: "Portrait (phone screen)", value: "portrait" },
          { title: "Landscape", value: "landscape" },
          { title: "Square", value: "square" },
        ],
        layout: "radio",
      },
      initialValue: "portrait",
    }),
    defineField({
      name: "loop",
      title: "Play as silent loop",
      type: "boolean",
      description:
        "Muted autoplay loop (like a GIF) while on screen. Off = normal player with controls.",
      initialValue: true,
    }),
  ],
  validation: (Rule) =>
    Rule.custom(
      (v: { file?: { asset?: unknown }; youtubeUrl?: string } | undefined) =>
        v?.file?.asset || v?.youtubeUrl
          ? true
          : "Upload a video file or add a YouTube URL",
    ),
  preview: {
    select: { title: "alt", subtitle: "caption", media: "poster" },
  },
});

const mediaMembers = [
  defineArrayMember({ type: "productImage" }),
  defineArrayMember({ type: "productVideo" }),
];

export const productFeatureSchema = defineType({
  name: "productFeature",
  title: "Feature Section",
  type: "object",
  icon: () => "✨",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 4,
      description: "Lead with the outcome. 2–4 sentences.",
    }),
    defineField({
      name: "bullets",
      title: "Bullet Points",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: "media",
      title: "Image or Video",
      type: "array",
      of: mediaMembers,
      description: "Optional. Leave empty for a text-only section.",
      validation: (Rule) => Rule.max(1),
    }),
    defineField({
      name: "mediaSide",
      title: "Media Side",
      type: "string",
      options: {
        list: ["right", "left"],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "right",
      hidden: ({ parent }) => !parent?.media?.length,
    }),
    toneField,
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow", media: "media.0.asset" },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle ?? "Feature",
      media,
    }),
  },
});

export const productGallerySchema = defineType({
  name: "productGallery",
  title: "Gallery Section",
  type: "object",
  icon: () => "🖼️",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
    defineField({
      name: "items",
      title: "Images & Videos",
      type: "array",
      of: mediaMembers,
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Grid", value: "grid" },
          { title: "Horizontal rail (phones)", value: "rail" },
        ],
        layout: "radio",
      },
      initialValue: "grid",
    }),
    toneField,
  ],
  preview: {
    select: { title: "heading", items: "items" },
    prepare: ({ title, items }) => ({
      title: title ?? "Gallery",
      subtitle: `${items?.length ?? 0} item(s)`,
    }),
  },
});
