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

  /* ── Motion controls ────────────────────────────────────────────── */
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

  /* ── Color controls ─────────────────────────────────────────────── */
  {
    key: "highlightColor",
    label: "Highlight Color",
    type: "color",
    layer: "color",
    default: "#0BE09B",
  },
  {
    key: "accentColor",
    label: "Accent Color",
    type: "color",
    layer: "color",
    default: "#0091FF",
  },
  {
    key: "cardBgColor",
    label: "Card Background",
    type: "color",
    layer: "color",
    default: "rgba(255,255,255,0.02)",
  },
  {
    key: "cardBorderColor",
    label: "Card Border",
    type: "color",
    layer: "color",
    default: "rgba(255,255,255,0.07)",
  },
  {
    key: "titleColor",
    label: "Title Color",
    type: "color",
    layer: "color",
    default: "rgba(255,255,255,0.75)",
  },
  {
    key: "summaryColor",
    label: "Summary Color",
    type: "color",
    layer: "color",
    default: "rgba(255,255,255,0.45)",
  },
  {
    key: "detailColor",
    label: "Detail Color",
    type: "color",
    layer: "color",
    default: "rgba(255,255,255,0.55)",
  },
  {
    key: "priorityBadgeColor",
    label: "Priority Badge Color",
    type: "color",
    layer: "color",
    default: "rgba(255,255,255,0.3)",
  },
  {
    key: "headerLabelColor",
    label: "Header Label Color",
    type: "color",
    layer: "color",
    default: "rgba(255,255,255,0.35)",
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
