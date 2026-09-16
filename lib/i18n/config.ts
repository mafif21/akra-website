// Locale config with no dictionary imports, so it stays safe to use in proxy.ts.

export const locales = ["en", "id"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Open Graph locale codes (language_TERRITORY). */
export const ogLocales: Record<Locale, string> = {
  en: "en_US",
  id: "id_ID",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Builds a path for a locale. The default locale is served without a prefix
 * ("/", "/about"); others are prefixed ("/id", "/id/about").
 */
export function localizedPath(locale: Locale, path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return normalized;
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

/** `alternates` metadata (canonical + hreflang) for a page available in every locale. */
export function getAlternates(locale: Locale, path = "/") {
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [l, localizedPath(l, path)]),
  );
  languages["x-default"] = localizedPath(defaultLocale, path);

  return { canonical: localizedPath(locale, path), languages };
}
