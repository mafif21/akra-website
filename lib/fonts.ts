import { Instrument_Serif, Jost, Ubuntu } from "next/font/google";

// Google fonts loaded and self-hosted at build time by next/font (see DESIGN.md
// → Typography). The CSS variables are mapped to --font-heading / --font-body in
// app/globals.css.

/** Jost: geometric, modern sans for headings, hero, brand and nav. Variable 300–700. */
export const fontHeading = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

/** Ubuntu: warm, readable sans for body copy, buttons, labels, forms and captions. */
export const fontBody = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

/**
 * Instrument Serif italic: the accent face for a single word inside a Jost
 * heading (components/ui/AccentText). Italic only, one weight, and not
 * preloaded, since it is never above the fold.
 */
export const fontAccent = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument-serif",
  display: "swap",
  preload: false,
  fallback: ["Georgia", "serif"],
});
