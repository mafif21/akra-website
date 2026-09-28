"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { locales, localizedPath, stripLocale, type Locale, type Wording } from "@/lib/i18n";

type LanguageWording = Wording["navbar"]["language"];

type LocaleSwitchProps = {
  /** The locale on screen right now. */
  locale: Locale;
  /** Names the row and labels each locale, from wording `navbar.language`. */
  wording: LanguageWording;
  className?: string;
};

/**
 * Switches the page between locales. English is served from "/" and Indonesian
 * from "/id" (proxy.ts), so each entry is an ordinary link to the same page in
 * the other language: crawlable, right-clickable, and still working with
 * JavaScript off. The locale already showing is text rather than a link, so the
 * only tab stop is the language you can actually move to.
 */
export function LocaleSwitch({ locale, wording, className }: LocaleSwitchProps) {
  const path = stripLocale(usePathname());

  return (
    <ul
      aria-label={wording.label}
      className={cn("label-caps flex items-center font-medium", className)}
    >
      {locales.map((item) => (
        // A hairline stands in for the divider between the two codes.
        <li
          key={item}
          className="ml-2.5 border-l border-line pl-2.5 first:ml-0 first:border-l-0 first:pl-0"
        >
          {item === locale ? (
            // Underlined as well as darker, so the current language doesn't rest on colour alone.
            <span aria-current="true" className="text-text underline decoration-1 underline-offset-4">
              {wording.codes[item]}
            </span>
          ) : (
            // hrefLang and lang tell crawlers and screen readers what sits behind the code.
            <Link
              href={localizedPath(item, path)}
              hrefLang={item}
              lang={item}
              className="hit-area link-underline text-accent transition-colors hover:text-text"
            >
              {wording.codes[item]}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
