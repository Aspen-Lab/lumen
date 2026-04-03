import type { CompositionMap } from "@/types/composition";
import { composition as promptInputComposition } from "@/components/library/action/PromptInput/composition";

// Register all component compositions here
const compositions: Record<string, CompositionMap> = {
  "prompt-input": promptInputComposition,
};

// Build reverse map: atom slug → component slugs that use it
export function getComponentsUsingAtom(atomSlug: string): string[] {
  const result: string[] = [];
  for (const [componentSlug, comp] of Object.entries(compositions)) {
    if (comp.atoms.some((a) => a.slug === atomSlug)) {
      result.push(componentSlug);
    }
  }
  return result;
}

// Component display names for UI
const componentNames: Record<string, string> = {
  "prompt-input": "PromptInput",
};

export function getComponentName(slug: string): string {
  return componentNames[slug] ?? slug;
}
