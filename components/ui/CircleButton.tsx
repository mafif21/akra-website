import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/cn";

type CircleButtonProps = {
  /** Accessible name (the button only shows an icon), from wording. */
  label: string;
  /** Renders a link when set, otherwise a button. */
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  className?: string;
  /** The icon, e.g. <ChevronRightIcon className="size-5" />. */
  children: ReactNode;
};

/** Round icon control on a light surface, for use over images. */
export function CircleButton({ label, href, onClick, className, children }: CircleButtonProps) {
  const classes = cn(
    "group/circle inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface text-text md:size-12",
    "transition hover:scale-102 hover:bg-bg",
    className,
  );
  const icon = (
    <span className="transition-transform group-hover/circle:translate-x-0.5">
      {children}
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label={label} onClick={onClick} className={classes}>
        {icon}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} onClick={onClick} className={classes}>
      {icon}
    </button>
  );
}
