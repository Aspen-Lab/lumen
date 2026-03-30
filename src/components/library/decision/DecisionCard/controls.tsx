import { ControlDefinition } from "@/types/controls";

export const decisionCardControls: ControlDefinition[] = [
  /* ── Architecture controls ─────────────────────────────────────── */
  {
    key: "confidence",
    label: "Confidence",
    type: "slider",
    layer: "architecture",
    default: 0.82,
    min: 0,
    max: 1,
    step: 0.01,
  },
  {
    key: "urgency",
    label: "Urgency",
    type: "select",
    layer: "architecture",
    default: "high",
    options: [
      { label: "Low", value: "low" },
      { label: "Medium", value: "medium" },
      { label: "High", value: "high" },
    ],
  },

  /* ── Motion controls ──────────────────────────────── */
  {
    key: "entryAnimation",
    label: "Entry Animation",
    type: "select",
    layer: "motion",
    default: "slide",
    options: [
      { label: "Fade", value: "fade" },
      { label: "Slide", value: "slide" },
      { label: "Scale", value: "scale" },
    ],
  },

  /* ── Color controls ──────────────────────────────── */
  {
    key: "highlightPulse",
    label: "Highlight Pulse",
    type: "toggle",
    layer: "color",
    default: false,
  },
  {
    key: "borderGlow",
    label: "Border Glow",
    type: "toggle",
    layer: "color",
    default: true,
  },
  {
    key: "accentColor",
    label: "Accent Color",
    type: "color",
    layer: "color",
    default: "#0BE09B",
  },
  {
    key: "glowIntensity",
    label: "Glow Intensity",
    type: "slider",
    layer: "color",
    default: 0.5,
    min: 0,
    max: 1,
    step: 0.05,
  },
];
