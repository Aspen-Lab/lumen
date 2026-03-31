import { ControlDefinition } from "@/types/controls";

export const streamingTextControls: ControlDefinition[] = [
  /* ── Architecture controls ─────────────────────────────────────── */
  {
    key: "tokenize",
    label: "Tokenize",
    type: "select",
    layer: "architecture",
    default: "word",
    options: [
      { label: "Word", value: "word" },
      { label: "Character", value: "char" },
    ],
  },
  {
    key: "cursor",
    label: "Cursor",
    type: "toggle",
    layer: "architecture",
    default: true,
  },

  /* ── Motion controls ──────────────────────────────── */
  {
    key: "speed",
    label: "Speed (ms / token)",
    type: "slider",
    layer: "motion",
    default: 30,
    min: 10,
    max: 100,
    step: 5,
  },
  {
    key: "blur",
    label: "Blur Unrevealed",
    type: "toggle",
    layer: "motion",
    default: false,
  },

  /* ── Color controls ──────────────────────────────── */
  {
    key: "textColor",
    label: "Text Color",
    type: "color",
    layer: "color",
    default: "#FFFFFF",
  },
  {
    key: "cursorColor",
    label: "Cursor Color",
    type: "color",
    layer: "color",
    default: "#0BE09B",
  },
];
