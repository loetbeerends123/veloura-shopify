---
name: Luxury Editorial & Scientific Precision
colors:
  surface: '#fff8f6'
  surface-dim: '#e6d7d2'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ec'
  surface-container: '#faebe5'
  surface-container-high: '#f5e5e0'
  surface-container-highest: '#efdfda'
  on-surface: '#221a17'
  on-surface-variant: '#54433d'
  inverse-surface: '#372e2b'
  inverse-on-surface: '#fdede8'
  outline: '#87736c'
  outline-variant: '#dac1b9'
  surface-tint: '#934a2b'
  primary: '#904829'
  on-primary: '#ffffff'
  primary-container: '#ae5f3f'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb599'
  secondary: '#286b34'
  on-secondary: '#ffffff'
  secondary-container: '#abf4ae'
  on-secondary-container: '#2e713a'
  tertiary: '#006761'
  on-tertiary: '#ffffff'
  tertiary-container: '#00837b'
  on-tertiary-container: '#f3fffc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbce'
  primary-fixed-dim: '#ffb599'
  on-primary-fixed: '#370e00'
  on-primary-fixed-variant: '#753316'
  secondary-fixed: '#abf4ae'
  secondary-fixed-dim: '#90d794'
  on-secondary-fixed: '#002107'
  on-secondary-fixed-variant: '#07521f'
  tertiary-fixed: '#8ff4ea'
  tertiary-fixed-dim: '#72d7ce'
  on-tertiary-fixed: '#00201e'
  on-tertiary-fixed-variant: '#00504b'
  background: '#fff8f6'
  on-background: '#221a17'
  surface-variant: '#efdfda'
typography:
  display-lg:
    fontFamily: ebGaramond
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: 0.04em
  headline-lg:
    fontFamily: ebGaramond
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: ebGaramond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  headline-md:
    fontFamily: ebGaramond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
    letterSpacing: 0.02em
  headline-sm:
    fontFamily: ebGaramond
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  body-lg:
    fontFamily: dmSans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: dmSans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: dmSans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-lg:
    fontFamily: dmSans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
  label-md:
    fontFamily: dmSans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: dmSans
    fontSize: 10px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  max-width: 1280px
---

## Brand & Style

This design system embodies a "Scientific Editorial" aesthetic—a fusion of high-end luxury fashion layouts and the rigorous, clean presentation of clinical skincare. The brand personality is sophisticated and authoritative, yet approachable through warmth in its accent palette. 

The visual style leans heavily into **Minimalism** with a focus on:
- **Generous Whitespace:** Utilizing negative space to create a sense of breathing room and exclusivity.
- **Precision:** 1px hairline rules and strict grid alignment to evoke a "scientific" and "formulaic" feel.
- **High-Contrast Typography:** Juxtaposing timeless serifs with modern, functional sans-serifs.
- **Tactile Accents:** Subtle depth applied only to high-conversion elements, ensuring the interface remains lightweight and fast.

## Colors

The palette is rooted in botanical and earthy tones, balanced against a pristine white laboratory backdrop.

- **Primary (Terracotta/Blush):** Used for storytelling elements, reviews, and soft brand accents. It provides warmth and a human touch to the scientific aesthetic.
- **Secondary (Forest Green):** Reserved exclusively for primary transactional actions, such as "Add to Cart." This creates a strong psychological link between the brand's botanical roots and the act of purchasing.
- **Accent (Vibrant Green):** A high-visibility green used strictly for trust indicators, success states, and validation.
- **Neutrals:** Pure white backgrounds preserve the "clean" narrative, while the UI Gray Light is used for subtle sectioning. Hairline borders (#DEDEDE) provide structure without adding visual weight.

## Typography

Typography is the primary driver of the brand's "Editorial" feel. 

- **Headlines:** `ebGaramond` is used to provide a classic, literary authority. Large display sizes should utilize wide letter-spacing (4%) to emphasize the luxury nature of the content.
- **Body & UI:** `dmSans` provides a modern, geometric contrast. It is highly legible and functional, ensuring that "scientific" product data and clinical facts are easy to digest.
- **Labels:** Uppercase labels with increased tracking are used for categories and overlines to create a rhythmic hierarchy across long-form landing pages.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model on desktop to maintain the composed look of a magazine spread, while transitioning to a fluid model on mobile.

- **Grid:** A 12-column grid is used for desktop (1280px max-width). Components should often span "offset" columns (e.g., a 5-column image next to a 6-column text block with a 1-column gap) to create visual interest.
- **Rhythm:** A 4px base unit governs all internal padding. External section spacing is aggressive (80px to 120px) to force focus on individual product narratives.
- **Mobile Adaption:** Margins reduce to 16px, and multi-column editorial layouts reflow into a single stacked column, prioritizing large, full-bleed imagery.

## Elevation & Depth

This design system uses a "Flat-Plus" approach. Depth is not used to simulate real-world objects, but to highlight interactive priority.

- **Hairline Rules:** Most "containers" are defined by 1px solid borders (`#DEDEDE`) rather than shadows. This maintains the clean, scientific aesthetic.
- **Interactive Depth:** The "Add to Cart" button is the only element that utilizes a distinctive shadow: a soft, Forest Green glow (`rgba(58, 125, 68, 0.3) 0px 6px 20px 0px`). This makes the primary CTA feel "lifted" and physically pressable.
- **Tonal Layering:** Use the UI Gray Light (`#F9F9F9`) to create subtle background shifts between the "Hero," "Ingredients," and "Reviews" sections without needing heavy borders.

## Shapes

The shape language is a mix of geometric discipline and organic softness.

- **Cards & Modules:** An 8px (`rounded-lg`) radius is applied to product cards and images, providing a soft, modern container that feels premium.
- **CTAs:** Primary buttons use a 50px pill radius. This organic shape contrasts against the rigid grid, making buttons feel more inviting and "touchable."
- **Inputs:** Form fields use a more conservative 4px radius to maintain the precise, scientific look of the UI.

## Components

### Buttons
- **Primary (Transactional):** Pill-shaped, Forest Green background, white text, with the specific green ambient shadow.
- **Secondary (Editorial):** Ghost buttons with a 1px Terracotta border and Terracotta text. No shadow.
- **Tertiary:** Underlined text using `label-lg` styling for "Learn More" links within scientific descriptions.

### Cards
- **Product Card:** White background, 8px corner radius, 1px hairline border. The product image should be centered with ample padding (32px+).
- **Review Card:** Soft Terracotta (`#C4714F`) accents in the star ratings, using `ebGaramond` for the quote text to feel like a testimonial in a luxury magazine.

### Inputs
- **Text Fields:** 1px `#DEDEDE` border, 4px radius. On focus, the border shifts to Forest Green. Labels use `label-md` and sit above the field.

### Chips & Trust Indicators
- **Scientific Validation:** Small badges with a Vibrant Green (`#278B1E`) icon and `label-sm` text. These are used near ingredient lists to denote "Clinical Results" or "Vegan Formula."
- **Reviews:** Use a light tint of the Primary color for background fills on review summary chips.