import { ComponentMeta } from "@/types/component-meta";

export const componentRegistry: ComponentMeta[] = [
  {
    slug: "prompt-input",
    name: "PromptInput",
    description: "AI prompt input with animated gradient glow border",
    category: "action",
    tags: ["LLM", "Agent"],
    version: "0.1.0",
    author: "Aspen",
    status: "stable",
  },
];

export function getComponentsByCategory(category: string) {
  return componentRegistry.filter((c) => c.category === category);
}

export function getComponentBySlug(slug: string) {
  return componentRegistry.find((c) => c.slug === slug);
}

export const categories = [
  { slug: "action", name: "Action", icon: "Zap" },
] as const;
