import { ThemePreset } from "@/types/controls";

// Shared AI brand presets — applied to color-layer controls
const chatgpt: Partial<Record<string, unknown>> = {
  accentColor: "#10A37F",
  glowFrom: "#10A37F",
  accentFrom: "#10A37F",
  highColor: "#10A37F",
  highlightColor: "#10A37F",
  primaryColor: "#10A37F",
  activeColor: "#10A37F",
  color: "#10A37F",
  glowTo: "#1A7F5A",
  accentTo: "#1A7F5A",
};

const claude: Partial<Record<string, unknown>> = {
  accentColor: "#D97706",
  glowFrom: "#D97706",
  accentFrom: "#D97706",
  highColor: "#D97706",
  highlightColor: "#D97706",
  primaryColor: "#D97706",
  activeColor: "#D97706",
  color: "#D97706",
  glowTo: "#92400E",
  accentTo: "#92400E",
};

const gemini: Partial<Record<string, unknown>> = {
  accentColor: "#4285F4",
  glowFrom: "#4285F4",
  accentFrom: "#4285F4",
  highColor: "#4285F4",
  highlightColor: "#4285F4",
  primaryColor: "#4285F4",
  activeColor: "#4285F4",
  color: "#4285F4",
  glowTo: "#7B61FF",
  accentTo: "#7B61FF",
};

const perplexity: Partial<Record<string, unknown>> = {
  accentColor: "#22D3EE",
  glowFrom: "#22D3EE",
  accentFrom: "#22D3EE",
  highColor: "#22D3EE",
  highlightColor: "#22D3EE",
  primaryColor: "#22D3EE",
  activeColor: "#22D3EE",
  color: "#22D3EE",
  glowTo: "#0EA5E9",
  accentTo: "#0EA5E9",
};

const deepseek: Partial<Record<string, unknown>> = {
  accentColor: "#536DFE",
  glowFrom: "#536DFE",
  accentFrom: "#536DFE",
  highColor: "#536DFE",
  highlightColor: "#536DFE",
  primaryColor: "#536DFE",
  activeColor: "#536DFE",
  color: "#536DFE",
  glowTo: "#304FFE",
  accentTo: "#304FFE",
};

export function getPresetsForComponent(controlKeys: string[]): ThemePreset[] {
  const keySet = new Set(controlKeys);

  function filterRelevant(src: Partial<Record<string, unknown>>): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(src)) {
      if (keySet.has(k)) out[k] = v;
    }
    return out;
  }

  const presets: ThemePreset[] = [
    { id: "chatgpt", name: "ChatGPT", brand: "OpenAI", color: "#10A37F", values: filterRelevant(chatgpt) },
    { id: "claude", name: "Claude", brand: "Anthropic", color: "#D97706", values: filterRelevant(claude) },
    { id: "gemini", name: "Gemini", brand: "Google", color: "#4285F4", values: filterRelevant(gemini) },
    { id: "perplexity", name: "Perplexity", brand: "Perplexity", color: "#22D3EE", values: filterRelevant(perplexity) },
    { id: "deepseek", name: "DeepSeek", brand: "DeepSeek", color: "#536DFE", values: filterRelevant(deepseek) },
  ];

  // Only return presets that have at least one matching control
  return presets.filter((p) => Object.keys(p.values).length > 0);
}
