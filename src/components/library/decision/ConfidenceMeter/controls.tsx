import { ControlDefinition } from "@/types/controls";

export const confidenceMeterControls: ControlDefinition[] = [
  /* ── Architecture controls ─────────────────────────────────────── */
  {
    key: "confidence",
    label: "Confidence",
    type: "slider",
    layer: "architecture",
    default: 0.72,
    min: 0,
    max: 1,
    step: 0.01,
  },

  /* ── Motion controls ──────────────────────────────── */
  {
    key: "fillSpeed",
    label: "Fill Speed",
    type: "slider",
    layer: "motion",
    default: 1,
    min: 0.3,
    max: 3,
    step: 0.1,
  },
  {
    key: "overshoot",
    label: "Overshoot",
    type: "slider",
    layer: "motion",
    default: 0.08,
    min: 0,
    max: 0.3,
    step: 0.01,
  },

  /* ── Color controls ──────────────────────────────── */
  {
    key: "glowOnHigh",
    label: "Glow on High",
    type: "toggle",
    layer: "color",
    default: true,
  },
  {
    key: "highColor",
    label: "High Color",
    type: "color",
    layer: "color",
    default: "#0BE09B",
  },
  {
    key: "lowColor",
    label: "Low Color",
    type: "color",
    layer: "color",
    default: "#EF4444",
  },
  {
    key: "arcOpacity",
    label: "Arc Opacity",
    type: "slider",
    layer: "color",
    default: 0.9,
    min: 0.5,
    max: 1,
    step: 0.05,
  },
];
