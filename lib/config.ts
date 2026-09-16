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

/** Primary navigation. Labels come from wording `navbar.links.<key>`. */
export const navItems = [
  { key: "home", href: "/" },
  { key: "about", href: "#about" },
  { key: "products", href: "#products" },
  { key: "custom", href: "#custom" },
  { key: "contact", href: "#contact" },
] as const satisfies ReadonlyArray<{
  key: keyof Wording["navbar"]["links"];
  href: string;
}>;
