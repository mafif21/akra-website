"use client";

import { AnimatePresence, m, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { overlayFade } from "@/lib/motion";
import { useDialog } from "@/lib/use-dialog";

type DialogLayerProps = {
  open: boolean;
  onClose: () => void;
  /** id of the element that names the dialog (usually its heading). */
  labelledBy: string;
  describedBy?: string;
  /** Positions the panel inside the full-screen layer. */
  layerClassName?: string;
  panelClassName?: string;
  panelVariants: Variants;
  children: ReactNode;
};

/**
 * Shared base for Modal and Drawer: portal, backdrop, animated panel with
 * dialog semantics, plus Escape / focus trap / scroll lock via useDialog.
 */
export function DialogLayer({
  open,
  onClose,
  labelledBy,
  describedBy,
  layerClassName,
  panelClassName,
  panelVariants,
  children,
}: DialogLayerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useDialog(open, onClose, panelRef);

  return (
    <AnimatePresence>
      {open && (
        <Portal key="dialog-layer">
          <div className={cn("fixed inset-0 z-50 flex", layerClassName)}>
            <m.div
              className="absolute inset-0 bg-text/40"
              variants={overlayFade}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={onClose}
              aria-hidden="true"
            />
            <m.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={labelledBy}
              aria-describedby={describedBy}
              tabIndex={-1}
              className={cn("relative bg-surface outline-none", panelClassName)}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {children}
            </m.div>
          </div>
        </Portal>
      )}
    </AnimatePresence>
  );
}

// Only rendered while open, which only happens after a client interaction,
// so `document` is always available here.
function Portal({ children }: { children: ReactNode }) {
  return createPortal(children, document.body);
}
