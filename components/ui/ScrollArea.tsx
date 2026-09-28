"use client";

import Lenis from "lenis";
import { useEffect, useRef, type ReactNode } from "react";
import { scrollLerp } from "@/lib/motion";

type ScrollAreaProps = {
  children: ReactNode;
  /** Sets the height cap and the overflow, e.g. "lg:max-h-catalogue lg:overflow-y-auto". */
  className?: string;
  /** Names the region for assistive tech, from wording. */
  label: string;
  /** Jumps back to the top whenever this value changes, e.g. the active filter. */
  resetKey?: unknown;
};

/**
 * A vertically scrolling box that eases like the page does (components/ui/SmoothScroll):
 * its own Lenis instance with the same lerp. Lenis handles the nesting itself: while
 * the box can still move, the wheel stays inside it; at either end the gesture passes
 * on to the page. Touch stays native, and reduced motion turns the easing off.
 *
 * Focusable so the keyboard can scroll it even when nothing inside takes focus.
 */
export function ScrollArea({ children, className, label, resetKey }: ScrollAreaProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    // Start at the top: Lenis takes its first position from the box as it finds it.
    wrapper.scrollTop = 0;

    const lenis = new Lenis({ wrapper, content, lerp: scrollLerp, autoRaf: true });
    lenisRef.current = lenis;

    return () => {
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    // Native first, for the same reason as resetScroll() in lib/scroll.ts.
    if (wrapperRef.current) wrapperRef.current.scrollTop = 0;
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
  }, [resetKey]);

  return (
    <div
      ref={wrapperRef}
      role="region"
      aria-label={label}
      tabIndex={0}
      className={className}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
