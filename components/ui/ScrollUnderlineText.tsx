"use client";

import {
  m,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "framer-motion";
import { Fragment, useRef } from "react";
import { cn } from "@/lib/cn";
import { splitHighlights } from "@/lib/format";
import { scrollSpring } from "@/lib/motion";

type ScrollUnderlineTextProps = {
  /** The full sentence, from wording. */
  text: string;
  /** Phrases inside `text`, in the order they appear, that light up one by one. */
  phrases: readonly string[];
  className?: string;
};

/**
 * A statement that is marked up as you scroll it: each key phrase draws its 1px
 * underline left to right and settles from --color-muted to --color-text, one
 * after another (DESIGN.md → Motion: smooth and slow, nothing colliding).
 *
 * Scroll progress runs through a spring, so the lines keep drawing for a beat
 * after the wheel stops rather than snapping to it. Every phrase animates the
 * single `--lit` variable the `draw-underline` utility is built on, which keeps
 * both colours tokens. Reduced motion gets the finished phrases, undrawn: the
 * utility forces --lit to 1 in CSS, so server and client render the same markup.
 */
export function ScrollUnderlineText({ text, phrases, className }: ScrollUnderlineTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);

  // Starts once the statement is well inside the viewport, ends before it leaves.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.6"] });
  const progress = useSpring(scrollYProgress, scrollSpring);

  const segments = splitHighlights(text, phrases);
  const total = segments.filter((segment) => segment.phrase !== null).length;
  // One phrase per slice of the range, with the last slice left as a lead-out.
  const slice = 1 / (total + 1);

  return (
    <p ref={ref} className={cn("text-muted", className)}>
      {segments.map((segment, index) =>
        segment.phrase === null ? (
          <Fragment key={index}>{segment.text}</Fragment>
        ) : (
          <Phrase
            key={index}
            text={segment.text}
            progress={progress}
            start={segment.phrase * slice}
            end={(segment.phrase + 1) * slice}
          />
        ),
      )}
    </p>
  );
}

type PhraseProps = {
  text: string;
  progress: MotionValue<number>;
  /** Scroll progress at which this phrase starts and finishes drawing. */
  start: number;
  end: number;
};

function Phrase({ text, progress, start, end }: PhraseProps) {
  const lit = useTransform(progress, [start, end], [0, 1]);
  // Framer writes any `--*` key straight to the element; its style type, which
  // is React's CSSProperties, just has no room for custom properties.
  const style = { "--lit": lit } as MotionStyle;

  return (
    <m.span className="draw-underline" style={style}>
      {text}
    </m.span>
  );
}
