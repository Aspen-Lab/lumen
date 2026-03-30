import { ControlDefinition } from "@/types/controls";

export const resultRevealControls: ControlDefinition[] = [
  /* ── Architecture controls ─────────────────────────────────────── */
  {
    key: "revealMode",
    label: "Reveal Mode",
    type: "select",
    layer: "architecture",
    default: "progressive",
    options: [
      { label: "All at Once", value: "all-at-once" },
      { label: "Progressive", value: "progressive" },
      { label: "On Scroll", value: "on-scroll" },
    ],
  },

  /* ── Motion controls ──────────────────────────────── */
  {
    key: "blurAmount",
    label: "Blur Amount",
    type: "slider",
    layer: "motion",
    default: 12,
    min: 0,
    max: 20,
    step: 1,
  },
  {
    key: "revealDuration",
    label: "Reveal Duration",
    type: "slider",
    layer: "motion",
    default: 0.8,
    min: 0.3,
    max: 3,
    step: 0.1,
  },
  {
    key: "stagger",
    label: "Stagger",
    type: "slider",
    layer: "motion",
    default: 0.18,
    min: 0.05,
    max: 0.5,
    step: 0.01,
  },

  /* ── Color controls ──────────────────────────────── */
  {
    key: "accentColor",
    label: "Accent Color",
    type: "color",
    layer: "color",
    default: "#0BE09B",
  },
  {
    key: "cardBgColor",
    label: "Card Background",
    type: "color",
    layer: "color",
    default: "#111113",
  },
  {
    key: "headerColor",
    label: "Header Text",
    type: "color",
    layer: "color",
    default: "rgba(255,255,255,0.30)",
  },
  {
    key: "progressBarColor",
    label: "Progress Bar Track",
    type: "color",
    layer: "color",
    default: "rgba(255,255,255,0.06)",
  },
  {
    key: "textColor",
    label: "Body Text",
    type: "color",
    layer: "color",
    default: "rgba(255,255,255,0.70)",
  },
  {
    key: "sectionTitleColor",
    label: "Section Title",
    type: "color",
    layer: "color",
    default: "rgba(255,255,255,0.35)",
  },
];
