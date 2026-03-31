"use client";

import Link from "next/link";
import { categories, getComponentsByCategory } from "@/data/registry";

import { ThinkingLoader } from "@/components/library/reasoning/ThinkingLoader";
import { ReasoningSteps } from "@/components/library/reasoning/ReasoningSteps";
import { DecisionCard } from "@/components/library/decision/DecisionCard";
import { ConfidenceMeter } from "@/components/library/decision/ConfidenceMeter";
import { ResultReveal } from "@/components/library/output/ResultReveal";
import { StreamingText } from "@/components/library/output/StreamingText";
import { SourceCitation } from "@/components/library/output/SourceCitation";
import { InsightStack } from "@/components/library/output/InsightStack";
import { SmartCTA } from "@/components/library/action/SmartCTA";
import { PromptInput } from "@/components/library/action/PromptInput";
import { ProgressiveBlurReveal } from "@/components/library/motion/ProgressiveBlurReveal";
import { GlowButton } from "@/components/library/primitives/GlowButton";
import { GhostButton } from "@/components/library/primitives/GhostButton";
import { Toggle as TogglePrimitive } from "@/components/library/primitives/Toggle";
import { Slider as SliderPrimitive } from "@/components/library/primitives/Slider";
import { Badge } from "@/components/library/primitives/Badge";
import { StatusDot } from "@/components/library/primitives/StatusDot";
import { ProgressBar } from "@/components/library/primitives/ProgressBar";
import { ArcGauge } from "@/components/library/primitives/ArcGauge";
import { TextInput } from "@/components/library/primitives/TextInput";
import { Tooltip as TooltipPrimitive } from "@/components/library/primitives/Tooltip";
import { Popover as PopoverPrimitive } from "@/components/library/primitives/Popover";
import { Tag } from "@/components/library/primitives/Tag";

const previewMap: Record<string, React.ComponentType> = {
  "thinking-loader": ThinkingLoader,
  "reasoning-steps": ReasoningSteps,
  "decision-card": DecisionCard,
  "confidence-meter": ConfidenceMeter,
  "result-reveal": ResultReveal,
  "streaming-text": StreamingText,
  "source-citation": SourceCitation,
  "insight-stack": InsightStack,
  "smart-cta": SmartCTA,
  "prompt-input": PromptInput,
  "progressive-blur-reveal": ProgressiveBlurReveal,
  "glow-button": GlowButton,
  "ghost-button": GhostButton,
  "toggle": TogglePrimitive,
  "slider": SliderPrimitive,
  "badge": Badge,
  "status-dot": StatusDot,
  "progress-bar": ProgressBar,
  "arc-gauge": ArcGauge,
  "text-input": TextInput,
  "tooltip": TooltipPrimitive,
  "popover": PopoverPrimitive,
  "tag": Tag,
};

export default function HomePage() {
  return (
    <div className="space-y-16 py-4">
      {/* Hero */}
      <div className="space-y-5 pt-4">
        <h1 className="text-[48px] font-bold tracking-tight text-white leading-none">
          Lumen
        </h1>
        <p className="text-lg text-white/35 max-w-lg leading-relaxed">
          Interactive components for AI-native interfaces.
          Reasoning, decision, action, output.
        </p>
      </div>

      {/* Grid */}
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
                      {/* Live preview */}
                      <div className="relative h-[200px] flex items-center justify-center p-5 overflow-hidden">
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface-1 to-transparent z-10 pointer-events-none" />
                        <div className="w-full scale-[0.85] origin-center pointer-events-none select-none">
                          {Preview && <Preview />}
                        </div>
                      </div>

                      {/* Info */}
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
