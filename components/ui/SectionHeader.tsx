import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  /** id of the heading, for the section's aria-labelledby. */
  id: string;
  /** Small uppercase label above the title (DESIGN.md → section header). */
  eyebrow?: string;
  title: string;
  /** Short paragraph under the title. */
  intro?: string;
  /** h1 on a page of its own (the catalogue), h2 for a section of the home page. */
  as?: "h1" | "h2";
  className?: string;
};

/**
 * Section header per DESIGN.md: a muted uppercase eyebrow, the large Jost title
 * and an intro held to a comfortable measure. Wrap it in <Reveal> to animate it.
 */
export function SectionHeader({
  id,
  eyebrow,
  title,
  intro,
  as: Heading = "h2",
  className,
}: SectionHeaderProps) {
  return (
    <div className={className}>
      {eyebrow && <p className="label-caps font-medium text-accent">{eyebrow}</p>}
      <Heading id={id} className={cn("heading-section", eyebrow && "mt-4")}>
        {title}
      </Heading>
      {intro && <p className="mt-6 max-w-xl text-accent">{intro}</p>}
    </div>
  );
}
