"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";
import { reveal, revealUp } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Extra delay in seconds, to stagger neighbouring reveals. */
  delay?: number;
  /** Set when something needs to reference the revealed block, e.g. aria-controls. */
  id?: string;
};

/**
 * Fades and slides its children up once they scroll into view (DESIGN.md → Motion).
 * Lets Server Components use scroll reveals without becoming client components.
 */
export function Reveal({ children, className, delay = 0, id }: RevealProps) {
  return (
    <m.div id={id} className={className} custom={delay} variants={revealUp} {...reveal}>
      {children}
    </m.div>
  );
}
