"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────── */

export interface ToggleProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
  size?: "sm" | "md";
  activeColor?: string;
  label?: string;
  className?: string;
}

/* ── Size tokens ────────────────────────────────────────────── */

const sizes = {
  sm: {
    track: "w-8 h-[18px]",
    trackPx: { width: 32, height: 18 },
    thumb: "w-3 h-3",
    thumbPx: 12,
    padding: 3,
  },
  md: {
    track: "w-11 h-6",
    trackPx: { width: 44, height: 24 },
    thumb: "w-[18px] h-[18px]",
    thumbPx: 18,
    padding: 3,
  },
};

/* ── Component ──────────────────────────────────────────────── */

export function Toggle({
  value = false,
  onChange,
  size = "md",
  activeColor = "#0BE09B",
  label,
  className,
}: ToggleProps) {
  const s = sizes[size];

  /* Travel distance: track width − thumb size − 2×padding */
  const travel = s.trackPx.width - s.thumbPx - s.padding * 2;

  /* Derive rgba versions for the track background */
  const trackBgOff = "rgba(255,255,255,0.08)";
  const trackBgOn  = hexToRgba(activeColor, 0.3);

  function handleClick() {
    onChange?.(!value);
  }

  return (
    <div
      className={cn("inline-flex items-center gap-2 select-none", className)}
    >
      {/* Optional label — placed left */}
      {label && (
        <span className="text-sm text-white/60 leading-none">{label}</span>
      )}

      {/* Track */}
      <motion.button
        role="switch"
        aria-checked={value}
        onClick={handleClick}
        className={cn(
          "relative inline-flex shrink-0 items-center rounded-full cursor-pointer",
          "border border-white/[0.06] focus-visible:outline-none",
          s.track
        )}
        animate={{
          backgroundColor: value ? trackBgOn : trackBgOff,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        style={{ padding: s.padding }}
      >
        {/* Thumb */}
        <motion.span
          className={cn("block rounded-full bg-white shrink-0", s.thumb)}
          animate={{ x: value ? travel : 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            mass: 0.6,
          }}
        />
      </motion.button>
    </div>
  );
}

/* ── Helpers ────────────────────────────────────────────────── */

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace(/^#/, "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const int = parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}
