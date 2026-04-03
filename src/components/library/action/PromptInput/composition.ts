import type { CompositionMap } from "@/types/composition";

export const composition: CompositionMap = {
  container: {
    role: "AI prompt input panel",
    layout: "vertical — input area stacked above toolbar",
    state: ["value", "focused", "micOn"],
  },
  atoms: [
    { slug: "glow-surface",  type: "surface", role: "animated gradient border, reacts to focus state" },
    { slug: "text-area",     type: "input",   role: "self-sizing text capture" },
    { slug: "chip-button",   type: "action",  role: "secondary toolbar actions (Prompts, Attach)" },
    { slug: "icon-button",   type: "action",  role: "standalone icon action (Attach)" },
    { slug: "toggle-chip",   type: "control", role: "mic on/off toggle with track indicator" },
    { slug: "fab",           type: "action",  role: "primary send action, gradient when active" },
    { slug: "toolbar",       type: "layout",  role: "arrange left/right action groups" },
  ],
};
