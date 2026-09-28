"use client";

import { useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/Icons";
import { ProductCard } from "@/components/ui/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import type { Locale, Wording } from "@/lib/i18n";
import { staggerStep } from "@/lib/motion";
import { catalogueHref, featuredProducts } from "@/lib/products";

type ProductsWording = Wording["products"];

type ProductsProps = {
  locale: Locale;
  wording: ProductsWording;
};

/** Slack (px) around a scroll end, so sub-pixel offsets don't keep an arrow enabled. */
const EDGE_TOLERANCE = 2;

/** Widths the cards are rendered at (w-64 / sm:w-72 / xl:w-80). */
const CARD_SIZES = "(min-width: 80rem) 20rem, (min-width: 40rem) 18rem, 16rem";

/**
 * Products teaser: a fixed column of copy on the left, a horizontal run of cards
 * on the right that the arrows scroll. The full catalogue lives on its own page.
 */
export function Products({ locale, wording }: ProductsProps) {
  const titleId = useId();
  const scrollerRef = useRef<HTMLUListElement>(null);
  const reduceMotion = useReducedMotion();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // Which arrows still have somewhere to scroll to.
  const syncEdges = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const remaining = scroller.scrollWidth - scroller.clientWidth - scroller.scrollLeft;
    setCanPrev(scroller.scrollLeft > EDGE_TOLERANCE);
    setCanNext(remaining > EDGE_TOLERANCE);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // Also covers the first measurement: the observer fires once on observe().
    const observer = new ResizeObserver(syncEdges);
    observer.observe(scroller);
    return () => observer.disconnect();
  }, [syncEdges]);

  /** Scrolls one card along, letting the browser handle snapping and easing. */
  const scrollByCard = useCallback(
    (direction: 1 | -1) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      const [first, second] = scroller.children;
      const step =
        first instanceof HTMLElement && second instanceof HTMLElement
          ? second.offsetLeft - first.offsetLeft // card width plus the gap
          : scroller.clientWidth;

      scroller.scrollBy({ left: step * direction, behavior: reduceMotion ? "auto" : "smooth" });
    },
    [reduceMotion],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    scrollByCard(event.key === "ArrowRight" ? 1 : -1);
  };

  return (
    // Surface band after the white About. At least a screen tall, content centred in
    // it; min-h, not h, so nothing is ever cut off. w-full: a flex child would shrink.
    <section
      id="products"
      aria-labelledby={titleId}
      className="flex min-h-screen items-center bg-surface px-gutter py-section"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-y-stack lg:grid-cols-12 lg:gap-x-12 lg:gap-y-0">
        {/* Left: heading, intro and the controls for the run of cards. */}
        <div className="flex flex-col lg:col-span-4">
          <Reveal>
            <h2
              id={titleId}
              className="heading-section"
            >
              {wording.title}
            </h2>
            <p className="mt-6 text-accent">{wording.intro}</p>
            <Link
              href={catalogueHref(locale)}
              className="group hit-area label-caps mt-8 inline-flex items-center gap-3 font-medium"
            >
              <span className="link-underline">{wording.seeAll}</span>
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          {/* On wide screens the arrows sit at the foot of the column. */}
          <div className="hidden flex-1 lg:block" aria-hidden />

          {/* The negative margin pulls the first icon flush with the column edge. */}
          <Reveal className="mt-10 -ml-3.5 flex gap-1 lg:mt-12" delay={staggerStep}>
            <Button
              variant="ghost"
              size="icon-lg"
              className="group/arrow"
              aria-label={wording.previous}
              aria-controls={`${titleId}-slider`}
              disabled={!canPrev}
              onClick={() => scrollByCard(-1)}
            >
              <ArrowLeftIcon className="size-7 transition-transform group-hover/arrow:-translate-x-1" />
            </Button>
            <Button
              variant="ghost"
              size="icon-lg"
              className="group/arrow"
              aria-label={wording.next}
              aria-controls={`${titleId}-slider`}
              disabled={!canNext}
              onClick={() => scrollByCard(1)}
            >
              <ArrowRightIcon className="size-7 transition-transform group-hover/arrow:translate-x-1" />
            </Button>
          </Reveal>
        </div>

        {/* Right: the cards themselves, running off the edge of the page. */}
        <Reveal className="min-w-0 lg:col-span-8" delay={staggerStep}>
          <ul
            id={`${titleId}-slider`}
            ref={scrollerRef}
            tabIndex={0}
            aria-label={wording.sliderLabel}
            onScroll={syncEdges}
            onKeyDown={handleKeyDown}
            // Bleeds into the page gutter on the right; the negative left margin
            // only buys room for a focused card's outline.
            className="scrollbar-none -mr-gutter -ml-1.5 flex snap-x snap-mandatory scroll-pl-1.5 gap-6 overflow-x-auto py-1.5 pr-gutter pl-1.5"
          >
            {featuredProducts.map(({ id, image, category, destinations }) => {
              const item = wording.items[id];
              const shipped = destinations.map((country) => wording.countries[country]);

              return (
                <li key={id} className="w-64 shrink-0 snap-start sm:w-72 xl:w-80">
                  {/* Opens the catalogue already filtered to this piece's category. */}
                  <ProductCard
                    href={catalogueHref(locale, category)}
                    name={item.name}
                    alt={item.alt}
                    shippedTo={shipped.length > 0 ? wording.shippedTo : wording.worldwide}
                    destinations={shipped}
                    image={image}
                    sizes={CARD_SIZES}
                  />
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
