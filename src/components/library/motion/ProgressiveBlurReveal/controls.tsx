import { ControlDefinition } from "@/types/controls";

export const progressiveBlurRevealControls: ControlDefinition[] = [
  /* ── Architecture controls ─────────────────────────────────────── */
  {
    key: "revealTrigger",
    label: "Reveal Trigger",
    type: "select",
    layer: "architecture",
    default: "click",
    options: [
      { label: "Click", value: "click" },
      { label: "Scroll", value: "scroll" },
      { label: "Auto", value: "auto" },
    ],
  },

  /* ── Motion controls ──────────────────────────────── */
  {
    key: "blurStart",
    label: "Blur Start",
    type: "slider",
    layer: "motion",
    default: 12,
    min: 0,
    max: 30,
    step: 1,
  },
  {
    key: "blurEnd",
    label: "Blur End",
    type: "slider",
    layer: "motion",
    default: 0,
    min: 0,
    max: 5,
    step: 0.5,
  },
  {
    key: "transitionCurve",
    label: "Transition Curve",
    type: "select",
    layer: "motion",
    default: "ease",
    options: [
      { label: "Ease", value: "ease" },
      { label: "Spring", value: "spring" },
      { label: "Linear", value: "linear" },
    ],
  },
  {
    key: "duration",
    label: "Duration",
    type: "slider",
    layer: "motion",
    default: 0.7,
    min: 0.3,
    max: 3,
    step: 0.1,
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
    key: "revealOpacity",
    label: "Reveal Opacity",
    type: "slider",
    layer: "color",
    default: 0.9,
    min: 0.5,
    max: 1,
    step: 0.05,
  },
];
