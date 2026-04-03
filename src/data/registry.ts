import { ComponentMeta } from "@/types/component-meta";
import { promptInputMeta } from "@/components/library/action/PromptInput/meta";

export const componentRegistry: ComponentMeta[] = [
  promptInputMeta,
];

export function getComponentsByCategory(category: string) {
  return componentRegistry.filter((c) => c.category === category);
}

export function getComponentBySlug(slug: string) {
  return componentRegistry.find((c) => c.slug === slug);
}

export const categories = [
  { slug: "action", name: "Action", icon: "Zap" },
  { slug: "reasoning", name: "Reasoning", icon: "Brain" },
  { slug: "decision", name: "Decision", icon: "GitBranch" },
  { slug: "output", name: "Output", icon: "Layers" },
  { slug: "motion", name: "Motion", icon: "Sparkles" },
] as const;
