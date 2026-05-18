---
name: Coderun High-Fidelity Gamification
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#454655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#767686'
  outline-variant: '#c6c5d7'
  surface-tint: '#3f4cda'
  primary: '#3d4ad8'
  on-primary: '#ffffff'
  primary-container: '#5865f2'
  on-primary-container: '#fffdff'
  inverse-primary: '#bec2ff'
  secondary: '#006e2f'
  on-secondary: '#ffffff'
  secondary-container: '#6bff8f'
  on-secondary-container: '#007432'
  tertiary: '#835200'
  on-tertiary: '#ffffff'
  tertiary-container: '#a46800'
  on-tertiary-container: '#fffdff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bec2ff'
  on-primary-fixed: '#000569'
  on-primary-fixed-variant: '#222fc2'
  secondary-fixed: '#6bff8f'
  secondary-fixed-dim: '#4ae176'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005321'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  code-sm:
    fontFamily: jetbrainsMono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 64px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The design system is engineered for a high-energy, gamified learning environment that balances professional software engineering education with the addictive engagement of modern social and gaming platforms. The brand personality is **motivating, precise, and tech-forward**. It avoids "juvenile" gamification in favor of a polished, premium "Pro-Tech" aesthetic.

The visual direction follows a **Modern-SaaS-meets-Glassmorphism** style. It utilizes high-fidelity depth, subtle background blurs, and vibrant accent glows to create a sense of momentum. The goal is to make the act of coding feel like a high-end experience rather than a chore.

**Key Visual Principles:**
- **Kinetic Energy:** Use subtle scale transforms and "glow-ups" on interactive elements.
- **Visual Clarity:** High whitespace and clear typographic hierarchy to ensure complex code samples remain readable.
- **Premium Depth:** Layers are defined by soft shadows and material translucency rather than heavy borders.

## Colors

The palette is anchored by a vibrant **Blurple** (#5865F2), which serves as the primary driver for action and progression. 

- **Primary Gradient:** Used exclusively for "Hero" moments, high-level achievement cards, and primary call-to-actions.
- **Success/Warning/Error:** These follow a high-saturation logic to ensure they stand out against clean white surfaces. 
- **Neutral Palette:** We use a Slate-based neutral scale (#0F172A) to maintain a modern "tech" feel, avoiding muddy grays.
- **Surface Strategy:** Use `surface-bright` for the main canvas and `surface-dim` for secondary sidebars or inset code editors to provide structural contrast.

## Typography

**Plus Jakarta Sans** is the sole typeface for the UI, chosen for its modern, geometric construction and approachable curves.

- **Headlines:** Use Bold (700) or ExtraBold (800) weights with tighter letter-spacing to create a "locked-in" professional look.
- **Body:** Standard body text uses the 400 weight. For emphasis within learning modules, use the Medium (500) weight rather than Bold to maintain visual lightness.
- **Code Snippets:** While the UI uses Plus Jakarta Sans, all code-specific blocks must revert to **JetBrains Mono** for technical legibility.

## Layout & Spacing

The design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

- **Rhythm:** All spacing is derived from a 4px base unit. 
- **Generous Margins:** To evoke a premium feel, avoid crowding elements. Use `xl` (40px) or `xxl` (64px) vertical spacing between major sections.
- **Safe Areas:** On mobile, ensure a minimum horizontal margin of 20px. 
- **The "Dashboard" View:** For the learning interface, use a "Fixed-Sidebar / Fluid-Content" model to maximize the space available for the code editor and instructions.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and **Glassmorphism**. 

- **Level 1 (Base):** White or `surface-bright` flat surfaces.
- **Level 2 (Cards/Inputs):** A very soft, diffused shadow: `0 4px 20px rgba(15, 23, 42, 0.05)`.
- **Level 3 (Floating Menus/Modals):** More pronounced depth with a slight primary-color tint in the shadow: `0 12px 40px rgba(88, 101, 242, 0.15)`.
- **Glass Effects:** Use a `backdrop-filter: blur(12px)` on navigation bars and overlay panels, paired with a subtle `1px` white border at 20% opacity to define the edge.

## Shapes

The shape language is **playful and generous**. 

- **Standard Elements:** Buttons, inputs, and small cards use a **16px** (`rounded-lg`) radius.
- **Container Elements:** Large feature cards and modals use a **24px** (`rounded-xl`) radius.
- **Selection States:** Use pill-shaped (full radius) indicators for active tabs or tags to differentiate them from functional buttons.

## Components

### Buttons
- **Primary:** Primary-Gradient background, white text. On hover, apply a `1.02` scale transform and a `box-shadow: 0 0 20px rgba(88, 101, 242, 0.4)`.
- **Secondary:** Surface-Dim background with Primary-colored text.
- **Active State:** On click, use a `0.98` scale and `2px` downward translation to feel "tactile."

### Input Fields
- **Default:** `surface-bright` background with a subtle gray border.
- **Focus State:** Transition the border to Primary-Blue and add a `4px` outer soft glow (spread) of the primary color at 20% opacity.

### Progress Bars
- Use a rounded track with a 12px height. The "fill" should be the Primary-Gradient and include a subtle "shimmer" animation to indicate active learning.

### Cards
- Always use a white background. Include a `1px` border of `surface-dim`. For "Achievement" cards, add a 2px Primary-Gradient border.

### Chips/Tags
- Small, uppercase `label-md` text. Use low-opacity versions of the secondary colors (e.g., Success Green at 10% opacity) for the background to keep the UI light.