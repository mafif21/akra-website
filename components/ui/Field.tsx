import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ChevronDownIcon } from "./Icons";

type FieldProps = {
  label: ReactNode;
  htmlFor: string;
  /** Shown next to the label for optional fields, e.g. "Optional". */
  optionalLabel?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** Label + form control pair. */
export function Field({ label, htmlFor, optionalLabel, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-baseline justify-between gap-3 text-xs font-medium tracking-widest text-text uppercase"
      >
        {label}
        {optionalLabel && (
          <span className="text-xs font-normal tracking-normal text-muted normal-case">
            {optionalLabel}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

const controlClasses = cn(
  "w-full rounded border border-line bg-bg px-4 py-3 text-base text-text",
  "placeholder:text-muted transition-colors duration-500 ease-soft",
  "hover:border-muted focus:border-primary focus-visible:outline-1 focus-visible:outline-offset-0",
);

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(controlClasses, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(controlClasses, "resize-y", className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          controlClasses,
          "cursor-pointer appearance-none pr-11 unselected:text-muted *:text-text",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted" />
    </div>
  );
}
