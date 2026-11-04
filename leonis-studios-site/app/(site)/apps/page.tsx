// app/(site)/apps/page.tsx — index of Leonis-owned apps.
// Thin wrapper; shared implementation in components/products/ProductIndexPage.tsx.

import ProductIndexPage, { productIndexMetadata } from "@/components/products/ProductIndexPage";

export function generateMetadata() {
  return productIndexMetadata("app");
}

export default function Page() {
  return <ProductIndexPage kind="app" />;
}
