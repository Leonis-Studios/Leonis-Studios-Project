// components/JsonLd.tsx
//
// Renders a JSON-LD <script> block. Single shared component so
// structured data isn't hand-duplicated per page — callers type
// their object literal with schema-dts (e.g. WithContext<Article>)
// for compile-time validation against the schema.org shape.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
