// app/(site)/games/[slug]/page.tsx — one game's product page.
// Thin wrapper; shared implementation in components/products/ProductDetailPage.tsx.

import ProductDetailPage, { productMetadata, productStaticParams } from "@/components/products/ProductDetailPage";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return productStaticParams("game");
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  return productMetadata("game", slug);
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  return <ProductDetailPage kind="game" slug={slug} />;
}
