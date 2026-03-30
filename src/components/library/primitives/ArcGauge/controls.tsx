import { ControlDefinition } from "@/types/controls";

export const arcGaugeControls: ControlDefinition[] = [
  /* ── Architecture controls ─────────────────────────────────────── */
  {
    key: "value",
    label: "Value",
    type: "slider",
    layer: "architecture",
    default: 0.65,
    min: 0,
    max: 1,
    step: 0.01,
  },
  {
    key: "size",
    label: "Size (px)",
    type: "slider",
    layer: "architecture",
    default: 160,
    min: 80,
    max: 280,
    step: 8,
  },
  {
    key: "strokeWidth",
    label: "Stroke Width",
    type: "slider",
    layer: "architecture",
    default: 8,
    min: 4,
    max: 20,
    step: 1,
  },
  {
    key: "showLabel",
    label: "Show Label",
    type: "toggle",
    layer: "architecture",
    default: true,
  },

  /* ── Motion controls ────────────────────────────────────────────── */
  {
    key: "animated",
    label: "Animated",
    type: "toggle",
    layer: "motion",
    default: true,
  },

  /* ── Color controls ─────────────────────────────────────────────── */
  {
    key: "color",
    label: "Arc Color",
    type: "color",
    layer: "color",
    default: "#0BE09B",
  },
  {
    key: "trackColor",
    label: "Track Color",
    type: "color",
    layer: "color",
    default: "rgba(255,255,255,0.06)",
  },
];
