import type { Metadata } from "next";
import { About } from "@/components/sections/About";
import { Hero } from "@/components/sections/Hero";
import { Navbar } from "@/components/sections/Navbar";
import { MAIN_CONTENT_ID } from "@/lib/config";
import { getAlternates, getWording } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { alternates: getAlternates(await getLocale(), "/") };
}

export default async function HomePage() {
  const locale = await getLocale();
  const { navbar, customOrder, hero } = getWording(locale);

  return (
    <>
      <Navbar locale={locale} wording={{ navbar, customOrder }} />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="outline-none">
        <Hero wording={hero} />
        <About />
      </main>
    </>
  );
}
