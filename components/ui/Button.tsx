import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "icon";

type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  solid: "bg-primary text-bg hover:bg-text",
  outline: "border border-text text-text hover:bg-text hover:text-bg",
  ghost: "text-text hover:text-primary",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-3 sm:px-5",
  md: "h-12 px-7",
  icon: "size-11",
};

/**
 * Button classes per DESIGN.md: thin outline or solid primary, small radius,
 * small uppercase label with letter-spacing. Use it to style links as buttons.
 */
export function buttonStyles({ variant = "solid", size = "md", className }: ButtonStyleOptions = {}) {
  return cn(
    "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded whitespace-nowrap",
    "text-xs font-medium tracking-widest uppercase",
    "transition-colors duration-500 ease-soft disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

type ButtonProps = ComponentProps<"button"> & Omit<ButtonStyleOptions, "className">;

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}
