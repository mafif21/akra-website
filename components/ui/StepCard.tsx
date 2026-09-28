"use client";

import { m } from "framer-motion";
import { cn } from "@/lib/cn";
import { sweepFill } from "@/lib/motion";

type StepCardProps = {
  /** Two-digit position label, e.g. "01". */
  index: string;
  label: string;
  active: boolean;
  /** Called on hover, focus and click — every way a step can be picked. */
  onActivate: () => void;
  /** id of the panel this step drives. */
  controls: string;
};

/**
 * One step of a process list. The active step is filled by a black layer that
 * sweeps in from the left and, once another step takes over, leaves
 * by the right, so the fill reads as flowing down the list rather than blinking.
 * Under prefers-reduced-motion the fill switches instantly (MotionConfig).
 */
export function StepCard({ index, label, active, onActivate, controls }: StepCardProps) {
  return (
    <button
      type="button"
      onClick={onActivate}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      aria-current={active ? "step" : undefined}
      aria-controls={controls}
      className="relative isolate flex w-full cursor-pointer items-baseline gap-5 px-6 py-6 text-left sm:px-8"
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
      <span
        className={cn(
          "text-xs tracking-widest tabular-nums transition-colors",
          // /90 holds the numerals just back from the label on the filled step.
          active ? "text-surface/90" : "text-muted",
        )}
      >
        {index}
      </span>
      <span
        className={cn(
          "font-heading text-2xl font-light tracking-wide uppercase transition-colors sm:text-3xl",
          active ? "text-surface" : "text-text",
        )}
      >
        {label}
      </span>
    </button>
  );
}
