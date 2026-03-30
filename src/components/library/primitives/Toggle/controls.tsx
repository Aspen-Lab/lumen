import { ControlDefinition } from "@/types/controls";

export const toggleControls: ControlDefinition[] = [
  /* ── Architecture controls ──────────────────────────────────── */
  {
    key: "size",
    label: "Size",
    type: "select",
    layer: "architecture",
    default: "md",
    options: [
      { label: "Small", value: "sm" },
      { label: "Medium", value: "md" },
    ],
  },

  /* ── Color controls ─────────────────────────────────────────── */
  {
    key: "activeColor",
    label: "Active Color",
    type: "color",
    layer: "color",
    default: "#0BE09B",
  },
];
