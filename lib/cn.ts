export type ClassValue =
  | string
  | number
  | false
  | null
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>;

/**
 * Joins class names, skipping falsy values:
 * cn("px-6", isActive && "text-primary", { "opacity-50": disabled })
 *
 * It does not resolve conflicting Tailwind classes ("px-6" + "px-4" keeps both),
 * so components should avoid exposing overridable utilities that collide.
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) classes.push(nested);
    } else {
      for (const [name, enabled] of Object.entries(input)) {
        if (enabled) classes.push(name);
      }
    }
  }

  return classes.join(" ");
}
