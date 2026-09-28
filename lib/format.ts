/** Two-digit, 1-based position label for numbered lists: 0 → "01", 9 → "10". */
export function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export type TextSegment = {
  text: string;
  /** Position among the highlighted phrases, or null for the text between them. */
  phrase: number | null;
};

/**
 * Splits a sentence around the given phrases, keeping everything in order:
 * splitHighlights("a big cat", ["big"]) → [a ][big][ cat].
 *
 * Each phrase is matched once, after the previous one, so repeated words stay
 * put. A phrase that is not in the sentence (a locale whose wording was
 * reworded) is skipped rather than throwing.
 */
export function splitHighlights(text: string, phrases: readonly string[]): TextSegment[] {
  const segments: TextSegment[] = [];
  let cursor = 0;
  let found = 0;

  for (const phrase of phrases) {
    const start = text.indexOf(phrase, cursor);
    if (start === -1) continue;

    if (start > cursor) segments.push({ text: text.slice(cursor, start), phrase: null });
    segments.push({ text: phrase, phrase: found });
    cursor = start + phrase.length;
    found += 1;
  }

  if (cursor < text.length) segments.push({ text: text.slice(cursor), phrase: null });
  return segments;
}
