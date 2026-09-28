import type { Metadata, ResolvingMetadata } from "next";
import { Catalogue } from "@/components/sections/Catalogue";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { MAIN_CONTENT_ID } from "@/lib/config";
import { getAlternates, getWording } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { productsPath } from "@/lib/products";

export async function generateMetadata(
  _props: PageProps<"/[lang]/products">,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const locale = await getLocale();
  const { meta } = getWording(locale).catalogue;
  const alternates = getAlternates(locale, productsPath);
  // Keeps the layout's Open Graph image, site name and locales; only the page's own lines change.
  const { openGraph, twitter } = await parent;

  return {
    title: meta.title,
    description: meta.description,
    alternates,
    openGraph: {
      ...openGraph,
      title: meta.title,
      description: meta.description,
      url: alternates.canonical,
    },
    twitter: {
      ...twitter,
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function ProductsPage() {
  const locale = await getLocale();
  const { navbar, customOrder, catalogue, products } = getWording(locale);

  return (
    <>
      <Navbar locale={locale} wording={{ navbar, customOrder }} />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="outline-none">
        <Catalogue locale={locale} wording={catalogue} items={products.items} />
      </main>
      <Footer />
    </>
  );
}
