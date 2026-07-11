# InternHive Career Platform Design System

This document outlines the design system specifications for the InternHive Career Platform, extracted from the Stitch project configuration. The system is engineered to build a high-trust, professional marketplace connecting university students with industry leaders. The brand personality is **authoritative yet accessible**, bridging the gap between academic ambition and corporate reality.

---

## 🎨 Color Palette

The visual style follows a **Modern Corporate** aesthetic with a heavy emphasis on **Card-based Minimalism**. It utilizes "safe" blue tones energized by purposeful amber accents to guide user actions and highlight career milestones.

### Core Brand Colors

| Color | Hex | Role & Description |
| :--- | :--- | :--- |
| **Primary (Deep Navy)** | `#14213D` | Used for global navigation, structural headers, and primary interaction states. Establishes institutional trust. |
| **Secondary (Amber/Orange)** | `#FCA311` | Used for key conversion points, alerts, and high-visibility CTAs (approx. 5% ratio). |
| **Neutral Dark (Charcoal)** | `#1B1B1E` | Used for main body text to ensure AAA accessibility. |
| **Neutral Light (Off-white)** | `#F5F3F6` | Provides a soft surface canvas that reduces screen glare compared to pure white. |

### Color Tokens (Material-Style)

#### Primary & Accent Tones
*   `primary`: `#000A24`
*   `on-primary`: `#FFFFFF`
*   `primary-container`: `#14213D`
*   `on-primary-container`: `#7C89AA`
*   `inverse-primary`: `#B9C6EA`
*   `secondary`: `#855300`
*   `on-secondary`: `#FFFFFF`
*   `secondary-container`: `#FFA515`
*   `on-secondary-container`: `#684000`
*   `tertiary`: `#090B0C`
*   `on-tertiary`: `#FFFFFF`
*   `tertiary-container`: `#202222`
*   `on-tertiary-container`: `#888989`

#### Surfaces & Backgrounds
*   `background`: `#FBF8FB`
*   `on-background`: `#1B1B1E`
*   `surface`: `#FBF8FB`
*   `on-surface`: `#1B1B1E`
*   `surface-dim`: `#DBD9DC`
*   `surface-bright`: `#FBF8FB`
*   `surface-variant`: `#E4E2E5`
*   `on-surface-variant`: `#45464D`
*   `surface-tint`: `#525E7D`
*   `inverse-surface`: `#303033`
*   `inverse-on-surface`: `#F2F0F3`

#### Surface Containers (Elevation Hierarchy)
*   `surface-container-lowest`: `#FFFFFF` (Main Elevated Surfaces/Cards)
*   `surface-container-low`: `#F5F3F6`
*   `surface-container`: `#F0EDF0`
*   `surface-container-high`: `#EAE7EA`
*   `surface-container-highest`: `#E4E2E5`

#### Boundaries & Status
*   `outline`: `#75777E`
*   `outline-variant`: `#C5C6CE`
*   `error`: `#BA1A1A`
*   `on-error`: `#FFFFFF`
*   `error-container`: `#FFDAD6`
*   `on-error-container`: `#93000A`

---

## 🔤 Typography

This design system utilizes a dual-font strategy. **Space Grotesk** is used for headlines to provide a modern, technical character suited for a tech-forward student demographic. **Inter** is used for all functional and body text to ensure legibility across various screen sizes.

### Headings (Space Grotesk)
Headlines use tight letter-spacing to maintain a locked-in, professional feel.

*   **`display-lg`**
    *   `font-family`: `Space Grotesk`, sans-serif
    *   `font-size`: `48px`
    *   `font-weight`: `700` (Bold)
    *   `line-height`: `56px`
    *   `letter-spacing`: `-0.02em`
*   **`headline-lg`**
    *   `font-family`: `Space Grotesk`, sans-serif
    *   `font-size`: `32px`
    *   `font-weight`: `700` (Bold)
    *   `line-height`: `40px`
*   **`headline-lg-mobile`**
    *   `font-family`: `Space Grotesk`, sans-serif
    *   `font-size`: `24px`
    *   `font-weight`: `700` (Bold)
    *   `line-height`: `32px`
*   **`headline-md`**
    *   `font-family`: `Space Grotesk`, sans-serif
    *   `font-size`: `24px`
    *   `font-weight`: `600` (Semi-Bold)
    *   `line-height`: `32px`

### Body & Labels (Inter)
Body text relies on standard Inter metrics for optimal reading flow.

*   **`body-lg`**
    *   `font-family`: `Inter`, sans-serif
    *   `font-size`: `18px`
    *   `font-weight`: `400` (Regular)
    *   `line-height`: `28px`
*   **`body-md`**
    *   `font-family`: `Inter`, sans-serif
    *   `font-size`: `16px`
    *   `font-weight`: `400` (Regular)
    *   `line-height`: `24px`
*   **`body-sm`**
    *   `font-family`: `Inter`, sans-serif
    *   `font-size`: `14px`
    *   `font-weight`: `400` (Regular)
    *   `line-height`: `20px`
*   **`label-md`**
    *   `font-family`: `Inter`, sans-serif
    *   `font-size`: `14px`
    *   `font-weight`: `600` (Semi-Bold)
    *   `line-height`: `16px`
    *   `letter-spacing`: `0.01em`
*   **`label-sm`**
    *   `font-family`: `Inter`, sans-serif
    *   `font-size`: `12px`
    *   `font-weight`: `500` (Medium)
    *   `line-height`: `14px`

---

## 📐 Layout & Spacing

The system follows a strict **Fluid Grid** model with a 12-column foundation for desktop, reflowing to a simpler structure for smaller viewports.

*   **Grid Layouts:**
    *   **Desktop (1024px+):** 4-column card grid, or 12-column layout for complex dashboards.
    *   **Tablet (768px - 1023px):** 2-column card grid.
    *   **Mobile (Up to 767px):** 1-column card grid.
*   **Scale Metrics:**
    *   `base`: `8px` rhythmic scale.
    *   `gutter`: `24px`
    *   `margin-mobile`: `16px`
    *   `margin-desktop`: `40px`
    *   `container-max`: `1200px`

---

## 💎 Elevation & Depth

Hierarchy is established through **Ambient Shadows** on top of the Off-white background. Surfaces should not use heavy borders; instead, depth defines the interactive zones.

*   **Level 0 (Background):** Flat `#F5F5F5` background.
*   **Level 1 (Cards):** White (`#FFFFFF`) with a soft shadow:
    `box-shadow: 0px 4px 20px rgba(20, 33, 61, 0.05);`
*   **Level 2 (Hover/Active):** White (`#FFFFFF`) with a more pronounced shadow:
    `box-shadow: 0px 8px 30px rgba(20, 33, 61, 0.08);`

---

## 🟢 Shapes

The shape language is **"Hyper-Softened"** to create a friendly, modern container feel, but stays structured for interaction fields.

*   `sm`: `0.25rem` (4px)
*   `DEFAULT`: `0.5rem` (8px)
*   `md`: `0.75rem` (12px)
*   `lg`: `1rem` (16px) — Used for Buttons & Input Fields to maintain a professional, clickable appearance.
*   `xl`: `1.5rem` (24px) — Used for Main Cards (2xl corner radius) to soften the layout.
*   `full`: `9999px` — Used for Status Badges/Chips (pill shape).

---

## 🧩 Component Specifications

### Buttons
*   **Primary:** Solid Navy (`#14213D`) background with White (`#FFFFFF`) text. No border. Corner radius `lg` (8px).
*   **Secondary:** Transparent background with a 2px Amber (`#FCA311`) outline and Amber text.
*   **Tertiary:** Ghost style; Navy text with no background, used for low-priority actions (e.g., 'Cancel').

### Cards
All internship listings and profile snippets are housed in cards. Cards must include `24px` internal padding, a `24px` border radius, and the Level 1 shadow. On hover, the card should transition smoothly to Level 2 elevation.

### Input Fields
Inputs use a white background with a 1px border (`#E5E5E5`). On focus, the border shifts to Navy (`#14213D`) with a subtle 2px glow of the same color at 10% opacity.

### Status Badges
Small, pill-shaped (`full`) indicators:
*   **"New" / "Hot" Internships:** Light Amber tint background with Dark Amber text.
*   **"Applied":** Light Navy tint background with Navy text.

### Navigation
The top navigation bar is a solid Navy (`#14213D`) with white links. The active state is indicated by a 3px Amber underline or an Amber text color shift.
