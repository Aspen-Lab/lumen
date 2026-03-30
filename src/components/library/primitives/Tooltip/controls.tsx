import { ControlDefinition } from "@/types/controls";

export const tooltipControls: ControlDefinition[] = [
  /* ── Architecture controls ─────────────────────────────────────── */
  {
    key: "content",
    label: "Content",
    type: "text",
    layer: "architecture",
    default: "Helpful hint",
  },
  {
    key: "side",
    label: "Side",
    type: "select",
    layer: "architecture",
    default: "top",
    options: [
      { label: "Top",    value: "top"    },
      { label: "Bottom", value: "bottom" },
      { label: "Left",   value: "left"   },
      { label: "Right",  value: "right"  },
    ],
  },
];
