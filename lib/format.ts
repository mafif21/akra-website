/** Two-digit, 1-based position label for numbered lists: 0 → "01", 9 → "10". */
export function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}
