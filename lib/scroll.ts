import type Lenis from "lenis";
import type { VirtualScrollData } from "lenis";

/**
 * The page's smooth scroller (components/ui/SmoothScroll.tsx), which registers
 * itself on mount. In-page navigation drives that same instance instead of
 * starting a second, competing animation next to it.
 */
let scroller: Lenis | null = null;

export function registerScroller(instance: Lenis | null) {
  scroller = instance;
}

/**
 * Jumps the page to the very top, with no easing. The native jump comes first:
 * Lenis skips a scrollTo whose target equals the one it already holds, and after
 * a reload that is 0 even though the browser has restored an offset. Lenis then
 * drops any glide carried over from the previous page, which would otherwise
 * keep pulling the new one down to the old position.
 */
export function resetScroll() {
  window.scrollTo(0, 0);
  scroller?.scrollTo(0, { immediate: true, force: true });
}

/**
 * For a page that should always open at its top: jumps there now and stops the
 * browser from restoring an old offset when this history entry is reloaded or
 * revisited. Next.js won't do it on a client navigation, because the sticky
 * header, the first element of every page, always counts as in view.
 *
 * Returns the cleanup, which hands restoration back to the browser for the
 * pages that follow: `useLayoutEffect(() => startAtTop(), [])`.
 */
export function startAtTop(): () => void {
  const previous = window.history.scrollRestoration;
  window.history.scrollRestoration = "manual";
  resetScroll();

  return () => {
    window.history.scrollRestoration = previous;
  };
}

/**
 * Smooth-scrolls the section with this id to the vertical centre of the
 * viewport. A section taller than the viewport — or a short one whose centred
 * position would tuck its top under the sticky header — stops just below the
 * header instead, so its heading stays visible.
 *
 * Returns false when the page holds no such section, which lets a link fall
 * back to ordinary navigation.
 */
export function scrollToSection(id: string): boolean {
  const target = document.getElementById(id);
  if (!target) return false;

  // Next frame: a sidebar link scrolls while its drawer is still closing, and an
  // open drawer locks the page and stops Lenis (lib/use-dialog.ts,
  // components/ui/SmoothScroll.tsx). Measuring and scrolling a frame later means
  // the lock is already released and the scroll actually runs.
  requestAnimationFrame(() => {
    const { top, height } = target.getBoundingClientRect();
    const documentTop = top + window.scrollY;
    // Air above and below the section once it sits centred; negative when the
    // section is taller than the viewport.
    const margin = (window.innerHeight - height) / 2;
    // What a plain anchor jump uses: the element's own scroll-margin-top, which
    // app/globals.css sets per section (--section-scroll-offset, falling back to
    // the global --scroll-offset). Reading it back keeps every landing point in
    // the CSS, responsive and per section, with nothing to change here.
    const headerOffset = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;

    // Lenis and the browser both clamp the destination to the scrollable range.
    const destination = margin >= headerOffset ? documentTop - margin : documentTop - headerOffset;
    if (scroller) scroller.scrollTo(destination);
    else window.scrollTo({ top: destination, behavior: "smooth" });
  });

  return true;
}

/** Quiet time after the last wheel event before a snap is considered, in ms. */
const SNAP_DELAY = 150;

/**
 * Settles a section marked `data-scroll-snap` into view: once a downward wheel
 * gesture comes to rest with that section's top edge on screen, the page glides
 * on until the section sits just below the header (its scroll-margin-top, as for
 * scrollToSection). Down only, so scrolling back up past it, or on down from it
 * to the footer, is never pulled back. Wheel only: touch stays native, keyboard
 * and scrollbar are left alone, and nothing moves under reduced motion.
 *
 * Returns the cleanup.
 */
export function attachSectionSnap(lenis: Lenis): () => void {
  let timer: number | undefined;

  const settle = () => {
    if (lenis.prefersReducedMotion) return;

    const resting = lenis.targetScroll;
    for (const section of document.querySelectorAll<HTMLElement>("[data-scroll-snap]")) {
      const headerOffset = Number.parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
      const point = section.getBoundingClientRect().top + window.scrollY - headerOffset;

      if (resting > point - window.innerHeight && resting < point) {
        lenis.scrollTo(point);
        return;
      }
    }
  };

  const onWheel = ({ deltaY, event }: VirtualScrollData) => {
    if (event.type === "touchmove" || event.type === "touchstart") return;
    window.clearTimeout(timer);
    if (deltaY > 0) timer = window.setTimeout(settle, SNAP_DELAY);
  };

  const unsubscribe = lenis.on("virtual-scroll", onWheel);

  return () => {
    window.clearTimeout(timer);
    unsubscribe();
  };
}
