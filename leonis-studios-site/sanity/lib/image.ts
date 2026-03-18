// sanity/lib/image.ts
//
// Sanity stores images as references to asset documents,
// not as plain URLs. This helper builds transformation URLs
// so you can resize, crop and format images on the fly.
//
// Usage in any component:
//   import { urlFor } from "@/sanity/lib/image"
//   <Image src={urlFor(coverImage).width(800).format("webp").url()} />
//
// Common methods:
//   .width(n)       resize to n pixels wide
//   .height(n)      resize to n pixels tall
//   .fit("crop")    crop to exact dimensions using the hotspot
//   .format("webp") convert to WebP for better compression
//   .quality(80)    set compression quality 0-100
//   .url()          returns the final URL string

import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}