"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type ThinkingStage = "thinking" | "searching" | "analyzing";

export interface ThinkingLoaderProps {
  stage?: ThinkingStage;
  duration?: number;
  showLabel?: boolean;
  pulseSpeed?: number;
  glowIntensity?: number;
  blur?: number;
  // Color props
  accentColor?: string;
  glowColor?: string;
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
}

const STAGE_LABELS: Record<ThinkingStage, string[]> = {
  thinking: ["Thinking", "Processing", "Reasoning", "Considering"],
  searching: ["Searching", "Scanning", "Fetching", "Retrieving"],
  analyzing: ["Analyzing", "Evaluating", "Comparing", "Reviewing"],
};

const STAGE_ICONS: Record<ThinkingStage, string> = {
  thinking: "◈",
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

/** Parse a hex color into its r, g, b components as a comma-separated string,
 *  e.g. "#0BE09B" → "11, 224, 155". Falls back to the provided fallback string
 *  if the input is not a valid 6-digit hex. */
function hexToRgbParts(hex: string, fallback: string): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return fallback;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return fallback;
  return `${r}, ${g}, ${b}`;
}

export function ThinkingLoader({
  stage = "thinking",
  duration = 3000,
  showLabel = true,
  pulseSpeed = 1.2,
  glowIntensity = 0.6,
  blur = 0,
  accentColor = "#0BE09B",
  glowColor,
  textColor,
  bgColor,
  borderColor,
}: ThinkingLoaderProps) {
  const labels = STAGE_LABELS[stage];
  const currentLabel = useCyclingLabel(labels, duration);
  const icon = STAGE_ICONS[stage];

  // Clamp values to safe ranges
  const safeSpeed = Math.max(0.5, Math.min(3, pulseSpeed));
  const safeGlow = Math.max(0, Math.min(1, glowIntensity));
  const safeBlur = Math.max(0, Math.min(20, blur));

  // Resolve the effective glow color: prefer explicit glowColor, fall back to accentColor
  const effectiveGlowColor = glowColor ?? accentColor;
  const effectiveGlowRgb = hexToRgbParts(effectiveGlowColor, "11, 224, 155");
  const accentRgb = hexToRgbParts(accentColor, "11, 224, 155");

  const glowShadow = `0 0 ${8 + safeGlow * 24}px rgba(${effectiveGlowRgb}, ${0.15 + safeGlow * 0.55})`;
  const pulseDuration = 1 / safeSpeed;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 px-4 py-2.5",
        "rounded-xl relative overflow-hidden",
        !bgColor && "bg-[#161618]",
        !borderColor && "border border-white/[0.06]"
      )}
      style={{
        filter: safeBlur > 0 ? `blur(${safeBlur * 0.05}px)` : undefined,
        ...(bgColor ? { background: bgColor } : {}),
        ...(borderColor
          ? { border: `1px solid ${borderColor}` }
          : {}),
      }}
    >
      {/* Ambient glow backdrop */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-xl"
        animate={{ opacity: [0.3, safeGlow * 0.8, 0.3] }}
        transition={{
          duration: pulseDuration * 1.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `radial-gradient(ellipse at 20% 50%, rgba(${effectiveGlowRgb}, ${
            0.04 + safeGlow * 0.1
          }) 0%, transparent 70%)`,
        }}
      />

      {/* Pulse orb */}
      <div className="relative flex-shrink-0 w-5 h-5 flex items-center justify-center">
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 1.7, 1], opacity: [0.6, 0, 0.6] }}
          transition={{
            duration: pulseDuration,
            repeat: Infinity,
            ease: "easeOut",
          }}
          style={{
            background: `rgba(${effectiveGlowRgb}, ${0.25 + safeGlow * 0.35})`,
            boxShadow: glowShadow,
          }}
        />
        {/* Inner solid dot */}
        <motion.div
          className="relative w-2 h-2 rounded-full"
          animate={{ scale: [0.85, 1.1, 0.85] }}
          transition={{
            duration: pulseDuration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: accentColor,
            boxShadow: glowShadow,
          }}
        />
      </div>

      {/* Stage icon — subtle mono marker */}
      <span
        className="font-mono text-[10px] flex-shrink-0 tabular-nums"
        style={{ color: textColor ?? `rgba(${accentRgb}, 0.5)` }}
      >
        {icon}
      </span>

      {/* Animated dots row */}
      <div className="flex items-center gap-[3px] flex-shrink-0">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block w-[3px] h-[3px] rounded-full"
            style={{ background: accentColor }}
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
              className={cn(
                "absolute inset-0 text-detail font-mono leading-[18px] whitespace-nowrap",
                !textColor && "text-white/55"
              )}
              style={textColor ? { color: textColor } : undefined}
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

      {/* Right edge scan line */}
      <motion.div
        className="absolute top-0 bottom-0 w-px pointer-events-none"
        animate={{ left: ["-4px", "calc(100% + 4px)"] }}
        transition={{
          duration: pulseDuration * 2.5,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background: `linear-gradient(to bottom, transparent, rgba(${effectiveGlowRgb}, ${
            0.15 + safeGlow * 0.45
          }), transparent)`,
        }}
      />
    </div>
  );
}
