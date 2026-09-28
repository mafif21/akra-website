"use client";

import { Reveal } from "@/components/ui/Reveal";
import { StepCard } from "@/components/ui/StepCard";
import { formatIndex } from "@/lib/format";
import type { Wording } from "@/lib/i18n";
import { fadeIn, staggerStep } from "@/lib/motion";
import lifestylePhoto from "@/public/images/about/lifestyle.jpeg";
import showcasePhoto from "@/public/images/about/showcase.jpeg";
import diningTable from "@/public/images/hero/dining-table.jpg";
import barStools from "@/public/images/hero/lounge-chair.jpg";
import sideboard from "@/public/images/hero/sideboard.jpg";
import { m } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import { useId, useState } from "react";

type CustomProcessWording = Wording["customProcess"];

type Step = {
  /** Also the wording key: customProcess.steps.<key>.label / .caption / .alt */
  key: keyof CustomProcessWording["steps"];
  image: StaticImageData;
};

/**
 * The five phases, in order. Placeholders: swap the images for photography of
 * the actual workshop — a sketch table, a bench in progress, a piece under
 * inspection, a crate being packed.
 */
const steps: readonly Step[] = [
  { key: "planning", image: lifestylePhoto },
  { key: "design", image: diningTable },
  { key: "production", image: showcasePhoto },
  { key: "quality", image: barStools },
  { key: "shipping", image: sideboard },
];

const PANEL_SIZES = "(min-width: 64rem) 48vw, 100vw";

/**
 * Custom process: a list of steps on the left that fills with color as you move
 * through it, and a panel on the right that crossfades to match. Hover, tap and
 * keyboard focus all pick a step; "planning" is active on load.
 */
export function CustomProcess({ wording }: { wording: CustomProcessWording }) {
  const id = useId();
  const titleId = `${id}-title`;
  const panelId = `${id}-panel`;
  const [activeKey, setActiveKey] = useState<Step["key"]>(steps[0].key);

  return (
    // theme-dark inverts the tokens, so the active step fills white with dark text.
    <section id="custom" aria-labelledby={titleId} className="theme-dark px-gutter py-section">
      <div className="mx-auto max-w-7xl">
        {/* Heading stacked over its description, the whole block set right. */}
        <div className="grid gap-y-6 text-right lg:grid-cols-12">
          <Reveal className="lg:col-span-6 lg:col-start-7">
            <h2
              id={titleId}
              className="heading-section"
            >
              {wording.title}
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-6 lg:col-start-7" delay={staggerStep}>
            {/* ml-auto keeps the measure-capped paragraph against the right edge. */}
            <p className="ml-auto max-w-2xl text-accent">{wording.description}</p>
          </Reveal>
        </div>

        {/* The list and the panel share the first row, so the panel stretches to the
            exact height of the list instead of standing on its own aspect ratio; the
            caption takes a row of its own underneath. The row gaps are margins on the
            items, so the stacked order on a phone keeps the spacing it had. */}
        <div className="mt-10 grid lg:grid-cols-12 lg:gap-x-12">
          {/* Steps: one outer border, a hairline between each. They set the row height. */}
          <Reveal className="lg:col-span-6">
            <ul aria-label={wording.stepsLabel} className="border border-line">
              {steps.map(({ key }, position) => (
                <li key={key} className="border-t border-line first:border-t-0">
                  <StepCard
                    index={formatIndex(position)}
                    label={wording.steps[key].label}
                    active={key === activeKey}
                    onActivate={() => setActiveKey(key)}
                    controls={panelId}
                  />
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Panel: every step is stacked and crossfades, so nothing reflows on change.
              Its own 3:2 ratio holds while the section is stacked; from lg the panel
              grows to fill the row, which the step list sets, so the two line up. */}
          <Reveal
            className="mt-8 lg:col-span-6 lg:mt-0 lg:flex lg:flex-col"
            delay={staggerStep}
            id={panelId}
          >
            <div className="relative aspect-3/2 overflow-hidden rounded bg-surface lg:aspect-auto lg:flex-1">
              {steps.map(({ key, image }) => (
                <m.div
                  key={key}
                  className="absolute inset-0"
                  aria-hidden={key !== activeKey}
                  variants={fadeIn}
                  initial={false}
                  animate={key === activeKey ? "visible" : "hidden"}
                >
                  <Image
                    src={image}
                    alt={wording.steps[key].alt}
                    fill
                    sizes={PANEL_SIZES}
                    placeholder="blur"
                    loading={key === steps[0].key ? "eager" : "lazy"}
                    className="object-cover"
                  />
                </m.div>
              ))}
            </div>
          </Reveal>

          {/* Captions share one grid cell, so the tallest one sets the height once. */}
          <Reveal className="mt-6 lg:col-span-6 lg:col-start-7" delay={staggerStep}>
            <div className="grid" aria-live="polite">
              {steps.map(({ key }) => (
                <m.p
                  key={key}
                  className="col-start-1 row-start-1 max-w-xl text-accent"
                  aria-hidden={key !== activeKey}
                  variants={fadeIn}
                  initial={false}
                  animate={key === activeKey ? "visible" : "hidden"}
                >
                  {wording.steps[key].caption}
                </m.p>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
