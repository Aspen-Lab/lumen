"use client";

import Link from "next/link";
import { categories, getComponentsByCategory } from "@/data/registry";
import { PromptInput } from "@/components/library/action/PromptInput";

const previewMap: Record<string, React.ComponentType> = {
  "prompt-input": PromptInput,
};

export default function HomePage() {
  return (
    <div className="space-y-16 py-4">
      <div className="space-y-5 pt-4">
        <h1 className="text-[48px] font-bold tracking-tight text-white leading-none">
          Lumen
        </h1>
        <p className="text-lg text-white/35 max-w-lg leading-relaxed">
          Interactive components for AI-native interfaces.
          Reasoning, decision, action, output.
        </p>
      </div>

      <div className="space-y-12">
        {categories.map((cat) => {
          const components = getComponentsByCategory(cat.slug);
          return (
            <div key={cat.slug}>
              <h2 className="text-xs font-medium text-white/25 uppercase tracking-widest mb-4">
                {cat.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {components.map((comp) => {
                  const Preview = previewMap[comp.slug];
                  return (
                    <Link
                      key={comp.slug}
                      href={`/components/${comp.category}/${comp.slug}`}
                      className="group block rounded-2xl bg-surface-1/60 overflow-hidden hover:bg-surface-2/60 transition-all duration-200"
                    >
                      <div className="relative h-[200px] flex items-center justify-center p-5 overflow-hidden">
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface-1 to-transparent z-10 pointer-events-none" />
                        <div className="w-full scale-[0.85] origin-center pointer-events-none select-none">
                          {Preview && <Preview />}
                        </div>
                      </div>
                      <div className="px-4 py-3">
                        <div className="text-sm font-semibold font-mono text-white/70 group-hover:text-white transition-colors">
                          {comp.name}
                        </div>
                        <div className="text-xs text-white/20 mt-0.5 truncate">
                          {comp.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
