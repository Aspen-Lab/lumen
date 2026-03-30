import { ControlDefinition } from "@/types/controls";

export const badgeControls: ControlDefinition[] = [
  /* ── Architecture controls ─────────────────────────────────────── */
  {
    key: "variant",
    label: "Variant",
    type: "select",
    layer: "architecture",
    default: "success",
    options: [
      { label: "Default", value: "default" },
      { label: "Success", value: "success" },
      { label: "Warning", value: "warning" },
      { label: "Danger",  value: "danger"  },
      { label: "Info",    value: "info"    },
    ],
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
  {
    key: "dot",
    label: "Pulsing Dot",
    type: "toggle",
    layer: "architecture",
    default: false,
  },
  {
    key: "mono",
    label: "Mono Font",
    type: "toggle",
    layer: "architecture",
    default: false,
  },

  /* ── Color controls ─────────────────────────────────────────────── */
  {
    key: "color",
    label: "Color Override",
    type: "color",
    layer: "color",
    default: "#0BE09B",
  },
];
