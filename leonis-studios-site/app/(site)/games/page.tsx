// app/(site)/games/page.tsx — index of Leonis-owned games.
// Thin wrapper; shared implementation in components/products/ProductIndexPage.tsx.

import ProductIndexPage, { productIndexMetadata } from "@/components/products/ProductIndexPage";

export function generateMetadata() {
  return productIndexMetadata("game");
}

export default function Page() {
  return <ProductIndexPage kind="game" />;
}
