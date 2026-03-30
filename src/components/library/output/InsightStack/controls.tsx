import { ControlDefinition } from "@/types/controls";

export const insightStackControls: ControlDefinition[] = [
  /* ── Architecture controls ─────────────────────────────────────── */
  {
    key: "priorityOrder",
    label: "Priority Order",
    type: "toggle",
    layer: "architecture",
    default: true,
  },
  {
    key: "highlightTop",
    label: "Highlight Top Insight",
    type: "toggle",
    layer: "architecture",
    default: true,
  },
  {
    key: "stackOffset",
    label: "Stack Offset",
    type: "slider",
    layer: "architecture",
    default: 4,
    min: 0,
    max: 8,
    step: 1,
  },

  /* ── Motion controls ──────────────────────────────── */
  {
    key: "expandSpeed",
    label: "Expand Speed",
    type: "slider",
    layer: "motion",
    default: 0.35,
    min: 0.1,
    max: 1,
    step: 0.05,
  },
  {
    key: "parallax",
    label: "Parallax Tilt",
    type: "toggle",
    layer: "motion",
    default: true,
  },

  /* ── Color controls ──────────────────────────────── */
  {
    key: "highlightColor",
    label: "Highlight Color",
    type: "color",
    layer: "color",
    default: "#0BE09B",
  },
  {
    key: "cardOpacity",
    label: "Card Opacity",
    type: "slider",
    layer: "color",
    default: 0.8,
    min: 0.5,
    max: 1,
    step: 0.05,
  },
];
