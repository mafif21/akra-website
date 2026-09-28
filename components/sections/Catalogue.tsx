"use client";

import { m } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense, useId, useLayoutEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { cn } from "@/lib/cn";
import { interpolate, type Locale, type Wording } from "@/lib/i18n";
import { revealUp, staggerStep, sweepFill } from "@/lib/motion";
import {
  CATEGORY_PARAM,
  filterProducts,
  parseCategory,
  productCategories,
  products,
  type ProductCategory,
} from "@/lib/products";
import { startAtTop } from "@/lib/scroll";

type CatalogueProps = {
  locale: Locale;
  wording: Wording["catalogue"];
  /** Product names and alt text, shared with the home page teaser. */
  items: Wording["products"]["items"];
};

/** Widths the cards are rendered at: 3 columns beside the filters, 3 across on a tablet, 2 on a phone. */
const CARD_SIZES = "(min-width: 80rem) 18rem, (min-width: 48rem) 30vw, 50vw";

/** Cards past this many share the last stagger delay, so a long grid doesn't trickle in. */
const MAX_STAGGER = 6;

/**
 * The full catalogue: category filters on the left, the matching products on the
 * right in a grid that scrolls within itself (eased like the page).
 *
 * The selected category lives in the URL (?category=, lib/products.ts), which is
 * also how the home page hero and products teaser open this page pre-filtered.
 * Reading it needs a Suspense boundary on a prerendered page; the fallback is the
 * unfiltered catalogue, so the static HTML still lists every product.
 */
export function Catalogue(props: CatalogueProps) {
  // The catalogue always opens at the top: after a link from partway down the
  // home page, a reload, or Back. Before paint, so the old offset never shows.
  useLayoutEffect(() => startAtTop(), []);

  return (
    <Suspense fallback={<CatalogueView {...props} category={null} />}>
      <SyncedCatalogue {...props} />
    </Suspense>
  );
}

function SyncedCatalogue(props: CatalogueProps) {
  const category = parseCategory(useSearchParams().get(CATEGORY_PARAM));
  return <CatalogueView {...props} category={category} />;
}

/**
 * Writes the choice into the URL. Next.js syncs useSearchParams with the history
 * API, so the grid re-renders at once, with no request. Replacing the entry
 * (not pushing) keeps Back going to wherever the visitor came from.
 */
function selectCategory(category: ProductCategory | null) {
  const url = new URL(window.location.href);
  if (category) url.searchParams.set(CATEGORY_PARAM, category);
  else url.searchParams.delete(CATEGORY_PARAM);
  window.history.replaceState(null, "", url);
}

type Filter = {
  /** The category this filter selects; null for "all". */
  value: ProductCategory | null;
  label: string;
  count: number;
};

function CatalogueView({
  locale,
  wording,
  items,
  category,
}: CatalogueProps & { category: ProductCategory | null }) {
  const id = useId();
  const titleId = `${id}-title`;
  const gridId = `${id}-grid`;

  const visible = filterProducts(category);
  const categoryLabel = category ? wording.categories[category] : wording.all;

  const filters: Filter[] = [
    { value: null, label: wording.all, count: products.length },
    ...productCategories.map((value) => ({
      value,
      label: wording.categories[value],
      count: filterProducts(value).length,
    })),
  ];

  return (
    <section id="catalogue" aria-labelledby={titleId} className="px-gutter pt-stack pb-section">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeader
            as="h1"
            id={titleId}
            eyebrow={wording.eyebrow}
            title={wording.title}
            intro={wording.intro}
          />
        </Reveal>

        <div className="mt-stack grid gap-y-10 lg:grid-cols-12 lg:gap-x-12">
          {/* Filters: a row of chips that swipes on a phone, a list with hairlines from lg. */}
          <Reveal className="min-w-0 lg:col-span-3" delay={staggerStep}>
            <ul
              aria-label={wording.filterLabel}
              className="scrollbar-none -mx-gutter flex gap-2 overflow-x-auto px-gutter lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-line lg:px-0"
            >
              {filters.map((filter) => (
                <li key={filter.value ?? "all"} className="shrink-0 lg:border-b lg:border-line">
                  <FilterButton
                    {...filter}
                    active={filter.value === category}
                    controls={gridId}
                    onSelect={() => selectCategory(filter.value)}
                  />
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="min-w-0 lg:col-span-9" delay={staggerStep * 2} id={gridId}>
            <h2 className="sr-only">{wording.gridLabel}</h2>
            {/* Announces the new count after each filter change. */}
            <p className="sr-only" aria-live="polite">
              {interpolate(wording.results, { count: visible.length })}
            </p>

            {visible.length > 0 ? (
              <ScrollArea
                label={wording.gridLabel}
                resetKey={category}
                className="scrollbar-thin lg:max-h-catalogue lg:overflow-y-auto"
              >
                {/* Keyed by category, so a new filter plays the cards in afresh. */}
                <ul
                  key={category ?? "all"}
                  className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:pr-4"
                >
                  {visible.map((product, index) => (
                    <m.li
                      key={product.id}
                      variants={revealUp}
                      custom={Math.min(index, MAX_STAGGER) * staggerStep}
                      initial="hidden"
                      animate="visible"
                    >
                      <ProductCard
                        name={items[product.id].name}
                        alt={items[product.id].alt}
                        category={wording.categories[product.category]}
                        image={product.image}
                        sizes={CARD_SIZES}
                        ratio="landscape"
                      />
                    </m.li>
                  ))}
                </ul>
              </ScrollArea>
            ) : (
              <EmptyState
                locale={locale}
                wording={wording.empty}
                categoryLabel={categoryLabel}
                onShowAll={() => selectCategory(null)}
              />
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

type FilterButtonProps = Filter & {
  active: boolean;
  /** id of the grid this filter drives. */
  controls: string;
  onSelect: () => void;
};

/**
 * One category. The active one fills black with the same sweep as the custom
 * process steps (components/ui/StepCard): in from the left, out by the right.
 */
function FilterButton({ label, count, active, controls, onSelect }: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      aria-controls={controls}
      className={cn(
        "relative isolate flex w-full cursor-pointer items-baseline justify-between gap-6 overflow-hidden rounded border border-line px-4 py-3 text-left whitespace-nowrap",
        "transition-colors lg:rounded-none lg:border-0 lg:py-4",
        active ? "text-bg" : "text-text hover:bg-surface",
      )}
    >
      {/* The origin flips only at scaleX 0 or 1, where it cannot be seen. */}
      <m.span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-primary"
        style={{ transformOrigin: active ? "left" : "right" }}
        variants={sweepFill}
        initial={false}
        animate={active ? "visible" : "hidden"}
      />
      <span className="text-sm font-medium tracking-widest uppercase">{label}</span>
      {/* The count is a visual aid; the live region under the grid announces results. */}
      <span
        aria-hidden="true"
        className={cn(
          "text-xs tabular-nums transition-colors",
          active ? "text-surface/90" : "text-accent",
        )}
      >
        {count}
      </span>
    </button>
  );
}

type EmptyStateProps = {
  locale: Locale;
  wording: Wording["catalogue"]["empty"];
  categoryLabel: string;
  onShowAll: () => void;
};

/**
 * A category with nothing photographed yet. Everything is made to order, so
 * rather than a dead end it offers the whole catalogue or a WhatsApp chat about
 * that category.
 */
function EmptyState({ locale, wording, categoryLabel, onShowAll }: EmptyStateProps) {
  // Mid-sentence in the WhatsApp message and its label: "… in dining furniture".
  const category = categoryLabel.toLocaleLowerCase(locale);

  return (
    <div className="rounded bg-surface px-6 py-16 sm:px-12 sm:py-20">
      <h3 className="font-heading text-3xl font-light text-pretty sm:text-4xl">
        {interpolate(wording.title, { category: categoryLabel })}
      </h3>
      <p className="mt-5 max-w-lg text-accent">{wording.description}</p>

      <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
        <Button variant="outline" onClick={onShowAll}>
          {wording.showAll}
        </Button>
        <WhatsAppLink
          message={interpolate(wording.message, { category })}
          ariaLabel={interpolate(wording.contactAriaLabel, { category })}
        >
          {wording.contact}
        </WhatsAppLink>
      </div>
    </div>
  );
}
