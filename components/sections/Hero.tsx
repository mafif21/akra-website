"use client";

import { m, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import { useId, useRef, useState, type CSSProperties } from "react";
import { CircleButton } from "@/components/ui/CircleButton";
import { ChevronRightIcon } from "@/components/ui/Icons";
import { formatIndex } from "@/lib/format";
import { interpolate, type Wording } from "@/lib/i18n";
import { captionSwap, crossfade, settleIn, staggerStep, wipeReveal } from "@/lib/motion";
import barStool from "@/public/images/hero/bar-stool.jpg";
import bench from "@/public/images/hero/bench.jpg";
import cafeChair from "@/public/images/hero/cafe-chair.jpg";
import diningTable from "@/public/images/hero/dining-table.jpg";
import loungeChair from "@/public/images/hero/lounge-chair.jpg";
import sideboard from "@/public/images/hero/sideboard.jpg";

type HeroWording = Wording["hero"];

type HeroItem = {
  /** Also the wording key: hero.items.<id>.name / .alt */
  id: keyof HeroWording["items"];
  image: StaticImageData;
  href: string;
};

/**
 * Hero images, in display order. Every 3 items form a set; scrolling through
 * the hero swaps one set for the next. Placeholders: replace the files in
 * public/images/hero/ (and their alt text in wording) with real photos.
 */
const heroItems: readonly HeroItem[] = [
  { id: "cafeChair", image: cafeChair, href: "#products" },
  { id: "loungeChair", image: loungeChair, href: "#products" },
  { id: "diningTable", image: diningTable, href: "#products" },
  { id: "barStool", image: barStool, href: "#products" },
  { id: "sideboard", image: sideboard, href: "#products" },
  { id: "bench", image: bench, href: "#products" },
];

const COLUMNS = 3;
const SET_COUNT = Math.ceil(heroItems.length / COLUMNS);

type Layer = HeroItem & { indexLabel: string };

/** columns[c][s] = the item shown in column c while set s is active. */
const columns: Layer[][] = Array.from({ length: COLUMNS }, (_, column) =>
  Array.from({ length: SET_COUNT }, (_, set) => {
    const position = set * COLUMNS + column;
    return { ...heroItems[position], indexLabel: formatIndex(position) };
  }),
);

export function Hero({ wording }: { wording: HeroWording }) {
  const titleId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeSet, setActiveSet] = useState(0);

  // The track is SET_COUNT screens tall and the image panel sticks inside it,
  // so scroll progress through the track decides which set is showing.
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setActiveSet(Math.min(SET_COUNT - 1, Math.floor(progress * SET_COUNT)));
  });

  return (
    <section aria-labelledby={titleId}>
      <h1 id={titleId} className="sr-only">
        {wording.title}
      </h1>

      <div
        ref={trackRef}
        className="relative h-hero-track"
        style={{ "--hero-sets": SET_COUNT } as CSSProperties}
      >
        <div className="sticky top-header h-hero">
          {/* Mobile: swipeable row. Desktop: three columns side by side, edge to edge. */}
          <ul className="scrollbar-none flex h-full snap-x snap-mandatory overflow-x-auto md:grid md:grid-cols-3 md:overflow-visible">
            {columns.map((layers, column) => (
              <HeroColumn
                key={layers[0].id}
                layers={layers}
                activeSet={activeSet}
                delay={column * staggerStep}
                wording={wording}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

type HeroColumnProps = {
  layers: Layer[];
  activeSet: number;
  /** Stagger delay for this column's swap, in seconds. */
  delay: number;
  wording: HeroWording;
};

function HeroColumn({ layers, activeSet, delay, wording }: HeroColumnProps) {
  const reduceMotion = useReducedMotion();

  return (
    <li className="group relative h-full w-4/5 shrink-0 snap-start overflow-hidden bg-surface md:w-auto">
      {/* Images: later sets stack on top and wipe in over earlier ones. */}
      <div className="absolute inset-0 transition-transform duration-700 ease-soft md:group-hover:scale-102">
        {layers.map((layer, set) => (
          <m.div
            key={layer.id}
            className="absolute inset-0 overflow-hidden"
            aria-hidden={set !== activeSet}
            custom={delay}
            initial={false}
            animate={set <= activeSet ? "visible" : "hidden"}
            variants={set === 0 ? undefined : reduceMotion ? crossfade : wipeReveal}
          >
            <m.div className="absolute inset-0" custom={delay} variants={settleIn}>
              <Image
                src={layer.image}
                alt={wording.items[layer.id].alt}
                fill
                sizes="(min-width: 48rem) 33vw, 80vw"
                placeholder="blur"
                loading={set === 0 ? "eager" : "lazy"}
                className="object-cover"
              />
            </m.div>
          </m.div>
        ))}
      </div>

      {/* Scrim keeps captions readable over light and dark photos. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-text/70 via-text/25 to-transparent" />

      {/* Captions for every set share one grid cell; only the active one is visible and focusable. */}
      <div className="absolute inset-x-0 bottom-0 grid p-4 md:p-6">
        {layers.map((layer, set) => {
          const name = wording.items[layer.id].name;
          const isActive = set === activeSet;

          return (
            <m.div
              key={layer.id}
              className="col-start-1 row-start-1 flex items-end justify-between gap-4"
              inert={!isActive}
              custom={delay}
              initial={false}
              animate={isActive ? "visible" : "hidden"}
              variants={captionSwap}
            >
              <p className="flex items-baseline gap-3 text-surface">
                <span className="text-xs tracking-widest tabular-nums">{layer.indexLabel}.</span>
                <span className="font-heading text-2xl md:text-3xl">{name}</span>
              </p>
              <CircleButton
                href={layer.href}
                label={interpolate(wording.viewProduct, { name })}
                className="focus-visible:outline-surface"
              >
                <ChevronRightIcon className="size-5" />
              </CircleButton>
            </m.div>
          );
        })}
      </div>
    </li>
  );
}
