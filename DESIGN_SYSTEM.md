# Zorvate Design System

This document defines the semantic design tokens used throughout the Zorvate application. All UI components consume these tokens to ensure consistency, maintainability, and unified visual language.

## Token Organization

Design tokens are defined as CSS custom properties in [app/globals.css](app/globals.css) and organized by semantic purpose.

---

## 1. Color Tokens

### Primary Palette (Amethyst)

- `--color-amethyst`: `#9B5CF6` — Primary brand color
- `--color-amethyst-foreground`: `#FAFAF8` — Text on amethyst backgrounds
- `--color-amethyst-soft`: `rgba(155, 92, 246, 0.08)` — Subtle tinted backgrounds

### Surface & Background

- `--color-surface`: `#111118` — Primary surface color for cards
- `--color-surface-secondary`: `#111827` — Secondary surface for depth
- `--color-background`: `#09090B` — Main app background
- `--color-foreground`: `#FAFAF8` — Primary text color
- `--color-muted-foreground`: `#A0A0A8` — Muted/secondary text

### Semantic Colors

- `--color-border`: `#27272E` — Border and divider color
- `--color-input`: `#27272E` — Input field background
- `--color-primary`: `#9B5CF6` — Alias for primary brand action
- `--color-primary-foreground`: `#FAFAF8` — Text on primary backgrounds

---

## 2. Typography Scale

Defined in Tailwind configuration; uses system fonts with geometric sans-serif preference.

- `text-xs`: 0.75rem (12px)
- `text-sm`: 0.875rem (14px)
- `text-base`: 1rem (16px)
- `text-lg`: 1.125rem (18px)
- `text-2xl`: 1.5rem (24px)
- `text-3xl` through `text-5xl`: Headline sizes

**Font Weight Scale**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold), 900 (black)

---

## 3. Spacing Scale

- `--spacing-xs`: `0.25rem` (4px)
- `--spacing-sm`: `0.5rem` (8px)
- `--spacing-md`: `1rem` (16px)
- `--spacing-lg`: `1.5rem` (24px)

Used in padding, margin, and gap utilities throughout components.

---

## 4. Border Radius Scale

- `--radius-sm`: `0.5rem` (8px) — Small elements (badges, small buttons)
- `--radius-md`: `0.75rem` (12px) — Medium elements
- `--radius-lg`: `1rem` (16px) — Large elements
- `--radius-button`: `0.875rem` (14px) — Standardized button radius
- `--radius-card`: `1.25rem` (20px) — Card corners
- `--radius-control`: `0.875rem` (14px) — Form inputs
- `--radius-pill`: `9999px` — Fully rounded (badges, pills)

---

## 5. Shadow System

All shadows use soft, elevated definitions to create depth without harshness.

- `--shadow-sm`: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- `--shadow-md`: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`
- `--shadow-lg`: `0 10px 15px -3px rgba(0, 0, 0, 0.2)`
- `--shadow-button`: `0 10px 24px -18px rgba(155, 92, 246, 0.34)` — Amethyst-tinted shadow
- `--shadow-card`: `0 8px 20px -2px rgba(0, 0, 0, 0.15)` — Card elevation
- `--shadow-amethyst`: `0 0 20px rgba(155, 92, 246, 0.4)` — Brand glow effect

---

## 6. Motion Tokens

### Transition Timing

- `--transition-standard`: Animate color, background, border, shadow, and opacity at 180ms with ease timing
- Duration: `180ms`
- Easing: `ease` (cubic-bezier(0.25, 0.46, 0.45, 0.94))

### Animation Curves

- `--ease-out-expo`: `cubic-bezier(0.16, 1, 0.3, 1)` — Exit animation (exit transitions)

**Properties**: The standard transition applies to:
- `color`
- `background-color`
- `border-color`
- `box-shadow`
- `opacity`

---

## 7. Component Patterns

### Button Variants

All buttons use `--radius-button` for consistent corner treatment.

- **Default**: Amethyst background with hover shadow elevation
- **Secondary**: Transparent with border
- **Outline**: Border-only variant
- **Ghost**: Text-only variant
- **Disabled**: 50% opacity

### Input Variants

All inputs use `--radius-control` for consistent corner treatment.

- **Default**: Surface background with border
- **Focus**: Primary border highlight
- **Disabled**: Muted foreground, reduced opacity
- **Error**: Rose border

### Card Variants

All cards use `--radius-card` for consistent corner treatment.

- **Elevated**: `--shadow-card` with surface background
- **Flat**: No shadow, border only
- **Translucent**: Glass effect with backdrop blur

---

## 8. Semantic Utilities

### Glass Panel

Glassmorphic surface with frosted effect:
- `backdrop-filter: blur(16px)`
- Background: `color-mix(in srgb, var(--color-surface) 60%, transparent)`
- Border: `1px solid var(--color-border)`
- Shadow: `var(--shadow-card)`

### Glass Panel Elevated

Enhanced glass effect for emphasis:
- `backdrop-filter: blur(18px)`
- Background: `color-mix(in srgb, var(--color-surface) 70%, transparent)`
- Border: `1px solid var(--color-border)`

### Glow Hover

Interactive glow effect on hover:
- Applies `--transition-standard` motion
- On hover: Primary border and `--shadow-amethyst`

---

## 9. Usage Guidelines

### Color Consumption

Replace all hardcoded hex values with semantic color tokens:

```css
/* ❌ Hardcoded */
.button { background: #9B5CF6; }

/* ✅ Token-based */
.button { background: var(--color-amethyst); }
```

### Radius Consumption

Use context-specific radius tokens instead of generic classes:

```css
/* ❌ Generic */
.button { border-radius: 0.75rem; }

/* ✅ Semantic */
.button { border-radius: var(--radius-button); }
```

### Motion Consistency

Use `--transition-standard` for all interactive state changes:

```css
/* ✅ Consistent */
.interactive { transition: var(--transition-standard); }
```

---

## 10. Design System Evolution

As the design system matures:

- **Phase 1**: Establish semantic tokens and document (current)
- **Phase 2**: Component library with variant documentation
- **Phase 3**: Accessibility audit and WCAG compliance
- **Phase 4**: Animation storybook and motion guidelines
- **Phase 5**: Design tokens in multiple output formats (JSON, figma-tokens, etc.)

---

## 11. References

- **Color System**: Amethyst (#9B5CF6) primary, dark mode (surface #111118)
- **Spacing**: 4px base unit system
- **Typography**: System fonts with 1rem = 16px base
- **Motion**: 180ms standard, ease curves for consistency
- **Accessibility**: WCAG AA compliant contrast ratios minimum

---

## 12. Contributing

When adding new design tokens:

1. Define in [app/globals.css](app/globals.css) as CSS custom property in `@theme` block
2. Document semantic purpose in this file
3. Update component examples
4. Verify all usages follow token pattern
5. Run type-check, lint, and build validation
