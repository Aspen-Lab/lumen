import { AtomMeta } from "@/types/atom";

export const atomRegistry: AtomMeta[] = [
  {
    slug: "glow-surface",
    name: "GlowSurface",
    description: "Animated gradient border container",
    definition: "A container with animated conic gradient border. 3-layer compositing: static gradient, rotating sweep, blur halo. Focus state drives intensity.",
    intent: "Communicate that content is interactive and elevated",
    role: "surface",
    interactions: ["hover"],
    level: "decorative",
  },
  {
    slug: "text-area",
    name: "TextArea",
    description: "Self-sizing text input",
    definition: "A textarea that auto-resizes with content. Scoped placeholder styling. No scrollbar until maxHeight reached.",
    intent: "Capture multi-line user input without layout disruption",
    role: "input",
    interactions: ["input"],
    level: "primary",
  },
  {
    slug: "chip-button",
    name: "ChipButton",
    description: "Compact icon + label button",
    definition: "A small button with icon and text label. Rounded, low visual weight. Designed for toolbar grouping.",
    intent: "Trigger a secondary action within a constrained space",
    role: "action",
    interactions: ["click"],
    level: "secondary",
  },
  {
    slug: "icon-button",
    name: "IconButton",
    description: "Icon-only trigger button",
    definition: "A button containing only an icon. Minimal footprint. Hover reveals intent via cursor change.",
    intent: "Trigger an action where the icon alone communicates meaning",
    role: "action",
    interactions: ["click"],
    level: "ghost",
  },
  {
    slug: "toggle-chip",
    name: "ToggleChip",
    description: "Inline labeled on/off switch",
    definition: "An integrated toggle with icon, label text, and track/thumb switch. Single tappable unit that reads as one control.",
    intent: "Let the user flip a binary state without leaving context",
    role: "control",
    interactions: ["toggle"],
    level: "secondary",
  },
  {
    slug: "fab",
    name: "FAB",
    description: "Circular primary action button",
    definition: "A circular button with gradient fill when active, muted when inactive. Press feedback via scale. The strongest action signal.",
    intent: "Commit the primary action — send, submit, confirm",
    role: "action",
    interactions: ["click"],
    level: "primary",
  },
  {
    slug: "toolbar",
    name: "Toolbar",
    description: "Horizontal action bar",
    definition: "A horizontal flex container with justify-between. Groups left-side and right-side actions. Not interactive itself — arranges children.",
    intent: "Organize multiple actions into a scannable row",
    role: "layout",
    interactions: ["passive"],
    level: "ghost",
  },
];

export function getAtomsByRole(role: string) {
  if (role === "all") return atomRegistry;
  return atomRegistry.filter((a) => a.role === role);
}

export function getAtomBySlug(slug: string) {
  return atomRegistry.find((a) => a.slug === slug);
}

export const atomRoles = ["all", "input", "action", "control", "display", "surface", "layout", "feedback"] as const;
export const atomInteractions = ["click", "toggle", "input", "hover", "drag", "passive"] as const;
