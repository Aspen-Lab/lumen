"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { type ThinkingStage, type ThinkingLoaderProps } from "./index";

const STAGE_LABELS: Record<ThinkingStage, string[]> = {
  thinking: ["Thinking", "Processing", "Reasoning", "Considering"],
  searching: ["Searching", "Scanning", "Fetching", "Retrieving"],
  analyzing: ["Analyzing", "Evaluating", "Comparing", "Reviewing"],
};

const STAGE_PROGRESS_COLOR: Record<ThinkingStage, string> = {
  thinking: "#0BE09B",
  searching: "#0091FF",
  analyzing: "#0BE09B",
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

export function ThinkingLoaderMobile({
  stage = "thinking",
  duration = 3000,
  showLabel = true,
  pulseSpeed = 1.2,
  glowIntensity = 0.6,
  blur = 0,
}: ThinkingLoaderProps) {
  const labels = STAGE_LABELS[stage];
  const currentLabel = useCyclingLabel(labels, duration);
  const accentColor = STAGE_PROGRESS_COLOR[stage];

  const safeSpeed = Math.max(0.5, Math.min(3, pulseSpeed));
  const safeGlow = Math.max(0, Math.min(1, glowIntensity));
  const safeBlur = Math.max(0, Math.min(20, blur));

  const pulseDuration = 1 / safeSpeed;
  const glowShadow = `0 0 ${10 + safeGlow * 28}px rgba(11, 224, 155, ${0.2 + safeGlow * 0.6})`;

  return (
    <div
      className={cn(
        "w-full flex flex-col gap-3 px-4 py-4",
        "rounded-xl border border-white/[0.06] bg-[#161618]",
        "relative overflow-hidden"
      )}
      style={{
        filter: safeBlur > 0 ? `blur(${safeBlur * 0.05}px)` : undefined,
      }}
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-xl"
        animate={{ opacity: [0.4, safeGlow * 0.9, 0.4] }}
        transition={{
          duration: pulseDuration * 1.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `radial-gradient(ellipse at 10% 50%, rgba(11, 224, 155, ${
            0.06 + safeGlow * 0.12
          }) 0%, transparent 65%)`,
        }}
      />

      {/* Top row: orb + label */}
      <div className="flex items-center gap-3 relative">
        {/* Large pulse orb */}
        <div className="relative w-7 h-7 flex items-center justify-center flex-shrink-0">
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ scale: [1, 1.9, 1], opacity: [0.5, 0, 0.5] }}
            transition={{
              duration: pulseDuration,
              repeat: Infinity,
              ease: "easeOut",
            }}
            style={{
              background: `rgba(11, 224, 155, ${0.3 + safeGlow * 0.4})`,
              boxShadow: glowShadow,
            }}
          />
          <motion.div
            className="relative w-3 h-3 rounded-full"
            animate={{ scale: [0.8, 1.15, 0.8] }}
            transition={{
              duration: pulseDuration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ background: accentColor, boxShadow: glowShadow }}
          />
        </div>

        {/* Cycling label */}
        {showLabel && (
          <div className="relative h-6 flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentLabel}
                className="absolute inset-0 text-heading font-mono font-semibold leading-6"
                style={{ color: "rgba(255,255,255,0.8)" }}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                {currentLabel}
              </motion.span>
            </AnimatePresence>
          </div>
        )}

        {/* Dot trio — right aligned */}
        <div className="flex items-center gap-[4px] flex-shrink-0">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block w-[4px] h-[4px] rounded-full"
              style={{ background: accentColor }}
              animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
              transition={{
                duration: pulseDuration * 0.85,
                repeat: Infinity,
                delay: (i * pulseDuration * 0.85) / 3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress bar — full width */}
      <div className="relative w-full h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
        {/* Animated fill */}
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          animate={{ x: ["-100%", "100%"] }}
          transition={{
            duration: pulseDuration * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: "55%",
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            boxShadow: `0 0 8px rgba(11, 224, 155, ${0.3 + safeGlow * 0.5})`,
          }}
        />
      </div>

      {/* Scan line overlay */}
      <motion.div
        className="absolute top-0 bottom-0 w-[2px] pointer-events-none"
        animate={{ left: ["-4px", "calc(100% + 4px)"] }}
        transition={{
          duration: pulseDuration * 3,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background: `linear-gradient(to bottom, transparent, rgba(11, 224, 155, ${
            0.1 + safeGlow * 0.4
          }), transparent)`,
        }}
      />
    </div>
  );
}
