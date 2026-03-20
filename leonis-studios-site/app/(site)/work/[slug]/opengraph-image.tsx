import { ImageResponse } from "next/og";
import { client }        from "@/sanity/lib/client";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const project = await client
    .fetch(
      `*[_type == "caseStudy" && slug.current == $slug][0] {
        title,
        client,
        year,
        summary
      }`,
      { slug: params.slug }
    )
    .catch(() => null);

  const headline = project?.title ?? "Leonis Studios — Case Study";
  const meta     = project ? `${project.client} · ${project.year}` : "";

  return new ImageResponse(
    (
      <div
        style={{
          width:          "100%",
          height:         "100%",
          background:     "#0a0a0a",
          display:        "flex",
          flexDirection:  "column",
          justifyContent: "center",
          padding:        "0 80px",
          position:       "relative",
        }}
      >
        {/* Crimson left bar */}
        <div
          style={{
            position:   "absolute",
            left:       0,
            top:        0,
            width:      "6px",
            height:     "100%",
            background: "#c41e3a",
            display:    "flex",
          }}
        />

        {/* Studio name top left */}
        <div
          style={{
            position:      "absolute",
            top:           "48px",
            left:          "80px",
            fontFamily:    "system-ui, -apple-system, sans-serif",
            fontSize:      "14px",
            fontWeight:    800,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color:         "#888888",
            display:       "flex",
          }}
        >
          LEONIS STUDIOS
        </div>

        {/* Domain bottom right */}
        <div
          style={{
            position:   "absolute",
            bottom:     "48px",
            right:      "80px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize:   "14px",
            color:      "#444444",
            display:    "flex",
          }}
        >
          leonisstudios.com
        </div>

        {/* Bottom crimson strip */}
        <div
          style={{
            position:   "absolute",
            bottom:     "0px",
            left:       0,
            width:      "100%",
            height:     "4px",
            background: "#c41e3a",
            display:    "flex",
          }}
        />

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* "Case Study" label */}
          <div
            style={{
              fontFamily:    "system-ui, -apple-system, sans-serif",
              fontSize:      "13px",
              fontWeight:    800,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color:         "#c41e3a",
              marginBottom:  "20px",
              display:       "flex",
            }}
          >
            Case Study
          </div>

          {/* Project title */}
          <div
            style={{
              fontFamily:    "system-ui, -apple-system, sans-serif",
              fontSize:      "72px",
              fontWeight:    800,
              color:         "#f2f2f0",
              lineHeight:    0.92,
              letterSpacing: "-0.03em",
              display:       "flex",
            }}
          >
            {headline}
          </div>

          {/* Client · Year */}
          {meta && (
            <div
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize:   "24px",
                fontWeight: 400,
                color:      "#888888",
                marginTop:  "24px",
                display:    "flex",
              }}
            >
              {meta}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
