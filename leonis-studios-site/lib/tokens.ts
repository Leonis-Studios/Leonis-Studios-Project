export const tokens = {
  weightLight: 450,
  weightRegular: 400,
  weightMedium: 500,
  weightSemibold: 600,
  weightBold: 700,

  weightBody: 700,
  weightSecondary: 700,
  weightHeading: 700,
  weightDisplay: 800,
  weightUI: 800,
  weightMono: 400,

  fontSizes: {
    body:      "clamp(16px, 1.6vw, 21px)",   // body/paragraph text
    bodyLarge: "clamp(17px, 1.75vw, 23px)",  // hero sub-copy, section intro paragraphs
    h3:        "clamp(21px, 2.5vw, 29px)",   // card/step subheadings
    h3Compact: "clamp(18px, 1.7vw, 24px)",   // subheadings in tight grid layouts
  },
} as const;
