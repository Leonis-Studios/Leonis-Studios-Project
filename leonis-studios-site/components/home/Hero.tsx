// Server Component — fetches hero copy from Sanity (homePage.hero)
// and hands it to HeroClient, which owns the scroll-state interactivity.

import { client }        from "@/sanity/lib/client";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";
import type { HomePageData } from "@/lib/types";
import HeroClient        from "./HeroClient";

export default async function Hero() {
  const data: HomePageData | null = await client
    .fetch(HOME_PAGE_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => null);

  return <HeroClient hero={data?.hero} />;
}
