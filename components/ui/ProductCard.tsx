import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Destination = {
  /** ISO 3166-1 alpha-2 code, shown on the card. */
  code: string;
  /** Full country name, for screen readers. */
  name: string;
};

type ProductCardProps = {
  /** Makes the whole card a link; without it the card is static. */
  href?: string;
  name: string;
  /** Descriptive alt text for the product photo. */
  alt: string;
  /** Furniture type, set small above the name. */
  category?: string;
  /** Lead-in for the destinations, e.g. "Shipped to", or the whole note when there are none. Omit to leave the line out. */
  shippedTo?: string;
  /** Markets the piece has shipped to; empty for worldwide pieces. */
  destinations?: readonly Destination[];
  image: StaticImageData;
  /** Rendered widths of the image, to keep next/image from over-fetching. */
  sizes: string;
  /** Photo shape: tall for a slider, wide so a grid shows more rows at once. */
  ratio?: "portrait" | "landscape";
};

/**
 * One product: photo, then name and details under a hairline. No box around the
 * whole card: the photo and the text are two separate blocks. Sharp-cornered and
 * quiet per DESIGN.md. As a link the whole card is one tab stop.
 */
export function ProductCard({
  href,
  name,
  alt,
  category,
  shippedTo,
  destinations = [],
  image,
  sizes,
  ratio = "portrait",
}: ProductCardProps) {
  const linked = Boolean(href);

  const body: ReactNode = (
    <>
      <div
        className={cn(
          "relative overflow-hidden rounded bg-surface",
          ratio === "portrait" ? "aspect-4/5" : "aspect-4/3",
        )}
      >
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          placeholder="blur"
          className={cn(
            "object-cover",
            linked && "transition-transform duration-700 group-hover:scale-102",
          )}
        />
      </div>

      <div className="mt-5 border-t border-line pt-4">
        {category && (
          <p className="label-caps mb-1 text-accent">{category}</p>
        )}
        <h3 className="font-heading text-xl font-light">
          <span className={cn(linked && "link-underline")}>{name}</span>
        </h3>
        {shippedTo && (
          <p className="label-caps mt-2 text-muted">
            {shippedTo}
            {destinations.length > 0 && (
              <>
                {/* Codes read as letters, so screen readers get the country names instead. */}
                <span aria-hidden="true"> {destinations.map((it) => it.code).join(" · ")}</span>
                <span className="sr-only"> {destinations.map((it) => it.name).join(", ")}</span>
              </>
            )}
          </p>
        )}
      </div>
    </>
  );

  // `relative` keeps absolutely positioned children (the sr-only span above)
  // inside the card, so a slider's overflow clips them instead of the page
  // growing sideways to fit them.
  if (href) {
    return (
      <Link href={href} className="group relative block">
        {body}
      </Link>
    );
  }

  return <div className="relative">{body}</div>;
}
