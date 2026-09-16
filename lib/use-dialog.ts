import { useEffect, useEffectEvent, type RefObject } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => element.getClientRects().length > 0,
  );
}

/**
 * Shared behaviour for modal layers (Modal, Drawer) while `open` is true:
 * - closes on Escape
 * - traps Tab / Shift+Tab focus inside `panelRef`
 * - moves focus into the panel (an element with `data-autofocus`, else the panel)
 * - locks page scroll
 * - returns focus to the previously focused element on close
 */
export function useDialog(
  open: boolean,
  onClose: () => void,
  panelRef: RefObject<HTMLElement | null>,
) {
  const handleClose = useEffectEvent(onClose);

  useEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const root = document.documentElement;
    const previousStyle = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
    // Pad by the scrollbar width so content doesn't shift when the scrollbar disappears.
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (scrollbarWidth > 0) root.style.paddingRight = `${scrollbarWidth}px`;

    const initialFocus = panel.querySelector<HTMLElement>("[data-autofocus]") ?? panel;
    initialFocus.focus({ preventScroll: true });

    function onKeyDown(event: KeyboardEvent) {
      if (!panel) return;

      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = getFocusable(panel);
      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const outside = !panel.contains(active);

      if (event.shiftKey && (active === first || active === panel || outside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || outside)) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      root.style.overflow = previousStyle.overflow;
      root.style.paddingRight = previousStyle.paddingRight;
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [open, panelRef]);
}
