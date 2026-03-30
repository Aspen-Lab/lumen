"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────── */

export type Urgency = "low" | "medium" | "high";
export type ActionType = "primary" | "secondary" | "destructive";
export type LoadingAnimation = "spinner" | "pulse" | "dots";
export type CTAState = "idle" | "confirm" | "loading" | "success";

export interface SmartCTAProps {
  urgency?: Urgency;
  actionType?: ActionType;
  confirmRequired?: boolean;
  label?: string;
  sublabel?: string;
  pressScale?: number;
  glowOnUrgent?: boolean;
  glowIntensity?: number;
  loadingAnimation?: LoadingAnimation;
  onAction?: () => void | Promise<void>;
  /* ── Color props ── */
  primaryColor?: string;
  secondaryColor?: string;
  destructiveColor?: string;
  cancelTextColor?: string;
}

/* ── Helpers ────────────────────────────────────────────────── */

/** Parse a 6-digit hex string into its R, G, B integer components. */
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace(/^#/, "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const int = parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function buildColors(hex: string): { base: string; glow: string; border: string; bg: string } {
  const [r, g, b] = hexToRgb(hex);
  return {
    base:   hex,
    glow:   `rgba(${r},${g},${b},0.28)`,
    border: `rgba(${r},${g},${b},0.35)`,
    bg:     `rgba(${r},${g},${b},0.10)`,
  };
}

function buildGradient(hex: string, intensity: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `linear-gradient(135deg, rgba(${r},${g},${b},${0.14 * intensity}) 0%, rgba(${r},${g},${b},${0.06 * intensity}) 100%)`;
}

function buildGlow(hex: string, glowIntensity: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${glowIntensity})`;
}

const urgencyIntensity: Record<Urgency, number> = {
  low: 0.5,
  medium: 0.75,
  high: 1,
};

/* ── Loading indicators ─────────────────────────────────────── */

function Spinner({ color }: { color: string }) {
  return (
    <motion.span
      className="inline-block w-4 h-4 rounded-full border-2 border-transparent"
      style={{ borderTopColor: color, borderRightColor: `${color}50` }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
    />
  );
}

function PulseIndicator({ color }: { color: string }) {
  return (
    <motion.span
      className="inline-block w-4 h-4 rounded-full"
      style={{ background: color }}
      animate={{ scale: [1, 1.4, 1], opacity: [0.9, 0.4, 0.9] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function DotsIndicator({ color }: { color: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: color }}
          animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.14,
          }}
        />
      ))}
    </span>
  );
}

function LoadingIndicator({
  type,
  color,
}: {
  type: LoadingAnimation;
  color: string;
}) {
  if (type === "spinner") return <Spinner color={color} />;
  if (type === "pulse") return <PulseIndicator color={color} />;
  return <DotsIndicator color={color} />;
}

/* ── Success checkmark ──────────────────────────────────────── */

function CheckIcon({ color }: { color: string }) {
  return (
    <motion.svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
    >
      <motion.path
        d="M3.5 9L7.5 13L14.5 5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

/* ── Main component ─────────────────────────────────────────── */

export function SmartCTA({
  urgency = "medium",
  actionType = "primary",
  confirmRequired = false,
  label = "Confirm Action",
  sublabel = "This will apply the suggested changes",
  pressScale = 0.96,
  glowOnUrgent = true,
  glowIntensity = 0.28,
  loadingAnimation = "spinner",
  onAction,
  primaryColor = "#0BE09B",
  secondaryColor = "#0091FF",
  destructiveColor = "#FB7A29",
  cancelTextColor = "rgba(255,255,255,0.35)",
}: SmartCTAProps) {
  const [ctaState, setCtaState] = useState<CTAState>("idle");

  const safePressScale = Math.max(0.9, Math.min(1, pressScale));
  const intensity = urgencyIntensity[urgency];
  const isUrgentGlow = glowOnUrgent && urgency === "high";

  /* ── Resolve base hex per actionType ── */
  const actionBaseHex: Record<ActionType, string> = {
    primary: primaryColor,
    secondary: secondaryColor,
    destructive: destructiveColor,
  };

  const baseHex = actionBaseHex[actionType];
  const colors = buildColors(baseHex);
  const resolvedGlow = buildGlow(baseHex, glowIntensity);

  /* ── Urgency dot colors track the three action bases ── */
  const urgencyDotColor: Record<Urgency, string> = {
    low:    primaryColor,
    medium: secondaryColor,
    high:   destructiveColor,
  };

  /* ── Gradient uses the resolved base + urgency intensity ── */
  const gradient = buildGradient(baseHex, intensity);

  const handleClick = useCallback(async () => {
    if (ctaState === "loading" || ctaState === "success") return;

    if (confirmRequired && ctaState === "idle") {
      setCtaState("confirm");
      return;
    }

    setCtaState("loading");

    try {
      if (onAction) {
        await onAction();
      } else {
        // Default: simulate a 1.4s async operation
        await new Promise((r) => setTimeout(r, 1400));
      }
    } catch {
      // swallow errors, still show success
    }

    setCtaState("success");
    setTimeout(() => setCtaState("idle"), 1800);
  }, [ctaState, confirmRequired, onAction]);

  const handleCancel = useCallback(() => {
    setCtaState("idle");
  }, []);

  /* ── Render button content by state ── */

  const buttonContent = () => {
    if (ctaState === "loading") {
      return (
        <motion.span
          key="loading"
          className="flex items-center gap-2.5"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          <LoadingIndicator type={loadingAnimation} color={colors.base} />
          <span className="text-sm font-semibold" style={{ color: colors.base }}>
            Processing…
          </span>
        </motion.span>
      );
    }

    if (ctaState === "success") {
      return (
        <motion.span
          key="success"
          className="flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <CheckIcon color={colors.base} />
          <span className="text-sm font-semibold" style={{ color: colors.base }}>
            Done
          </span>
        </motion.span>
      );
    }

    if (ctaState === "confirm") {
      return (
        <motion.span
          key="confirm"
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          <span className="text-sm font-semibold" style={{ color: colors.base }}>
            Are you sure?
          </span>
        </motion.span>
      );
    }

    // idle
    return (
      <motion.span
        key="idle"
        className="flex flex-col items-start gap-0.5"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18 }}
      >
        <span className="text-sm font-semibold leading-tight" style={{ color: colors.base }}>
          {label}
        </span>
        {sublabel && (
          <span
            className="text-[11px] font-normal leading-tight"
            style={{ color: `${colors.base}70` }}
          >
            {sublabel}
          </span>
        )}
      </motion.span>
    );
  };

  return (
    <div className="relative flex flex-col items-start gap-2">
      {/* Urgency indicator row */}
      {ctaState === "idle" && (
        <motion.div
          className="flex items-center gap-1.5"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: urgencyDotColor[urgency] }}
            animate={urgency === "high" ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.09em]"
            style={{ color: `${urgencyDotColor[urgency]}90` }}
          >
            {urgency} urgency
          </span>
        </motion.div>
      )}

      {/* Main button */}
      <motion.button
        className={cn(
          "relative flex items-center gap-3 px-5 py-3 rounded-xl border",
          "overflow-hidden cursor-pointer select-none",
          "transition-shadow duration-200",
          ctaState === "loading" || ctaState === "success"
            ? "pointer-events-none"
            : ""
        )}
        style={{
          background: gradient,
          borderColor: colors.border,
          boxShadow: isUrgentGlow
            ? `0 0 0 1px ${colors.border}, 0 4px 24px ${resolvedGlow}`
            : `0 0 0 1px ${colors.border}`,
          minWidth: 220,
        }}
        whileHover={
          ctaState === "idle" || ctaState === "confirm"
            ? {
                boxShadow: `0 0 0 1px ${colors.border}, 0 6px 32px ${resolvedGlow}`,
                y: -1,
              }
            : {}
        }
        whileTap={{ scale: safePressScale }}
        onClick={handleClick}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
      >
        {/* Shimmer on hover — subtle top gradient line */}
        <motion.span
          className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${colors.base}60 50%, transparent 100%)`,
          }}
        />

        {/* Ambient glow layer (urgent only) */}
        {isUrgentGlow && ctaState === "idle" && (
          <motion.span
            className="absolute inset-0 pointer-events-none rounded-xl"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${resolvedGlow} 0%, transparent 70%)`,
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 flex items-center gap-3 w-full">
          <AnimatePresence mode="wait">
            {buttonContent()}
          </AnimatePresence>
        </div>
      </motion.button>

      {/* Confirm cancel option */}
      <AnimatePresence>
        {ctaState === "confirm" && (
          <motion.button
            className="text-[11px] font-medium transition-colors duration-150 pl-1"
            style={{ color: cancelTextColor }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            onClick={handleCancel}
          >
            Cancel
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
