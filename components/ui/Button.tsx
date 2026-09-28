import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "icon" | "icon-lg";
type ButtonShape = "default" | "pill";

type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** "pill" rounds the ends fully, for a standalone call to action. */
  shape?: ButtonShape;
  className?: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  solid: "bg-primary text-bg hover:bg-accent",
  outline: "border border-text text-text hover:bg-text hover:text-bg",
  ghost: "text-text hover:text-accent",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-11 px-3 sm:px-5",
  md: "h-12 px-7",
  icon: "size-11",
  "icon-lg": "size-14",
};

const shapeClasses: Record<ButtonShape, string> = {
  default: "rounded",
  pill: "rounded-full",
};

/**
 * Button classes per DESIGN.md: solid primary (black) or thin outline, small radius,
 * small uppercase label with letter-spacing. Use it to style links as buttons.
 */
export function buttonStyles({
  variant = "solid",
  size = "md",
  shape = "default",
  className,
}: ButtonStyleOptions = {}) {
  return cn(
    "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2.5 whitespace-nowrap",
    "label-caps font-medium",
    "transition-colors disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    shapeClasses[shape],
    className,
  );
}

type ButtonProps = ComponentProps<"button"> & Omit<ButtonStyleOptions, "className">;

export function Button({ variant, size, shape, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles({ variant, size, shape, className })} {...props} />;
}
