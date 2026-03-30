import { ControlDefinition } from "@/types/controls";

export const statusDotControls: ControlDefinition[] = [
  /* ── Architecture controls ─────────────────────────────────────── */
  {
    key: "state",
    label: "State",
    type: "select",
    layer: "architecture",
    default: "active",
    options: [
      { label: "Active",   value: "active"   },
      { label: "Complete", value: "complete" },
      { label: "Pending",  value: "pending"  },
      { label: "Error",    value: "error"    },
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
      { label: "Large",  value: "lg" },
    ],
  },

  /* ── Motion controls ────────────────────────────────────────────── */
  {
    key: "pulse",
    label: "Pulse Ring",
    type: "toggle",
    layer: "motion",
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
