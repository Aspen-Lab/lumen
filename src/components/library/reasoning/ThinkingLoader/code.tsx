export const thinkingLoaderCode = `"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type ThinkingStage = "thinking" | "searching" | "analyzing";

export interface ThinkingLoaderProps {
  stage?: ThinkingStage;
  duration?: number;
  showLabel?: boolean;
  pulseSpeed?: number;   // 0.5 – 3
  glowIntensity?: number; // 0 – 1
  blur?: number;          // 0 – 20
}

const STAGE_LABELS: Record<ThinkingStage, string[]> = {
  thinking:  ["Thinking",  "Processing", "Reasoning",  "Considering"],
  searching: ["Searching", "Scanning",   "Fetching",   "Retrieving"],
  analyzing: ["Analyzing", "Evaluating", "Comparing",  "Reviewing"],
};

const STAGE_ICONS: Record<ThinkingStage, string> = {
  thinking:  "◈",
  searching: "◎",
  analyzing: "◉",
};

function useCyclingLabel(labels: string[], interval: number): string {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % labels.length);
    }, interval);
    return () => clearInterval(id);
  }, [labels, interval]);
  return labels[index];
}

export function ThinkingLoader({
  stage = "thinking",
  duration = 3000,
  showLabel = true,
  pulseSpeed = 1.2,
  glowIntensity = 0.6,
  blur = 0,
}: ThinkingLoaderProps) {
  const labels        = STAGE_LABELS[stage];
  const currentLabel  = useCyclingLabel(labels, duration);
  const icon          = STAGE_ICONS[stage];

  const safeSpeed = Math.max(0.5, Math.min(3,  pulseSpeed));
  const safeGlow  = Math.max(0,   Math.min(1,  glowIntensity));
  const safeBlur  = Math.max(0,   Math.min(20, blur));

  const glowShadow  = \`0 0 \${8 + safeGlow * 24}px rgba(11, 224, 155, \${0.15 + safeGlow * 0.55})\`;
  const pulseDuration = 1 / safeSpeed;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 px-4 py-2.5",
        "rounded-xl border border-[--border-default] bg-bg-elevated",
        "relative overflow-hidden"
      )}
      style={{ filter: safeBlur > 0 ? \`blur(\${safeBlur * 0.05}px)\` : undefined }}
    >
      {/* Ambient glow backdrop */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-xl"
        animate={{ opacity: [0.3, safeGlow * 0.8, 0.3] }}
        transition={{ duration: pulseDuration * 1.6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: \`radial-gradient(ellipse at 20% 50%, rgba(11, 224, 155, \${
            0.04 + safeGlow * 0.1
          }) 0%, transparent 70%)\`,
        }}
      />

      {/* Pulse orb */}
      <div className="relative flex-shrink-0 w-5 h-5 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 1.7, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: pulseDuration, repeat: Infinity, ease: "easeOut" }}
          style={{ background: \`rgba(11, 224, 155, \${0.25 + safeGlow * 0.35})\`, boxShadow: glowShadow }}
        />
        <motion.div
          className="relative w-2 h-2 rounded-full"
          animate={{ scale: [0.85, 1.1, 0.85] }}
          transition={{ duration: pulseDuration, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "#0BE09B", boxShadow: glowShadow }}
        />
      </div>

      {/* Stage icon */}
      <span className="font-mono text-[10px] flex-shrink-0 tabular-nums"
        style={{ color: "rgba(11, 224, 155, 0.5)" }}>
        {icon}
      </span>

      {/* Animated dots */}
      <div className="flex items-center gap-[3px] flex-shrink-0">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block w-[3px] h-[3px] rounded-full"
            style={{ background: "#0BE09B" }}
            animate={{ opacity: [0.2, 1, 0.2], y: [0, -2, 0] }}
            transition={{
              duration: pulseDuration * 0.9,
              repeat: Infinity,
              delay: (i * pulseDuration * 0.9) / 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Cycling label */}
      {showLabel && (
        <div className="relative min-w-[72px] h-[18px] overflow-hidden flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentLabel}
              className="absolute inset-0 text-detail font-mono text-[--text-secondary] leading-[18px] whitespace-nowrap"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              {currentLabel}
            </motion.span>
          </AnimatePresence>
        </div>
      )}

      {/* Scan line */}
      <motion.div
        className="absolute top-0 bottom-0 w-px pointer-events-none"
        animate={{ left: ["-4px", "calc(100% + 4px)"] }}
        transition={{ duration: pulseDuration * 2.5, repeat: Infinity, ease: "linear" }}
        style={{
          background: \`linear-gradient(to bottom, transparent, rgba(11, 224, 155, \${
            0.15 + safeGlow * 0.45
          }), transparent)\`,
        }}
      />
    </div>
  );
}
`;
