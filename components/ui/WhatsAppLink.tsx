import type { ReactNode } from "react";
import { siteConfig } from "@/lib/config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowUpRightIcon, WhatsAppIcon } from "./Icons";

type WhatsAppLinkProps = {
  /** Pre-filled chat message, from wording. */
  message: string;
  /** Full accessible name, e.g. "Contact us on WhatsApp (opens in a new tab)". */
  ariaLabel: string;
  /** The visible label. */
  children: ReactNode;
};

/**
 * Outbound WhatsApp chat link: small uppercase label on a hairline that darkens
 * on hover, with the arrow nudging out toward the new tab it opens.
 */
export function WhatsAppLink({ message, ariaLabel, children }: WhatsAppLinkProps) {
  return (
    <a
      href={buildWhatsAppUrl(siteConfig.whatsappNumber, message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="group hit-area label-caps inline-flex items-center gap-3 border-b border-line pb-1 font-medium text-text transition-colors hover:border-text"
    >
      <WhatsAppIcon className="size-5" />
      {children}
      <ArrowUpRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}
