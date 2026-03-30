import { ComponentMeta } from "@/types/component-meta";

export const componentRegistry: ComponentMeta[] = [
  // Primitives
  { slug: "glow-button", name: "GlowButton", description: "Gradient glow button with press interaction", category: "primitives", tags: ["LLM"], version: "0.1.0", author: "Aspen", status: "stable" },
  { slug: "ghost-button", name: "GhostButton", description: "Minimal borderless secondary button", category: "primitives", tags: ["LLM"], version: "0.1.0", author: "Aspen", status: "stable" },
  { slug: "toggle", name: "Toggle", description: "On/off switch with spring animation", category: "primitives", tags: ["LLM"], version: "0.1.0", author: "Aspen", status: "stable" },
  { slug: "slider", name: "Slider", description: "Range slider with value readout", category: "primitives", tags: ["LLM"], version: "0.1.0", author: "Aspen", status: "stable" },
  { slug: "badge", name: "Badge", description: "Status and category label", category: "primitives", tags: ["LLM"], version: "0.1.0", author: "Aspen", status: "stable" },
  { slug: "status-dot", name: "StatusDot", description: "Minimal state indicator with pulse", category: "primitives", tags: ["LLM"], version: "0.1.0", author: "Aspen", status: "stable" },
  { slug: "progress-bar", name: "ProgressBar", description: "Linear progress with spring animation", category: "primitives", tags: ["LLM"], version: "0.1.0", author: "Aspen", status: "stable" },
  { slug: "arc-gauge", name: "ArcGauge", description: "Semicircular gauge meter", category: "primitives", tags: ["LLM"], version: "0.1.0", author: "Aspen", status: "stable" },
  { slug: "text-input", name: "TextInput", description: "Dark themed text input with auto-resize", category: "primitives", tags: ["LLM"], version: "0.1.0", author: "Aspen", status: "stable" },
  { slug: "tooltip", name: "Tooltip", description: "Hover information popup", category: "primitives", tags: ["LLM"], version: "0.1.0", author: "Aspen", status: "stable" },
  { slug: "popover", name: "Popover", description: "Click-triggered floating panel", category: "primitives", tags: ["LLM"], version: "0.1.0", author: "Aspen", status: "stable" },
  { slug: "tag", name: "Tag", description: "Inline removable label", category: "primitives", tags: ["LLM"], version: "0.1.0", author: "Aspen", status: "stable" },

  // Compositions
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
  {
    slug: "smart-cta",
    name: "SmartCTA",
    description: "Context-aware call-to-action with state transitions",
    category: "action",
    tags: ["Agent"],
    version: "0.1.0",
    author: "Aspen",
    status: "stable",
  },
  {
    slug: "thinking-loader",
    name: "ThinkingLoader",
    description: "Animated indicator showing AI is processing",
    category: "reasoning",
    tags: ["LLM", "Streaming"],
    version: "0.1.0",
    author: "Aspen",
    status: "stable",
  },
  {
    slug: "reasoning-steps",
    name: "ReasoningSteps",
    description: "Step-by-step reveal of AI reasoning process",
    category: "reasoning",
    tags: ["LLM", "Agent"],
    version: "0.1.0",
    author: "Aspen",
    status: "stable",
  },
  {
    slug: "decision-card",
    name: "DecisionCard",
    description: "AI recommendation with confidence and tradeoffs",
    category: "decision",
    tags: ["Agent", "Tool Use"],
    version: "0.1.0",
    author: "Aspen",
    status: "stable",
  },
  {
    slug: "confidence-meter",
    name: "ConfidenceMeter",
    description: "Visual representation of AI confidence level",
    category: "decision",
    tags: ["LLM"],
    version: "0.1.0",
    author: "Aspen",
    status: "stable",
  },
  {
    slug: "result-reveal",
    name: "ResultReveal",
    description: "Progressive reveal of AI-generated results",
    category: "output",
    tags: ["LLM", "Streaming"],
    version: "0.1.0",
    author: "Aspen",
    status: "stable",
  },
  {
    slug: "insight-stack",
    name: "InsightStack",
    description: "Stacked insight cards with expand interaction",
    category: "output",
    tags: ["RAG", "Search"],
    version: "0.1.0",
    author: "Aspen",
    status: "stable",
  },
  {
    slug: "progressive-blur-reveal",
    name: "ProgressiveBlurReveal",
    description: "Blur-to-clear content reveal on scroll or trigger",
    category: "motion",
    tags: ["Streaming"],
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
  { slug: "primitives", name: "Primitives", icon: "Box" },
  { slug: "action", name: "Action", icon: "Zap" },
  { slug: "reasoning", name: "Reasoning", icon: "Brain" },
  { slug: "decision", name: "Decision", icon: "Scale" },
  { slug: "output", name: "Output", icon: "Sparkles" },
  { slug: "motion", name: "Motion", icon: "Play" },
] as const;
