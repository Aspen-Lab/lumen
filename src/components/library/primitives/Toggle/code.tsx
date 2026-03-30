export const toggleCode: string = `"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────── */

interface ToggleProps {
  value?:       boolean;                       // controlled on/off state
  onChange?:    (value: boolean) => void;      // called with next value on click
  size?:        "sm" | "md";                   // track + thumb scale
  activeColor?: string;                        // hex — track tint & thumb accent when on
  label?:       string;                        // optional label placed to the left
  className?:   string;
}

/* ── Size tokens ────────────────────────────────────────────── */

const sizes = {
  sm: { track: "w-8 h-[18px]",  trackPx: { width: 32, height: 18 }, thumb: "w-3 h-3",          thumbPx: 12, padding: 3 },
  md: { track: "w-11 h-6",      trackPx: { width: 44, height: 24 }, thumb: "w-[18px] h-[18px]", thumbPx: 18, padding: 3 },
};

/* ── Helpers ────────────────────────────────────────────────── */

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace(/^#/, "");
  const full  = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const int   = parseInt(full, 16);
  return \`rgba(\${(int >> 16) & 255},\${(int >> 8) & 255},\${int & 255},\${alpha})\`;
}

/* ── Toggle ─────────────────────────────────────────────────── */

export function Toggle({
  value       = false,
  onChange,
  size        = "md",
  activeColor = "#0BE09B",
  label,
  className,
}: ToggleProps) {
  const s      = sizes[size];
  const travel = s.trackPx.width - s.thumbPx - s.padding * 2;

  return (
    <div className={cn("inline-flex items-center gap-2 select-none", className)}>
      {/* Label — left */}
      {label && (
        <span className="text-sm text-white/60 leading-none">{label}</span>
      )}

      {/* Track */}
      <motion.button
        role="switch"
        aria-checked={value}
        onClick={() => onChange?.(!value)}
        className={cn(
          "relative inline-flex shrink-0 items-center rounded-full cursor-pointer",
          "border border-white/[0.06] focus-visible:outline-none",
          s.track
        )}
        animate={{ backgroundColor: value ? hexToRgba(activeColor, 0.3) : "rgba(255,255,255,0.08)" }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        style={{ padding: s.padding }}
      >
        {/* Thumb — spring slide */}
        <motion.span
          className={cn("block rounded-full bg-white shrink-0", s.thumb)}
          animate={{ x: value ? travel : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.6 }}
        />
      </motion.button>
    </div>
  );
}
`;
