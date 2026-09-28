import type { ComponentProps } from "react";

// Thin-stroke line icons. Decorative by default: give the parent control an accessible name.

type IconProps = ComponentProps<"svg">;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Two-line menu mark: quieter than a three-bar hamburger. */
export function MenuIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 9h18M3 15h18" />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Icon>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 9l6 6 6-6" />
    </Icon>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15 6l-6 6 6 6" />
    </Icon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 6l6 6-6 6" />
    </Icon>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 12H4M10 6l-6 6 6 6" />
    </Icon>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </Icon>
  );
}

/** Four-point sparkle, for small badges. */
export function SparkleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3c.8 5.2 3.8 8.2 9 9-5.2.8-8.2 3.8-9 9-.8-5.2-3.8-8.2-9-9 5.2-.8 8.2-3.8 9-9z" />
    </Icon>
  );
}

/** External / outbound mark, e.g. next to a link that opens elsewhere. */
export function ArrowUpRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 17L17 7M8 7h9v9" />
    </Icon>
  );
}

// Social marks, drawn in the same thin-stroke style as the icons above so the
// row reads as one set rather than five brand logos.

export function InstagramIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      {/* Round cap on a zero-length path: the lens dot. */}
      <path d="M17.4 6.6h.01" />
    </Icon>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18 2.6h-3a5 5 0 0 0-5 5v2.8H7.2v4H10v8.2h4v-8.2h2.8l1-4H14V7.6a1 1 0 0 1 1-1h3z" />
    </Icon>
  );
}

/** The X wordmark: one diagonal runs through, the other breaks where they cross. */
export function XIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 3.6L20 20.4" />
      <path d="M20 3.6l-5.6 5.9M9.6 14.5L4 20.4" />
    </Icon>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M22.5 7.1a2.8 2.8 0 0 0-1.9-2C18.9 4.6 12 4.6 12 4.6s-6.9 0-8.6.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 12a29 29 0 0 0 .5 4.9 2.8 2.8 0 0 0 1.9 2c1.7.5 8.6.5 8.6.5s6.9 0 8.6-.5a2.8 2.8 0 0 0 1.9-2 29 29 0 0 0 .5-4.9 29 29 0 0 0-.5-4.9z" />
      <path d="M9.9 14.9l5.6-2.9-5.6-2.9z" />
    </Icon>
  );
}

export function TiktokIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20.5 7.9v4a9.9 9.9 0 0 1-5-1.9v4.5a6.5 6.5 0 1 1-8-6.3v4.3a2.5 2.5 0 1 0 4 2V3h4.1a6 6 0 0 0 4.9 4.9z" />
    </Icon>
  );
}

/** Speech bubble with the handset inside, in the same thin stroke as the social marks. */
export function WhatsAppIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 20.5l1.3-4.2a8.6 8.6 0 1 1 3.2 3.1z" />
      <path d="M9.2 8.3c.3-.5.9-.6 1.2-.2l.8 1.3c.2.3.1.7-.2 1l-.4.4a5.6 5.6 0 0 0 2.6 2.6l.4-.4c.3-.3.7-.4 1-.2l1.3.8c.4.3.3.9-.2 1.2a3 3 0 0 1-2.6.4 7.4 7.4 0 0 1-4.3-4.3 3 3 0 0 1 .4-2.6z" />
    </Icon>
  );
}
