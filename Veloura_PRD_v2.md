# PRODUCT REQUIREMENT DOCUMENT (PRD) — VERSION 2.0
## Project: Veloura Premium E-Commerce Platform
### Anti-Cellulite Performance Apparel — Full Multi-Page Implementation

**Prepared for:** Design & Frontend Development Team  
**Reference Sites:** try-herbloom.com (content/persuasion structure), ruadh.com (design aesthetic)  
**Visual Mockups:** Provided Google Stitch exports (5 pages)  
**Last Updated:** June 2026

---

## TABLE OF CONTENTS

1. Strategic Overview & Conversion Philosophy
2. Global Design System (Tokens, Typography, Spacing)
3. Global Components (Header, Footer, Sticky Bar)
4. Page 1 — Home
5. Page 2 — Veloura Cellulite Legging (Product Page)
6. Page 3 — Cart Slide-Out / Drawer
7. Page 4 — Full Cart Page
8. Page 5 — Our Story
9. Page 6 — Contact
10. Technical Logic & Cart Rules
11. Responsive Behaviour
12. Interaction & Animation Guidelines
13. Component-Level Specs (Reusable)
14. Copy & Tone Guidelines

---

## 1. STRATEGIC OVERVIEW & CONVERSION PHILOSOPHY

Veloura is a D2C performance apparel brand that positions itself as **clinically engineered**, not cosmetic. The platform has one primary commercial goal: convert first-time visitors who are sceptical and have been disappointed by similar products before.

**The persuasion arc across all pages must follow this sequence:**

1. **Interrupt** — Challenge the customer's prior mental model (cellulite is a circulation problem, not a fat problem).
2. **Educate** — Give a credible, science-backed explanation of *why* other solutions failed.
3. **Demonstrate** — Show real before/after transformations, timeline-based results, and social proof.
4. **Bundle & Convert** — Present the buy decision as a protocol, not a purchase. Multiple tiers reduce friction.
5. **Upsell** — Introduce the Bloom Shorts as a necessary complement, not an optional extra.

This is identical to the content architecture at try-herbloom.com and should be replicated with Veloura brand language throughout.

---

## 2. GLOBAL DESIGN SYSTEM

### 2.1 Design Direction

The design must replicate the **Rùadh aesthetic** (ruadh.com): ultra-minimal, editorial, high-end women's fashion energy with lots of breathing room. **NOT** a typical activewear/fitness brand look. Think editorial luxury magazine meets clinical dermatology.

### 2.2 Color Palette (Exact Values)

| Token Name | Hex | Usage |
|---|---|---|
| `--color-canvas` | `#FAF6F4` | Primary page background across all pages |
| `--color-canvas-secondary` | `#F5EDE8` | Blush tint for section backgrounds, upsell blocks |
| `--color-canvas-dark` | `#2B1E17` | Dark brown for founder quote block bg (Our Story) |
| `--color-text-primary` | `#1C1009` | Body text, product copy, nav links |
| `--color-text-muted` | `#8A7060` | Captions, subtext, muted labels |
| `--color-accent-rust` | `#A65B45` | Timeline step numbers, accent eyebrows, icons, "ADD TO ORDER" links |
| `--color-accent-rust-light` | `#C97A5A` | Hover state for rust elements |
| `--color-cta-green` | `#3A7D44` | ALL primary CTA buttons (Add to Cart, Secure Checkout, Start My Transformation) |
| `--color-cta-green-hover` | `#2E6435` | Hover state for green buttons |
| `--color-badge-popular` | `#8B1A1A` | Dark red for "MOST POPULAR" badge text/background |
| `--color-badge-value` | `#8A7060` | Muted taupe for "BEST VALUE" badge |
| `--color-border` | `rgba(28, 16, 9, 0.08)` | All hairline dividers, card borders |
| `--color-star` | `#C97A5A` | Review star icons (rust/terracotta tone, not yellow) |

> **Critical:** No yellow, orange, or bright colour is used anywhere. The palette is deliberately restrained: off-white, rust, forest green, dark charcoal. This is what distinguishes Veloura from generic activewear brands.

### 2.3 Typography

| Role | Family | Weight | Size (Desktop) | Notes |
|---|---|---|---|---|
| Display Heading (H1) | Cormorant Garamond | 400 (Regular) | 52–72px | Luxury serif. Low letter-spacing (-0.01em). Used for hero headlines only |
| Section Heading (H2) | Cormorant Garamond | 400 (Regular) | 36–44px | Same as above, slightly smaller |
| Sub-heading (H3) | Cormorant Garamond | 700 (Bold) | 22–26px | Bold serif for card titles, block headings |
| Eyebrow / Overline | DM Sans | 500 (Medium) | 10–11px | ALL CAPS, letter-spacing 0.15em. Used above H1s and H2s |
| Body Text | DM Sans | 400 (Regular) | 15–16px | Line-height 1.65. Used for all descriptive copy |
| UI / Button Labels | DM Sans | 500 (Medium) | 13–14px | ALL CAPS, letter-spacing 0.1em. Used for CTAs, nav links |
| Price | DM Sans | 600 (SemiBold) | 18–22px | For product pricing display |
| Caption / Badge | DM Sans | 500 (Medium) | 10–12px | Labels on bundles, review metadata |

**Font Sources (Google Fonts):**
- `Cormorant Garamond` — import weights 400, 400 italic, 700, 700 italic
- `DM Sans` — import weights 400, 500, 600

### 2.4 Spacing & Layout

| Token | Value | Usage |
|---|---|---|
| `--space-xs` | 8px | Internal component padding, icon gap |
| `--space-sm` | 16px | Element gap within a card |
| `--space-md` | 32px | Standard section element spacing |
| `--space-lg` | 64px | Padding top/bottom of sections on desktop |
| `--space-xl` | 96px | Large section top/bottom padding |
| `--space-2xl` | 128px | Hero and anchor section padding |
| `--max-width` | 1200px | Global content container |
| `--max-width-narrow` | 800px | For centered text-only blocks |

**Layout Grid:** 12-column grid, 24px gutters. Two-column product layout uses 55% / 45% split on desktop.

### 2.5 Border Radius & Elevation

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 4px | Input fields, badges |
| `--radius-md` | 8px | Cards, bundle tier boxes |
| `--radius-lg` | 40px | CTA pill buttons (Secure Checkout, Add to Cart) |
| `--shadow-card` | `0 2px 12px rgba(28,16,9,0.06)` | Product cards, upsell cards |
| `--shadow-sticky` | `0 -4px 24px rgba(28,16,9,0.08)` | Sticky bottom bar shadow |

---

## 3. GLOBAL COMPONENTS

### 3.1 Global Header / Navigation

**Structure:**
```
[Home] [Veloura Cellulite Legging] [Our Story] [Contact]    VELOURA    [Search Icon] [Cart Bag Icon]
```

**Detailed Specs:**
- **Logo:** "VELOURA" in Cormorant Garamond, Regular weight, 22px, ALL CAPS. **Must be absolutely centered horizontally** in the header, regardless of nav link count.
- **Left Nav Links:** `Home`, `Veloura Cellulite Legging`, `Our Story`, `Contact`. DM Sans 500, 11px, letter-spacing 0.12em. Colour `--color-text-primary`. No underline default; subtle underline on hover.
- **Right Icons:** Search (magnifying glass) and Cart (shopping bag). 20px. Cart displays a red badge with item count when cart is non-empty.
- **Background:** `--color-canvas` (`#FAF6F4`). Fully opaque.
- **Border Bottom:** 1px solid `--color-border`. No drop shadow on header.
- **Height:** 64px on desktop, 56px on mobile.
- **Sticky Behaviour:** Header is position `sticky`, stays at top of viewport on all pages.
- **Active Nav State:** The currently active page link has a subtle underline (2px, `--color-accent-rust`).

**Mobile Header (< 768px):**
- Logo remains centered.
- Nav links collapse into a hamburger icon (☰) on the LEFT side.
- Cart icon stays on the RIGHT side.
- Hamburger opens a full-height slide-in drawer from the left with nav links stacked vertically. Background `--color-canvas`. Padding 32px.

### 3.2 Global Footer

**Three-column layout on desktop, stacked on mobile:**

- **Column 1:** VELOURA logo (Cormorant 18px), then tagline: *"Clinically engineered for real, structural change."* below in DM Sans 13px muted.
- **Column 2 (Links):** Privacy Policy · Shipping & Returns · Stockist Enquiries · Sustainability
- **Column 3 (Links):** Instagram · Contact
- **Footer Bottom Bar:** Full-width hairline border, then: `© 2024 VELOURA CLINICAL. FORMULATED FOR RESULTS.` centred in DM Sans 11px muted.
- **Background:** Same as page canvas `#FAF6F4`.

---

## 4. PAGE 1 — HOME PAGE

**Goal:** Quickly communicate the unique mechanism (VELO-LYMPH™ technology), establish credibility, and convert visitors to the product page. All CTAs link to the Veloura Cellulite Legging product page.

---

### SECTION 1.1: HERO

**Layout:** Split-screen, 50/50 on desktop. Left = copy. Right = product image. On mobile: image stacks above copy.

**Left Side (Copy Block):**
- **Overline/Eyebrow:** `VELO-LYMPH™ TECHNOLOGY` — DM Sans 500, 10px, ALL CAPS, letter-spacing 0.15em, colour `--color-accent-rust`
- **H1 Headline:** `Stop hiding your legs.` — Cormorant Garamond, Regular, 64px on desktop / 44px mobile. Colour `--color-text-primary`. Line-height 1.1.
- **Sub-copy:** `The only legging engineered to treat cellulite at the root through clinical micro-compression.` — DM Sans Regular, 15px, `--color-text-muted`. Max-width 320px.
- **CTA Button:** Green pill button (border-radius 40px), label: `Shop The Veloura Legging →`. Background `--color-cta-green`. DM Sans 500, 13px, white, letter-spacing 0.1em. Padding 14px 28px. Links to product page.
- **Left padding:** 64px from left edge on desktop.
- **Vertical alignment:** Centred vertically within the hero height (500px desktop, auto mobile).

**Right Side (Image Block):**
- Full-height product photography. Model wearing black Veloura leggings, minimal studio/architectural background (grey concrete or white).
- Image fills the right 50% column with `object-fit: cover`. No border-radius on this image.
- Image slightly overshoots the hero height by ~20px for a "bleeding" editorial feel.

**Hero Background:** `--color-canvas`. NO gradient, no overlay.

**Bottom Border:** Thin 1px `--color-border` line below the full hero section to separate from next section.

---

### SECTION 1.2: BEFORE & AFTER SLIDER — "See the structural change"

**Background:** White (`#FFFFFF`) on a slightly elevated card (subtle shadow), centred with 80px vertical padding. Width 90% max-width 800px, centred.

**Heading:** `See the structural change` — Cormorant H2, centred.  
**Sub-copy:** `Visible reduction in dimpling after 30 days of consistent Velo-Lymph™ therapy.` — DM Sans 14px, centred, muted.

**Before/After Image Component:**
- A single wide image container (aspect ratio 16:9 or 3:2), split by a **vertical drag handle** in the centre.
- Left side: "Before" — shows dimpled/textured legging fabric or skin.
- Right side: "After" — shows smooth, visibly reduced texture.
- Drag handle: A white circular handle (32px diameter, subtle shadow) with a horizontal arrows icon (`⟨⟩`) or `//` icon in `--color-accent-rust`. The handle has a white vertical line extending full height of the image.
- Labels: "BEFORE" badge (top-left of left half) and "AFTER" badge (top-right of right half). Both in DM Sans 11px, ALL CAPS, white text, semi-transparent dark background pill (rgba(0,0,0,0.45), border-radius 4px).
- The slider is interactive: the user can click/touch and drag the handle to reveal more or less of each side.
- **Default position:** Drag handle at 50% centre on load.
- On mobile: touch-draggable.

---

### SECTION 1.3: RESULTS TIMELINE — "The path to smoother skin"

**Background:** `--color-canvas`. Padding 80px vertical.

**Heading:** `The path to smoother skin` — Cormorant H2, centred.  
**Sub-copy:** `Micro-compression works continuously. Here is what to expect.` — DM Sans 14px, centred, muted.

**Layout:** 4-column horizontal grid on desktop. On mobile: 2×2 grid. Each column contains:

| Step | Label | Title | Body Copy |
|---|---|---|---|
| 1 | Day 1 | FLUID ACTIVATION | Immediate sensation of lightness as stagnant lymphatic fluid begins to drain. |
| 2 | Day 14 | SURFACE SMOOTHING | Skin texture starts feeling softer. Micro-circulation increases, bringing nutrients to the dermis. |
| 3 | Day 30 | STRUCTURAL RELEASE | Fibrous bands begin to relax. Visible reduction in deeper dimpling starts to occur. |
| 4 | Day 90+ | LASTING REMODELLING | Significant structural improvement. Continuous wear prevents less stagnation from forming. |

**Each Column Structure:**
- **Icon:** A small, minimal line-art icon in `--color-accent-rust` (e.g. droplet for Day 1, wave for Day 14, diamond for Day 30, sparkle for Day 90). 24×24px. Centred.
- **Day Label:** DM Sans 500, 11px, ALL CAPS, letter-spacing 0.12em, `--color-accent-rust`. e.g. `DAY 1`.
- **Step Title:** DM Sans 600, 12px, ALL CAPS, letter-spacing 0.1em, `--color-text-primary`. e.g. `FLUID ACTIVATION`.
- **Body:** DM Sans Regular, 13px, `--color-text-muted`, line-height 1.6.
- Columns are separated by vertical hairline borders (`--color-border`) on desktop.

---

### SECTION 1.4: BUNDLE BLOCK — "Commit to your results"

**Background:** `--color-canvas-secondary` (`#F5EDE8`) for the full section. Padding 80px vertical.

**Heading:** `Commit to your results` — Cormorant H2, centred.  
**Sub-copy:** `Choose your protocol. Consistent daily wear is the key to structural remodelling.` — DM Sans 14px, centred, muted.

**Bundle Card:**
- White background card, `--shadow-card`, border-radius 12px. Max-width 680px, centred on page.
- Internal padding: 40px.
- The 3 bundle tiers are displayed as **radio-button selection rows**, stacked vertically.

**Tier Layout (each row):**

**Tier 1 — Starter Protocol:**
- Radio button (left) + label block (middle) + price (right)
- Label: `1 PAIR — STARTER PROTOCOL`
- Sub-copy: `Good for occasional use. Try the technology.`
- Price: `£44.99`

**Tier 2 — Most Popular (DEFAULT SELECTED):**
- Radio button (left, pre-selected) + label block (middle) + price (right)
- **"MOST POPULAR" Badge:** Pill badge, `--color-badge-popular` background, white text, 10px DM Sans, positioned top-right of this row OR inline right of label.
- Label: `2 PAIRS — FREE SHIPPING`
- Sub-copy with checklist:
  - ✓ Full cellular update
  - ✓ Consistent daily therapy
  - ✓ Never miss a day. Maximum clinical results.
- **Extra Fields (visible only when Tier 2 is selected, animated slide-down):**
  - **Pair 1:** Colour dropdown + Size dropdown
  - **Pair 2:** Colour dropdown + Size dropdown
  - Each dropdown: DM Sans 14px, full-width within the card, white bg, 1px `--color-border` border, border-radius 4px.
- Price: `£44.99` + small badge: `SAVE £44 + FREE SHIPPING`

**Tier 3 — Best Value:**
- Radio button (left) + label block (middle) + price (right)
- **"BEST VALUE" Badge:** Taupe/beige pill, muted text.
- Label: `3 PAIRS — BEST VALUE`
- Sub-copy: `Never miss a day. Maximum clinical results.`
- Price: `£65.00` + small badge: `SAVE £69 + FREE SHIPPING`

**CTA Button (below all tiers):**
- Full-width green pill button, label: `🛒 Secure Checkout`
- Padding 18px 0. Border-radius 40px. DM Sans 500, 14px, ALL CAPS.
- Below button: `30-DAY CLINICAL TRIAL GUARANTEE + FREE RETURNS` in DM Sans 11px, centred, `--color-text-muted`.

---

### SECTION 1.5: SOCIAL PROOF — "Real structural change"

**Background:** `--color-canvas`. Padding 80px vertical.

**Left Side (Full Width on Mobile):**
- **Heading:** `Real structural change` — Cormorant H2, left-aligned.
- **Sub-copy:** `Join thousands of women who stopped treating the symptom and started treating the cause.` — DM Sans 14px, muted.
- **Star Rating Line:** ★★★★☆ `4.9/5 from 2,400+ REVIEWS` — stars in `--color-star`, text DM Sans 12px.

**Reviews Grid (Masonry-style, 3 columns on desktop, 1 on mobile):**

Each review card contains:
- **Star rating:** 5 stars in `--color-star`.
- **Review text:** DM Sans 14px, in quotes. Truncated to ~3 lines with "Read more" if longer.
- **Reviewer name + "VERIFIED BUYER"** badge: DM Sans 12px, muted. Badge: small outlined pill.
- Some cards include a small **user-uploaded photo thumbnail** (60×60px, rounded 8px, top-right of card).

**Sample Reviews to Use (placeholder copy):**

> *"I've spent thousands on creams that did nothing. After finding the science behind Veloura and wearing them for 6 weeks, the back of my thighs are noticeably smoother. The fabric is thick and compressive but surprisingly comfortable."* — Sarah M., VERIFIED BUYER

> *"Show it close-up. Loving this compression."* — Tiff, VERIFIED BUYER

> *"My daily uniform. I bought the 3-pack because I wanted to wear them every day so I wouldn't miss it. My legs feel incredibly light at the end of the day, no more heavy feeling. The dimpling is definitely fading."* — Elena F., VERIFIED BUYER

> **Dermatologist Approved Block (separate visual callout):**  
> Icon: small shield or medical cross in `--color-accent-rust`.  
> Quote: *"I recommend these to patients as an adjunct to professional treatments. The continuous micro-compression aids lymphatic drainage effectively between clinic visits."*  
> Attribution: `— Dr J. Chen, MD`

**"READ ALL REVIEWS" Link:** Centred below the grid. DM Sans 500, 12px, underlined, `--color-text-primary`. Links to review anchor on product page.

---

## 5. PAGE 2 — VELOURA CELLULITE LEGGING (PRODUCT PAGE)

**URL:** `/products/veloura-cellulite-legging`

**Goal:** This is the primary conversion page. It must do the following in order:
1. Validate the customer's desire (headline).
2. Explain why Veloura works (mechanism).
3. Let them buy (bundle section with ATC).
4. Overcome objections (FAQ, science section).
5. Show proof (before/after slider, reviews).
6. Re-offer the purchase (sticky bottom bar).

---

### SECTION 2.0: TWO-COLUMN PRODUCT LAYOUT (Sticky Image Gallery + Buy Box)

**Desktop Layout:**
- **Left Column (55%):** Sticky product image gallery. Sticks within the sticky container from top of product section to the bottom of the buy box.
- **Right Column (45%):** Scrolls normally through all the purchasing copy/logic.
- **Gap between columns:** 48px.
- **Top margin below header:** 32px.

**Left Column — Sticky Image Gallery:**
- **Main image:** Large, full-width within the column. Aspect ratio 4:5. High-quality product photography. Multiple views: front, back, texture close-up, on-model lifestyle.
- **Thumbnail Row:** Below main image. 4–5 small thumbnails (80×80px, border-radius 4px). Active thumbnail has a 2px `--color-text-primary` border. Clicking switches main image with a smooth crossfade (150ms).
- **Image Quality Note:** Use actual product photos. On first render, use the **hero front image** (model in studio). Second image: back/thigh close-up. Third: fabric texture close-up. Fourth: lifestyle (outdoor/walking).

**Right Column — Buy Box (scrolls):**

**Product Name:**  
`Veloura Cellulite Legging` — Cormorant H2, 36px, colour `--color-text-primary`.

**Overline above name:**  
`VELO-LYMPH™ ENHANCED` — DM Sans 500, 10px, ALL CAPS, letter-spacing 0.15em, `--color-accent-rust`.

**Hero Claim:**  
`Reclaim your confidence. Smooth, sculpted legs in 8 weeks.` — Cormorant 28px, Regular.

**Supporting Body:**  
DM Sans 14px, muted:  
*"Experience the freedom of wearing what you love. Our Velo-Lymph™ technology works with your body's natural rhythms to transform your skin while you live your life."*

**Two Checkmark Bullets:**
- ✓ Not shapewear. Not compression. — DM Sans 14px, `--color-text-primary`. ✓ in `--color-cta-green`.
- ✓ Works while you live. Zero effort.

**Hairline divider** (1px `--color-border`)

---

### SECTION 2.1: BUNDLE SELECTOR (Within Buy Box)

**Label above:** `BUNDLE & SAVE` — DM Sans 500, 11px, ALL CAPS, letter-spacing 0.12em, `--color-accent-rust`.

**Three bundle tiers as vertical radio rows (same logic as Homepage Bundle Block but inside product page):**

**Tier 1 — 1 LEGGING:**
- Radio + label `1 LEGGING` + price `£44.99`
- Sub-copy: `Starter Protocol`

**Tier 2 — 2 LEGGINGS (DEFAULT SELECTED):**
- Radio (pre-selected) + `2 LEGGINGS` label
- **"MOST POPULAR" badge** — dark red pill, top-right of this row.
- Sub-copy: `SAVE £44 + FREE SHIPPING`
- Checkbox-list features (DM Sans 13px, `--color-text-muted`):
  - ✓ Full cellular update
  - ✓ Consistent daily therapy
  - ✓ Never miss a day. Maximum clinical results.
- **When tier 2 selected:** Reveal animated slide-down for:
  - **Pair 1 label** + `Colour:` dropdown + `Size:` dropdown (side by side, 50/50 width)
  - **Pair 2 label** + `Colour:` dropdown + `Size:` dropdown (side by side)
  - Dropdowns: full-width, 1px border `--color-border`, radius 4px, DM Sans 14px. Placeholder: "Select colour" / "Select size".
- Price: `£44.99`

**Tier 3 — 3 LEGGINGS:**
- Radio + `3 LEGGINGS` label
- **"BEST VALUE" badge** — taupe pill.
- Sub-copy: `Do it yourself outfit`
- Price: `£65.00` + badge: `SAVE £69 + FREE SHIPPING`

**ADD TO CART Button (below tiers):**
- Full-width. Background `--color-cta-green`. Border-radius 40px. Padding 18px 0.
- Label: `🛒 ADD TO CART` — DM Sans 500, 14px, ALL CAPS, white, letter-spacing 0.08em.
- **Scarcity text below button:** `Only 34 left in stock now` — DM Sans 12px, colour `#C0392B` (red), centred, with a small ⚡ or 🔴 dot icon before the text.

**Clicking "ADD TO CART"** triggers the Cart Drawer to slide in from the right (Section 3).

---

### SECTION 2.2: MECHANISM / SCIENCE BLOCK

*Positioned below the sticky buy box, as the page scrolls down.*

**Background:** `--color-canvas-secondary` (`#F5EDE8`). Padding 64px vertical. Max-width 800px, centred.

**Heading:** `You Didn't Fail. You Were Treating the Wrong Problem.` — Cormorant H2, 40px, centred.

**Body Text (2 paragraphs, DM Sans 15px, line-height 1.7, centred, max-width 680px):**

Paragraph 1: *"Cellulite is a circulation issue, not a fat issue. The proprietary weave stimulates micro-circulation to smooth skin from within."*

Paragraph 2: *"Your body has a remarkable self-repair system — but it needs movement to activate it. Veloura's 47+ mapped micro-pressure points keep that system running every hour you wear them."*

**Dermatologist Quote Block:**
- Background: white card, `--shadow-card`, border-radius 8px. Padding 32px. Max-width 640px, centred.
- Left border: 3px solid `--color-accent-rust`.
- Quote text in Cormorant Italic, 22px: *"Micro-compression aids lymphatic drainage more effectively than any topical treatment I've reviewed. The effect is structural, not cosmetic."*
- Attribution: DM Sans 12px, muted: `— Dr. Vanessa Cole, MD · Dermatology & Clinical Research`

---

### SECTION 2.3: FAQ — "Frequently Asked Questions"

**Background:** `--color-canvas`. Padding 64px vertical. Max-width 700px, centred.

**Heading:** `Frequently Asked Questions` — Cormorant H2, centred.

**Accordion Component:**
- Each FAQ is a row with a question (DM Sans 500, 15px) and a `+` / `−` toggle icon (right-aligned, 20px, `--color-text-muted`).
- On expand: answer slides down with 200ms ease. Answer text: DM Sans 14px, `--color-text-muted`, padding 12px 0.
- Hairline border (1px `--color-border`) between each item.
- Only one item open at a time (accordion behaviour).

**FAQ Items (Questions + Answers):**

**Q: How quickly will I see results?**  
A: *Most customers notice a feeling of lightness within the first wear as stagnant fluid starts to move. Visible skin texture improvement typically begins around week 2–3 of daily wear. Structural changes — the real reduction in dimpling — are most visible at 6–8 weeks of consistent use.*

**Q: I've tried leggings before. Why is this different?**  
A: *Standard compression leggings squeeze superficially, which can actually restrict circulation and worsen the appearance of cellulite over time. Veloura's VELO-LYMPH™ fabric uses 47 mapped micro-pressure points engineered to stimulate lymphatic flow with every step — it works with your body's movement, not against it.*

**Q: How do I find the right size?**  
A: *We recommend sizing up if you're between sizes for maximum comfort during all-day wear. Our size guide is available on the product image gallery. When in doubt, the fabric has 4-way stretch to accommodate.*

**Q: How long does shipping take?**  
A: *UK standard shipping: 3–5 business days. UK express: 1–2 business days. EU: 5–8 days. International: 7–14 days. All orders over £65 include free standard UK shipping.*

**Q: Can I wear them every day?**  
A: *Absolutely — and we encourage it. The clinical results are cumulative: the more consistently you wear them, the better the structural improvement. Machine wash cold, hang dry. They maintain their therapeutic properties for 80+ washes.*

**Q: What if they don't work for me?**  
A: *We offer a 30-day Clinical Trial Guarantee. If you don't see measurable improvement in skin texture within 30 days of daily wear, contact us for a full refund — no returns required, no questions asked.*

---

### SECTION 2.4: BEFORE & AFTER SLIDER — "The Transformation You've Been Waiting For"

**Background:** `--color-canvas-secondary` (`#F5EDE8`). Padding 80px vertical.

**Layout:** Two-column, 45/55 split on desktop. Left = copy. Right = Before/After slider. On mobile: stacks (copy above, slider below).

**Left Copy Block:**
- **Heading:** `The Transformation You've Been Waiting For.` — Cormorant H2, 36px.
- **Body (DM Sans 15px, `--color-text-muted`):**  
  *"Your transformation is structural. It's not an overnight process. It's a physiological process. By stimulating deep lymphatic drainage daily, Veloura mechanically restructures the skin's surface from within."*
- **Thumbnail row:** Three small square before/after thumbnail pairs below the copy. Each pair shows a miniature before and after side-by-side. Clicking switches the main slider to show that customer's result. DM Sans 11px label below each: "Customer 1", "Customer 2", "Customer 3" — or first-name initials.

**Right Slider Block:**
- Large interactive Before/After slider (same component as homepage, larger variant).
- Aspect ratio: 3:4 (portrait) to show the thigh/leg area clearly.
- Same white circular drag handle, same BEFORE/AFTER labels.
- Below the slider: 5 small star icons + `"Verified Purchase"` text in DM Sans 12px, muted. Small quote: *"I cried when I saw these photos side by side."* — DM Sans 13px italic.

---

### SECTION 2.5: RESULTS TIMELINE — "Your 8-Week Journey to Smooth"

**Background:** `--color-canvas`. Padding 80px vertical. Max-width 900px, centred.

**Heading:** `Your 8-Week Journey to Smooth` — Cormorant H2, centred.

**Layout:** Three horizontal steps on desktop. Each step has:
- **Circular step number:** 40px circle, background `--color-accent-rust`, white number inside (Cormorant 20px). Centred above the content.
- **Week Label:** DM Sans 500, 11px, ALL CAPS, `--color-accent-rust`. e.g. `WEEK 2`
- **Step Title:** DM Sans 600, 14px, `--color-text-primary`.
- **Body:** DM Sans 13px, `--color-text-muted`, max-width 200px, centred.
- **Connecting Line:** Horizontal dotted line between the circles (not behind them). Colour `--color-accent-rust` at 30% opacity.

| Step | Week | Title | Body |
|---|---|---|---|
| 1 | WEEK 2 | CIRCULATION ACTIVATED | Micro-circulation is stimulated. The skin begins to receive nutrients it has been denied. |
| 2 | WEEK 4 | TEXTURE SOFTENING | The "orange peel" texture begins to soften. Stagnant fluid is actively draining. |
| 3 | WEEK 8 | VISIBLE TRANSFORMATION | Visible reduction in cellulite. Skin surface is measurably smoother to the touch. |

---

### SECTION 2.6: CUSTOMER REVIEWS

**Background:** `--color-canvas`. Padding 80px vertical. Max-width 1000px.

**Review Summary Bar:**
- Left block: Large `4.8` number (Cormorant 64px) + star row below (5 stars, colour `--color-star`) + `Based on 471 reviews` (DM Sans 12px, muted).
- Right: `WRITE A REVIEW` button — outlined pill, `--color-text-primary` border and text. DM Sans 500, 12px, ALL CAPS.
- Below summary: 3 small user-uploaded photo thumbnails (showing customer selfies or leg photos), each 72×72px, border-radius 8px. These are a UGC trust signal.

**Individual Review Cards:**

Each card (full-width rows, not grid):
- **Top Row:** Avatar circle (32px, initial or photo) + `[Name]` (DM Sans 600, 13px) + `VERIFIED PURCHASE` badge (outlined green pill, DM Sans 11px) + star rating (right-aligned) + `[Date]` (DM Sans 11px, muted).
- **Size/Colour Row:** `Size: M · Colour: Slate` — DM Sans 12px, muted.
- **Review Title:** DM Sans 600, 14px, `--color-text-primary`.
- **Review Body:** DM Sans 14px, `--color-text-muted`, max 4 lines, "Read more" expand.
- **Photo Row (if customer photo):** 1–3 thumbnails, 80×80px, border-radius 8px, spaced 8px apart. Clicking opens a lightbox.

**Sample Review 1:**
- Name: Faith B. · VERIFIED PURCHASE · ★★★★★
- Size: S · Colour: Slate
- Title: *"I've tried everything. These work."*
- Body: *"I have had cellulite since I was 16. I am now 34. I have tried every cream, treatment, and piece of clothing on the market. Nothing moved the needle until these. After 5 weeks of wearing them almost every day I can genuinely see a difference in the dimpling on my thighs. Far more comfortable than medical-grade garments and actually something on my thighs."*

**Sample Review 2:**
- Name: Eva S. · VERIFIED PURCHASE · ★★★★★
- Title: *"Day one results are real."*
- Body: *"I'm sceptical by nature but I just bought them because I kept seeing them. This is different. My thighs feel more taut than they've felt from clean eats."*

---

### SECTION 2.7: STICKY BOTTOM CART BAR

**This is a fixed bar at the bottom of the viewport**, visible on the product page at all times once the user has scrolled past the main ATC button.

**Structure:**
```
[Product thumbnail 40x40px] | Veloura Cellulite Legging | £44.99 | [START MY TRANSFORMATION button]
```

- **Background:** `--color-canvas` with `--shadow-sticky`.
- **Height:** 72px.
- **Product thumbnail:** 40×40px, border-radius 4px.
- **Product name:** DM Sans 500, 14px, `--color-text-primary`. On mobile: truncate to "Veloura Legging".
- **Price:** DM Sans 600, 16px, `--color-text-primary`. Show the currently selected tier price.
- **CTA Button:** `START MY TRANSFORMATION` — Green pill, DM Sans 500, 13px, ALL CAPS, white. Border-radius 40px. Padding 14px 24px. This button re-triggers the ATC logic (adds currently selected tier to cart and opens drawer).
- **Visibility:** Hidden when the ATC button in the buy box is visible in the viewport. Appears with a smooth slide-up animation (300ms ease) once the ATC button scrolls out of view.

---

## 6. PAGE 3 — CART SLIDE-OUT DRAWER

**Trigger:** Fires automatically when any "Add to Cart" or "ADD TO ORDER" action is taken.  
**Position:** Slides in from the **right** edge of the screen, over the page content. A semi-transparent dark overlay (`rgba(0,0,0,0.4)`) covers the page behind it.  
**Width:** 480px on desktop. Full-width on mobile.  
**Background:** White (`#FFFFFF`).  
**Close:** X button top-right of drawer (20px, `--color-text-muted`). Clicking overlay also closes.

---

### Drawer — Header Section

- **Title:** `Your Selection` — Cormorant 28px, Regular.
- **Sub-label:** `VELO-LYMPH™ ENHANCED` — DM Sans 500, 10px, ALL CAPS, letter-spacing 0.15em, `--color-accent-rust`. Below the title.
- **Hairline border** below.

---

### Drawer — Cart Items

For each item in cart:

| Element | Spec |
|---|---|
| Product thumbnail | 80×80px, border-radius 4px, object-fit cover |
| Product name | DM Sans 600, 15px, `--color-text-primary`. e.g. "Veloura Bloom Legging" |
| Variant info | DM Sans 13px, muted. e.g. "Slate / Size S" |
| Quantity selector | `−` `[1]` `+` — inline row. Buttons 28×28px, border 1px `--color-border`, border-radius 4px. DM Sans 500, 14px. |
| Price | DM Sans 600, 16px, right-aligned. |
| Remove button | `REMOVE` text link, DM Sans 500, 11px, ALL CAPS, `--color-text-muted`. Top-right of item. |

---

### Drawer — Upsell Block: "COMPLETE YOUR PROTOCOL"

- **Background:** `--color-canvas-secondary` (`#F5EDE8`). Border-radius 8px. Padding 20px.
- **Header Row:** Small flask/lab icon (`--color-accent-rust`, 16px) + `COMPLETE YOUR PROTOCOL` — DM Sans 500, 11px, ALL CAPS, letter-spacing 0.12em, `--color-accent-rust`.
- **Product Card (within the blush block):**
  - White background card, border-radius 8px, padding 16px. `--shadow-card`.
  - Product thumbnail: 72×72px, border-radius 4px. (Grey/slate Bloom Shorts image).
  - Product name: `Bloom Shorts` — DM Sans 600, 15px.
  - Body copy: `Essential for 24/7 lymphatic support and targeted compression.` — DM Sans 13px, muted.
  - Price: `£24.99` — DM Sans 600, 15px, right-aligned top.
  - **ADD TO ORDER button:** `ADD TO ORDER ⊕` — DM Sans 500, 13px, `--color-accent-rust`, underlined. No pill background. Clicking this instantly adds the Bloom Shorts to the cart and updates the subtotal without closing the drawer. The "ADD TO ORDER" button then changes to `✓ ADDED` (green, non-clickable) once added.
- **State management:** If Bloom Shorts are already in the cart, this entire blush block is hidden (or shows `✓ Added to your protocol` with green text and no button).

---

### Drawer — Footer / Totals

- **Hairline border** above.
- **Subtotal row:** `Subtotal` (DM Sans 14px) — `£44.99` (DM Sans 600, right-aligned).
- **Shipping row:** `Shipping` (DM Sans 14px, muted) — `Calculated at checkout` (DM Sans 13px, muted, right-aligned, italic).
- **Hairline border.**
- **Total row:** `Total` (DM Sans 600, 18px) — `£44.99` (DM Sans 700, 18px, right-aligned).
- **SECURE CHECKOUT Button:** Full-width green pill. Label: `🔒 SECURE CHECKOUT`. DM Sans 500, 14px, ALL CAPS, white. Border-radius 40px. Padding 18px 0.
- **Trust Badges Row** (below button, centred):
  - `○ 30-DAY CLINICAL TRIAL` | `◇ ENCRYPTED PAYMENT`
  - DM Sans 11px, muted. Icons: small outline shield / circle tick. Separated by a vertical pipe `|`.

---

## 7. PAGE 4 — FULL CART PAGE

**URL:** `/cart`  
**Background:** `--color-canvas`

**Page Heading:**
- `Your Protocol` — Cormorant H1, 52px. Left-aligned. Below the global header, with 32px top margin.
- Hairline border below heading.

**Two-Column Layout (65% / 35% on desktop, stacked on mobile):**

---

### Left Column — Cart Items ("Your Protocol")

**Each cart item row (white card, `--shadow-card`, border-radius 8px, padding 24px, margin-bottom 16px):**

| Element | Spec |
|---|---|
| Product image | 140×180px, border-radius 8px, object-fit cover. Lifestyle photo (model). |
| Product name | Cormorant 24px, `--color-text-primary`. "Veloura Bloom Legging" |
| Variant info | DM Sans 13px, muted. "Color: Slate · Size: S" — two separate lines |
| Quantity selector | `−` `[1]` `+`. Same spec as drawer. Inline row below variant info. |
| Price | DM Sans 600, 18px, right-aligned. |
| Remove button | `REMOVE` — DM Sans 500, 11px, ALL CAPS, `--color-accent-rust`. Right-aligned, below price. |

**Below all cart items — "Complete Your Protocol" Upsell Block:**
- Heading: `Complete Your Protocol` — Cormorant 28px, left-aligned.
- Hairline divider below.
- **Bloom Shorts upsell card (white card, `--shadow-card`, border-radius 8px, padding 24px):**
  - Thumbnail: 100×120px, border-radius 8px.
  - Product name: `Veloura Bloom Shorts` — Cormorant 22px.
  - Body: `Essential for 24/7 lymphatic support and targeted compression.` — DM Sans 14px, muted.
  - **"CLINICAL RESULTS" tag:** Small outlined pill, `--color-accent-rust` border and text, DM Sans 10px, ALL CAPS.
  - Price: `£24.99` — DM Sans 600, 16px.
  - **ADD TO ORDER Button:** Outlined pill (border `--color-accent-rust`, text `--color-accent-rust`). Label: `ADD TO ORDER`. DM Sans 500, 12px, ALL CAPS. Padding 10px 20px. Same single-add logic as the drawer — once added, button changes to `✓ ADDED` and entire upsell card becomes greyed/checkmarked.

---

### Right Column — Summary (Sticky)

**White card, `--shadow-card`, border-radius 12px, padding 32px. Sticky top: 96px (below header).**

- **Heading:** `Summary` — Cormorant 32px.
- **Hairline border.**
- **Subtotal row:** `Subtotal` / `£44.99` — DM Sans 14px / DM Sans 600.
- **Shipping row:** `Shipping` / `Calculated at checkout` — DM Sans 14px / DM Sans 13px italic muted.
- **Hairline border.**
- **Total row:** `Total` / `£44.99` — DM Sans 600, 18px / DM Sans 700, 20px.
- **SECURE CHECKOUT Button:** Full-width green pill. Label: `SECURE CHECKOUT`. DM Sans 500, 14px, ALL CAPS, white. Border-radius 40px. Padding 18px 0. `--color-cta-green`.
- **Trust Icons (below button, two rows):**
  - Row 1: 🔒 icon + `SECURE ENCRYPTED PAYMENT` — DM Sans 12px, muted.
  - Row 2: ◇ icon + `30-DAY CLINICAL TRIAL GUARANTEE` — DM Sans 12px, muted.
  - Each row left-aligned with icon and text inline.

---

## 8. PAGE 5 — OUR STORY

**URL:** `/our-story`

---

### SECTION 5.1: HERO — Full-Width Editorial Image

- Full-viewport-width image (aspect ratio 16:7 on desktop). Model wearing leggings in an architectural, light-filled space (studio, atrium, or outdoor minimal).
- **Overlay text (bottom-left, over image):**
  - Line 1: `Engineering Confidence.` — Cormorant 52px, white, Regular.
  - Line 2: `Sculpting the Future of Skin.` — Cormorant 52px, `--color-accent-rust`, Italic. This italic rust line is the signature visual element of the brand.
- Subtle dark gradient overlay at the bottom of the image to ensure text legibility: `linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)`.

---

### SECTION 5.2: THE GENESIS

**Layout:** Two-column, 55/45 split. Left = text. Right = abstract image.

**Left — Text Block:**
- **Heading:** `The Genesis` — Cormorant H2, 40px, `--color-accent-rust` (one of the few times heading uses rust colour).
- **Body (DM Sans 15px, `--color-text-muted`, line-height 1.7, two paragraphs):**

  Paragraph 1: *"Veloura was born at the intersection of rigorous clinical dermatology and high-performance textile engineering. We observed a fundamental flaw in the traditional approach to cellulite and skin texture: the industry treated it as a purely aesthetic fat issue, masking it with restrictive compression rather than addressing the physiological root cause."*

  Paragraph 2: *"Through years of research, we isolated the true mechanism — stagnant microcirculation and lymphatic fluid. This realisation catalysed the development of our proprietary Velo-Lymph™ technology, shifting the paradigm from passive shapewear to active, therapeutic apparel."*

- **"CLINICALLY DESIGNED" Pill Badge** (below text): White card with `--shadow-card`, border-radius 40px. Small icon (molecule/atom) in `--color-accent-rust` + `CLINICALLY DESIGNED` in DM Sans 500, 11px, ALL CAPS, letter-spacing 0.12em.

**Right — Abstract Image:**
- A 3D-rendered or macro-photography image of the legging's micro-texture fabric structure. Dark green/slate tones with a deep undulating wave pattern. This is the distinctive visual element from the Rùadh-inspired design — it's scientific, tactile, not lifestyle.
- Border-radius 8px. No shadow.

---

### SECTION 5.3: OUR PHILOSOPHY — Three Column Grid

**Background:** `--color-canvas`. Padding 80px vertical. Max-width 1000px, centred.

**Eyebrow:** `OUR PHILOSOPHY` — DM Sans 500, 10px, ALL CAPS, letter-spacing 0.15em, `--color-accent-rust`, centred.  
**Heading:** `Beauty through Circulation.` (line break) `Treating the` *`Wrong Problem.`* — Cormorant H2, centred. The italic `Wrong Problem.` is in `--color-accent-rust` italic, the rest is standard `--color-text-primary`.

**Three-column grid (1/3 each on desktop, stacked on mobile):**

| Column | Icon | Title | Body |
|---|---|---|---|
| 1 | Droplet outline | Not a Fat Issue | Dermatologists have established that cellulite is fundamentally a circulation problem — a localised lymphatic drainage failure rather than excess lipid storage. |
| 2 | Cross/plus with strikethrough | The Flaw in Compression | Traditional shapewear merely compresses superficially, masking the texture while often exacerbating the underlying circulatory stagnation by restricting blood flow. |
| 3 | Pulse/wave line | Active Stimulation | We engineered garments that work dynamically with your body's movement, providing continuous micro-massage to stimulate lymphatic flow for the hours you wear them. |

Each column: icon (24px, `--color-accent-rust`) top, then title (DM Sans 600, 14px, ALL CAPS), then body (DM Sans 14px, muted). No card background — plain text on canvas.

---

### SECTION 5.4: THE SCIENCE OF STIMULATION

**Background:** White card, `--shadow-card`, border-radius 12px. Max-width 960px, centred. Padding 48px. Margin 40px auto.

**Eyebrow:** `VELO-LYMPH™ TECHNOLOGY` — DM Sans 500, 10px, ALL CAPS, `--color-accent-rust`.  
**Heading:** `The Science of Stimulation` — Cormorant H2, left-aligned.  
**Body:** DM Sans 14px, muted, max-width 480px, left-aligned:  
*"Our proprietary fabric maps over 47+ micro-pressure points directly into the textile structure. Each point is meticulously calculated to trigger a specific lymphatic pathway with every step you take."*

**Three Stats Row (right half of card or below body, on same card):**
- Three large stat figures, evenly spaced:
  - `47+` · `PRESSURE POINTS` — DM Sans 700, 36px / DM Sans 500, 10px ALL CAPS muted
  - `8h` · `PASSIVE TREATMENT` — same format
  - `30%` · `CIRCULATION BOOST` — same format
- Hairline borders between the three stats.

**Decorative element (right of card on desktop):** Abstract medical/anatomical line illustration or the rust cross/target icon in `--color-accent-rust`, large (120px). Positioned in the white space of the card.

---

### SECTION 5.5: FOUNDER QUOTE BLOCK

**Background:** `--color-canvas-dark` (`#2B1E17`). Full-width. Padding 80px vertical.

**Content (centred, max-width 720px):**
- **Opening quote mark:** Large decorative `"` in `--color-accent-rust`, Cormorant 96px, centred.
- **Quote text:** Cormorant 28px, Regular, white, centred, line-height 1.4, italic:  
  *"We didn't set out to make another legging. We set out to engineer a solution that respects the biological reality of women's bodies. Veloura is where scientific rigour meets daily wear."*
- **Attribution:** `THE FOUNDERS` — DM Sans 500, 11px, ALL CAPS, letter-spacing 0.15em, `--color-accent-rust`, centred.  
  `Veloura Clinical Innovations` — DM Sans 13px, muted (warm grey), centred.

---

## 9. PAGE 6 — CONTACT

**URL:** `/contact`  
**Background:** `--color-canvas`

**Layout:** Centred single-column form, max-width 560px, vertically centred on page with generous padding.

**Heading:** `Get in Touch` — Cormorant H1, 52px, centred.  
**Sub-copy:** `We're here to support your journey.` — DM Sans 15px, muted, centred.

**Form Fields (stacked vertically, gap 16px between fields):**

| Field | Label | Input Type | Spec |
|---|---|---|---|
| Name | Name | text | Full-width. DM Sans 14px. 1px border `--color-border`. Radius 4px. Padding 14px 16px. |
| Email | Email Address | email | Same as above. |
| Order Number | Order Number (Optional) | text | Same, with "(Optional)" in placeholder. |
| Message | Message | textarea | Full-width. Min-height 140px. Same border/padding. Resize: vertical only. |

**Submit Button:** Full-width green pill. `Send Message`. DM Sans 500, 14px, ALL CAPS, white. Border-radius 40px. Padding 16px 0.

**Contact Info Block (below form, centred, 24px margin-top):**
- Hairline divider.
- **Email:** `hello@veloura.com` — DM Sans 14px, `--color-text-primary`.
- **Hours:** `Customer Support: Monday–Friday, 9am–6pm GMT` — DM Sans 13px, muted.
- Both centred.

---

## 10. TECHNICAL LOGIC & CART RULES

### 10.1 Bundle Pricing Calculation

The following pricing logic **must be enforced at the cart/checkout level**, not just in the UI display:

| Cart Contents | Checkout Price | Mechanism |
|---|---|---|
| 1x Veloura Legging | £44.99 | Standard price |
| 2x Veloura Legging | £44.99 total | Second item added with 100% automatic discount code `BOGO-VELO` applied at cart level |
| 3x Veloura Legging | £65.00 total | Cart total overridden with a fixed price discount: `3PACK-VELO` |
| +Bloom Shorts | +£24.99 | Additive to any legging bundle |

> Note: The BOGO discount must not be user-removable in the checkout flow.

### 10.2 Upsell State Management

- The Bloom Shorts upsell block (in both the cart drawer and the full cart page) must track whether Bloom Shorts are currently in the cart.
- If **Bloom Shorts ARE in the cart**: hide the "ADD TO ORDER" button. Replace the entire upsell card with a confirmation state: `✓ Bloom Shorts — Added to your protocol` in DM Sans 13px, `--color-cta-green`. The blush background block can remain but the button is replaced.
- If the user **removes** Bloom Shorts from the cart: the upsell block must revert to its original CTA state.

### 10.3 Sticky Bar Visibility Logic

- On the product page, the sticky bottom cart bar should be **hidden by default**.
- It becomes **visible** (slides up with 300ms ease animation) when the primary "ADD TO CART" button inside the buy box scrolls out of the visible viewport (intersection observer).
- It becomes **hidden again** if the user scrolls back up to reveal the in-page ATC button.

### 10.4 Before/After Slider

- Built with CSS clip-path or a JS drag solution (e.g. `img-comparison-slider` web component or custom vanilla JS).
- Must be **touch-friendly** — works with finger drag on mobile.
- Default position: 50% (centred handle).
- On page load: animate the handle from 50% → 30% → 50% over 1.5s with ease-in-out to hint at interactivity. Only plays once.

### 10.5 FAQ Accordion

- Single-open accordion: opening one item closes any previously open item.
- Transition: `max-height` animation, 200ms ease-out.
- The `+` icon rotates 45° to become `×` when the item is open. Transition: 200ms.

---

## 11. RESPONSIVE BEHAVIOUR

### 11.1 Breakpoints

| Breakpoint | Token | Width |
|---|---|---|
| Mobile | `--bp-mobile` | < 640px |
| Tablet | `--bp-tablet` | 640px – 1023px |
| Desktop | `--bp-desktop` | ≥ 1024px |

### 11.2 Key Responsive Changes

| Component | Desktop | Mobile |
|---|---|---|
| Header | Logo centred, nav links left, icons right | Logo centred, hamburger left, cart icon right |
| Hero (Home) | 50/50 split | Image top (full-width), copy below |
| Product Layout | 55/45 sticky gallery | Single column, gallery above buy box, no sticky |
| Timeline (4 steps) | 4-column horizontal | 2×2 grid |
| Bundle Card | Single centred card | Full-width, edge-to-edge |
| Cart Drawer | 480px slide-in from right | Full-screen slide-in from bottom |
| Full Cart | 65/35 two-column | Single column, summary below items |
| Our Story Hero | 16:7 aspect ratio | 16:9 or taller, text below image |
| Our Story Genesis | 55/45 two-column | Stacked, image below text |
| Footer | 3-column | Stacked |

### 11.3 Typography Scaling

All font sizes scale down by approximately 20–25% on mobile. Key values:
- H1 Hero: 64px desktop → 40px mobile
- H2 Section: 40px desktop → 28px mobile
- Cormorant Quote (Founder): 28px desktop → 22px mobile
- Body: 15px desktop → 14px mobile (no change)

---

## 12. INTERACTION & ANIMATION GUIDELINES

| Interaction | Animation | Duration | Easing |
|---|---|---|---|
| Cart drawer open | Slide from right (translateX 100% → 0) | 350ms | ease-out |
| Cart drawer close | Slide to right (translateX 0 → 100%) | 250ms | ease-in |
| Page overlay (behind drawer) | Fade in opacity (0 → 0.4) | 350ms | ease |
| FAQ accordion open | max-height 0 → auto (JS-calculated) | 200ms | ease-out |
| FAQ `+` icon rotation | rotate 0deg → 45deg | 200ms | ease |
| Bundle tier reveal (Tier 2 fields) | max-height 0 → auto + opacity fade | 300ms | ease-out |
| Sticky bar appear | translateY 100% → 0 | 300ms | ease-out |
| Sticky bar disappear | translateY 0 → 100% | 200ms | ease-in |
| B/A slider hint animation | handle translateX 50% → 20% → 50% | 1500ms | ease-in-out |
| CTA button hover | background colour darken 10% | 150ms | ease |
| Thumbnail switch (gallery) | main image opacity 1 → 0 → 1 + new src | 150ms | ease |
| Add to Cart success | Button label flashes "ADDED ✓" for 1.5s | 150ms fade | ease |

**General rule:** Animations should feel quick and functional, not showy. This is a premium editorial brand — slow, ornate animations would undermine the clinical credibility.

---

## 13. COMPONENT-LEVEL SPECS (REUSABLE)

### 13.1 Green CTA Button (Primary)

```
Background: --color-cta-green (#3A7D44)
Text: white, DM Sans 500, 13–14px, ALL CAPS, letter-spacing 0.1em
Border-radius: 40px (pill)
Padding: 14–18px top/bottom, 24–32px left/right (or full-width on contained elements)
Hover: background --color-cta-green-hover (#2E6435), transition 150ms
Active: scale(0.98)
Disabled: opacity 0.5, cursor not-allowed
Icon (optional): emoji or SVG icon with 6px right margin
```

### 13.2 Outlined Secondary Button

```
Background: transparent
Border: 1px solid --color-text-primary
Text: --color-text-primary, DM Sans 500, 12px, ALL CAPS
Border-radius: 40px
Hover: background --color-text-primary, text white
```

### 13.3 Eyebrow / Overline

```
Font: DM Sans 500
Size: 10–11px
Case: ALL CAPS
Letter-spacing: 0.15em
Colour: --color-accent-rust
Margin-bottom: 12px
Usage: Always appears above an H1 or H2 heading
```

### 13.4 Product Card (for upsell contexts)

```
Background: white
Border-radius: 8px
Shadow: --shadow-card
Padding: 16–20px
Contents: thumbnail (left) + name + description + price + action (right/bottom)
Max-width: 100% of container
```

### 13.5 Badge / Pill Tag

```
Border-radius: 40px
Padding: 4px 12px
Font: DM Sans 500, 10px, ALL CAPS, letter-spacing 0.1em
Variants:
  - "MOST POPULAR": bg #8B1A1A, text white
  - "BEST VALUE": bg --color-badge-value, text white
  - "VERIFIED PURCHASE": bg transparent, border 1px --color-cta-green, text --color-cta-green
  - "CLINICAL RESULTS": bg transparent, border 1px --color-accent-rust, text --color-accent-rust
```

---

## 14. COPY & TONE GUIDELINES

### Voice Principles

The Veloura brand voice is: **clinical but warm, confident but never aggressive**. It speaks like a knowledgeable friend who happens to be a doctor — direct, honest, evidence-based, but ultimately on the customer's side.

**DO:**
- Use first person plural ("we engineered...") for brand voice.
- Address the customer's past frustration before presenting the solution.
- Use medical/clinical vocabulary where it builds trust (lymphatic drainage, micro-circulation, dermal).
- Keep sentences short and punchy in hero headlines. Longer in body copy.
- Use *italic serif* for emotional resonance (quotes, italicised claims).

**DON'T:**
- Use aggressive loss-aversion tactics ("You're missing out!", "Last chance!").
- Use all-caps body copy (only in UI labels and eyebrows).
- Overpromise: avoid "CURE", "ELIMINATE", "PERMANENT". Use "reduce", "improve", "transform".
- Sound like a fitness brand. Veloura is a **clinical textile** brand.

### Key Brand Phrases (Must Use Consistently)

| Phrase | Context |
|---|---|
| VELO-LYMPH™ TECHNOLOGY | Eyebrow overlines, product name sub-label |
| Clinical micro-compression | Product description copy |
| Structural change | Review section headings, hero copy |
| Your protocol | Cart page header, bundle heading |
| Complete your protocol | Upsell section heading |
| 30-day clinical trial guarantee | Trust badge, FAQ answer |
| Treat the cause, not the symptom | Persuasion copy, science sections |

---

*End of PRD v2.0 — Veloura Premium E-Commerce Platform*
