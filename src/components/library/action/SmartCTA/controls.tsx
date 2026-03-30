import { ControlDefinition } from "@/types/controls";

export const smartCTAControls: ControlDefinition[] = [
  /* ── Architecture controls ─────────────────────────────────────── */
  {
    key: "urgency",
    label: "Urgency",
    type: "select",
    layer: "architecture",
    default: "medium",
    options: [
      { label: "Low",    value: "low"    },
      { label: "Medium", value: "medium" },
      { label: "High",   value: "high"   },
    ],
  },
  {
    key: "actionType",
    label: "Action Type",
    type: "select",
    layer: "architecture",
    default: "primary",
    options: [
      { label: "Primary",     value: "primary"     },
      { label: "Secondary",   value: "secondary"   },
      { label: "Destructive", value: "destructive" },
    ],
  },
  {
    key: "confirmRequired",
    label: "Confirm Required",
    type: "toggle",
    layer: "architecture",
    default: false,
  },

  /* ── Motion controls ──────────────────────────────── */
  {
    key: "pressScale",
    label: "Press Scale",
    type: "slider",
    layer: "motion",
    default: 0.96,
    min: 0.9,
    max: 1,
    step: 0.01,
  },
  {
    key: "loadingAnimation",
    label: "Loading Animation",
    type: "select",
    layer: "motion",
    default: "spinner",
    options: [
      { label: "Spinner", value: "spinner" },
      { label: "Pulse",   value: "pulse"   },
      { label: "Dots",    value: "dots"    },
    ],
  },

  /* ── Color controls ──────────────────────────────── */
  {
    key: "glowOnUrgent",
    label: "Glow on Urgent",
    type: "toggle",
    layer: "color",
    default: true,
  },
  {
    key: "primaryColor",
    label: "Primary Color",
    type: "color",
    layer: "color",
    default: "#0BE09B",
  },
  {
    key: "glowIntensity",
    label: "Glow Intensity",
    type: "slider",
    layer: "color",
    default: 0.6,
    min: 0,
    max: 1,
    step: 0.05,
  },
];
