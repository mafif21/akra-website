import localFont from "next/font/local";

// Self-hosted variable fonts from public/fonts (see DESIGN.md → Typography).
// The CSS variables are mapped to --font-heading / --font-body in app/globals.css.

/** Fraunces: soft, old-style serif for headings. Latin subset, weights 100–900. */
export const fontHeading = localFont({
  src: "../public/fonts/Fraunces-Variable.woff2",
  variable: "--font-fraunces",
  weight: "100 900",
  style: "normal",
  display: "swap",
  fallback: ["Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

/** Satoshi: warm, low-contrast sans for body copy and UI. Weights 300–900. */
export const fontBody = localFont({
  src: "../public/fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
  style: "normal",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});
