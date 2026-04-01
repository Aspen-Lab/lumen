import { ControlDefinition } from "@/types/controls";
import { BlueprintNode } from "@/types/blueprint";

export interface ComponentEntry {
  desktop: React.ComponentType<Record<string, unknown>>;
  mobile: React.ComponentType<Record<string, unknown>>;
  controls: ControlDefinition[];
  code: string | ((props: Record<string, unknown>) => string);
  blueprint?: BlueprintNode[];
}

type LazyModule = {
  desktop: () => Promise<{ [key: string]: React.ComponentType }>;
  mobile: () => Promise<{ [key: string]: React.ComponentType }>;
  controls: () => Promise<{ [key: string]: ControlDefinition[] }>;
  code: () => Promise<{ [key: string]: string | ((props: Record<string, unknown>) => string) }>;
  exports: {
    desktop: string;
    mobile: string;
    controls: string;
    code: string;
  };
};

const lazyMap: Record<string, LazyModule> = {
  "prompt-input": {
    desktop: () => import("@/components/library/action/PromptInput"),
    mobile: () => import("@/components/library/action/PromptInput/mobile"),
    controls: () => import("@/components/library/action/PromptInput/controls"),
    code: () => import("@/components/library/action/PromptInput/code"),
    exports: { desktop: "PromptInput", mobile: "PromptInputMobile", controls: "promptInputControls", code: "generatePromptInputCode" },
  },
};

const cache = new Map<string, ComponentEntry>();

export async function loadComponent(slug: string): Promise<ComponentEntry | null> {
  if (cache.has(slug)) return cache.get(slug)!;

  const lazy = lazyMap[slug];
  if (!lazy) return null;

  const [desktopMod, mobileMod, controlsMod, codeMod] = await Promise.all([
    lazy.desktop(),
    lazy.mobile(),
    lazy.controls(),
    lazy.code(),
  ]);

  // Try loading blueprint (optional)
  let blueprint: BlueprintNode[] | undefined;
  try {
    const bpMod = await import(`@/components/library/action/PromptInput/blueprint`);
    if (slug === "prompt-input" && bpMod.promptInputBlueprint) {
      blueprint = bpMod.promptInputBlueprint;
    }
  } catch {
    // No blueprint for this component
  }

  const entry: ComponentEntry = {
    desktop: (desktopMod as Record<string, React.ComponentType<Record<string, unknown>>>)[lazy.exports.desktop],
    mobile: (mobileMod as Record<string, React.ComponentType<Record<string, unknown>>>)[lazy.exports.mobile],
    controls: (controlsMod as Record<string, ControlDefinition[]>)[lazy.exports.controls],
    code: (codeMod as Record<string, string | ((props: Record<string, unknown>) => string)>)[lazy.exports.code],
    blueprint,
  };

  cache.set(slug, entry);
  return entry;
}

export function hasComponent(slug: string): boolean {
  return slug in lazyMap;
}
