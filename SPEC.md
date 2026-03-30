# Lumen — Engineering Specification

> An interactive component library for AI-native products — built for reasoning, decision, action, and premium multi-device experiences.

---

## 1. Project Overview

**Lumen** is a showcase site (à la React Bits) that presents a curated set of interactive UI components designed specifically for AI-native products. It is NOT a general-purpose animation library. Every component exists to solve a real interaction problem in AI product interfaces — reasoning visualization, decision presentation, action confirmation, output reveal.

The site itself is the primary deliverable. Component code is displayed, demoed, and copyable — but Lumen is not an npm package (yet). It is a portfolio-grade, publicly accessible showcase.

### Core Value Proposition

1. **AI-product semantic** — components are organized by experience stage, not technology
2. **Dual-device** — every component has intentional Desktop and Mobile behaviors (not just responsive scaling)
3. **Two-layer parameters** — visual/motion params AND product-semantic params (confidence, urgency, etc.)
4. **Copyable** — every component's code is viewable and copyable from the site

---

## 2. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS 3.x |
| Animation | Framer Motion |
| Language | TypeScript |
| Deployment | Vercel |
| Font | Geist (primary), Geist Mono (code) |
| Icons | Lucide React |
| Code Display | Shiki (syntax highlighting) |
| State | React state only (no external state lib) |

---

## 3. Information Architecture

### 3.1 Top Navigation

```
Components    Patterns    Playground    Roadmap    Docs
   ✅ v0.1      🔒 v0.2    🔒 v0.2     🔒 v0.2   🔒 v0.3
```

v0.1 ships **Components** only. Other sections render a "Coming Soon" placeholder.

### 3.2 Components — Sidebar Navigation

Organized by **experience stage**, not by technology:

```
COMPONENTS

Reasoning
  ├── ThinkingLoader
  └── ReasoningSteps

Decision
  ├── DecisionCard
  └── ConfidenceMeter

Output
  ├── ResultReveal
  └── InsightStack

Action
  └── SmartCTA

Motion
  └── ProgressiveBlurReveal
```

Each component can carry secondary tags (displayed as pills, not as navigation):
`LLM` `Agent` `Tool Use` `RAG` `Search` `Streaming`

### 3.3 URL Structure

```
/                           → Landing / intro page
/components/[category]      → Category overview (optional, can skip in v0.1)
/components/[category]/[slug] → Individual component page
/patterns                   → Coming Soon
/playground                 → Coming Soon
/roadmap                    → Coming Soon
/docs                       → Coming Soon
```

---

## 4. Page Templates

### 4.1 Component Page Layout

Every component page follows the same 5-section template:

```
┌─────────────────────────────────────────────┐
│  Sidebar (left)  │  Content (right)         │
│                  │                           │
│  Nav tree        │  1. LIVE PREVIEW          │
│                  │     Default rendered demo  │
│                  │                           │
│                  │  2. DEVICE TOGGLE          │
│                  │     [Desktop] [Mobile]     │
│                  │                           │
│                  │  3. CONTROLS               │
│                  │     Parameter sliders,     │
│                  │     dropdowns, toggles     │
│                  │                           │
│                  │  4. CODE                   │
│                  │     Syntax-highlighted     │
│                  │     + Copy button          │
│                  │                           │
│                  │  5. USAGE RATIONALE        │
│                  │     When to use            │
│                  │     Why this design        │
│                  │     AI product scenarios   │
│                  │     PC vs Mobile notes     │
└─────────────────────────────────────────────┘
```

### 4.2 Live Preview Area

- Dark background container with subtle border
- Component renders at actual size inside a framed viewport
- Desktop mode: renders at full content width
- Mobile mode: renders inside a phone-frame mockup (375px width)
- The preview MUST be interactive — hover states, click states, animations all work

### 4.3 Device Toggle

- Two buttons: `Desktop` / `Mobile`
- Switching does NOT just resize — it loads a different behavioral variant of the component
- Desktop variant may use: hover, side-by-side layout, richer density
- Mobile variant may use: stacked layout, bottom sheet, thumb-zone interaction, gesture

### 4.4 Controls Panel

Two layers of controls:

**Layer A — Visual / Motion**
- speed, delay, duration
- blur, opacity, scale
- easing preset (spring, ease-out, linear)
- stagger amount

**Layer B — Product Semantic**
- confidence (0–1 slider)
- urgency (low / medium / high)
- recommendation strength
- trust level
- density (compact / default / spacious)
- risk level

Controls update the Live Preview in real-time.

### 4.5 Code Panel

- Collapsible (default: collapsed)
- Syntax highlighted with Shiki
- Copy button (top-right)
- Shows the React component code with current prop values reflected
- Language: TSX

### 4.6 Usage Rationale

Markdown-rendered section with:
- **When to use** — product scenarios where this component fits
- **Why this design** — design rationale and tradeoffs
- **AI product context** — what AI interaction pattern it serves
- **Desktop vs Mobile** — behavioral differences explained

---

## 5. Component Specification

### 5.1 v0.1 Component List

#### Reasoning

**ThinkingLoader**
- Animated indicator showing AI is processing
- Desktop: inline with surrounding content, subtle pulse + text rotation
- Mobile: full-width bar or overlay, bolder animation
- Semantic params: `stage` (thinking / searching / analyzing), `duration`, `showLabel`
- Motion params: `pulseSpeed`, `glowIntensity`, `blur`

**ReasoningSteps**
- Step-by-step reveal of AI's reasoning process
- Desktop: vertical timeline with expandable detail per step
- Mobile: stacked cards with progressive disclosure
- Semantic params: `steps[]`, `currentStep`, `confidencePerStep`, `showEvidence`
- Motion params: `revealSpeed`, `stagger`, `fadeIn`

#### Decision

**DecisionCard**
- Card presenting an AI recommendation with confidence and tradeoffs
- Desktop: horizontal layout with comparison columns
- Mobile: stacked layout with swipe or tab between options
- Semantic params: `confidence`, `urgency`, `recommendation`, `tradeoffs[]`, `motionPreset`
- Motion params: `entryAnimation`, `highlightPulse`, `borderGlow`

**ConfidenceMeter**
- Visual representation of AI confidence level
- Desktop: horizontal bar or arc with label and detail tooltip
- Mobile: compact arc or badge
- Semantic params: `confidence` (0–1), `label`, `breakdown[]`
- Motion params: `fillSpeed`, `overshoot`, `glowOnHigh`

#### Output

**ResultReveal**
- Progressive reveal of AI-generated result
- Desktop: blur-to-clear with section-by-section reveal
- Mobile: slide-up card with staggered content
- Semantic params: `sections[]`, `revealMode` (all-at-once / progressive / on-scroll)
- Motion params: `blurAmount`, `revealDuration`, `stagger`

**InsightStack**
- Stacked insight cards that expand on interaction
- Desktop: grid or masonry, hover to expand
- Mobile: vertical stack, tap to expand
- Semantic params: `insights[]`, `priorityOrder`, `highlightTop`
- Motion params: `expandSpeed`, `stackOffset`, `parallax`

#### Action

**SmartCTA**
- Context-aware call-to-action button with state transitions
- Desktop: full button with label + sublabel, hover micro-interaction
- Mobile: full-width sticky bottom button, haptic-ready
- Semantic params: `urgency`, `actionType`, `confirmRequired`, `label`, `sublabel`
- Motion params: `pressScale`, `glowOnUrgent`, `loadingAnimation`

#### Motion

**ProgressiveBlurReveal**
- Content that transitions from blurred to clear as user scrolls or triggers
- Desktop: scroll-linked blur reduction
- Mobile: tap-to-reveal or scroll-linked
- Semantic params: `revealTrigger` (scroll / click / auto), `sections[]`
- Motion params: `blurStart`, `blurEnd`, `transitionCurve`, `duration`

### 5.2 Component File Structure

Each component lives in its own directory:

```
src/components/library/[category]/[ComponentName]/
  ├── index.tsx              # Main component (Desktop)
  ├── mobile.tsx             # Mobile variant (if significantly different)
  ├── controls.tsx           # Controls panel definition
  ├── code.tsx               # Raw code string for display
  ├── rationale.mdx          # Usage rationale content
  └── meta.ts                # Metadata (name, description, tags, category)
```

### 5.3 Component Metadata Schema

```typescript
// src/types/component-meta.ts

export interface ComponentMeta {
  slug: string;                    // URL-safe identifier
  name: string;                    // Display name
  description: string;             // One-line description
  category: ComponentCategory;     // 'reasoning' | 'decision' | 'output' | 'action' | 'motion'
  tags: ComponentTag[];            // ['LLM', 'Streaming', 'Agent', etc.]
  version: string;                 // semver
  author: string;                  // 'Aspen'
  status: 'stable' | 'beta' | 'experimental';
}

export type ComponentCategory =
  | 'reasoning'
  | 'decision'
  | 'output'
  | 'action'
  | 'motion';

export type ComponentTag =
  | 'LLM'
  | 'Agent'
  | 'Tool Use'
  | 'RAG'
  | 'Search'
  | 'Streaming';
```

### 5.4 Controls Schema

```typescript
// src/types/controls.ts

export type ControlType = 'slider' | 'select' | 'toggle' | 'color' | 'text';

export interface ControlDefinition {
  key: string;                     // Prop name on the component
  label: string;                   // Display label
  type: ControlType;
  layer: 'visual' | 'semantic';   // Which parameter layer
  default: any;
  // Type-specific:
  min?: number;                    // slider
  max?: number;                    // slider
  step?: number;                   // slider
  options?: { label: string; value: any }[]; // select
}
```

---

## 6. Design System (Site Chrome)

### 6.1 Color Tokens

```css
:root {
  /* Backgrounds */
  --bg-primary: #0A0A0B;
  --bg-secondary: #111113;
  --bg-elevated: #18181B;
  --bg-preview: #0D0D0F;

  /* Text */
  --text-primary: rgba(255, 255, 255, 0.85);
  --text-secondary: rgba(255, 255, 255, 0.55);
  --text-tertiary: rgba(255, 255, 255, 0.35);
  --text-muted: rgba(255, 255, 255, 0.25);

  /* Borders */
  --border-default: rgba(255, 255, 255, 0.06);
  --border-hover: rgba(255, 255, 255, 0.12);
  --border-active: rgba(255, 255, 255, 0.20);

  /* Accent — Lumen Green (primary) */
  --accent-green: #0BE09B;
  --accent-green-dim: rgba(11, 224, 155, 0.15);
  --accent-green-border: rgba(11, 224, 155, 0.20);

  /* Accent — Blue (interactive) */
  --accent-blue: #0091FF;
  --accent-blue-dim: rgba(0, 145, 255, 0.12);

  /* Accent — Warm (warnings, urgency) */
  --accent-warm: #FB7A29;
  --accent-warm-dim: rgba(251, 122, 41, 0.12);

  /* Code */
  --code-bg: #0F0F11;
  --code-border: rgba(255, 255, 255, 0.08);
}
```

### 6.2 Typography

- Primary: `Geist` (sans-serif)
- Mono: `Geist Mono`
- All numbers use `tabular-nums`
- Scale: 12px (detail) / 14px (body) / 16px (headings) / 20px (page title) / 28px (hero)

### 6.3 Layout

- Sidebar width: 260px (collapsible on mobile)
- Content max-width: 900px
- Preview container: rounded-xl, border, bg-preview
- Spacing unit: 4px base
- Cards: `rounded-xl`, `border border-[--border-default]`

### 6.4 Motion Defaults (Site UI)

- Page transitions: 200ms ease-out
- Hover states: 150ms
- Panel expand/collapse: 300ms spring
- Copy button feedback: 1.5s fade

---

## 7. Repository Structure

```
lumen/
├── public/
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout with sidebar
│   │   ├── page.tsx                      # Landing / intro
│   │   ├── components/
│   │   │   └── [category]/
│   │   │       └── [slug]/
│   │   │           └── page.tsx          # Component detail page
│   │   ├── patterns/
│   │   │   └── page.tsx                  # Coming Soon
│   │   ├── playground/
│   │   │   └── page.tsx                  # Coming Soon
│   │   ├── roadmap/
│   │   │   └── page.tsx                  # Coming Soon
│   │   └── docs/
│   │       └── page.tsx                  # Coming Soon
│   ├── components/
│   │   ├── site/                         # Site chrome components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopNav.tsx
│   │   │   ├── DeviceToggle.tsx
│   │   │   ├── ControlsPanel.tsx
│   │   │   ├── CodePanel.tsx
│   │   │   ├── PreviewFrame.tsx
│   │   │   ├── UsageRationale.tsx
│   │   │   └── ComingSoon.tsx
│   │   └── library/                      # The actual showcase components
│   │       ├── reasoning/
│   │       │   ├── ThinkingLoader/
│   │       │   └── ReasoningSteps/
│   │       ├── decision/
│   │       │   ├── DecisionCard/
│   │       │   └── ConfidenceMeter/
│   │       ├── output/
│   │       │   ├── ResultReveal/
│   │       │   └── InsightStack/
│   │       ├── action/
│   │       │   └── SmartCTA/
│   │       └── motion/
│   │           └── ProgressiveBlurReveal/
│   ├── types/
│   │   ├── component-meta.ts
│   │   └── controls.ts
│   ├── data/
│   │   └── registry.ts                  # Central component registry
│   ├── lib/
│   │   ├── code-highlight.ts            # Shiki setup
│   │   └── utils.ts
│   └── styles/
│       └── globals.css                   # Tailwind + CSS variables
├── CLAUDE.md
├── SPEC.md
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── package.json
└── README.md
```

---

## 8. Component Registry

All components are registered centrally for sidebar generation and routing:

```typescript
// src/data/registry.ts

import { ComponentMeta } from '@/types/component-meta';

export const componentRegistry: ComponentMeta[] = [
  {
    slug: 'thinking-loader',
    name: 'ThinkingLoader',
    description: 'Animated indicator showing AI is processing',
    category: 'reasoning',
    tags: ['LLM', 'Streaming'],
    version: '0.1.0',
    author: 'Aspen',
    status: 'stable',
  },
  // ... all other components
];

export function getComponentsByCategory(category: string) {
  return componentRegistry.filter(c => c.category === category);
}

export function getComponentBySlug(slug: string) {
  return componentRegistry.find(c => c.slug === slug);
}
```

---

## 9. Development Phases

### v0.1 — Foundation (current)
- Site shell: sidebar, top nav, component page template
- 8 components with live preview, device toggle, controls, code, rationale
- Desktop + Mobile variant for each
- Deployed to Vercel

### v0.2 — AI Product Patterns
- Patterns section (reasoning flow, decision flow, agent interaction)
- Playground with global Desktop/Mobile toggle + preset system
- Additional components in each category

### v0.3 — Distribution
- CLI or registry-style install (`npx lumen add DecisionCard`)
- Code export with dependency resolution
- Theme/preset system

### v0.4 — Figma MCP Integration
- Component token mapping
- Prompt-to-component suggestions
- Design/code alignment tooling

---

## 10. Quality Checklist (per component)

Before a component is considered "shipped":

- [ ] Desktop variant renders correctly
- [ ] Mobile variant renders correctly with distinct behavior
- [ ] All Layer A (visual) controls work and update preview in real-time
- [ ] All Layer B (semantic) controls work and update preview in real-time
- [ ] Code panel shows accurate, copyable TSX
- [ ] Usage rationale is written (when to use, why, AI context, device differences)
- [ ] Metadata is registered in `registry.ts`
- [ ] No TypeScript errors
- [ ] Accessible (keyboard navigable, sufficient contrast, aria labels)
- [ ] Performs well (no jank at 60fps, animations use `transform`/`opacity`)
