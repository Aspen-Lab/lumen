import { ControlDefinition } from "@/types/controls";

export const ghostButtonControls: ControlDefinition[] = [
  /* ── Architecture controls ─────────────────────────────────────── */
  {
    key: "label",
    label: "Label",
    type: "text",
    layer: "architecture",
    default: "Button",
  },
  {
    key: "size",
    label: "Size",
    type: "select",
    layer: "architecture",
    default: "md",
    options: [
      { label: "Small",  value: "sm" },
      { label: "Medium", value: "md" },
    ],
  },

  /* ── Color controls ─────────────────────────────────────────────── */
  {
    key: "color",
    label: "Color",
    type: "color",
    layer: "color",
    default: "#FFFFFF",
  },
];
