export type ControlType = "slider" | "select" | "toggle" | "color" | "text";

export interface ThemePreset {
  id: string;
  name: string;
  brand?: string;
  color: string;
  values: Record<string, unknown>;
}

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
