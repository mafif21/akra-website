# DESIGN.md — Design System

## Mood
Modern, minimal, monochrome. Clean and confident — furniture speaks through
strong photography and generous whitespace, not color. Editorial and quiet,
letting each product stand out against a neutral canvas.

## Typography
- Heading: 'Jost' (weights 300–700) — geometric, modern sans. Used for headings,
  hero, brand, nav.
- Body: 'Ubuntu' (weights 300,400,500,700) — warm, readable sans. Used for body,
  buttons, labels, forms, captions.
- Accent: 'Instrument Serif' italic, only for a single accent word inside a
  Jost heading (components/ui/AccentText). Never for body or whole headings.
- Load via next/font. Do NOT use Inter/Roboto/Arial.
- Scale: headings large & airy, body 16–18px, generous line-height (1.6+).
  Tokens: body copy is --text-body (17px / 1.65); section titles use the
  `heading-section` utility; small uppercase labels use `label-caps`.

## Color Palette (monochrome)
- --color-bg:      #FFFFFF   /* main background */
- --color-surface: #F2F2F2   /* surface, divider, subtle bg */
- --color-text:    #040404   /* primary text (near-black) */
- --color-muted:   #6B6B6B   /* tertiary text, metadata (AA on bg and surface) */
- --color-line:    #CCCCCC   /* border, disabled */
- --color-primary: #040404   /* primary action (black) */
- --color-accent:  #404040   /* secondary emphasis */

Greys in use: #404040 (secondary), #6B6B6B (tertiary), #CCCCCC (border),
#F2F2F2 (surface). Every small text colour must reach 4.5:1 on bg and surface.

Rule: pure white background, near-black text. No warm tints, no gradients.

Section rhythm (home page, top to bottom): Hero / About on --color-bg, Products
on --color-surface, Custom inverted (`theme-dark`), Slogan on --color-bg, footer
inverted. `theme-dark` (globals.css) re-points the tokens for its subtree: bg
#040404, text #FFFFFF, primary #FFFFFF, accent #CCCCCC, muted #A3A3A3, line
#404040. Sections meet on the color change alone, with no hairline between them.

## Spacing & Layout
- Large, intentional whitespace. Big vertical section padding (100–160px).
- Asymmetric layout: text & image not always 50/50, overlap is welcome.
- Base 12-column grid, but go off-grid confidently for hero & showcase.
- Thin (1px) --color-line borders as dividers, not heavy shadows.
- Rhythm tokens: py-section between sections, gap/mt-stack between a section's
  header and its content, mt-6 from a heading to its intro. Everything else
  stays on Tailwind's 4px scale.
- Tap targets are at least 44px: size-11 for icon links, `hit-area` for
  small inline text links.

## Imagery
- Strong, clean product photography — this carries the design in monochrome.
- Neutral backgrounds, good lighting. Photos do the emotional work.
- Image corners: small radius (--radius, 3px) for product photography;
  --radius-soft (16px) only for editorial collages such as About.

## Motion (Framer Motion)
- Smooth & slow. Fade + slide-up on scroll (reveal).
- Duration 0.6–0.8s, gentle easing (easeOut).
- Hover: subtle scale (1.02) or animated underline, not bounce.
- Respect prefers-reduced-motion.

## Consistent Components
- Button: solid --color-primary (black) or thin outline, small radius, small
  uppercase + letter-spacing.
- Section header: small eyebrow (uppercase, muted) + large Jost heading.
  Use components/ui/SectionHeader.
- Badge (components/ui/Badge): pill with a hairline border and optional icon,
  above a heading.
- Pill CTA: buttonStyles({ shape: "pill" }), for a standalone call to action.
- Image tile (components/ui/ImageTile): photo filling a small-radius tile, with
  a short label on a solid white tag in the lower-left corner.
