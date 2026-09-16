import type { Metadata } from "next";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { cn } from "@/lib/cn";
import { fontBody, fontHeading } from "@/lib/fonts";
import { createTranslator, locales, ogLocales } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { MAIN_CONTENT_ID, siteConfig } from "@/lib/config";
import "../globals.css";

// Only /(en) and /id exist; any other [lang] value is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = createTranslator(locale);
  const title = t("meta.title");
  const description = t("meta.description");
  const image = { ...siteConfig.ogImage, alt: t("meta.ogImageAlt") };

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: title, template: t("meta.titleTemplate") },
    description,
    applicationName: t("meta.siteName"),
    openGraph: {
      type: "website",
      siteName: t("meta.siteName"),
      title,
      description,
      locale: ogLocales[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  const t = createTranslator(locale);

  return (
    <html lang={locale} className={cn(fontHeading.variable, fontBody.variable)}>
      <body>
        <a
          href={`#${MAIN_CONTENT_ID}`}
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-text focus:px-4 focus:py-2 focus:text-bg"
        >
          {t("a11y.skipToContent")}
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
