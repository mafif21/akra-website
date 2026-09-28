import type { Metadata } from "next";
import { About } from "@/components/sections/About";
import { CustomProcess } from "@/components/sections/CustomProcess";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Navbar } from "@/components/sections/Navbar";
import { Products } from "@/components/sections/Products";
import { Slogan } from "@/components/sections/Slogan";
import { MAIN_CONTENT_ID } from "@/lib/config";
import { getAlternates, getWording } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { alternates: getAlternates(await getLocale(), "/") };
}

export default async function HomePage() {
  const locale = await getLocale();
  const { navbar, customOrder, hero, products, customProcess } = getWording(locale);

  return (
    <>
      <Navbar locale={locale} wording={{ navbar, customOrder }} />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="outline-none">
        <Hero locale={locale} wording={hero} />
        <About />
        <Products locale={locale} wording={products} />
        <CustomProcess wording={customProcess} />
        <Slogan />
      </main>
      <Footer />
    </>
  );
}
