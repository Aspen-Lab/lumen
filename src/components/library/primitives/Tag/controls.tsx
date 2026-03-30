import { ControlDefinition } from "@/types/controls";

export const tagControls: ControlDefinition[] = [
  /* ── Architecture controls ─────────────────────────────────────── */
  {
    key: "label",
    label: "Label",
    type: "text",
    layer: "architecture",
    default: "design",
  },
  {
    key: "removable",
    label: "Removable",
    type: "toggle",
    layer: "architecture",
    default: false,
  },

  /* ── Color controls ─────────────────────────────────────────────── */
  {
    key: "color",
    label: "Color",
    type: "color",
    layer: "color",
    default: "#0BE09B",
  },
];
