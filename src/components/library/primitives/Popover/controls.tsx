import { ControlDefinition } from "@/types/controls";

export const popoverControls: ControlDefinition[] = [
  /* ── Architecture controls ─────────────────────────────────────── */
  {
    key: "side",
    label: "Side",
    type: "select",
    layer: "architecture",
    default: "bottom",
    options: [
      { label: "Bottom", value: "bottom" },
      { label: "Top",    value: "top"    },
    ],
  },
  {
    key: "align",
    label: "Align",
    type: "select",
    layer: "architecture",
    default: "start",
    options: [
      { label: "Start",  value: "start"  },
      { label: "Center", value: "center" },
      { label: "End",    value: "end"    },
    ],
  },
];
