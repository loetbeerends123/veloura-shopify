# Veloura — Shopify Theme

Premium D2C storefront for **Veloura**, an anti-cellulite performance-apparel brand positioned as
*clinically engineered, not cosmetic*. Built as a brand layer on top of **Shopify Dawn 15.4.1**.

Full product spec: [`Veloura_PRD_v2.md`](Veloura_PRD_v2.md) (source of truth).
Quick technical reference: [`CLAUDE.md`](CLAUDE.md).

## What's in here

This is a complete Shopify theme. The Veloura work is a **layer on Dawn** — Dawn's cart, checkout,
product-form and search engine are kept intact; the bespoke design lives in:

- **`assets/veloura.css`** — design tokens (PRD §2) + all component styles. Loaded after Dawn's
  `base.css` in `layout/theme.liquid`.
- **`assets/veloura.js`** — dependency-free interactions: before/after slider, FAQ accordion,
  bundle selector, sticky cart bar, product gallery.
- **`sections/veloura-*.liquid`** — bespoke sections (hero, before-after, timeline, bundle,
  social-proof, product buy box, mechanism, faq, reviews, sticky-bar, story-hero, feature-split,
  philosophy, science, founder-quote, contact, cart-upsell).
- **`snippets/veloura-*.liquid`** — `veloura-icon`, `veloura-before-after`, `veloura-bundle-tiers`.
- **Templates** repointed to Veloura sections: `templates/index.json`, `product.json`, `cart.json`,
  `page.our-story.json`, `page.contact.json`.
- Light, additive edits to `layout/theme.liquid` (fonts + CSS/JS hooks) and
  `snippets/cart-drawer.liquid` ("Your Selection" title + "Complete Your Protocol" upsell).

Fonts: Cormorant Garamond + DM Sans, loaded via Google Fonts in `theme.liquid`.

## Preview / install (requires a Shopify store)

A Liquid theme cannot be previewed on GitHub Pages or opened as a static file — it must run on
Shopify. With the [Shopify CLI](https://shopify.dev/docs/themes/tools/cli):

```bash
shopify theme dev      # local preview against a dev store
shopify theme check    # lint (recommended before pushing)
shopify theme push     # upload (use --unpublished for a draft)
```

You can also zip the theme folder and upload it via **Online Store → Themes → Add theme**.

## Store-side setup needed (not in theme files)

These live in the Shopify admin, not in code:

1. **Products** — create *Veloura Cellulite Legging* (handle `veloura-cellulite-legging`) with
   Colour/Size variants and 4–5 images, and *Veloura Bloom Shorts*. Update the product handle in
   `templates/index.json` if you use a different one.
2. **Pages + templates** — create a page using the **Our Story** template (`page.our-story`) and a
   **Contact** page (`page.contact`).
3. **Navigation** — build the `main-menu` (Home · Veloura Cellulite Legging · Our Story · Contact)
   and footer menus.
4. **Theme settings → Veloura** — set the **Cart upsell product** (Bloom Shorts) so the drawer and
   cart-page upsell render.
5. **Bundle discounts (PRD §10.1)** — the bundle UI sets quantity and shows pricing, but Shopify
   enforces discounts server-side. Create **automatic discounts** in Admin to match:
   `BOGO-VELO` (buy 2 leggings, 2nd 100% off) and `3PACK-VELO` (3 leggings → fixed £65). Consider a
   bundle app or Shopify Functions for strict enforcement.

## Known simplifications

- The **cart page** reuses Dawn's tested cart sections (restyled to the editorial look) with the
  Veloura upsell inserted, rather than a fully custom two-column rebuild — this keeps AJAX
  quantity/remove working.
- The bundle **colour/size dropdowns** are presentational; map them to real variants / line-item
  properties or a bundle app for production.
- Photographic slots fall back to tasteful tonal placeholders until store images are uploaded.

## Credits

Veloura brand layer over Shopify Dawn (© Shopify, MIT). Design per `Veloura_PRD_v2.md`.
