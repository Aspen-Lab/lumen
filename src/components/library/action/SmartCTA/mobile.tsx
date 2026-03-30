"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SmartCTAProps, CTAState, LoadingAnimation } from "./index";

/* ── Color config (mirrored from index) ─────────────────────── */

const actionColors = {
  primary:     { base: "#0BE09B", glow: "rgba(11,224,155,0.28)",  border: "rgba(11,224,155,0.35)",  bg: "rgba(11,224,155,0.10)"  },
  secondary:   { base: "#0091FF", glow: "rgba(0,145,255,0.28)",   border: "rgba(0,145,255,0.35)",   bg: "rgba(0,145,255,0.10)"   },
  destructive: { base: "#FB7A29", glow: "rgba(251,122,41,0.28)",  border: "rgba(251,122,41,0.35)",  bg: "rgba(251,122,41,0.10)"  },
} as const;

const urgencyDotColor = {
  low:    "#0BE09B",
  medium: "#0091FF",
  high:   "#FB7A29",
} as const;

/* ── Loading sub-components ─────────────────────────────────── */

function Spinner({ color }: { color: string }) {
  return (
    <motion.span
      className="inline-block w-5 h-5 rounded-full border-2 border-transparent"
      style={{ borderTopColor: color, borderRightColor: `${color}50` }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
    />
  );
}

function PulseIndicator({ color }: { color: string }) {
  return (
    <motion.span
      className="inline-block w-5 h-5 rounded-full"
      style={{ background: color }}
      animate={{ scale: [1, 1.4, 1], opacity: [0.9, 0.4, 0.9] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function DotsIndicator({ color }: { color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block w-2 h-2 rounded-full"
          style={{ background: color }}
          animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
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

function LoadingIndicator({ type, color }: { type: LoadingAnimation; color: string }) {
  if (type === "spinner") return <Spinner color={color} />;
  if (type === "pulse") return <PulseIndicator color={color} />;
  return <DotsIndicator color={color} />;
}

function CheckIcon({ color }: { color: string }) {
  return (
    <motion.svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
    >
      <motion.path
        d="M4 11L9 16.5L18 5.5"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

/* ── Mobile SmartCTA ────────────────────────────────────────── */

export function SmartCTAMobile({
  urgency = "medium",
  actionType = "primary",
  confirmRequired = false,
  label = "Confirm Action",
  sublabel = "This will apply the suggested changes",
  pressScale = 0.96,
  glowOnUrgent = true,
  loadingAnimation = "spinner",
  onAction,
}: SmartCTAProps) {
  const [ctaState, setCtaState] = useState<CTAState>("idle");

  const colors = actionColors[actionType];
  const safePressScale = Math.max(0.9, Math.min(1, pressScale));
  const isUrgentGlow = glowOnUrgent && urgency === "high";

  const urgencyIntensity = { low: 0.5, medium: 0.75, high: 1 }[urgency];

  const gradientMap = {
    primary:     `linear-gradient(160deg, rgba(11,224,155,${0.16 * urgencyIntensity}) 0%, rgba(11,224,155,${0.07 * urgencyIntensity}) 100%)`,
    secondary:   `linear-gradient(160deg, rgba(0,145,255,${0.16 * urgencyIntensity}) 0%, rgba(0,145,255,${0.07 * urgencyIntensity}) 100%)`,
    destructive: `linear-gradient(160deg, rgba(251,122,41,${0.16 * urgencyIntensity}) 0%, rgba(251,122,41,${0.07 * urgencyIntensity}) 100%)`,
  };

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
        await new Promise((r) => setTimeout(r, 1400));
      }
    } catch {
      // swallow
    }

    setCtaState("success");
    setTimeout(() => setCtaState("idle"), 1800);
  }, [ctaState, confirmRequired, onAction]);

  const handleCancel = useCallback(() => {
    setCtaState("idle");
  }, []);

  const buttonContent = () => {
    if (ctaState === "loading") {
      return (
        <motion.span
          key="loading"
          className="flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          <LoadingIndicator type={loadingAnimation} color={colors.base} />
          <span className="text-base font-semibold" style={{ color: colors.base }}>
            Processing…
          </span>
        </motion.span>
      );
    }

    if (ctaState === "success") {
      return (
        <motion.span
          key="success"
          className="flex items-center justify-center gap-2.5"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <CheckIcon color={colors.base} />
          <span className="text-base font-semibold" style={{ color: colors.base }}>
            Done
          </span>
        </motion.span>
      );
    }

    if (ctaState === "confirm") {
      return (
        <motion.span
          key="confirm"
          className="flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          <span className="text-base font-semibold" style={{ color: colors.base }}>
            Tap again to confirm
          </span>
        </motion.span>
      );
    }

    // idle
    return (
      <motion.span
        key="idle"
        className="flex flex-col items-center gap-0.5"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18 }}
      >
        <span className="text-base font-semibold leading-tight" style={{ color: colors.base }}>
          {label}
        </span>
        {sublabel && (
          <span
            className="text-xs font-normal leading-tight"
            style={{ color: `${colors.base}70` }}
          >
            {sublabel}
          </span>
        )}
      </motion.span>
    );
  };

  return (
    <div className="relative w-full flex flex-col items-center gap-3 px-4">
      {/* Urgency pill */}
      {ctaState === "idle" && (
        <motion.div
          className="flex items-center gap-1.5 self-start"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: urgencyDotColor[urgency] }}
            animate={
              urgency === "high"
                ? { scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }
                : {}
            }
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.09em]"
            style={{ color: `${urgencyDotColor[urgency]}90` }}
          >
            {urgency} urgency
          </span>
        </motion.div>
      )}

      {/* Full-width sticky-style button */}
      <motion.button
        className={cn(
          "relative w-full flex items-center justify-center",
          "min-h-[56px] rounded-2xl border overflow-hidden",
          "cursor-pointer select-none",
          ctaState === "loading" || ctaState === "success"
            ? "pointer-events-none"
            : ""
        )}
        style={{
          background: gradientMap[actionType],
          borderColor: colors.border,
          boxShadow: isUrgentGlow
            ? `0 0 0 1px ${colors.border}, 0 4px 28px ${colors.glow}`
            : `0 0 0 1px ${colors.border}, 0 2px 12px rgba(0,0,0,0.3)`,
        }}
        whileTap={{ scale: safePressScale }}
        onClick={handleClick}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
      >
        {/* Top shimmer line */}
        <span
          className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${colors.base}55 50%, transparent 100%)`,
          }}
        />

        {/* Urgent ambient pulse */}
        {isUrgentGlow && ctaState === "idle" && (
          <motion.span
            className="absolute inset-0 pointer-events-none rounded-2xl"
            animate={{ opacity: [0.25, 0.55, 0.25] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${colors.glow} 0%, transparent 70%)`,
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center px-6">
          <AnimatePresence mode="wait">
            {buttonContent()}
          </AnimatePresence>
        </div>
      </motion.button>

      {/* Cancel for confirm state */}
      <AnimatePresence>
        {ctaState === "confirm" && (
          <motion.button
            className="w-full py-2 text-sm font-medium text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.65)] transition-colors duration-150 rounded-xl border border-white/[0.06] bg-white/[0.025]"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            onClick={handleCancel}
          >
            Cancel
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
