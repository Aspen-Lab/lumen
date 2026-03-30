import { ControlDefinition } from "@/types/controls";

export const sliderControls: ControlDefinition[] = [
  /* ── Architecture controls ─────────────────────────────────────── */
  {
    key: "min",
    label: "Min",
    type: "slider",
    layer: "architecture",
    default: 0,
    min: 0,
    max: 50,
    step: 1,
  },
  {
    key: "max",
    label: "Max",
    type: "slider",
    layer: "architecture",
    default: 100,
    min: 50,
    max: 200,
    step: 1,
  },
  {
    key: "step",
    label: "Step",
    type: "slider",
    layer: "architecture",
    default: 1,
    min: 1,
    max: 10,
    step: 1,
  },
  {
    key: "label",
    label: "Label",
    type: "text",
    layer: "architecture",
    default: "Volume",
  },
  {
    key: "showValue",
    label: "Show Value",
    type: "toggle",
    layer: "architecture",
    default: true,
  },

  /* ── Color controls ─────────────────────────────────────────────── */
  {
    key: "trackColor",
    label: "Track Color",
    type: "color",
    layer: "color",
    default: "#0BE09B",
  },
  {
    key: "thumbColor",
    label: "Thumb Color",
    type: "color",
    layer: "color",
    default: "#FFFFFF",
  },
];
