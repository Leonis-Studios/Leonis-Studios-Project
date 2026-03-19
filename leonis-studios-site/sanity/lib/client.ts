// sanity/lib/client.ts
//
// The Sanity client is what your Next.js pages use to
// fetch content from Sanity's API.
//
// createClient from next-sanity is a Next.js-aware wrapper
// that supports the fetch cache — meaning Next.js can
// revalidate (refresh) data on a schedule without a full
// rebuild. More on that when we write the actual pages.

import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  // API version is a date string — Sanity versions its API
  // by date so old queries never break when the API updates.
  // Leave this as-is unless you need a specific new feature.
  apiVersion: "2024-01-01",

  // useCdn: true = fast cached responses via Sanity's CDN.
  // Fine for published content. Switch to false if you ever
  // build draft preview functionality.
  useCdn: true,
});
