import Link from "next/link";
import { legalLinks } from "@/lib/config";
import { localizedPath } from "@/lib/i18n";
import { getLocale, getLocaleWording } from "@/lib/i18n/server";

/**
 * Page foot: brand mark, copyright and the legal links on one baseline. It
 * stacks brand first on a phone, so the mark still opens the block. It is a dark
 * band (theme-dark), so the colour change separates it from the page above.
 */
export async function Footer() {
  const locale = await getLocale();
  const { footer } = await getLocaleWording();

  return (
    <footer className="theme-dark px-gutter py-stack">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-baseline md:justify-between md:gap-12">
        <p className="font-heading text-3xl font-semibold tracking-widest md:text-4xl">
          {footer.brand}
        </p>

        <p className="text-sm text-muted">{footer.copyright}</p>

        <ul aria-label={footer.legalLabel} className="flex items-center text-sm">
          {legalLinks.map(({ key, href }) => (
            // A hairline stands in for the divider between the two links.
            <li
              key={key}
              className="ml-4 border-l border-line pl-4 first:ml-0 first:border-l-0 first:pl-0"
            >
              <Link
                href={localizedPath(locale, href)}
                className="hit-area link-underline text-muted transition-colors hover:text-text"
              >
                {footer.legal[key]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
