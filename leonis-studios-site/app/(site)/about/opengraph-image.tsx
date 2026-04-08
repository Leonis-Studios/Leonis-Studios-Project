import { ImageResponse } from "next/og";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";

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
          background:     colors.bgDark,
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
            background: colors.accent,
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
            fontWeight:    tokens.weightDisplay,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color:         colors.textSecondary,
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
            color:      colors.textMuted,
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
              fontSize:      "80px",
              fontWeight:    tokens.weightDisplay,
              color:         colors.bgLight,
              lineHeight:    0.92,
              letterSpacing: "-0.03em",
              display:       "flex",
            }}
          >
            About Leonis Studios
          </div>
          <div
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize:   "24px",
              fontWeight: tokens.weightBody,
              color:      colors.textSecondary,
              marginTop:  "24px",
              display:    "flex",
            }}
          >
            Built on craft. Driven by results.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
