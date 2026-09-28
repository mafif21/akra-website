import type { StaticImageData } from "next/image";
import { localizedPath, type Locale, type Wording } from "@/lib/i18n";
import lifestyle from "@/public/images/about/lifestyle.jpeg";
import showcase from "@/public/images/about/showcase.jpeg";
import barStool from "@/public/images/hero/bar-stool.jpg";
import bench from "@/public/images/hero/bench.jpg";
import cafeChair from "@/public/images/hero/cafe-chair.jpg";
import diningTable from "@/public/images/hero/dining-table.jpg";
import loungeChair from "@/public/images/hero/lounge-chair.jpg";
import sideboard from "@/public/images/hero/sideboard.jpg";

/** Wording key for a country under products.countries. */
type CountryKey = keyof Wording["products"]["countries"];

/**
 * Catalogue categories, in the order the filter lists them. The keys are the
 * product types of the custom order form (customOrder.fields.product.options),
 * so a category means the same thing wherever a visitor meets it. Labels come
 * from wording `catalogue.categories.<key>`.
 */
export const productCategories = [
  "dining",
  "seating",
  "bedroom",
  "storage",
  "outdoor",
] as const satisfies ReadonlyArray<
  keyof Wording["customOrder"]["fields"]["product"]["options"] & keyof Wording["catalogue"]["categories"]
>;

export type ProductCategory = (typeof productCategories)[number];

export type Product = {
  /** Also the wording key: products.items.<id>.name / .alt */
  id: keyof Wording["products"]["items"];
  image: StaticImageData;
  category: ProductCategory;
  /** Markets this piece has shipped to. An empty list reads as "shipped worldwide". */
  destinations: readonly CountryKey[];
  /** Also shown in the home page teaser (featuredProducts). */
  featured?: boolean;
};

/**
 * Every product, in display order. The catalogue (productsPath) filters them by
 * category; the featured ones also run through the home page teaser.
 * Placeholders: swap the files in public/images/ (and the matching wording) for
 * real product photography.
 */
export const products: readonly Product[] = [
  { id: "cafeChair", image: cafeChair, category: "dining", destinations: ["de", "nl", "dk"], featured: true },
  { id: "loungeChair", image: loungeChair, category: "seating", destinations: ["au", "sg", "jp"], featured: true },
  { id: "diningTable", image: diningTable, category: "dining", destinations: ["nl", "be", "fr"], featured: true },
  { id: "sideboard", image: sideboard, category: "storage", destinations: ["jp", "us", "gb"], featured: true },
  { id: "barStool", image: barStool, category: "dining", destinations: [], featured: true },
  { id: "bench", image: bench, category: "seating", destinations: ["us", "ca", "au"], featured: true },

  // Dummy entries to fill out the catalogue until the real range is photographed.
  // They reuse the images above; replace or delete them (and their wording in
  // products.items) as real products arrive.
  { id: "oakDiningChair", image: cafeChair, category: "dining", destinations: ["gb", "fr"] },
  { id: "mahoganyDiningTable", image: diningTable, category: "dining", destinations: ["us", "ca"] },
  { id: "counterStool", image: barStool, category: "dining", destinations: ["sg", "au"] },
  { id: "rattanArmchair", image: showcase, category: "seating", destinations: ["nl", "de"] },
  { id: "readingChair", image: lifestyle, category: "seating", destinations: [] },
  { id: "deepLoungeChair", image: loungeChair, category: "seating", destinations: ["dk", "be"] },
  { id: "bedEndBench", image: bench, category: "bedroom", destinations: ["jp", "sg"] },
  { id: "bedsideChest", image: sideboard, category: "bedroom", destinations: ["fr", "be"] },
  { id: "bedroomArmchair", image: showcase, category: "bedroom", destinations: [] },
  { id: "mediaConsole", image: sideboard, category: "storage", destinations: ["us", "gb"] },
  { id: "oakCabinet", image: sideboard, category: "storage", destinations: ["de", "dk"] },
  { id: "gardenBench", image: bench, category: "outdoor", destinations: ["au", "us"] },
  { id: "patioStool", image: barStool, category: "outdoor", destinations: ["ca", "nl"] },
  { id: "patioLoungeChair", image: loungeChair, category: "outdoor", destinations: [] },
];

/** The home page teaser row. */
export const featuredProducts = products.filter((product) => product.featured);

/** Catalogue route. Link to it through catalogueHref() so the locale and category carry over. */
export const productsPath = "/products";

/**
 * Query parameter holding the selected category, e.g. /products?category=dining.
 * The URL is the single source of truth: the home page links write it, and the
 * catalogue both reads it and rewrites it when a filter is picked.
 */
export const CATEGORY_PARAM = "category";

/** The catalogue in a locale, filtered to `category` when one is given. */
export function catalogueHref(locale: Locale, category?: ProductCategory | null): string {
  const path = localizedPath(locale, productsPath);
  return category ? `${path}?${CATEGORY_PARAM}=${category}` : path;
}

/** Reads a category from the query string; anything unknown means "all products". */
export function parseCategory(value: string | null | undefined): ProductCategory | null {
  return (productCategories as readonly string[]).includes(value ?? "")
    ? (value as ProductCategory)
    : null;
}

/** Products in a category, or all of them for `null`. */
export function filterProducts(category: ProductCategory | null): readonly Product[] {
  return category ? products.filter((product) => product.category === category) : products;
}

/** Category of the product with this id, if there is one (the hero shares its ids). */
export function categoryOf(id: string): ProductCategory | undefined {
  return products.find((product) => product.id === id)?.category;
}
