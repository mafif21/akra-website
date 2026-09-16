import en from "@/wording/en.json";
import id from "@/wording/id.json";
import type { Locale } from "./config";

export type Wording = typeof en;

// Typing both as `Wording` makes the build fail if id.json is missing a key from en.json.
const dictionaries: Record<Locale, Wording> = { en, id };

/** Dot-separated paths to every string leaf, e.g. "meta.title". */
type StringPaths<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : T[K] extends readonly unknown[]
      ? never
      : T[K] extends object
        ? StringPaths<T[K], `${Prefix}${K}.`>
        : never;
}[keyof T & string];

export type WordingKey = StringPaths<Wording>;
export type WordingValues = Record<string, string | number>;
export type Translator = (key: WordingKey, values?: WordingValues) => string;

/** The full dictionary. Use it for structured content such as lists of items. */
export function getWording(locale: Locale): Wording {
  return dictionaries[locale];
}

/**
 * Returns `t(key, values?)` for a locale. `{name}` placeholders in the string
 * are replaced from `values`: t("footer.copyright", { year: 2026 }).
 */
export function createTranslator(locale: Locale): Translator {
  const dictionary = dictionaries[locale];

  return (key, values) => {
    const text = key
      .split(".")
      .reduce<unknown>(
        (node, part) => (node as Record<string, unknown> | undefined)?.[part],
        dictionary,
      );

    if (typeof text !== "string") {
      throw new Error(`Missing wording "${key}" for locale "${locale}"`);
    }
    return values ? interpolate(text, values) : text;
  };
}

/**
 * Replaces `{name}` placeholders in a wording string. Also usable in Client
 * Components that receive wording as props.
 */
export function interpolate(template: string, values: WordingValues): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in values ? String(values[name]) : match,
  );
}
