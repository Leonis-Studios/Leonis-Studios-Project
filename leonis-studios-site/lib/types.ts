// lib/types.ts
//
// TypeScript interfaces that describe the shape of data
// coming back from Sanity queries.
//
// Think of these as contracts — when you fetch a case study
// from Sanity and say it's type CaseStudy, TypeScript will
// warn you if you try to access a field that doesn't exist,
// and give you autocomplete for fields that do.
//
// Important: these reflect what your GROQ queries return,
// not the full Sanity schema. If your query only asks for
// name and slug, your interface should only have name and slug.
// We'll keep them in sync as we write queries later.

// ── Sanity Image ─────────────────────────────────────────
// Sanity stores images as references to asset documents.
// After our GROQ query resolves the reference, this is
// the shape we get back.
export interface SanityImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  hotspot?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// ── SEO ───────────────────────────────────────────────────
// Resolved shape of the reusable `seo` object (see
// sanity/schemaTypes/objects/seo.ts). Used on singleton page
// queries, which project the raw object. Post/CaseStudy queries
// project flattened, already-coalesced aliases instead (seoTitle,
// seoDescription, seoImage, noindex) — see below.
export interface Seo {
  metaTitle?:       string;
  metaDescription?: string;
  ogImage?:         string;
  canonicalUrl?:    string;
  noindex?:         boolean;
}

// ── Service ───────────────────────────────────────────────
export interface RetainerSummary {
  _id:            string;
  name:           string;
  slug?:          string;
  startingPrice?: number;
  priceLabel?:    string;
  billingPeriod?: string;
}

export interface Service {
  _id:                  string;
  name:                 string;
  slug:                 string;
  category:             "package" | "retainer" | "seo" | "addon";
  tier?:                "starter" | "growth" | "studio" | "essential" | "authority" | "na";
  tagline?:             string;
  description:          string;
  startingPrice?:       number;
  priceLabel?:          string;
  billingPeriod?:       string;
  features?:            string[];
  notIncluded?:         string[];
  featured?:            boolean;
  recommendedRetainer?: RetainerSummary;
}

// ── Case Study (card) ─────────────────────────────────────
// Used on the /work grid page — only the fields we need
// to render a card. No body content yet.
export interface CaseStudyCard {
  _id:             string;
  title:           string;
  slug:            string;
  client:          string;
  year:            number;
  summary:         string;
  tags?:           string[];
  featured?:       boolean;
  coverImage?:     SanityImage;
  services?:       Pick<Service, "name" | "slug">[];
  seoTitle?:       string;
  seoDescription?: string;
  noindex?:        boolean;
}

// ── Case Study (full) ─────────────────────────────────────
// Used on the /work/[slug] detail page — extends the card
// with body content and results metrics.
export interface CaseStudy extends CaseStudyCard {
  liveUrl?: string;
  // Portable Text is an array of block objects. The exact
  // internal shape is handled by @portabletext/react so
  // we type it as any[] here — it's the one place we allow it.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?:    any[];
  faq?:     FaqBlockItem[];
  results?: {
    label: string;
    value: string;
  }[];
  seoImage?: string;
}

// ── Author ────────────────────────────────────────────────
export interface Author {
  name:    string;
  slug?:   string;
  bio?:    string;
  image?: {
    url: string;
    alt?: string;
  };
  sameAs?: string[];
}

// ── Blog Post (card) ───────────────────────────────────────
// Used on the /blog index page — only the fields we need
// to render a card. No body content yet.
export interface PostCard {
  _id:              string;
  title:            string;
  slug:             string;
  excerpt:          string;
  publishedAt:      string;
  author?:          Author;
  tags?:            string[];
  featured?:        boolean;
  readTimeMinutes:  number;
  coverImage?:      SanityImage;
  seoTitle?:        string;
  seoDescription?:  string;
  noindex?:         boolean;
}

// ── Blog Post (full) ──────────────────────────────────────
// Used on the /blog/[slug] detail page — extends the card
// with body content.
export interface Post extends PostCard {
  _updatedAt?: string;
  // Portable Text is an array of block objects. The exact
  // internal shape is handled by @portabletext/react so
  // we type it as any[] here — it's the one place we allow it.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?:     any[];
  faq?:      FaqBlockItem[];
  seoImage?: string;
}

// ── Blog Page Settings ────────────────────────────────────
// Singleton document driving CaravanTrail's section header
// and empty state — all optional, component falls back to
// its own defaults when this doc doesn't exist yet.
export interface BlogPageSettings {
  eyebrow?:           string;
  headline?:          string;
  intro?:             string;
  emptyStateMessage?: string;
  seo?:               Seo;
}

// ── Site Settings ─────────────────────────────────────────
export interface SiteSettings {
  siteName?:        string;
  tagline?:         string;
  metaDescription?: string;
  email?:           string;
  location?:        string;
  social?: {
    twitter?:   string;
    github?:    string;
    linkedin?:  string;
    instagram?: string;
  };
  ogImage?: string;
}

// ── FAQ Item ──────────────────────────────────────────────
// Global home-page FAQ, sourced from standalone faqItem documents.
export interface FaqItem {
  _id:       string;
  question:  string;
  answer:    string;
  category?: string;
}

// ── FAQ Block (content-local) ──────────────────────────────
// Inline array field on post/caseStudy — distinct from FaqItem
// above (no _id, only _key, since it's not its own document).
export interface FaqBlockItem {
  _key:     string;
  question: string;
  answer:   string;
}

// ── Home Page ─────────────────────────────────────────────
// Singleton document driving the home page sections — all
// optional, every section falls back to its own hardcoded
// default when this doc (or a given field) hasn't been set yet.
export interface HomePageData {
  hero?: {
    eyebrow?:            string;
    headlineLine1?:      string;
    headlineLine2?:      string;
    headlineAccent?:     string;
    subcopy?:            string;
    primaryCtaLabel?:    string;
    secondaryCtaLabel?:  string;
    stats?: {
      value: string;
      label: string;
    }[];
  };
  marquee?: {
    items?: string[];
  };
  benefitsSection?: {
    eyebrow?:  string;
    headline?: string;
    subtext?:  string;
    items?: {
      title:       string;
      description: string;
    }[];
  };
  servicesSection?: {
    eyebrow?:  string;
    headline?: string;
    subtext?:  string;
  };
  howItWorks?: {
    eyebrow?:  string;
    headline?: string;
    subtext?:  string;
    steps?: {
      title:       string;
      description: string;
    }[];
    bottomCtaLabel?: string;
  };
  featuredWorkSection?: {
    eyebrow?:  string;
    headline?: string;
  };
  faqSection?: {
    eyebrow?:  string;
    headline?: string;
    intro?:    string;
  };
  ctaSection?: {
    eyebrow?:           string;
    headline?:          string;
    subtext?:           string;
    primaryCtaLabel?:   string;
    secondaryCtaLabel?: string;
  };
  seo?: Seo;
}

// ── Services Page ─────────────────────────────────────────
export interface ServicesPageData {
  hero?: {
    eyebrow?:        string;
    headlineLine1?:  string;
    headlineAccent?: string;
    subheading?:     string;
    categories?:     string[];
  };
  packagesSection?: {
    eyebrow?:  string;
    headline?: string;
    subtext?:  string;
  };
  retainersSection?: {
    eyebrow?:  string;
    headline?: string;
    subtext?:  string;
  };
  addonsSection?: {
    eyebrow?:  string;
    headline?: string;
    subtext?:  string;
  };
  ctaSection?: {
    eyebrow?:           string;
    headline?:          string;
    subtext?:           string;
    primaryCtaLabel?:   string;
    secondaryCtaLabel?: string;
  };
  seo?: Seo;
}

// ── Contact Page ──────────────────────────────────────────
export interface ContactPageData {
  hero?: {
    eyebrow?:        string;
    headlineLine1?:  string;
    headlineAccent?: string;
    subheading?:     string;
  };
  seo?: Seo;
}

// ── About Page ────────────────────────────────────────────
export interface AboutPageData {
  heroHeadline?:   string;
  heroSubheading?: string;
  storyEyebrow?:   string;
  storyHeadline?:  string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  storyBody?:      any[];
  profilePhoto?: {
    url: string;
    alt: string;
  };
  valuesEyebrow?: string;
  values?: {
    title:       string;
    description: string;
  }[];
  approachHeadline?: string;
  approachBody?:     string;
  skillsEyebrow?:    string;
  techStack?: {
    label:       string;
    description: string;
  }[];
  servicesList?: {
    label:       string;
    description: string;
  }[];
  promisesEyebrow?:    string;
  promisesHeadline?:   string;
  promisesSubheading?: string;
  promises?: {
    title: string;
    body:  string;
  }[];
  ctaHeadline?:      string;
  ctaSubtext?:       string;
  seo?:              Seo;
}