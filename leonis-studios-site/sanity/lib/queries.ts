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

export const ALL_SERVICES_QUERY = `
  *[_type == "service"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    tagline,
    description,
    features,
    price,
    featured
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
    "services": services[]->{ name, "slug": slug.current }
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
    "services": services[]->{ name, "slug": slug.current }
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
    results,
    "services": services[]->{ name, "slug": slug.current }
  }
`;

// Used by generateStaticParams to pre-render all case study pages
export const ALL_CASE_STUDY_SLUGS_QUERY = `
  *[_type == "caseStudy"] { "slug": slug.current }
`;