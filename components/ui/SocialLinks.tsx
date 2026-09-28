import type { ComponentType, SVGProps } from "react";
import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/ui/Icons";
import { cn } from "@/lib/cn";
import { socialLinks } from "@/lib/config";
import type { Wording } from "@/lib/i18n";

type SocialWording = Wording["social"];

const icons: Record<keyof SocialWording["links"], ComponentType<SVGProps<SVGSVGElement>>> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  x: XIcon,
  youtube: YoutubeIcon,
  tiktok: TiktokIcon,
};

type SocialLinksProps = {
  /** Names the row itself, from wording `social.label`. */
  label: string;
  /** Accessible name per profile, from wording `social.links`. */
  labels: SocialWording["links"];
  className?: string;
};

/**
 * Row of social profile links: URLs live in lib/config.ts, names in wording.
 * The icons carry no text, so every link is named by its aria-label. Each icon
 * sits in a 44px tap target; the negative margin keeps the outer glyphs flush
 * with the column edges.
 */
export function SocialLinks({ label, labels, className }: SocialLinksProps) {
  return (
    <ul aria-label={label} className={cn("-mx-3 flex items-center gap-1", className)}>
      {socialLinks.map(({ key, href }) => {
        const Icon = icons[key];

        return (
          <li key={key}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={labels[key]}
              className="inline-flex size-11 items-center justify-center text-muted transition-colors hover:text-text"
            >
              <Icon className="size-5" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
