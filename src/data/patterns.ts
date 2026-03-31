export interface PatternStep {
  componentSlug: string;
  label: string;
  duration: number; // ms to show before transitioning
}

export interface PatternMeta {
  slug: string;
  name: string;
  description: string;
  steps: PatternStep[];
}

export const patternRegistry: PatternMeta[] = [
  {
    slug: "reasoning-flow",
    name: "Reasoning Flow",
    description: "The full AI thinking experience — from processing indicator through step-by-step reasoning to final result reveal.",
    steps: [
      { componentSlug: "thinking-loader", label: "Processing", duration: 3000 },
      { componentSlug: "reasoning-steps", label: "Reasoning", duration: 4000 },
      { componentSlug: "result-reveal", label: "Output", duration: 4000 },
    ],
  },
  {
    slug: "decision-loop",
    name: "Decision Loop",
    description: "Ask, wait, evaluate, act — the core decision-making cycle in AI products.",
    steps: [
      { componentSlug: "prompt-input", label: "Input", duration: 3000 },
      { componentSlug: "thinking-loader", label: "Processing", duration: 2500 },
      { componentSlug: "decision-card", label: "Decision", duration: 4000 },
      { componentSlug: "smart-cta", label: "Action", duration: 3000 },
    ],
  },
  {
    slug: "confidence-calibration",
    name: "Confidence Calibration",
    description: "Present AI outputs with varying certainty levels — meter, card, and supporting insights.",
    steps: [
      { componentSlug: "confidence-meter", label: "Confidence", duration: 3500 },
      { componentSlug: "decision-card", label: "Recommendation", duration: 4000 },
      { componentSlug: "insight-stack", label: "Evidence", duration: 4000 },
    ],
  },
];

export function getPatternBySlug(slug: string) {
  return patternRegistry.find((p) => p.slug === slug);
}
