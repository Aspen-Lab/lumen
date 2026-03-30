export const smartCTACode: string = `"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────── */

type Urgency         = "low" | "medium" | "high";
type ActionType      = "primary" | "secondary" | "destructive";
type LoadingAnimation = "spinner" | "pulse" | "dots";
type CTAState        = "idle" | "confirm" | "loading" | "success";

interface SmartCTAProps {
  urgency?:          Urgency;           // semantic — drives color palette
  actionType?:       ActionType;        // semantic — green / blue / orange-red
  confirmRequired?:  boolean;           // semantic — two-tap confirmation gate
  label?:            string;
  sublabel?:         string;
  pressScale?:       number;            // visual  — 0.9–1
  glowOnUrgent?:     boolean;           // visual  — ambient glow when urgency=high
  loadingAnimation?: LoadingAnimation;  // visual  — spinner | pulse | dots
  onAction?:         () => void | Promise<void>;
}

/* ── Color config ───────────────────────────────────────────── */

const actionColors = {
  primary:     { base: "#0BE09B", glow: "rgba(11,224,155,0.28)",  border: "rgba(11,224,155,0.35)"  },
  secondary:   { base: "#0091FF", glow: "rgba(0,145,255,0.28)",   border: "rgba(0,145,255,0.35)"   },
  destructive: { base: "#FB7A29", glow: "rgba(251,122,41,0.28)",  border: "rgba(251,122,41,0.35)"  },
} as const;

const urgencyIntensity: Record<Urgency, number> = { low: 0.5, medium: 0.75, high: 1 };

const urgencyDotColor: Record<Urgency, string> = {
  low: "#0BE09B", medium: "#0091FF", high: "#FB7A29",
};

/* ── Loading indicators ─────────────────────────────────────── */

function Spinner({ color }: { color: string }) {
  return (
    <motion.span
      className="inline-block w-4 h-4 rounded-full border-2 border-transparent"
      style={{ borderTopColor: color, borderRightColor: \`\${color}50\` }}
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
          transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.14 }}
        />
      ))}
    </span>
  );
}

function LoadingIndicator({ type, color }: { type: LoadingAnimation; color: string }) {
  if (type === "spinner") return <Spinner color={color} />;
  if (type === "pulse")   return <PulseIndicator color={color} />;
  return <DotsIndicator color={color} />;
}

/* ── Success checkmark ──────────────────────────────────────── */

function CheckIcon({ color }: { color: string }) {
  return (
    <motion.svg width="18" height="18" viewBox="0 0 18 18" fill="none"
      initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}>
      <motion.path d="M3.5 9L7.5 13L14.5 5" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }} />
    </motion.svg>
  );
}

/* ── SmartCTA ───────────────────────────────────────────────── */

export function SmartCTA({
  urgency          = "medium",
  actionType       = "primary",
  confirmRequired  = false,
  label            = "Confirm Action",
  sublabel         = "This will apply the suggested changes",
  pressScale       = 0.96,
  glowOnUrgent     = true,
  loadingAnimation = "spinner",
  onAction,
}: SmartCTAProps) {
  const [ctaState, setCtaState] = useState<CTAState>("idle");

  const colors        = actionColors[actionType];
  const intensity     = urgencyIntensity[urgency];
  const safePressScale = Math.max(0.9, Math.min(1, pressScale));
  const isUrgentGlow  = glowOnUrgent && urgency === "high";

  const gradient = {
    primary:     \`linear-gradient(135deg, rgba(11,224,155,\${0.14*intensity}) 0%, rgba(11,224,155,\${0.06*intensity}) 100%)\`,
    secondary:   \`linear-gradient(135deg, rgba(0,145,255,\${0.14*intensity}) 0%, rgba(0,145,255,\${0.06*intensity}) 100%)\`,
    destructive: \`linear-gradient(135deg, rgba(251,122,41,\${0.14*intensity}) 0%, rgba(251,122,41,\${0.06*intensity}) 100%)\`,
  }[actionType];

  const handleClick = useCallback(async () => {
    if (ctaState === "loading" || ctaState === "success") return;
    if (confirmRequired && ctaState === "idle") { setCtaState("confirm"); return; }

    setCtaState("loading");
    try {
      if (onAction) await onAction();
      else await new Promise((r) => setTimeout(r, 1400));
    } catch { /* swallow */ }

    setCtaState("success");
    setTimeout(() => setCtaState("idle"), 1800);
  }, [ctaState, confirmRequired, onAction]);

  const buttonContent = () => {
    if (ctaState === "loading") return (
      <motion.span key="loading" className="flex items-center gap-2.5"
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
        <LoadingIndicator type={loadingAnimation} color={colors.base} />
        <span className="text-sm font-semibold" style={{ color: colors.base }}>Processing…</span>
      </motion.span>
    );

    if (ctaState === "success") return (
      <motion.span key="success" className="flex items-center gap-2"
        initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
        <CheckIcon color={colors.base} />
        <span className="text-sm font-semibold" style={{ color: colors.base }}>Done</span>
      </motion.span>
    );

    if (ctaState === "confirm") return (
      <motion.span key="confirm" className="flex items-center gap-2"
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
        <span className="text-sm font-semibold" style={{ color: colors.base }}>Are you sure?</span>
      </motion.span>
    );

    return (
      <motion.span key="idle" className="flex flex-col items-start gap-0.5"
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
        <span className="text-sm font-semibold leading-tight" style={{ color: colors.base }}>{label}</span>
        {sublabel && (
          <span className="text-[11px] font-normal leading-tight" style={{ color: \`\${colors.base}70\` }}>
            {sublabel}
          </span>
        )}
      </motion.span>
    );
  };

  return (
    <div className="relative flex flex-col items-start gap-2">
      {/* Urgency row */}
      {ctaState === "idle" && (
        <motion.div className="flex items-center gap-1.5"
          initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}>
          <motion.span className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: urgencyDotColor[urgency] }}
            animate={urgency === "high" ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.09em]"
            style={{ color: \`\${urgencyDotColor[urgency]}90\` }}>
            {urgency} urgency
          </span>
        </motion.div>
      )}

      {/* Button */}
      <motion.button
        className={cn(
          "relative flex items-center gap-3 px-5 py-3 rounded-xl border overflow-hidden cursor-pointer select-none",
          (ctaState === "loading" || ctaState === "success") && "pointer-events-none"
        )}
        style={{
          background: gradient,
          borderColor: colors.border,
          boxShadow: isUrgentGlow
            ? \`0 0 0 1px \${colors.border}, 0 4px 24px \${colors.glow}\`
            : \`0 0 0 1px \${colors.border}\`,
          minWidth: 220,
        }}
        whileHover={(ctaState === "idle" || ctaState === "confirm") ? {
          boxShadow: \`0 0 0 1px \${colors.border}, 0 6px 32px \${colors.glow}\`,
          y: -1,
        } : {}}
        whileTap={{ scale: safePressScale }}
        onClick={handleClick}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
      >
        {/* Top shimmer */}
        <motion.span className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{ background: \`linear-gradient(90deg, transparent 0%, \${colors.base}60 50%, transparent 100%)\` }} />

        {/* Urgent ambient glow */}
        {isUrgentGlow && ctaState === "idle" && (
          <motion.span className="absolute inset-0 pointer-events-none rounded-xl"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: \`radial-gradient(ellipse at 50% 0%, \${colors.glow} 0%, transparent 70%)\` }} />
        )}

        <div className="relative z-10 flex items-center gap-3 w-full">
          <AnimatePresence mode="wait">{buttonContent()}</AnimatePresence>
        </div>
      </motion.button>

      {/* Cancel */}
      <AnimatePresence>
        {ctaState === "confirm" && (
          <motion.button
            className="text-[11px] font-medium text-[rgba(255,255,255,0.35)] hover:text-[rgba(255,255,255,0.6)] transition-colors duration-150 pl-1"
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}
            onClick={() => setCtaState("idle")}>
            Cancel
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
`;
