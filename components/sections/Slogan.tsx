import { Reveal } from "@/components/ui/Reveal";
import { ScrollUnderlineText } from "@/components/ui/ScrollUnderlineText";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { getLocaleWording } from "@/lib/i18n/server";
import { staggerStep } from "@/lib/motion";

/**
 * The closing statement: the left half of the grid stays empty and the slogan
 * sits in the right, with the social links under it (DESIGN.md → asymmetric
 * layout, large intentional whitespace). No visible heading — the statement is
 * the focal point. It is the white band between the dark Custom section and the
 * dark footer, so the colour change frames it and no hairline is needed. It is
 * at least a screen tall with the statement centred, so it settles on its own,
 * and scrolling down into it glides it into place under the header
 * (data-scroll-snap, lib/scroll.ts; its scroll-margin, the header height, is where it comes to rest).
 */
export async function Slogan() {
  const { slogan, social } = await getLocaleWording();

  return (
    <section
      aria-labelledby="slogan-title"
      data-scroll-snap
      className="flex min-h-screen scroll-mt-(--header-height) items-center bg-bg px-gutter py-section"
    >
      {/* Names the section for assistive tech without putting a title on screen. */}
      <h2 id="slogan-title" className="sr-only">
        {slogan.title}
      </h2>

      <div className="mx-auto w-full max-w-7xl lg:grid lg:grid-cols-12">
        {/* Columns 1–4 are deliberately left empty from lg up; below that the
            whitespace collapses and the statement runs full width. */}
        <div className="lg:col-span-8 lg:col-start-5">
          <ScrollUnderlineText
            text={slogan.statement}
            phrases={slogan.highlights}
            className="font-heading text-3xl leading-snug font-light text-pretty sm:text-4xl lg:text-5xl"
          />

          <Reveal className="mt-stack" delay={staggerStep}>
            <SocialLinks label={social.label} labels={social.links} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
