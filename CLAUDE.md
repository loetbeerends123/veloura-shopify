# CLAUDE.md — Veloura

Premium D2C Shopify theme for **Veloura**, an anti-cellulite performance-apparel brand positioned
as *clinically engineered, not cosmetic*. Editorial-luxury aesthetic (Rùadh-inspired), not a
fitness look. Six page types: Home, Product (Veloura Cellulite Legging), Cart drawer, Full cart,
Our Story, Contact. Single hero product + Bloom Shorts upsell.

**Full specs live in [Veloura_PRD_v2.md](Veloura_PRD_v2.md) — it is the source of truth.** This
file is a quick reference only; when they conflict, the PRD wins. The Stitch exports under
`stitch_veloura_premium_e_commerce_platform/` are visual mockups (Tailwind CDN, EB Garamond) — use
for layout reference only, NOT as token/markup source.

## Commands

```bash
shopify theme dev          # local dev server + hot reload against the dev store
shopify theme check        # Theme Check linter (run before every push)
shopify theme pull         # pull live settings/templates from the store
shopify theme push         # deploy theme (use --unpublished for a draft)
```

## Architecture

**Brand layer on Shopify Dawn 15.4.1.** Dawn's cart/checkout/product-form/search engine
(`global.js`, `product-form.js`, `cart-drawer.js`, `base.css`) is kept intact; Veloura is layered
on top. Do NOT overwrite Dawn core files beyond the minimal, additive hooks already in place.

- `assets/veloura.css` — design tokens (PRD §2) + all brand component styles. Loaded **after**
  `base.css` in `layout/theme.liquid` so it wins the cascade. Overrides Dawn's `--font-*` vars.
- `assets/veloura.js` — dependency-free interactions (before/after slider, FAQ accordion, bundle
  selector, sticky cart bar, gallery). Cart add/drawer is Dawn's; this only drives bespoke UI.
- `sections/veloura-*.liquid` — all bespoke sections, each with a scoped `{% stylesheet %}` and
  `{% schema %}` (hero, before-after, timeline, bundle, social-proof, product, mechanism, faq,
  reviews, sticky-bar, story-hero, feature-split, philosophy, science, founder-quote, contact,
  cart-upsell).
- `snippets/veloura-*.liquid` — `veloura-icon`, `veloura-before-after`, `veloura-bundle-tiers`.
- `templates/*.json` repointed to Veloura sections: `index`, `product`, `cart` (Dawn cart sections
  + `veloura-cart-upsell`), `page.our-story`, `page.contact`.
- Additive Dawn edits: `layout/theme.liquid` (Google Fonts + `veloura.css`/`veloura.js`),
  `snippets/cart-drawer.liquid` ("Your Selection" title + "Complete Your Protocol" upsell),
  `config/settings_*` (Veloura palette + `veloura_upsell_product` setting), `locales/en.default.json`
  (cart title → "Your Protocol").

**Cart pricing is enforced server-side, not in theme** (PRD §10.1): the bundle UI sets quantity and
shows pricing, but `BOGO-VELO` (2nd 100% off) and `3PACK-VELO` (fixed £65) must be created as
**automatic discounts** in Admin (or a bundle app / Shopify Functions). Bloom Shorts +£24.99 additive.

## File naming

- Bespoke sections/snippets: `veloura-` prefix, kebab-case `.liquid` (`veloura-before-after.liquid`).
- Assets: `veloura.css` / `veloura.js` for the brand layer; section-specific CSS lives in each
  section's `{% stylesheet %}` block.
- One section = one concern; share UI via `veloura-*` snippets, never copy-paste markup.
- All brand classes use the `v-` prefix (`.v-btn`, `.v-tier`, `.v-faq__item`); tokens are the
  `--v-*` CSS variables in `veloura.css`. Dawn classes are restyled by selector, not renamed.

## Design tokens (assets/base.css `:root`) — PRD §2 verbatim

```css
:root {
  /* Color */
  --color-canvas: #FAF6F4;            --color-canvas-secondary: #F5EDE8;
  --color-canvas-dark: #2B1E17;       --color-text-primary: #1C1009;
  --color-text-muted: #8A7060;        --color-accent-rust: #A65B45;
  --color-accent-rust-light: #C97A5A; --color-cta-green: #3A7D44;
  --color-cta-green-hover: #2E6435;   --color-badge-popular: #8B1A1A;
  --color-badge-value: #8A7060;       --color-border: rgba(28,16,9,0.08);
  --color-star: #C97A5A;
  /* Spacing / layout */
  --space-xs:8px; --space-sm:16px; --space-md:32px; --space-lg:64px;
  --space-xl:96px; --space-2xl:128px;
  --max-width:1200px; --max-width-narrow:800px;
  /* Radius / elevation */
  --radius-sm:4px; --radius-md:8px; --radius-lg:40px;
  --shadow-card:0 2px 12px rgba(28,16,9,0.06);
  --shadow-sticky:0 -4px 24px rgba(28,16,9,0.08);
}
```

- **Type (current, supersedes PRD §2):** **Playfair Display** (serif headings) + **Inter**
  (body) — user-approved readability swap on 2026-06-11, replacing the PRD's Cormorant + DM Sans.
  Google Fonts in `layout/theme.liquid`: Playfair Display 400–800 (+italics), Inter 400/500/600/700.
  Tokens live in `--v-font-display` / `--v-font-body` (`assets/veloura.css`).
- **Readability & emphasis (current):** body reading copy darkened (`--v-muted` is now `#5F4A3B`,
  not the PRD `#8A7060`) for contrast; base `.v-body` is 1.125rem. Important phrases are wrapped
  in inline `<strong>` in section copy / `*.json` template settings — CSS renders
  `p strong, li strong, .v-em` as **bold + rust** (Font.png look). Liquid does not escape
  `{{ setting }}`, so `<strong>` in settings renders as markup.
- **Urgency cues (current):** stronger conversion push — hero `.v-urgency` (scarcity, red),
  PDP scarcity + `.v-guarantee` (60-day money-back), cart-upsell reassurance line. Classes
  `.v-urgency` / `.v-guarantee` in `veloura.css`; uses `--v-scarcity` / `--v-green`.
- **Breakpoints:** mobile <640, tablet 640–1023, desktop ≥1024.
- **Palette rule:** no yellow/orange/bright anywhere. Green = primary CTAs only; rust = accents
  (now also used for bold inline emphasis on body copy).

## Key JS behaviors (PRD §10, §12)

- **Cart drawer** — slides from right (350ms ease-out; overlay fade to 0.4). Opens on any
  add-to-cart / ADD TO ORDER. Mobile: full-screen from bottom. Ajax Cart API.
- **Before/After slider** — touch-friendly drag handle, default 50%; one-time hint animation
  50→30→50% over 1.5s on load. CSS clip-path or vanilla JS.
- **FAQ accordion** — single-open; `max-height` 200ms ease-out; `+` rotates 45°→`×`.
- **Bundle tier reveal** — selecting Tier 2 slide-downs the per-pair colour/size dropdowns
  (max-height + opacity, 300ms).
- **Sticky cart bar (product page)** — hidden by default; IntersectionObserver on the in-page ATC
  button toggles it (slide-up 300ms in / 200ms out).
- **Upsell state** — Bloom Shorts add/remove syncs both drawer & cart-page blocks: button → `✓
  ADDED`; if already in cart, hide CTA / show added confirmation; revert on removal.
- **Gallery thumbnails** — crossfade main image (150ms). **Add-to-cart** flashes `ADDED ✓` 1.5s.

## Voice (PRD §14)

Clinical but warm, never aggressive. First-person plural; address past frustration; clinical
vocab (lymphatic drainage, micro-circulation). No "cure/eliminate/permanent" — use
reduce/improve/transform. Recurring phrases: *VELO-LYMPH™*, *clinical micro-compression*,
*structural change*, *your protocol*, *treat the cause, not the symptom*.
