"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { scrollLerp } from "@/lib/motion";
import { attachSectionSnap, registerScroller } from "@/lib/scroll";

/**
 * Eases the whole page: the wheel sets a target and the scroll position trails
 * it, so the page settles instead of stopping dead (DESIGN.md → Motion: smooth
 * and slow). Lenis skips all of this by itself when the OS asks for reduced
 * motion, and touch scrolling stays native.
 */
export function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;

    const lenis = new Lenis({
      lerp: scrollLerp,
      autoRaf: true,
      // No offset here: Lenis reads the target's scroll-margin-top itself, so the
      // landing point lives in one place (the section[id] rules in app/globals.css)
      // and follows the header as it grows at the tablet breakpoint. Setting an offset
      // as well would stack on top of that margin and overshoot.
      anchors: true,
    });

    // Hand the instance to lib/scroll.ts so in-page navigation (the sidebar
    // menu) eases through this same scroller rather than its own animation.
    registerScroller(lenis);

    // Sections marked data-scroll-snap (the slogan) settle into view on the way down.
    const detachSnap = attachSectionSnap(lenis);

    // Modal and Drawer lock the page by setting overflow on <html> (lib/use-dialog.ts).
    // Pausing Lenis for as long as that lock holds keeps it from carrying a
    // stale target back into the page when the dialog closes.
    const lock = new MutationObserver(() => {
      if (root.style.overflow === "hidden") lenis.stop();
      else lenis.start();
    });

    lock.observe(root, { attributeFilter: ["style"] });

    return () => {
      lock.disconnect();
      detachSnap();
      registerScroller(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
