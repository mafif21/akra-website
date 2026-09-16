"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { slideIn } from "@/lib/motion";
import { Button } from "./Button";
import { DialogLayer } from "./DialogLayer";
import { CloseIcon } from "./Icons";

type DrawerSide = "left" | "right";

const sideVariants = { left: slideIn("left"), right: slideIn("right") };

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  /** Visible heading of the drawer; also its accessible name. */
  title: ReactNode;
  /** Accessible name of the close button, from wording. */
  closeLabel: string;
  side?: DrawerSide;
  className?: string;
  children: ReactNode;
};

/**
 * Side panel that slides in over a backdrop. Closes on Escape, backdrop click,
 * or the close button; focus is trapped while open.
 */
export function Drawer({
  open,
  onClose,
  title,
  closeLabel,
  side = "right",
  className,
  children,
}: DrawerProps) {
  const titleId = useId();

  return (
    <DialogLayer
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      layerClassName={side === "right" ? "justify-end" : "justify-start"}
      panelClassName={cn(
        "flex h-full w-11/12 max-w-md flex-col border-line",
        side === "right" ? "border-l" : "border-r",
        className,
      )}
      panelVariants={sideVariants[side]}
    >
      {/* Same height as the navbar so the close button lines up with the menu button. */}
      <div className="flex h-header shrink-0 items-center justify-between gap-4 border-b border-line pr-2 pl-gutter md:pr-4">
        <h2 id={titleId} className="font-body text-xs font-medium tracking-widest text-muted uppercase">
          {title}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label={closeLabel}>
          <CloseIcon className="size-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">{children}</div>
    </DialogLayer>
  );
}
