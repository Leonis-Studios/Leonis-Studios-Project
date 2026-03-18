// app/(site)/page.tsx
//
// The home page is a Server Component — it has no interactivity
// itself, it just composes the section components together.
// The data fetching happens inside each section component,
// not here. This keeps each section self-contained and
// independently cacheable.

import type { Metadata } from "next";
import Hero         from "@/components/home/Hero";
import Marquee      from "@/components/home/Marquee";
import Services     from "@/components/home/Services";
import FeaturedWork from "@/components/home/FeaturedWork";
import CTA          from "@/components/home/CTA";
import siteConfig   from "@/site.config";

export const metadata: Metadata = {
  title:       siteConfig.name,
  description: siteConfig.description,
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Services />
      <FeaturedWork />
      <CTA />
    </>
  );
}