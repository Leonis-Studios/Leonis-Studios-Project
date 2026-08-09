export const colors = {
  bgDark: "#14213d",
  bgBlack: "#000000",
  bgLight: "#ffffff",
  bgMuted: "#e5e5e5",
  bgCard: "#fafafa",
  surfaceDark: "#0c1425",
  surfaceAccent: "#29447e",
  borderDark: "#29447e",
  borderLight: "#e5e5e5",
  accent: "#fca311",
  textPrimary: "#ffffff",
  textSecondary: "#BCCEF0",
  textMuted: "#375ba7",
  textBody: "#14213d",
  textSubtle: "#29447e",
  textMutedLight: "#1a1a1a",
  textNav: "#999999",
  textNavAccent: "#fca311",
  emailFooterBg: "#f5f5f5",
  errorBg: "#fff0f0",
  textSecondaryLight: "#BFCEEE",

  // ── Caravan Trail (blog listing) — warm sand/antique palette ──
  antiqueGold: "#B46E00",
  bgSand: "#F6EFE2",
  bgPaper: "#F0E4CB",
  borderWarm: "rgba(20,33,61,0.12)",

  // ── Dune (blog post detail page only) — do not use on /blog index ──
  duneBg: "#f4ecdd",
  duneSurface: "#fffaf0",
  duneHeadline: "#14213d",
  duneBody: "#2c2c2a",
  duneMuted: "#8a7f68",
  duneDivider: "#c7b382",
  duneKickerBg: "#14213d",
  duneKickerText: "#fca311",
  duneChipBg: "#e6dcc2",
  duneChipText: "#4a4227",
} as const;

export type ColorKey = keyof typeof colors;
