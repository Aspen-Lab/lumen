import { ControlDefinition } from "@/types/controls";

export interface ComponentEntry {
  desktop: React.ComponentType<Record<string, unknown>>;
  mobile: React.ComponentType<Record<string, unknown>>;
  controls: ControlDefinition[];
  code: string | ((props: Record<string, unknown>) => string);
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

// Map of slug -> lazy loaders
// This replaces 240 lines of manual imports
const lazyMap: Record<string, LazyModule> = {
  // Primitives
  "glow-button": {
    desktop: () => import("@/components/library/primitives/GlowButton"),
    mobile: () => import("@/components/library/primitives/GlowButton"),
    controls: () => import("@/components/library/primitives/GlowButton/controls"),
    code: () => import("@/components/library/primitives/GlowButton/code"),
    exports: { desktop: "GlowButton", mobile: "GlowButton", controls: "glowButtonControls", code: "generateGlowButtonCode" },
  },
  "ghost-button": {
    desktop: () => import("@/components/library/primitives/GhostButton"),
    mobile: () => import("@/components/library/primitives/GhostButton"),
    controls: () => import("@/components/library/primitives/GhostButton/controls"),
    code: () => import("@/components/library/primitives/GhostButton/code"),
    exports: { desktop: "GhostButton", mobile: "GhostButton", controls: "ghostButtonControls", code: "generateGhostButtonCode" },
  },
  "toggle": {
    desktop: () => import("@/components/library/primitives/Toggle"),
    mobile: () => import("@/components/library/primitives/Toggle"),
    controls: () => import("@/components/library/primitives/Toggle/controls"),
    code: () => import("@/components/library/primitives/Toggle/code"),
    exports: { desktop: "Toggle", mobile: "Toggle", controls: "toggleControls", code: "generateToggleCode" },
  },
  "slider": {
    desktop: () => import("@/components/library/primitives/Slider"),
    mobile: () => import("@/components/library/primitives/Slider"),
    controls: () => import("@/components/library/primitives/Slider/controls"),
    code: () => import("@/components/library/primitives/Slider/code"),
    exports: { desktop: "Slider", mobile: "Slider", controls: "sliderControls", code: "generateSliderCode" },
  },
  "badge": {
    desktop: () => import("@/components/library/primitives/Badge"),
    mobile: () => import("@/components/library/primitives/Badge"),
    controls: () => import("@/components/library/primitives/Badge/controls"),
    code: () => import("@/components/library/primitives/Badge/code"),
    exports: { desktop: "Badge", mobile: "Badge", controls: "badgeControls", code: "generateBadgeCode" },
  },
  "status-dot": {
    desktop: () => import("@/components/library/primitives/StatusDot"),
    mobile: () => import("@/components/library/primitives/StatusDot"),
    controls: () => import("@/components/library/primitives/StatusDot/controls"),
    code: () => import("@/components/library/primitives/StatusDot/code"),
    exports: { desktop: "StatusDot", mobile: "StatusDot", controls: "statusDotControls", code: "generateStatusDotCode" },
  },
  "progress-bar": {
    desktop: () => import("@/components/library/primitives/ProgressBar"),
    mobile: () => import("@/components/library/primitives/ProgressBar"),
    controls: () => import("@/components/library/primitives/ProgressBar/controls"),
    code: () => import("@/components/library/primitives/ProgressBar/code"),
    exports: { desktop: "ProgressBar", mobile: "ProgressBar", controls: "progressBarControls", code: "generateProgressBarCode" },
  },
  "arc-gauge": {
    desktop: () => import("@/components/library/primitives/ArcGauge"),
    mobile: () => import("@/components/library/primitives/ArcGauge"),
    controls: () => import("@/components/library/primitives/ArcGauge/controls"),
    code: () => import("@/components/library/primitives/ArcGauge/code"),
    exports: { desktop: "ArcGauge", mobile: "ArcGauge", controls: "arcGaugeControls", code: "generateArcGaugeCode" },
  },
  "text-input": {
    desktop: () => import("@/components/library/primitives/TextInput"),
    mobile: () => import("@/components/library/primitives/TextInput"),
    controls: () => import("@/components/library/primitives/TextInput/controls"),
    code: () => import("@/components/library/primitives/TextInput/code"),
    exports: { desktop: "TextInput", mobile: "TextInput", controls: "textInputControls", code: "generateTextInputCode" },
  },
  "tooltip": {
    desktop: () => import("@/components/library/primitives/Tooltip"),
    mobile: () => import("@/components/library/primitives/Tooltip"),
    controls: () => import("@/components/library/primitives/Tooltip/controls"),
    code: () => import("@/components/library/primitives/Tooltip/code"),
    exports: { desktop: "Tooltip", mobile: "Tooltip", controls: "tooltipControls", code: "generateTooltipCode" },
  },
  "popover": {
    desktop: () => import("@/components/library/primitives/Popover"),
    mobile: () => import("@/components/library/primitives/Popover"),
    controls: () => import("@/components/library/primitives/Popover/controls"),
    code: () => import("@/components/library/primitives/Popover/code"),
    exports: { desktop: "Popover", mobile: "Popover", controls: "popoverControls", code: "generatePopoverCode" },
  },
  "tag": {
    desktop: () => import("@/components/library/primitives/Tag"),
    mobile: () => import("@/components/library/primitives/Tag"),
    controls: () => import("@/components/library/primitives/Tag/controls"),
    code: () => import("@/components/library/primitives/Tag/code"),
    exports: { desktop: "Tag", mobile: "Tag", controls: "tagControls", code: "generateTagCode" },
  },

  // Compositions
  "prompt-input": {
    desktop: () => import("@/components/library/action/PromptInput"),
    mobile: () => import("@/components/library/action/PromptInput/mobile"),
    controls: () => import("@/components/library/action/PromptInput/controls"),
    code: () => import("@/components/library/action/PromptInput/code"),
    exports: { desktop: "PromptInput", mobile: "PromptInputMobile", controls: "promptInputControls", code: "generatePromptInputCode" },
  },
  "smart-cta": {
    desktop: () => import("@/components/library/action/SmartCTA"),
    mobile: () => import("@/components/library/action/SmartCTA/mobile"),
    controls: () => import("@/components/library/action/SmartCTA/controls"),
    code: () => import("@/components/library/action/SmartCTA/code"),
    exports: { desktop: "SmartCTA", mobile: "SmartCTAMobile", controls: "smartCTAControls", code: "generateSmartCTACode" },
  },
  "thinking-loader": {
    desktop: () => import("@/components/library/reasoning/ThinkingLoader"),
    mobile: () => import("@/components/library/reasoning/ThinkingLoader/mobile"),
    controls: () => import("@/components/library/reasoning/ThinkingLoader/controls"),
    code: () => import("@/components/library/reasoning/ThinkingLoader/code"),
    exports: { desktop: "ThinkingLoader", mobile: "ThinkingLoaderMobile", controls: "thinkingLoaderControls", code: "generateThinkingLoaderCode" },
  },
  "reasoning-steps": {
    desktop: () => import("@/components/library/reasoning/ReasoningSteps"),
    mobile: () => import("@/components/library/reasoning/ReasoningSteps/mobile"),
    controls: () => import("@/components/library/reasoning/ReasoningSteps/controls"),
    code: () => import("@/components/library/reasoning/ReasoningSteps/code"),
    exports: { desktop: "ReasoningSteps", mobile: "ReasoningStepsMobile", controls: "reasoningStepsControls", code: "generateReasoningStepsCode" },
  },
  "decision-card": {
    desktop: () => import("@/components/library/decision/DecisionCard"),
    mobile: () => import("@/components/library/decision/DecisionCard/mobile"),
    controls: () => import("@/components/library/decision/DecisionCard/controls"),
    code: () => import("@/components/library/decision/DecisionCard/code"),
    exports: { desktop: "DecisionCard", mobile: "DecisionCardMobile", controls: "decisionCardControls", code: "generateDecisionCardCode" },
  },
  "confidence-meter": {
    desktop: () => import("@/components/library/decision/ConfidenceMeter"),
    mobile: () => import("@/components/library/decision/ConfidenceMeter/mobile"),
    controls: () => import("@/components/library/decision/ConfidenceMeter/controls"),
    code: () => import("@/components/library/decision/ConfidenceMeter/code"),
    exports: { desktop: "ConfidenceMeter", mobile: "ConfidenceMeterMobile", controls: "confidenceMeterControls", code: "generateConfidenceMeterCode" },
  },
  "result-reveal": {
    desktop: () => import("@/components/library/output/ResultReveal"),
    mobile: () => import("@/components/library/output/ResultReveal/mobile"),
    controls: () => import("@/components/library/output/ResultReveal/controls"),
    code: () => import("@/components/library/output/ResultReveal/code"),
    exports: { desktop: "ResultReveal", mobile: "ResultRevealMobile", controls: "resultRevealControls", code: "generateResultRevealCode" },
  },
  "streaming-text": {
    desktop: () => import("@/components/library/output/StreamingText"),
    mobile: () => import("@/components/library/output/StreamingText/mobile"),
    controls: () => import("@/components/library/output/StreamingText/controls"),
    code: () => import("@/components/library/output/StreamingText/code"),
    exports: { desktop: "StreamingText", mobile: "StreamingTextMobile", controls: "streamingTextControls", code: "generateStreamingTextCode" },
  },
  "source-citation": {
    desktop: () => import("@/components/library/output/SourceCitation"),
    mobile: () => import("@/components/library/output/SourceCitation/mobile"),
    controls: () => import("@/components/library/output/SourceCitation/controls"),
    code: () => import("@/components/library/output/SourceCitation/code"),
    exports: { desktop: "SourceCitation", mobile: "SourceCitationMobile", controls: "sourceCitationControls", code: "generateSourceCitationCode" },
  },
  "insight-stack": {
    desktop: () => import("@/components/library/output/InsightStack"),
    mobile: () => import("@/components/library/output/InsightStack/mobile"),
    controls: () => import("@/components/library/output/InsightStack/controls"),
    code: () => import("@/components/library/output/InsightStack/code"),
    exports: { desktop: "InsightStack", mobile: "InsightStackMobile", controls: "insightStackControls", code: "generateInsightStackCode" },
  },
  "progressive-blur-reveal": {
    desktop: () => import("@/components/library/motion/ProgressiveBlurReveal"),
    mobile: () => import("@/components/library/motion/ProgressiveBlurReveal/mobile"),
    controls: () => import("@/components/library/motion/ProgressiveBlurReveal/controls"),
    code: () => import("@/components/library/motion/ProgressiveBlurReveal/code"),
    exports: { desktop: "ProgressiveBlurReveal", mobile: "ProgressiveBlurRevealMobile", controls: "progressiveBlurRevealControls", code: "generateProgressiveBlurRevealCode" },
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

  const entry: ComponentEntry = {
    desktop: (desktopMod as Record<string, React.ComponentType<Record<string, unknown>>>)[lazy.exports.desktop],
    mobile: (mobileMod as Record<string, React.ComponentType<Record<string, unknown>>>)[lazy.exports.mobile],
    controls: (controlsMod as Record<string, ControlDefinition[]>)[lazy.exports.controls],
    code: (codeMod as Record<string, string | ((props: Record<string, unknown>) => string)>)[lazy.exports.code],
  };

  cache.set(slug, entry);
  return entry;
}

export function hasComponent(slug: string): boolean {
  return slug in lazyMap;
}
