export type ControlType = "slider" | "select" | "toggle" | "color" | "text";

export interface ControlDefinition {
  key: string;
  label: string;
  type: ControlType;
  layer: "architecture" | "motion" | "color";
  default: unknown;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: unknown }[];
}
