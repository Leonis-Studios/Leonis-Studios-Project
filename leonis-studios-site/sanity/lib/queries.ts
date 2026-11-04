// sanity/lib/queries.ts
//
// All GROQ queries live in one place. GROQ is Sanity's query
// language. Basic anatomy:
//
//   *[_type == "service"]
//   ↑ fetch all documents of type "service"
//
//   | order(order asc)
//   ↑ sort them by the order field, ascending
//
//   { _id, name, slug.current }
//   ↑ projection — only return these fields (like SQL SELECT)
//
//   ->
//   ↑ dereference a reference field — follow the pointer and
//     fetch fields from the linked document inline
//
//   $slug
//   ↑ a parameter — passed in when you call the query,
//     keeps queries reusable and prevents injection

// All active services grouped by category
export const ALL_SERVICES_QUERY = `
  *[_type == "service" && active == true] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    category,
    tier,
    tagline,
    description,
    startingPrice,
    priceLabel,
    billingPeriod,
    features,
    notIncluded,
    featured,
    "recommendedRetainer": recommendedRetainer-> {
      _id,
      name,
      "slug": slug.current,
      startingPrice,
      priceLabel,
      billingPeriod
    }
  }
`;

// Website packages only — for home page services section
export const PACKAGE_SERVICES_QUERY = `
  *[_type == "service" && category == "package" && active == true]
  | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    tier,
    tagline,
    description,
    startingPrice,
    priceLabel,
    billingPeriod,
    features,
    notIncluded,
    featured,
    "recommendedRetainer": recommendedRetainer-> {
      _id,
      name,
      startingPrice,
      priceLabel,
      billingPeriod
    }
  }
`;

// Retainers only
export const RETAINER_SERVICES_QUERY = `
  *[_type == "service" && category == "retainer" && active == true]
  | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    tier,
    tagline,
    description,
    startingPrice,
    priceLabel,
    billingPeriod,
    features,
    notIncluded,
    featured
  }
`;

// Add-ons only
export const ADDON_SERVICES_QUERY = `
  *[_type == "service" && category == "addon" && active == true]
  | order(order asc) {
    _id,
    name,
    startingPrice,
    priceLabel,
    billingPeriod,
    description
  }
`;

export const ALL_CASE_STUDIES_QUERY = `
  *[_type == "caseStudy"] | order(year desc) {
    _id,
    title,
    "slug": slug.current,
    client,
    year,
    summary,
    tags,
    featured,
    "coverImage": coverImage {
  alt,
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  hotspot,
  crop
},
    "services": services[]->{ name, "slug": slug.current },
    "seoTitle": coalesce(seo.metaTitle, title),
    "seoDescription": coalesce(seo.metaDescription, summary),
    "noindex": coalesce(seo.noindex, false)
  }
`;

export const FEATURED_CASE_STUDIES_QUERY = `
  *[_type == "caseStudy" && featured == true] | order(year desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    client,
    year,
    summary,
    tags,
    "coverImage": coverImage {
  alt,
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  hotspot,
  crop
},
    "services": services[]->{ name, "slug": slug.current },
    "seoTitle": coalesce(seo.metaTitle, title),
    "seoDescription": coalesce(seo.metaDescription, summary),
    "noindex": coalesce(seo.noindex, false)
  }
`;

// Single case study — used on /work/[slug]
// $slug is passed in as a parameter when calling this query
export const CASE_STUDY_BY_SLUG_QUERY = `
  *[_type == "caseStudy" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    client,
    year,
    summary,
    tags,
    liveUrl,
    featured,
    "coverImage": coverImage {
  alt,
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  hotspot,
  crop
},
    body,
    "faq": faq[]{ _key, question, answer },
    results,
    "services": services[]->{ name, "slug": slug.current },
    "seoTitle": coalesce(seo.metaTitle, title),
    "seoDescription": coalesce(seo.metaDescription, summary),
    "seoImage": seo.ogImage.asset->url,
    "noindex": coalesce(seo.noindex, false)
  }
`;

// Used by generateStaticParams to pre-render all case study pages
export const ALL_CASE_STUDY_SLUGS_QUERY = `
  *[_type == "caseStudy"] { "slug": slug.current }
`;

// Used by sitemap.ts
export const CASE_STUDY_DATES_QUERY = `
  *[_type == "caseStudy"] { "slug": slug.current, _updatedAt, "noindex": coalesce(seo.noindex, false) }
`;

// Fetches the single site settings document
export const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0] {
    siteName,
    tagline,
    metaDescription,
    email,
    location,
    social,
    "ogImage": ogImage.asset->url
  }
`;

// Active FAQ items ordered for home page accordion
export const FAQ_ITEMS_QUERY = `
  *[_type == "faqItem" && active == true]
  | order(order asc) {
    _id,
    question,
    answer,
    category
  }
`;

// All blog posts, newest first — used on /blog
// readTimeMinutes is computed here via pt::text() so the full
// Portable Text body never has to be sent to the listing page —
// ~1000 chars/min (~200wpm) estimate, clamped to 1 in the UI.
export const ALL_POSTS_QUERY = `
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "author": author->{ name, "slug": slug.current, bio, "image": image{ "url": asset->url, alt }, sameAs },
    tags,
    featured,
    "readTimeMinutes": round(length(pt::text(body)) / 1000),
    "coverImage": coverImage {
  alt,
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  hotspot,
  crop
},
    "seoTitle": coalesce(seo.metaTitle, title),
    "seoDescription": coalesce(seo.metaDescription, excerpt),
    "noindex": coalesce(seo.noindex, false)
  }
`;

// Single blog post — used on /blog/[slug]
// readTimeMinutes computed the same way as ALL_POSTS_QUERY (~1000 chars/min).
export const POST_BY_SLUG_QUERY = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    _updatedAt,
    "author": author->{ name, "slug": slug.current, bio, "image": image{ "url": asset->url, alt }, sameAs },
    tags,
    featured,
    "readTimeMinutes": round(length(pt::text(body)) / 1000),
    "coverImage": coverImage {
  alt,
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  hotspot,
  crop
},
    body,
    "faq": faq[]{ _key, question, answer },
    "seoTitle": coalesce(seo.metaTitle, title),
    "seoDescription": coalesce(seo.metaDescription, excerpt),
    "seoImage": seo.ogImage.asset->url,
    "noindex": coalesce(seo.noindex, false)
  }
`;

// Used by generateStaticParams to pre-render all blog post pages
export const ALL_POST_SLUGS_QUERY = `
  *[_type == "post"] { "slug": slug.current }
`;

// Used by sitemap.ts
export const POST_DATES_QUERY = `
  *[_type == "post"] { "slug": slug.current, _updatedAt, "noindex": coalesce(seo.noindex, false) }
`;

// Reused on every singleton page query below — reads the seo
// override object and resolves the image asset URL inline.
const SEO_PROJECTION = `
  seo {
    metaTitle,
    metaDescription,
    "ogImage": ogImage.asset->url,
    canonicalUrl,
    noindex
  }
`;

// Fetches the single blog page settings document (section header + empty state)
export const BLOG_PAGE_QUERY = `
  *[_type == "blogPage"][0] {
    eyebrow,
    headline,
    intro,
    emptyStateMessage,
    ${SEO_PROJECTION}
  }
`;

// Fetches the single home page document
export const HOME_PAGE_QUERY = `
  *[_type == "homePage"][0] {
    hero,
    marquee,
    benefitsSection,
    servicesSection,
    howItWorks,
    featuredWorkSection,
    faqSection,
    ctaSection,
    ${SEO_PROJECTION}
  }
`;

// Fetches the single services page document
export const SERVICES_PAGE_QUERY = `
  *[_type == "servicesPage"][0] {
    hero,
    packagesSection,
    retainersSection,
    addonsSection,
    ctaSection,
    ${SEO_PROJECTION}
  }
`;

// Fetches the single contact page document
export const CONTACT_PAGE_QUERY = `
  *[_type == "contactPage"][0] {
    hero,
    ${SEO_PROJECTION}
  }
`;

// Fetches the single about page document
export const ABOUT_PAGE_QUERY = `
  *[_type == "aboutPage"][0] {
    heroHeadline,
    heroSubheading,
    storyEyebrow,
    storyHeadline,
    storyBody,
    "profilePhoto": profilePhoto {
      "url": asset->url,
      alt
    },
    valuesEyebrow,
    values,
    approachHeadline,
    approachBody,
    skillsEyebrow,
    techStack,
    servicesList,
    promisesEyebrow,
    promisesHeadline,
    promisesSubheading,
    promises,
    ctaHeadline,
    ctaSubtext,
    ${SEO_PROJECTION}
  }
`;
// Used by sitemap.ts — real last-edit dates for the static routes,
// so <lastmod> only changes when the page's content actually does.
export const PAGE_DATES_QUERY = `
  {
    "home":     *[_type == "homePage"][0]._updatedAt,
    "services": *[_type in ["servicesPage", "service"]] | order(_updatedAt desc)[0]._updatedAt,
    "about":    *[_type == "aboutPage"][0]._updatedAt,
    "contact":  *[_type == "contactPage"][0]._updatedAt,
    "blog":     *[_type in ["blogPage", "post"]] | order(_updatedAt desc)[0]._updatedAt,
    "work":     *[_type == "caseStudy"] | order(_updatedAt desc)[0]._updatedAt,
    "apps":     *[_type == "product" && kind == "app"] | order(_updatedAt desc)[0]._updatedAt,
    "games":    *[_type == "product" && kind == "game"] | order(_updatedAt desc)[0]._updatedAt
  }
`;

// ── Products (apps & games) ─────────────────────────────────
// Media items (images and videos) share one projection so feature
// sections, galleries, and the hero clip all resolve the same shape.
const PRODUCT_MEDIA_PROJECTION = `
  _key,
  _type,
  alt,
  caption,
  _type == "productImage" => {
    "url": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "lqip": asset->metadata.lqip
  },
  _type == "productVideo" => {
    "url": file.asset->url,
    youtubeUrl,
    orientation,
    "loop": coalesce(loop, true),
    "poster": poster.asset->url
  }
`;

// One `product` type split by `kind`. $kind is "app" or "game".
// Card projection is shared by the index pages, home strip, footer,
// and llms.txt so they never disagree about what a product is.

const PRODUCT_CARD_PROJECTION = `
    _id,
    name,
    "slug": slug.current,
    kind,
    tagline,
    summary,
    status,
    platforms,
    priceLabel,
    "icon": icon { alt, "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }
`;

export const PRODUCTS_BY_KIND_QUERY = `
  *[_type == "product" && kind == $kind] | order(order asc, name asc) {
    ${PRODUCT_CARD_PROJECTION}
  }
`;

export const ALL_PRODUCTS_QUERY = `
  *[_type == "product"] | order(order asc, name asc) {
    ${PRODUCT_CARD_PROJECTION}
  }
`;

export const FEATURED_PRODUCTS_QUERY = `
  *[_type == "product" && featured == true && status != "retired"] | order(order asc, name asc) {
    ${PRODUCT_CARD_PROJECTION}
  }
`;

export const PRODUCT_BY_SLUG_QUERY = `
  *[_type == "product" && kind == $kind && slug.current == $slug][0] {
    ${PRODUCT_CARD_PROJECTION},
    primaryKeyword,
    category,
    appStoreUrl,
    playStoreUrl,
    webAppUrl,
    isFree,
    "hasWaitlist": defined(waitlistSegmentId) && waitlistSegmentId != "",
    waitlistPitch,
    launchDate,
    "heroImage": heroImage { alt, "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height },
    "heroVideo": select(
      defined(heroVideo.file.asset) || defined(heroVideo.youtubeUrl) => heroVideo { "_key": "hero", "_type": "productVideo", alt, caption, "url": file.asset->url, youtubeUrl, orientation, "loop": coalesce(loop, true), "poster": poster.asset->url },
      null
    ),
    "pillars": pillars[]{ _key, title, description },
    "sections": sections[]{
      _key,
      _type,
      eyebrow,
      heading,
      "tone": coalesce(tone, "auto"),
      _type == "productFeature" => {
        body,
        bullets,
        "mediaSide": coalesce(mediaSide, "right"),
        "media": media[0]{ ${PRODUCT_MEDIA_PROJECTION} }
      },
      _type == "productGallery" => {
        intro,
        "layout": coalesce(layout, "grid"),
        "items": items[]{ ${PRODUCT_MEDIA_PROJECTION} }
      }
    },
    "screenshots": screenshots[]{ _key, alt, caption, "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height },
    body,
    "faq": faq[]{ _key, question, answer },
    supportEmail,
    "privacyAnchor": coalesce(privacyAnchor, slug.current),
    "seoTitle": coalesce(seo.metaTitle, name + " — " + tagline),
    "seoDescription": coalesce(seo.metaDescription, summary),
    "seoImage": coalesce(seo.ogImage.asset->url, heroImage.asset->url),
    "noindex": coalesce(seo.noindex, false)
  }
`;

export const PRODUCT_SLUGS_BY_KIND_QUERY = `
  *[_type == "product" && kind == $kind && defined(slug.current)] { "slug": slug.current }
`;

export const PRODUCT_DATES_QUERY = `
  *[_type == "product" && defined(slug.current)] { "slug": slug.current, kind, _updatedAt, "noindex": coalesce(seo.noindex, false) }
`;

// Server-only: the waitlist API resolves the segment from the slug so
// clients can never choose which list they're added to.
export const PRODUCT_WAITLIST_QUERY = `
  *[_type == "product" && slug.current == $slug][0] { name, status, waitlistSegmentId }
`;
