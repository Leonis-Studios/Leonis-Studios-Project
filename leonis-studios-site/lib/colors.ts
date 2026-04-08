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
  textSecondary: "#beccea",
  textMuted: "#7e99d5",
  textBody: "#14213d",
  textSubtle: "#29447e",
  textMutedLight: "#666666",
  textNav: "#999999",
  textNavAccent: "#fca311",
  emailFooterBg: "#f5f5f5",
  errorBg: "#fff0f0",
} as const;

export type ColorKey = keyof typeof colors;
