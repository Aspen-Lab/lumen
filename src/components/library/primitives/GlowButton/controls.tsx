import { ControlDefinition } from "@/types/controls";

export const glowButtonControls: ControlDefinition[] = [
  /* ── Architecture controls ─────────────────────────────────────── */
  {
    key: "variant",
    label: "Variant",
    type: "select",
    layer: "architecture",
    default: "primary",
    options: [
      { label: "Primary", value: "primary" },
      { label: "Ghost",   value: "ghost"   },
      { label: "Danger",  value: "danger"  },
    ],
  },
  {
    key: "size",
    label: "Size",
    type: "select",
    layer: "architecture",
    default: "md",
    options: [
      { label: "Small",  value: "sm" },
      { label: "Medium", value: "md" },
      { label: "Large",  value: "lg" },
    ],
  },
  {
    key: "loading",
    label: "Loading",
    type: "toggle",
    layer: "architecture",
    default: false,
  },
  {
    key: "disabled",
    label: "Disabled",
    type: "toggle",
    layer: "architecture",
    default: false,
  },

  /* ── Color controls ─────────────────────────────────────────────── */
  {
    key: "glowFrom",
    label: "Glow From",
    type: "color",
    layer: "color",
    default: "#7C5CFC",
  },
  {
    key: "glowTo",
    label: "Glow To",
    type: "color",
    layer: "color",
    default: "#F97316",
  },
  {
    key: "glowIntensity",
    label: "Glow Intensity",
    type: "slider",
    layer: "color",
    default: 0.75,
    min: 0,
    max: 1,
    step: 0.05,
  },
];
