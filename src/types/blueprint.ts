export type BlueprintNodeType = "api" | "database" | "websocket" | "auth" | "cache" | "queue" | "storage";

export interface BlueprintNode {
  id: string;
  type: BlueprintNodeType;
  label: string;
  description: string;
  details?: string[];
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "left" | "right";
}

export const NODE_COLORS: Record<BlueprintNodeType, string> = {
  api: "#4A90D9",
  database: "#0BE09B",
  websocket: "#7C5CFC",
  auth: "#FB7A29",
  cache: "#22D3EE",
  queue: "#FACC15",
  storage: "#F472B6",
};

export const NODE_ICONS: Record<BlueprintNodeType, string> = {
  api: "↗",
  database: "⊡",
  websocket: "⇌",
  auth: "◈",
  cache: "◎",
  queue: "≡",
  storage: "▤",
};
