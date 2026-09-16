import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { getTranslator } from "@/lib/i18n/server";
import { staggerStep } from "@/lib/motion";
import lifestylePhoto from "@/public/images/about/lifestyle.jpeg";
import showcasePhoto from "@/public/images/about/showcase.jpeg";
import Image, { type StaticImageData } from "next/image";

export async function About() {
  const t = await getTranslator();

  return (
    <section id="about" aria-labelledby="about-title" className="px-gutter py-18">
      <div className="mx-auto grid max-w-7xl gap-y-block lg:grid-cols-12 lg:items-stretch lg:gap-x-12 lg:gap-y-0">
        {/* Row 1, left: heading only */}
        <Reveal className="lg:col-span-7 lg:row-start-1">
          <h2
            id="about-title"
            className="text-5xl font-light tracking-tight uppercase sm:text-6xl lg:text-5xl"
          >
            {t("about.title")}
          </h2>
        </Reveal>

        {/* Row 2, left: story + product showcase */}
        <div className="lg:col-span-6 lg:col-start-1 lg:row-start-2 mt-6">
          <Reveal delay={staggerStep}>
            <p className="text-md leading-relaxed text-muted">{t("about.description")}</p>
          </Reveal>
          <Reveal className="lg:mt-8">
            <AboutImage
              src={showcasePhoto}
              alt={t("about.showcaseAlt")}
              className="aspect-4/5 w-3/4 ml-auto lg:ml-0"
              sizes="(min-width: 80rem) 24rem, (min-width: 64rem) 27vw, 75vw"
            />
          </Reveal>
        </div>

        {/* Row 2, right: lifestyle image (top-aligned to story) + purpose (bottom-aligned) */}
        <Reveal className="flex flex-col lg:col-span-5 lg:col-start-8 lg:row-start-2">
          <AboutImage
            src={lifestylePhoto}
            alt={t("about.photoAlt")}
            className="aspect-4/3"
            sizes="(min-width: 80rem) 32rem, (min-width: 64rem) 36vw, 100vw"
          />
          <div className="flex-1" aria-hidden />
          <p className="mt-12 font-heading text-lg leading-snug font-light text-pretty">
            {t("about.purpose")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

type AboutImageProps = {
  src: StaticImageData;
  alt: string;
  className: string;
  sizes: string;
};

function AboutImage({ src, alt, className, sizes }: AboutImageProps) {
  return (
    <div className={cn("relative overflow-hidden rounded bg-surface", className)}>
      <Image src={src} alt={alt} fill sizes={sizes} placeholder="blur" className="object-cover" />
    </div>
  );
}
