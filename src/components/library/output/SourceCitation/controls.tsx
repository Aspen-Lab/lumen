import { ControlDefinition } from "@/types/controls";

export const sourceCitationControls: ControlDefinition[] = [
  /* ── Architecture controls ─────────────────────────────────────── */
  {
    key: "chipSize",
    label: "Chip Size",
    type: "select",
    layer: "architecture",
    default: "sm",
    options: [
      { label: "Small", value: "sm" },
      { label: "Medium", value: "md" },
    ],
  },
  {
    key: "showPreview",
    label: "Show Preview",
    type: "toggle",
    layer: "architecture",
    default: true,
  },

  /* ── Color controls ─────────────────────────────────────────────── */
  {
    key: "accentColor",
    label: "Accent Color",
    type: "color",
    layer: "color",
    default: "#0091FF",
  },
  {
    key: "chipBgColor",
    label: "Chip Background",
    type: "color",
    layer: "color",
    default: "rgba(0,145,255,0.12)",
  },
  {
    key: "previewBgColor",
    label: "Preview Background",
    type: "color",
    layer: "color",
    default: "#1A1A24",
  },
];
