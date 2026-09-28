import { Fragment } from "react";
import { splitHighlights } from "@/lib/format";

type AccentTextProps = {
  /** The full line, from wording. */
  text: string;
  /** Words or phrases inside `text`, in order, to set in the accent face. */
  phrases: readonly string[];
};

/**
 * A line with one word (or phrase) set in the italic serif accent face, e.g.
 * inside a heading: <h2><AccentText text={title} phrases={[accent]} /></h2>.
 * A phrase missing from the text (reworded in another locale) is skipped.
 */
export function AccentText({ text, phrases }: AccentTextProps) {
  return splitHighlights(text, phrases).map((segment, index) =>
    segment.phrase === null ? (
      <Fragment key={index}>{segment.text}</Fragment>
    ) : (
      <em key={index} className="font-accent font-normal">
        {segment.text}
      </em>
    ),
  );
}
