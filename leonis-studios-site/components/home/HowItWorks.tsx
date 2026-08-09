// Server Component — fetches process-step copy from Sanity (homePage.howItWorks)
// and hands it to HowItWorksClient, which owns the scroll/hover interactivity.

import { client }        from "@/sanity/lib/client";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";
import type { HomePageData } from "@/lib/types";
import HowItWorksClient  from "./HowItWorksClient";

export default async function HowItWorks() {
  const data: HomePageData | null = await client
    .fetch(HOME_PAGE_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => null);

  return <HowItWorksClient howItWorks={data?.howItWorks} />;
}
