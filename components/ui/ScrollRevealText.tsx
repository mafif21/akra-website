"use client";

import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Fragment, useRef } from "react";
import { cn } from "@/lib/cn";

type ScrollRevealTextProps = {
  /** Plain sentence; it is split on spaces and coloured word by word. */
  text: string;
  className?: string;
};

/**
 * How many words share the scroll range of any one word. Higher reads softer,
 * because neighbours already start brightening while a word is still filling in.
 */
const WORD_SPAN = 4;

/**
 * A sentence that is "read" as you scroll: each word starts muted and turns to
 * full --color-text as scroll progress passes over it (DESIGN.md → Motion:
 * gentle, nothing colliding).
 *
 * Each word is drawn twice — the muted copy carries the layout and the text
 * copy fades in on top of it — so both colours stay tokens and only opacity
 * animates. Reduced motion gets the finished sentence, fully coloured.
 */
export function ScrollRevealText({ text, className }: ScrollRevealTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();

  // Begins once the sentence is well inside the viewport, finishes before it leaves.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });

  if (reduceMotion) {
    return (
      <p ref={ref} className={cn("text-text", className)}>
        {text}
      </p>
    );
  }

  const words = text.split(" ");
  // The last word's range ends exactly at progress 1, whatever the word count.
  const step = 1 / (words.length + WORD_SPAN - 1);

  return (
    <p ref={ref} className={cn("text-muted", className)}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <Word
            word={word}
            progress={scrollYProgress}
            start={index * step}
            end={(index + WORD_SPAN) * step}
          />
          {/* A real space between words, so lines still break normally. */}
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}

type WordProps = {
  word: string;
  progress: MotionValue<number>;
  /** Scroll progress at which this word starts and finishes brightening. */
  start: number;
  end: number;
};

function Word({ word, progress, start, end }: WordProps) {
  const opacity = useTransform(progress, [start, end], [0, 1]);

  return (
    <span className="relative inline-block">
      {word}
      {/* The same word in full colour, laid exactly over the muted one. */}
      <m.span
        aria-hidden
        className="absolute inset-0 text-text select-none"
        style={{ opacity }}
      >
        {word}
      </m.span>
    </span>
  );
}
