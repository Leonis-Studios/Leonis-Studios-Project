// Server Component — fetches benefits copy from Sanity (homePage.benefitsSection)
// and hands it to BenefitsClient, which owns the scroll-triggered sand reveal.

import { client }        from "@/sanity/lib/client";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";
import type { HomePageData } from "@/lib/types";
import BenefitsClient    from "./BenefitsClient";

export default async function Benefits() {
  const data: HomePageData | null = await client
    .fetch(HOME_PAGE_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => null);

  return <BenefitsClient benefitsSection={data?.benefitsSection} />;
}
