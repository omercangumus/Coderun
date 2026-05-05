---
name: Ghost Code
colors:
  surface: '#f7fafd'
  surface-dim: '#d7dade'
  surface-bright: '#f7fafd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f8'
  surface-container: '#ebeef2'
  surface-container-high: '#e5e8ec'
  surface-container-highest: '#e0e3e7'
  on-surface: '#181c1f'
  on-surface-variant: '#454655'
  inverse-surface: '#2d3134'
  inverse-on-surface: '#eef1f5'
  outline: '#767686'
  outline-variant: '#c6c5d7'
  surface-tint: '#3f4cda'
  primary: '#3d4ad8'
  on-primary: '#ffffff'
  primary-container: '#5865f2'
  on-primary-container: '#fffdff'
  inverse-primary: '#bec2ff'
  secondary: '#006d37'
  on-secondary: '#ffffff'
  secondary-container: '#6bfe9c'
  on-secondary-container: '#00743a'
  tertiary: '#81419c'
  on-tertiary: '#ffffff'
  tertiary-container: '#9c5ab7'
  on-tertiary-container: '#fffdff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bec2ff'
  on-primary-fixed: '#000569'
  on-primary-fixed-variant: '#222fc2'
  secondary-fixed: '#6bfe9c'
  secondary-fixed-dim: '#4ae183'
  on-secondary-fixed: '#00210c'
  on-secondary-fixed-variant: '#005228'
  tertiary-fixed: '#f8d8ff'
  tertiary-fixed-dim: '#ebb2ff'
  on-tertiary-fixed: '#320047'
  on-tertiary-fixed-variant: '#692984'
  background: '#f7fafd'
  on-background: '#181c1f'
  surface-variant: '#e0e3e7'
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.2'
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Lexend
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  button-text:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-page: 32px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The brand personality is that of a "brilliant but humble mentor"—approachable, encouraging, and clarity-focused. It targets aspiring developers and engineers who may find tech intimidating, transforming complex subjects like DevOps and Python into an engaging, bite-sized journey.

The design style is **Tactile Modernism**. It blends the clean lines of modern SaaS with the "squishy," playful physicality of gamified learning apps. The UI should feel like a premium toy: high-quality, responsive, and physically satisfying to interact with. A friendly ghost mascot serves as the emotional anchor, appearing in varying states of celebration or guidance to keep the user motivated.

## Colors
This design system utilizes a palette that bridges the gap between a dark-mode IDE and a vibrant learning environment.
- **Primary (Logic Blue):** A deep, energetic blue used for main actions and branding.
- **Secondary (Execute Green):** A bright, "success" green for progress bars, correct answers, and growth.
- **Tertiary (Deploy Purple):** A royal purple for premium features, streaks, and "XP" related elements.
- **Neutral (Terminal Dark):** Used for primary text and headers to maintain a professional tech-edge.
- **Backgrounds:** Use extremely soft off-whites (#F7F9FC) to ensure the vibrant components pop without causing eye strain.

## Typography
The typography strategy prioritizes accessibility and friendliness. 
- **Headlines:** Use **Plus Jakarta Sans** with extra-bold weights to create a welcoming, soft-geometric look.
- **Body:** **Lexend** is chosen specifically for its proven readability in educational contexts, reducing visual noise for learners.
- **Labels/Tech Data:** **Space Grotesk** is used sparingly for XP counters, streak numbers, and technical labels to provide a subtle "code-like" futuristic feel without sacrificing the friendly aesthetic.

## Layout & Spacing
The layout follows a **Fixed-Width Fluid Grid**. On desktop, content is contained within a 1200px max-width container to prevent line-lengths from becoming unreadable. 

The spacing rhythm is based on an 8px base unit. Generous white space is essential—avoid cluttering the screen with too many lessons at once. Each "learning node" on the path should have significant breathing room to emphasize the feeling of a journey. Use vertical stacks for lesson paths and horizontal grids for dashboard cards.

## Elevation & Depth
This design system avoids traditional "floating" shadows in favor of **Isometric Depth Layers**. 
- **The "3D" Effect:** Buttons and cards should have a solid bottom-border (2pt to 4pt thick) in a darker shade of the element's color, simulating a physical button that can be pressed down.
- **Soft Ambient Shadows:** Use very large, very soft shadows (blur 30px+, opacity 5%) on active cards to make them feel "lifted" from the page.
- **Ghosting:** The mascot and certain floating tooltips use a soft backdrop blur (12px) to signify they are auxiliary to the main learning content.

## Shapes
Everything in this design system is rounded to evoke safety and friendliness. 
- **Standard Components:** Use a 0.5rem (8px) radius.
- **Large Cards & Path Nodes:** Use 1.5rem (24px) to create a distinct, "bubbly" appearance.
- **Interactive Elements:** Buttons should use 1rem (16px) or full pill-shape for secondary actions.
- **The Mascot:** The ghost mascot is the "softest" element, composed of continuous curves with no sharp angles, mirroring the rounded corners of the UI.

## Components
- **Path Nodes:** Circular or squircle-shaped icons representing lessons. When completed, they turn vibrant green with a thick "pressed" bottom border.
- **The "Grand Slam" Button:** Primary buttons feature a 4px bottom offset that disappears when clicked, providing tactile feedback.
- **Progress Bars:** Thick, rounded tracks with a vibrant green fill. The fill should have a subtle "shimmer" animation when progress increases.
- **Streak Indicators:** A "Flame" icon card using energetic purples and oranges, featuring a bold counter in Space Grotesk.
- **Gamified Cards:** Lessons are housed in white cards with a subtle 2px border (#E5E9F0). On hover, the border color changes to the primary blue.
- **Mascot Tooltips:** Soft, rounded speech bubbles that appear next to the ghost mascot, using a high-contrast dark background with white text for "pro-tips."