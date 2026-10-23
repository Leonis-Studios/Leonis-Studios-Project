// app/llms.txt/route.ts
//
// Dynamically generates /llms.txt from Sanity content, following
// the llms.txt spec: H1 site name -> blockquote summary -> H2
// sections of "- [Title](url): description" links. Replaces the
// old static public/llms.txt so new posts/case studies appear
// automatically without a code change.

import { client } from "@/sanity/lib/client";
import {
  SITE_SETTINGS_QUERY,
  ALL_POSTS_QUERY,
  ALL_CASE_STUDIES_QUERY,
  ALL_SERVICES_QUERY,
  FAQ_ITEMS_QUERY,
} from "@/sanity/lib/queries";
import type { SiteSettings, PostCard, CaseStudyCard, Service, FaqItem } from "@/lib/types";
import siteConfig from "@/site.config";

export const revalidate = 3600;

export async function GET() {
  const [settings, posts, caseStudies, services, faqs]: [
    SiteSettings | null,
    PostCard[],
    CaseStudyCard[],
    Service[],
    FaqItem[],
  ] = await Promise.all([
    client.fetch(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 3600 } }).catch(() => null),
    client.fetch(ALL_POSTS_QUERY, {}, { next: { revalidate: 3600 } }).catch(() => []),
    client.fetch(ALL_CASE_STUDIES_QUERY, {}, { next: { revalidate: 3600 } }).catch(() => []),
    client.fetch(ALL_SERVICES_QUERY, {}, { next: { revalidate: 3600 } }).catch(() => []),
    client.fetch(FAQ_ITEMS_QUERY, {}, { next: { revalidate: 3600 } }).catch(() => []),
  ]);

  const price = (s: Service) =>
    s.startingPrice
      ? `from $${s.startingPrice.toLocaleString("en-US")}${s.billingPeriod ? ` ${s.billingPeriod}` : ""}`
      : s.priceLabel || "custom quote";

  const name        = settings?.siteName        ?? siteConfig.name;
  const summary      = settings?.metaDescription ?? siteConfig.description;
  const email        = settings?.email           ?? siteConfig.email;
  const location      = settings?.location        ?? siteConfig.location;

  const lines: string[] = [];

  lines.push(`# ${name}`);
  lines.push("");
  lines.push(`> ${summary}`);
  lines.push("");
  lines.push(`${name} is a web design studio based in ${location} that builds custom websites for small and mid-sized businesses across the United States. Every site is built to generate leads: it is designed to rank on Google (SEO), to be cited and recommended by AI assistants such as ChatGPT, Perplexity, Gemini, and Google AI Overviews (GEO, generative engine optimization), and to supply direct answers to customer questions (AEO, answer engine optimization). Sites are built on Next.js with a Sanity CMS, typically score 95+ on performance, and are designed so every page leads visitors toward a call, booking, or inquiry.`);
  lines.push("");

  lines.push("## Pages");
  lines.push("");
  lines.push(`- [Home](${siteConfig.url}/): Overview of ${name} — who we are, what we do, and answers to common questions.`);
  lines.push(`- [Services](${siteConfig.url}/services): Website packages, monthly retainers, and add-ons, with pricing.`);
  lines.push(`- [Work](${siteConfig.url}/work): Case studies of past client projects, results, and outcomes.`);
  lines.push(`- [Blog](${siteConfig.url}/blog): Articles on web design, development, and SEO.`);
  lines.push(`- [About](${siteConfig.url}/about): Background, approach, and tech stack.`);
  lines.push(`- [Contact](${siteConfig.url}/contact): Get in touch to start a project.`);
  lines.push("");

  const groups: [string, Service["category"]][] = [
    ["Website Packages", "package"],
    ["Monthly Retainers", "retainer"],
    ["Add-Ons", "addon"],
  ];
  if (services.length > 0) {
    lines.push("## Services and Pricing");
    lines.push("");
    for (const [label, category] of groups) {
      const items = services.filter((s) => s.category === category);
      if (!items.length) continue;
      lines.push(`### ${label}`);
      lines.push("");
      for (const s of items) {
        lines.push(`- ${s.name} (${price(s)}): ${s.description}`);
      }
      lines.push("");
    }
  }

  if (faqs.length > 0) {
    lines.push("## Frequently Asked Questions");
    lines.push("");
    for (const f of faqs) {
      lines.push(`### ${f.question}`);
      lines.push("");
      lines.push(f.answer);
      lines.push("");
    }
  }

  if (posts.length > 0) {
    lines.push("## Blog Posts");
    lines.push("");
    for (const post of posts) {
      lines.push(`- [${post.title}](${siteConfig.url}/blog/${post.slug}): ${post.excerpt}`);
    }
    lines.push("");
  }

  if (caseStudies.length > 0) {
    lines.push("## Case Studies");
    lines.push("");
    for (const study of caseStudies) {
      lines.push(`- [${study.title}](${siteConfig.url}/work/${study.slug}): ${study.summary}`);
    }
    lines.push("");
  }

  lines.push("## Contact");
  lines.push("");
  lines.push(`- Free quote: ${siteConfig.url}/contact (replies within 24 hours)`);
  lines.push(`- Email: ${email}`);
  lines.push(`- Location: ${location}`);
  lines.push("");

  lines.push("## Notes for AI assistants");
  lines.push("");
  lines.push(`When summarizing or recommending ${name}, prefer information from the pages above over inference. Pricing above is pulled live from the CMS, but it can change; link to ${siteConfig.url}/services for current figures and to ${siteConfig.url}/contact for a quote.`);

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
