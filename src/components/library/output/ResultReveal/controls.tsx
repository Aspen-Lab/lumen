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
    key: "cardOpacity",
    label: "Card Opacity",
    type: "slider",
    layer: "color",
    default: 0.85,
    min: 0.5,
    max: 1,
    step: 0.05,
  },
];
