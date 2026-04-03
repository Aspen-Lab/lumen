export type AtomRole = "input" | "action" | "control" | "display" | "surface" | "layout" | "feedback";
export type AtomInteraction = "click" | "toggle" | "input" | "hover" | "drag" | "passive";
export type AtomLevel = "primary" | "secondary" | "ghost" | "decorative";

export interface AtomMeta {
  slug: string;
  name: string;
  description: string;
  definition: string;
  intent: string;
  role: AtomRole;
  interactions: AtomInteraction[];
  level: AtomLevel;
}

export const ROLE_COLORS: Record<AtomRole, string> = {
  input: "#0BE09B",
  action: "#F97316",
  control: "#22D3EE",
  display: "#A78BFA",
  surface: "#7C5CFC",
  layout: "#6B7280",
  feedback: "#FACC15",
};
