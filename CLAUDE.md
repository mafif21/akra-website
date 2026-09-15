## Project
Landing page for a furniture company focused on the international market (global export).
Key strength: custom furniture — customers can define their own design, materials, and colors.
Serves both retail (single-item) and wholesale (bulk) orders, with worldwide shipping.

Page goals:
- Showcase furniture products with a premium, craftsmanship feel.
- Highlight 3 selling points: custom-made, flexible order size (small–large), worldwide shipping.
- Drive visitors toward contact / catalog request / inquiry.

Target audience: international buyers (importers, interior designers, retailers) + end customers.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS — MUST use tokens from globals.css, NEVER hardcode colors/spacing.
- Framer Motion (animations)
- Lenis (smooth scroll)

## Folder Structure
- app/ — routing & layout
- components/sections/ — 1 section = 1 file
- components/ui/ — reusable components (check first before creating a new one)
- lib/ — helpers & utilities (shared)
- wording/ — translation files (id.json, en.json)

## General Rules
- ALWAYS pull colors, fonts, and spacing from CSS variables in globals.css. No arbitrary values.
- Before creating a new section, you MUST read DESIGN.md.
- 1 section = 1 file in components/sections/.
- Put reusable components in components/ui/. Check if it already exists before creating a new one.
- Helpers/utilities: reuse existing functions in lib/. Do not duplicate logic.

## Internationalization (i18n)
- Languages: English (default) + Indonesian.
- ALL displayed text MUST come from wording files — no hardcoded strings in components.
- Wording: wording/en.json (default) & wording/id.json.
- Keep key structure consistent and identical across both files (e.g. hero.title, hero.subtitle).
- Since the target market is international, English is the primary language.

## SEO & Performance
- Every page has relevant metadata (title, description, og-image).
- Use next/image for images, always provide descriptive alt text.
- Prefer SSG/SSR so content is indexable by Google.
- Keep the bundle light; animations must not slow down load.

## Accessibility
- Sufficient text contrast, alt text on all images, interactive elements keyboard-accessible.
- Use semantic tags (section, header, nav, footer).

## Avoid
- AI-style purple-blue gradients.
- Default fonts (Inter, Roboto, Arial).
- Uniform, all-centered card grids.
- Excessive emoji in the UI.
- Glassmorphism / neon effects that don't fit the furniture theme.
- Hardcoding text, colors, or spacing directly in components.

## Content Principles
- Focus on materials, craftsmanship, and product detail.
- Emphasize custom capability and global export reach.
- Calm, confident copywriting — not hard-selling.
- Professional tone for B2B buyers, but still warm.

## Definition of Done (per section)
- Uses tokens from globals.css (no hardcoded values).
- All text from wording files (en & id complete).
- Responsive (mobile → desktop).
- Alt text & metadata where relevant.
- Matches the design direction in DESIGN.md.
