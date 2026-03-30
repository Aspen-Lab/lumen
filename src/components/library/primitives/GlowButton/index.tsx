"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────── */

export type GlowButtonVariant = "primary" | "ghost" | "danger";
export type GlowButtonSize    = "sm" | "md" | "lg";

export interface GlowButtonProps {
  label:           string;
  sublabel?:       string;
  variant?:        GlowButtonVariant;
  size?:           GlowButtonSize;
  glowFrom?:       string;   // gradient start color  (#7C5CFC)
  glowTo?:         string;   // gradient end color    (#F97316)
  glowIntensity?:  number;   // 0–1
  loading?:        boolean;
  disabled?:       boolean;
  icon?:           ReactNode;
  onClick?:        () => void;
  className?:      string;
}

/* ── Helpers ────────────────────────────────────────────────── */

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace(/^#/, "");
  const full  =
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean;
  const int = parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ── Size map ───────────────────────────────────────────────── */

const sizeStyles: Record<GlowButtonSize, {
  px: string; py: string; gap: string;
  labelSize: string; sublabelSize: string;
  iconSize: string; spinnerSize: string;
  radius: string;
}> = {
  sm: {
    px: "px-3.5", py: "py-2",
    gap: "gap-2",
    labelSize: "text-[12px]", sublabelSize: "text-[10px]",
    iconSize: "w-3.5 h-3.5", spinnerSize: "w-3.5 h-3.5",
    radius: "rounded-lg",
  },
  md: {
    px: "px-5", py: "py-2.5",
    gap: "gap-2.5",
    labelSize: "text-sm", sublabelSize: "text-[11px]",
    iconSize: "w-4 h-4", spinnerSize: "w-4 h-4",
    radius: "rounded-xl",
  },
  lg: {
    px: "px-6", py: "py-3.5",
    gap: "gap-3",
    labelSize: "text-base", sublabelSize: "text-xs",
    iconSize: "w-5 h-5", spinnerSize: "w-5 h-5",
    radius: "rounded-2xl",
  },
};

/* ── Variant color resolver ─────────────────────────────────── */

const DANGER_FROM = "#EF4444";
const DANGER_TO   = "#DC2626";

function resolveVariantColors(
  variant: GlowButtonVariant,
  glowFrom: string,
  glowTo: string,
  intensity: number,
): {
  background:  string;
  border:      string;
  boxShadow:   string;
  hoverShadow: string;
  shimmer:     string;
  ambientGlow: string;
  textColor:   string;
  sublabelColor: string;
} {
  if (variant === "danger") {
    const f = DANGER_FROM;
    const t = DANGER_TO;
    return {
      background:    `linear-gradient(135deg, ${f} 0%, ${t} 100%)`,
      border:        rgba(f, 0.6),
      boxShadow:     `0 0 0 1px ${rgba(f, 0.4)}, 0 4px 20px ${rgba(f, 0.25 * intensity)}`,
      hoverShadow:   `0 0 0 1px ${rgba(f, 0.5)}, 0 6px 28px ${rgba(f, 0.45 * intensity)}`,
      shimmer:       `linear-gradient(90deg, transparent 0%, ${rgba(f, 0.5)} 50%, transparent 100%)`,
      ambientGlow:   `radial-gradient(ellipse at 50% 0%, ${rgba(f, 0.3 * intensity)} 0%, transparent 70%)`,
      textColor:     "#FFFFFF",
      sublabelColor: "rgba(255,255,255,0.65)",
    };
  }

  if (variant === "ghost") {
    return {
      background:    "rgba(255,255,255,0.03)",
      border:        rgba(glowFrom, 0.25),
      boxShadow:     `0 0 0 1px ${rgba(glowFrom, 0.18)}`,
      hoverShadow:   `0 0 0 1px ${rgba(glowFrom, 0.35)}, 0 4px 20px ${rgba(glowFrom, 0.2 * intensity)}`,
      shimmer:       `linear-gradient(90deg, transparent 0%, ${rgba(glowFrom, 0.35)} 50%, transparent 100%)`,
      ambientGlow:   `radial-gradient(ellipse at 50% 0%, ${rgba(glowFrom, 0.15 * intensity)} 0%, transparent 70%)`,
      textColor:     glowFrom,
      sublabelColor: rgba(glowFrom, 0.55),
    };
  }

  // primary
  return {
    background:    `linear-gradient(135deg, ${glowFrom} 0%, ${glowTo} 100%)`,
    border:        rgba(glowFrom, 0.5),
    boxShadow:     `0 0 0 1px ${rgba(glowFrom, 0.35)}, 0 4px 24px ${rgba(glowFrom, 0.3 * intensity)}`,
    hoverShadow:   `0 0 0 1px ${rgba(glowFrom, 0.5)}, 0 6px 32px ${rgba(glowFrom, 0.55 * intensity)}, 0 0 0 3px ${rgba(glowTo, 0.12 * intensity)}`,
    shimmer:       `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)`,
    ambientGlow:   `radial-gradient(ellipse at 50% 0%, ${rgba(glowFrom, 0.35 * intensity)} 0%, transparent 70%)`,
    textColor:     "#FFFFFF",
    sublabelColor: "rgba(255,255,255,0.65)",
  };
}

/* ── Spinner ────────────────────────────────────────────────── */

function Spinner({ color, sizeClass }: { color: string; sizeClass: string }) {
  return (
    <motion.span
      className={cn("inline-block rounded-full border-2 border-transparent", sizeClass)}
      style={{
        borderTopColor:   color,
        borderRightColor: rgba("#FFFFFF", 0.2),
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ── GlowButton ─────────────────────────────────────────────── */

export function GlowButton({
  label,
  sublabel,
  variant        = "primary",
  size           = "md",
  glowFrom       = "#7C5CFC",
  glowTo         = "#F97316",
  glowIntensity  = 0.75,
  loading        = false,
  disabled       = false,
  icon,
  onClick,
  className,
}: GlowButtonProps) {
  const s      = sizeStyles[size];
  const colors = resolveVariantColors(variant, glowFrom, glowTo, glowIntensity);

  const isInert = loading || disabled;

  /* ── Glow border gradient overlay (wrapping div trick) ── */
  // We render a gradient-border via a pseudo background on a wrapping element,
  // with an inner element that clips it to show only the border.
  // To keep it self-contained we use a box-shadow + border approach via style.

  return (
    <motion.button
      className={cn(
        "relative flex items-center",
        s.px, s.py, s.gap, s.radius,
        "border overflow-hidden select-none cursor-pointer",
        "transition-opacity duration-200",
        isInert && "cursor-not-allowed opacity-60",
        className,
      )}
      style={{
        background:  colors.background,
        borderColor: colors.border,
        boxShadow:   colors.boxShadow,
      }}
      whileHover={
        !isInert
          ? { scale: 1.01, y: -1, boxShadow: colors.hoverShadow }
          : {}
      }
      whileTap={!isInert ? { scale: 0.97 } : {}}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
      onClick={isInert ? undefined : onClick}
      disabled={isInert}
    >
      {/* Top shimmer line */}
      <span
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: colors.shimmer }}
      />

      {/* Ambient glow layer */}
      <motion.span
        className={cn("absolute inset-0 pointer-events-none", s.radius)}
        animate={
          !isInert
            ? { opacity: [0.4, 0.7, 0.4] }
            : { opacity: 0 }
        }
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: colors.ambientGlow }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-inherit w-full" style={{ gap: "inherit" }}>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.span
              key="loading"
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
            >
              <Spinner
                color={colors.textColor}
                sizeClass={s.spinnerSize}
              />
              <span
                className={cn("font-semibold leading-tight", s.labelSize)}
                style={{ color: colors.textColor }}
              >
                Loading…
              </span>
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              className="flex items-center gap-inherit"
              style={{ gap: "inherit" }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
            >
              {/* Icon */}
              {icon && (
                <span
                  className={cn("shrink-0 flex items-center justify-center", s.iconSize)}
                  style={{ color: colors.textColor }}
                >
                  {icon}
                </span>
              )}

              {/* Label + sublabel */}
              <span className="flex flex-col items-start gap-0.5">
                <span
                  className={cn("font-semibold leading-tight", s.labelSize)}
                  style={{ color: colors.textColor }}
                >
                  {label}
                </span>
                {sublabel && (
                  <span
                    className={cn("font-normal leading-tight", s.sublabelSize)}
                    style={{ color: colors.sublabelColor }}
                  >
                    {sublabel}
                  </span>
                )}
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}
