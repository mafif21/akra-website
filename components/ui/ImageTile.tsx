import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/cn";

type ImageTileProps = {
  image: StaticImageData;
  /** Descriptive alt text for the photo, from wording. */
  alt: string;
  /** Short caption on the corner tag, e.g. "Wood grain". Omit for a bare photo. */
  label?: string;
  /** Rendered widths of the image, to keep next/image from over-fetching. */
  sizes: string;
  /** "sharp" (3px, product photography) or "soft" (16px, editorial collages). */
  corners?: "sharp" | "soft";
  /** Shape and grid placement of the tile, e.g. "aspect-4/5" or "md:row-span-2". */
  className?: string;
  /**
   * Framing of the photo inside the tile, e.g. "object-top", or
   * "origin-bottom-left scale-150" to crop in on one detail of a wider shot.
   */
  imageClassName?: string;
};

/**
 * A photo that fills its tile edge to edge. Given a label, it is captioned by a
 * small solid tag in the lower-left corner, so the label stays legible over any
 * photo; on a narrow phone tile the tag wraps instead of running past the edge.
 */
export function ImageTile({
  image,
  alt,
  label,
  sizes,
  corners = "sharp",
  className,
  imageClassName,
}: ImageTileProps) {
  return (
    <figure
      className={cn(
        "relative overflow-hidden bg-surface",
        corners === "soft" ? "rounded-soft" : "rounded",
        className,
      )}
    >
      <Image
        src={image}
        alt={alt}
        fill
        sizes={sizes}
        placeholder="blur"
        className={cn("object-cover", imageClassName)}
      />
      {label && (
        <figcaption className="absolute inset-x-2 bottom-2 md:inset-x-3 md:bottom-3">
          <span className="label-caps inline-block rounded bg-bg px-2 py-1 font-medium text-text md:px-3 md:py-2">
            {label}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
