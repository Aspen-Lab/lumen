export type ComponentCategory =
  | "primitives"
  | "action"
  | "reasoning"
  | "decision"
  | "output"
  | "motion";

export type ComponentTag =
  | "LLM"
  | "Agent"
  | "Tool Use"
  | "RAG"
  | "Search"
  | "Streaming";

export interface ComponentMeta {
  slug: string;
  name: string;
  description: string;
  category: ComponentCategory;
  tags: ComponentTag[];
  version: string;
  author: string;
  status: "stable" | "beta" | "experimental";
}
