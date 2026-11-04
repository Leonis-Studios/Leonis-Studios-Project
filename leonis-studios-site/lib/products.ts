// lib/products.ts
//
// Route + label config for Leonis-owned products. Apps and games share
// one Sanity type and one set of components; everything that differs
// between /apps and /games lives here, so adding a third section later
// (e.g. /tools) is one entry, not a copy-pasted route tree.

import type { ProductKind, ProductStatus, ProductCard } from "@/lib/types";

export const productSections: Record<
  ProductKind,
  {
    basePath: string;
    label: string; // nav / breadcrumb label
    singular: string; // eyebrow: "App · by Leonis Studios"
    indexTitle: string;
    indexIntro: string;
  }
> = {
  app: {
    basePath: "/apps",
    label: "Apps",
    singular: "App",
    indexTitle: "Apps",
    indexIntro:
      "Software Leonis Studios designs, builds, and runs itself. Each one ships under its own name, made by the same studio that builds our clients' sites.",
  },
  game: {
    basePath: "/games",
    label: "Games",
    singular: "Game",
    indexTitle: "Games",
    indexIntro:
      "Games designed and published by Leonis Studios. Press kits, clips, and pre-registration links live on each game's page.",
  },
};

export function productPath(p: Pick<ProductCard, "kind" | "slug">) {
  return `${productSections[p.kind].basePath}/${p.slug}`;
}

export const statusLabel: Record<ProductStatus, string> = {
  development: "In development",
  preorder: "Pre-order open",
  live: "Available now",
  retired: "Retired",
};
