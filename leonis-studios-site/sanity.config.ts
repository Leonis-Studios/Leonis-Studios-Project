// sanity.config.ts
//
// This is the entry point for the embedded Sanity Studio.
// When you visit localhost:3000/studio, Next.js renders
// this config as a full CMS interface.
//
// Two plugins are included:
//   structureTool — the main content editing UI
//   visionTool    — lets you run GROQ queries live in the
//                   browser, great for learning and debugging

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@/sanity/schemaTypes";

export default defineConfig({
  // Where the studio lives inside your Next.js app
  basePath: "/studio",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins: [
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});