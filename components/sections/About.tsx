import type { StaticImageData } from "next/image";
import { AccentText } from "@/components/ui/AccentText";
import { Badge } from "@/components/ui/Badge";
import { buttonStyles } from "@/components/ui/Button";
import { SparkleIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { ImageTile } from "@/components/ui/ImageTile";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/config";
import type { Wording } from "@/lib/i18n";
import { getLocaleWording } from "@/lib/i18n/server";
import { staggerStep } from "@/lib/motion";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import sideboardPhoto from "@/public/images/hero/cafe-chair.jpg";
import stoolsPhoto from "@/public/images/hero/lounge-chair.jpg";
import shelvingPhoto from "@/public/images/hero/sideboard.jpg";

type CollageKey = keyof Wording["about"]["images"];

/**
 * The collage, in order: one wide photo on top, two below it.
 * Placeholders: swap for your own photography and update the alt text in wording.
 */
const collage: Record<CollageKey, StaticImageData> = {
  wide: sideboardPhoto,
  left: stoolsPhoto,
  right: shelvingPhoto,
};

/** Widths the photos render at: the image column is 55% of the row from lg. */
const WIDE_SIZES = "(min-width: 80rem) 40rem, (min-width: 64rem) 55vw, 100vw";
const HALF_SIZES = "(min-width: 80rem) 20rem, (min-width: 64rem) 28vw, 50vw";

/**
 * About: text on the left (badge, heading with one accent word, a short
 * paragraph and a consultation button), a three-photo collage on the right.
 * On a phone the collage follows the text and the button runs full width.
 */
export async function About() {
  const { about } = await getLocaleWording();

  return (
    <section id="about" aria-labelledby="about-title" className="bg-bg px-gutter py-section">
      <div className="mx-auto grid max-w-7xl gap-y-stack lg:grid-cols-split lg:items-center lg:gap-x-12">
        <Reveal>
          <Badge icon={<SparkleIcon className="size-4" />}>{about.badge}</Badge>

          <h2
            id="about-title"
            className="mt-6 font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
          >
            <AccentText text={about.title} phrases={[about.titleAccent]} />
          </h2>

          <p className="mt-6 max-w-md text-accent">{about.intro}</p>

          <div className="mt-10">
            <a
              href={buildWhatsAppUrl(siteConfig.whatsappNumber, about.cta.message)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={about.cta.ariaLabel}
              className={buttonStyles({ shape: "pill", className: "w-full sm:w-auto" })}
            >
              <WhatsAppIcon className="size-5" />
              {about.cta.label}
            </a>
          </div>
        </Reveal>

        <Reveal className="grid grid-cols-2 gap-4" delay={staggerStep}>
          <ImageTile
            image={collage.wide}
            alt={about.images.wide.alt}
            sizes={WIDE_SIZES}
            corners="soft"
            className="col-span-2 aspect-video"
          />
          <ImageTile
            image={collage.left}
            alt={about.images.left.alt}
            sizes={HALF_SIZES}
            corners="soft"
            className="aspect-4/3"
          />
          <ImageTile
            image={collage.right}
            alt={about.images.right.alt}
            sizes={HALF_SIZES}
            corners="soft"
            className="aspect-4/3"
          />
        </Reveal>
      </div>
    </section>
  );
}
