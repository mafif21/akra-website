import type { Transition, Variants } from "framer-motion";

// Motion tokens per DESIGN.md → Motion: smooth and slow, fade + slide-up reveals,
// 0.6–0.8s with a gentle ease-out, subtle hover. Reduced-motion users are handled
// globally by MotionProvider (components/ui/MotionProvider.tsx).
//
// Use the `m` component (not `motion`) with these, e.g.
//   <m.div variants={fadeUp} {...reveal} />
// Every variant state carries a transition, so it also works as an `exit` target.

/** Same curve as --ease-soft in app/globals.css (CSS transitions). */
export const easeOut = [0.22, 1, 0.36, 1] as const;

export const durations = {
  fast: 0.6,
  base: 0.7,
  slow: 0.8,
} as const;

/** Vertical offset for slide-up reveals, in px. */
const revealOffset = 24;

export const transition: Transition = {
  duration: durations.base,
  ease: easeOut,
};

/** Slightly quicker transition for elements leaving the screen. */
const exitTransition: Transition = {
  duration: durations.fast,
  ease: easeOut,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: revealOffset, transition: exitTransition },
  visible: { opacity: 1, y: 0, transition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0, transition: exitTransition },
  visible: { opacity: 1, transition: { ...transition, duration: durations.slow } },
};

/** Backdrop behind modals and drawers. */
export const overlayFade: Variants = {
  hidden: { opacity: 0, transition: exitTransition },
  visible: { opacity: 1, transition },
};

/** Panel sliding in from a screen edge (drawers). */
export function slideIn(side: "left" | "right" = "right"): Variants {
  return {
    hidden: { x: side === "right" ? "100%" : "-100%", transition: exitTransition },
    visible: { x: 0, transition },
  };
}

/** Parent variant that reveals children one after another. */
export function staggerContainer(stagger = 0.12, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  };
}

/** Spread onto an `m.*` element to play its variants once when scrolled into view. */
export const reveal = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, amount: 0.2 },
} as const;

/** Subtle hover scale for images and cards, e.g. <m.div {...hoverScale} />. */
export const hoverScale = {
  whileHover: { scale: 1.02 },
  transition: { duration: durations.fast, ease: easeOut },
} as const;

// ── Delayed variants (scroll reveals, Hero image swaps) ─────────────────────
// These take a delay in seconds through `custom`, so neighbouring elements can
// be staggered: <m.div custom={column * staggerStep} variants={wipeReveal} />.

/** Delay between neighbouring items in a staggered swap, in seconds. */
export const staggerStep = 0.08;

const withDelay = (delay: unknown, base: Transition = transition, offset = 0): Transition => ({
  ...base,
  delay: (typeof delay === "number" ? delay : 0) + offset,
});

/** fadeUp with an optional delay, for independent reveals (see components/ui/Reveal). */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: revealOffset, transition: exitTransition },
  visible: (delay) => ({ opacity: 1, y: 0, transition: withDelay(delay) }),
};

const clipHidden = "inset(100% 0% 0% 0%)";
const clipShown = "inset(0% 0% 0% 0%)";

// wipeReveal and crossfade set both clipPath and opacity in every state, so
// switching between them (e.g. once reduced motion is detected after hydration)
// never leaves a layer stuck clipped or transparent.

/** Image layer revealed bottom-up (and covered top-down) with a clip-path wipe. */
export const wipeReveal: Variants = {
  hidden: (delay) => ({
    clipPath: clipHidden,
    opacity: 1,
    transition: withDelay(delay, { duration: durations.slow, ease: easeOut }),
  }),
  visible: (delay) => ({
    clipPath: clipShown,
    opacity: 1,
    transition: withDelay(delay, { duration: durations.slow, ease: easeOut }),
  }),
};

/** Reduced-motion alternative to wipeReveal: a plain crossfade (the clip jumps, invisibly). */
export const crossfade: Variants = {
  hidden: (delay) => ({
    clipPath: clipHidden,
    opacity: 0,
    transition: {
      ...withDelay(delay),
      clipPath: withDelay(delay, { duration: 0 }, durations.base),
    },
  }),
  visible: (delay) => ({
    clipPath: clipShown,
    opacity: 1,
    transition: { ...withDelay(delay), clipPath: { duration: 0 } },
  }),
};

/** Image settling from a slight zoom while its layer is revealed. */
export const settleIn: Variants = {
  hidden: (delay) => ({
    scale: 1.08,
    transition: withDelay(delay, { duration: durations.slow, ease: easeOut }),
  }),
  visible: (delay) => ({
    scale: 1,
    transition: withDelay(delay, { duration: durations.slow, ease: easeOut }),
  }),
};

/**
 * Caption swap: the old caption drifts up and fades out, then the new one fades
 * in sliding up from below, so both move in the same direction and barely overlap.
 */
export const captionSwap: Variants = {
  hidden: (delay) => ({
    opacity: 0,
    y: -revealOffset / 2,
    transition: withDelay(delay, exitTransition),
  }),
  visible: (delay) => ({
    opacity: 1,
    y: [revealOffset / 2, 0], // always enter from below, wherever the exit left it
    transition: withDelay(delay, transition, 0.35),
  }),
};
