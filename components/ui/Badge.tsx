import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeProps = {
  /** Optional leading icon, e.g. <SparkleIcon className="size-4" />. */
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** Small pill note above a heading: a hairline outline, no fill. */
export function Badge({ icon, className, children }: BadgeProps) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-accent",
        className,
      )}
    >
      {icon}
      {children}
    </p>
  );
}
