import { ControlDefinition } from "@/types/controls";

export const progressBarControls: ControlDefinition[] = [
  /* ── Architecture controls ─────────────────────────────────────── */
  {
    key: "value",
    label: "Value",
    type: "slider",
    layer: "architecture",
    default: 0.6,
    min: 0,
    max: 1,
    step: 0.01,
  },
  {
    key: "height",
    label: "Height",
    type: "slider",
    layer: "architecture",
    default: 4,
    min: 2,
    max: 12,
    step: 1,
  },
  {
    key: "rounded",
    label: "Rounded",
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
    default: false,
  },

  /* ── Color controls ─────────────────────────────────────────────── */
  {
    key: "color",
    label: "Fill Color",
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
