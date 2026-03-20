import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily:    "system-ui, -apple-system, sans-serif",
              fontSize:      "88px",
              fontWeight:    800,
              color:         "#f2f2f0",
              lineHeight:    0.92,
              letterSpacing: "-0.03em",
              display:       "flex",
            }}
          >
            Our Work
          </div>
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
            Case studies &amp; client projects
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
