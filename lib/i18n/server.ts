import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { isLocale, type Locale } from "./config";
import { createTranslator, getWording, type Translator, type Wording } from "./wording";

// Server Component helpers: the locale comes from the [lang] root segment,
// so components don't need it passed down as a prop.

export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!isLocale(value)) notFound();
  return value;
}

/** In a Server Component: `const t = await getTranslator(); t("hero.title")`. */
export async function getTranslator(): Promise<Translator> {
  return createTranslator(await getLocale());
}

export async function getLocaleWording(): Promise<Wording> {
  return getWording(await getLocale());
}
