## Mood
Warm, natural, editorial-craft. Evokes wood, linen fabric, warm light.
Reference feel: premium furniture brands (e.g. Fritz Hansen, Karimoku, Herman Miller — the warm side of them).

## Typography
- Heading: [Fraunces / Instrument Serif ← REPLACE]
- Body: [Satoshi / General Sans ← REPLACE]
- Self-host fonts in public/fonts/. DO NOT use Inter/Roboto.
- Scale: headings large & airy, body 16–18px, generous line-height (1.6+).

## Color Palette ← REPLACE hex to match brand
- --color-bg:        #F5F1EA   /* warm cream/paper */
- --color-surface:   #FBF8F3   /* alternate section */
- --color-text:      #2A2521   /* deep brown, not pure black */
- --color-muted:     #6B5F52   /* secondary text */
- --color-primary:   #8A5A3B   /* wood/terracotta accent */
- --color-accent:    #4A5D43   /* olive green (optional) */
- --color-line:      #E0D8CC   /* subtle border */

Rule: warm background (cream), NOT pure white & NOT cold gray.

## Spacing & Layout
- Large, intentional whitespace. Big vertical section padding (100–160px).
- Asymmetric layout: text & image not always 50/50, overlap is welcome.
- Base 12-column grid, but go off-grid confidently for hero & showcase.
- Thin (1px) --color-line borders as dividers, not heavy shadows.

## Imagery
- Product photos in natural light, neutral backgrounds.
- Subtle grain/noise allowed for a "printed" texture.
- Image corners: sharp or small radius (2–4px), not large rounded.

## Motion (Framer Motion)
- Smooth & slow. Fade + slide-up on scroll (reveal).
- Duration 0.6–0.8s, gentle easing (easeOut).
- Hover: subtle scale (1.02) or animated underline, not bounce.
- Avoid busy, colliding animations.

## Consistent Components
- Button: thin outline or solid --color-primary, small radius, small uppercase + letter-spacing.
- Section header: small eyebrow (uppercase, muted) + large serif heading.
