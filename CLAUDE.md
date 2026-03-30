# CLAUDE.md — Lumen Project Instructions

## What is this project?

Lumen is a showcase website (like React Bits) for AI-native UI components. It displays interactive demos of components designed for AI product interfaces — reasoning, decision, action, and output patterns. It is NOT an npm package. It is a portfolio-grade showcase site.

## Tech stack

- Next.js 14+ (App Router)
- TypeScript (strict)
- Tailwind CSS 3.x
- Framer Motion (animations)
- Shiki (code highlighting)
- Lucide React (icons)
- Deployed on Vercel

## Key files

- `SPEC.md` — Full engineering specification. READ THIS FIRST before making any structural decisions.
- `src/data/registry.ts` — Central component registry. Every component must be registered here.
- `src/types/component-meta.ts` — Component metadata types.
- `src/types/controls.ts` — Control panel type definitions.
- `src/styles/globals.css` — CSS variables (color tokens, typography).

## Project structure rules

### Site chrome vs library components

- `src/components/site/` — Site UI (sidebar, nav, preview frame, controls panel, code panel). These are the SHELL.
- `src/components/library/` — The actual showcase components organized by category. These are the CONTENT.

Never mix these. Site chrome renders library components inside preview frames.

### Library component structure

Every component in `src/components/library/` follows this structure:

```
[ComponentName]/
  ├── index.tsx        # Main component (Desktop default)
  ├── mobile.tsx       # Mobile variant (when behavior differs significantly)
  ├── controls.tsx     # ControlDefinition[] export
  ├── code.tsx         # Raw code string for the code panel
  ├── rationale.mdx    # Usage rationale markdown
  └── meta.ts          # ComponentMeta export
```

### Adding a new component

1. Create the directory in the correct category under `src/components/library/`
2. Implement all 6 files above
3. Register it in `src/data/registry.ts`
4. The routing is automatic via `[category]/[slug]` dynamic routes

## Design system

### Color rules (STRICT)

- Green `#0BE09B` — accent, CTA, success, confidence-high. NEVER use for backgrounds.
- Blue `#0091FF` — interactive elements, selected states, links.
- Orange `#FB7A29` — warnings, urgency indicators.
- Background hierarchy: `#0A0A0B` → `#111113` → `#18181B` (primary → secondary → elevated).
- Text hierarchy: white at 85% → 55% → 35% → 25% opacity.
- Borders: white at 6% default, 12% hover, 20% active.

### Typography rules

- Font: Geist (sans) + Geist Mono (code).
- All numbers: `tabular-nums`.
- Never use font sizes outside this scale: 12 / 14 / 16 / 20 / 28 px.

### Motion rules

- Site UI transitions: 150-300ms, ease-out or spring.
- Component animations: use Framer Motion, respect `prefers-reduced-motion`.
- All animated properties should use `transform` and `opacity` for GPU acceleration.
- No animation should block interaction.

### Layout rules

- Sidebar: 260px fixed width, collapsible on mobile.
- Content area: max-width 900px.
- Preview frame: `rounded-xl`, subtle border, dark bg.
- Spacing base unit: 4px.

## Component design philosophy

### Two-layer parameter system

Every component has TWO kinds of props:

**Layer A — Visual/Motion**: speed, blur, opacity, scale, stagger, easing. These control HOW it looks.

**Layer B — Product Semantic**: confidence, urgency, trust level, density, recommendation strength. These control WHAT it communicates.

The controls panel exposes BOTH layers. Layer B is what differentiates Lumen from generic animation libraries.

### Desktop vs Mobile is NOT just responsive

When building mobile variants, do NOT just make it narrower. Change the BEHAVIOR:
- Different layout logic (side-by-side → stacked)
- Different interaction model (hover → tap)
- Different information density (dense → progressive disclosure)
- Different animation rhythm (simultaneous → sequential)

### Device toggle

The DeviceToggle switches between rendering the Desktop and Mobile variant. It does NOT resize an iframe. It loads a different component (or passes a different `device` prop that changes layout logic).

## Code style

- Use `cn()` utility for conditional classnames (clsx + tailwind-merge).
- Prefer Tailwind classes over inline styles.
- Use CSS variables from `globals.css` for all theme colors.
- Components must be self-contained — no global state dependencies.
- All components must have TypeScript interfaces for their props.
- Named exports for everything except page components (default export).

## What NOT to do

- Do NOT install a state management library. Use React state.
- Do NOT add a database. This is a static showcase site.
- Do NOT create an npm package structure. Components live in the site repo.
- Do NOT use `localStorage` except for device toggle preference.
- Do NOT add authentication.
- Do NOT over-abstract. Each component can be somewhat self-contained — DRY is secondary to clarity.
- Do NOT use Inter, Roboto, Arial, or system fonts. Geist only.

## Commit conventions

- `feat: add [ComponentName] component`
- `fix: [ComponentName] — description`
- `site: update sidebar / nav / layout`
- `docs: update rationale for [ComponentName]`
- `chore: dependency / config updates`
