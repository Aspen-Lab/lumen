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
    key: "cardBgColor",
    label: "Card Background (Revealed)",
    type: "color",
    layer: "color",
    default: "#111113",
  },
  {
    key: "cardBgDimColor",
    label: "Card Background (Unrevealed)",
    type: "color",
    layer: "color",
    default: "#0D0D0F",
  },
  {
    key: "titleColor",
    label: "Title Color",
    type: "color",
    layer: "color",
    default: "#ffffff",
  },
  {
    key: "textColor",
    label: "Body Text Color",
    type: "color",
    layer: "color",
    default: "#8a8a9a",
  },
  {
    key: "progressBarColor",
    label: "Progress Bar Color",
    type: "color",
    layer: "color",
    default: "#0BE09B",
  },
  {
    key: "buttonColor",
    label: "Button Color",
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
