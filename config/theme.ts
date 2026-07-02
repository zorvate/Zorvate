export const themeConfig = {
  defaultTheme: "system",
  enableSystem: true,
  disableTransitionOnChange: true,

  themes: [
    "light",
    "dark",
    "system",
  ] as const,
} as const;

export type Theme = (typeof themeConfig.themes)[number];