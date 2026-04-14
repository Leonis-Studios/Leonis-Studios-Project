export const tokens = {
  weightLight: 450,
  weightRegular: 400,
  weightMedium: 500,
  weightSemibold: 600,
  weightBold: 700,

  weightBody: 600,
  weightSecondary: 600,
  weightHeading: 600,
  weightDisplay: 700,
  weightUI: 700,
  weightMono: 400,

  fontSizes: {
    body:      "clamp(15px, 1.5vw, 20px)",   // body/paragraph text
    bodyLarge: "clamp(16px, 1.6vw, 21px)",   // hero sub-copy, section intro paragraphs
    h3:        "clamp(19px, 2.2vw, 26px)",   // card/step subheadings
    h3Compact: "clamp(16px, 1.5vw, 22px)",   // subheadings in tight grid layouts
  },
} as const;
