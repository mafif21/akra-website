import type { Wording } from "@/lib/i18n/wording";

// Non-translatable site settings. Displayed text belongs in wording/*.json.

export const siteConfig = {
  /** Production origin, used as metadataBase for absolute OG/canonical URLs. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Placeholder: add a 1200×630 image at public/og-image.jpg. */
  ogImage: {
    url: "/og-image.jpg",
    width: 1200,
    height: 630,
  },
  /**
   * WhatsApp number for inquiries, international format (country code, digits only).
   * Placeholder: replace it, or set NEXT_PUBLIC_WHATSAPP_NUMBER.
   */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6280000000000",
} as const;

/** Target of the "skip to content" link. */
export const MAIN_CONTENT_ID = "main-content";

/**
 * Primary navigation. Labels come from wording `navbar.links.<key>`.
 * `href` stays a real link so the item still navigates from another route;
 * `sectionId` is the section it scrolls to when that section is on the page
 * (components/sections/Navbar.tsx → lib/scroll.ts).
 */
export const navItems = [
  { key: "home", href: "/", sectionId: "home" },
  { key: "about", href: "#about", sectionId: "about" },
  { key: "products", href: "#products", sectionId: "products" },
  { key: "custom", href: "#custom", sectionId: "custom" },
] as const satisfies ReadonlyArray<{
  key: keyof Wording["navbar"]["links"];
  href: string;
  sectionId: string;
}>;

/**
 * Social profiles, in the order they appear. Labels come from wording
 * `social.links.<key>`. Placeholders: replace the URLs with the real profiles.
 */
export const socialLinks = [
  { key: "instagram", href: "https://instagram.com/" },
  { key: "facebook", href: "https://facebook.com/" },
  { key: "x", href: "https://x.com/" },
  { key: "youtube", href: "https://youtube.com/" },
  { key: "tiktok", href: "https://tiktok.com/" },
] as const satisfies ReadonlyArray<{
  key: keyof Wording["social"]["links"];
  href: string;
}>;

/**
 * Footer legal pages. Labels come from wording `footer.legal.<key>`.
 * Placeholders: the routes still have to be built.
 */
export const legalLinks = [
  { key: "terms", href: "/terms" },
  { key: "privacy", href: "/privacy" },
] as const satisfies ReadonlyArray<{
  key: keyof Wording["footer"]["legal"];
  href: string;
}>;
