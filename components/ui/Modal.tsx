"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { fadeUp } from "@/lib/motion";
import { Button } from "./Button";
import { DialogLayer } from "./DialogLayer";
import { CloseIcon } from "./Icons";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Small uppercase label above the title (DESIGN.md section header style). */
  eyebrow?: ReactNode;
  description?: ReactNode;
  /** Accessible name of the close button, from wording. */
  closeLabel: string;
  className?: string;
  children: ReactNode;
};

/**
 * Centered dialog (bottom-aligned on small screens). Closes on Escape, backdrop
 * click, or the close button; focus is trapped while open. Put `data-autofocus`
 * on an element inside to focus it first.
 */
export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  description,
  closeLabel,
  className,
  children,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <DialogLayer
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      describedBy={description ? descriptionId : undefined}
      layerClassName="items-end justify-center p-3 sm:items-center sm:p-6"
      panelClassName={cn(
        "flex max-h-full w-full max-w-xl flex-col rounded border border-line",
        className,
      )}
      panelVariants={fadeUp}
    >
      <div className="flex items-center justify-between gap-4 pt-2 pr-2 pl-6 sm:pl-10">
        {eyebrow ? (
          <p className="text-xs tracking-widest text-muted uppercase">{eyebrow}</p>
        ) : (
          <span />
        )}
        <Button variant="ghost" size="icon" onClick={onClose} aria-label={closeLabel}>
          <CloseIcon className="size-5" />
        </Button>
      </div>

      <div className="overflow-y-auto px-6 pb-8 sm:px-10 sm:pb-10">
        <h2 id={titleId} className="text-3xl text-balance sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p id={descriptionId} className="mt-4 text-muted">
            {description}
          </p>
        )}
        <div className="mt-8">{children}</div>
      </div>
    </DialogLayer>
  );
}
