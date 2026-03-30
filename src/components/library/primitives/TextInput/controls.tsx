import { ControlDefinition } from "@/types/controls";

export const textInputControls: ControlDefinition[] = [
  /* ── Architecture controls ─────────────────────────────────────── */
  {
    key: "placeholder",
    label: "Placeholder",
    type: "text",
    layer: "architecture",
    default: "Type something…",
  },
  {
    key: "multiline",
    label: "Multiline",
    type: "toggle",
    layer: "architecture",
    default: false,
  },
  {
    key: "rows",
    label: "Rows",
    type: "slider",
    layer: "architecture",
    default: 3,
    min: 2,
    max: 8,
    step: 1,
  },

  /* ── Color controls ─────────────────────────────────────────────── */
  {
    key: "bgColor",
    label: "Background",
    type: "color",
    layer: "color",
    default: "rgba(255,255,255,0.04)",
  },
  {
    key: "textColor",
    label: "Text Color",
    type: "color",
    layer: "color",
    default: "rgba(255,255,255,0.85)",
  },
  {
    key: "placeholderColor",
    label: "Placeholder Color",
    type: "color",
    layer: "color",
    default: "rgba(255,255,255,0.25)",
  },
];
