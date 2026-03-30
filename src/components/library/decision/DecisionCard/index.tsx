"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────── */

export type Urgency = "low" | "medium" | "high";
export type EntryAnimation = "fade" | "slide" | "scale";

export interface DecisionCardProps {
  confidence?: number;
  urgency?: Urgency;
  recommendation?: string;
  tradeoffs?: string[];
  entryAnimation?: EntryAnimation;
  highlightPulse?: boolean;
  borderGlow?: boolean;
  /** Color shown when confidence >= 0.75. Default: #0BE09B */
  highConfidenceColor?: string;
  /** Color shown when 0.45 <= confidence < 0.75. Default: #0091FF */
  midConfidenceColor?: string;
  /** Color shown when confidence < 0.45. Default: #FB7A29 */
  lowConfidenceColor?: string;
  /** Card background color. Default: #111113 */
  cardBackgroundColor?: string;
  /** Primary body text color. Default: rgba(255,255,255,0.82) */
  textPrimaryColor?: string;
  /** Secondary / muted text color. Default: rgba(255,255,255,0.35) */
  textSecondaryColor?: string;
  /** Tradeoffs section accent dot color. Default: rgba(251,122,41,0.7) */
  tradeoffAccentColor?: string;
  /**
   * Override the border/glow color used when borderGlow is true.
   * When omitted the glow color is derived automatically from the
   * active confidence color.
   */
  borderGlowColor?: string;
}

/* ── Defaults ───────────────────────────────────────────────── */

const DEFAULT_RECOMMENDATION =
  "Deploy the new inference pipeline to production. Current benchmarks show a 34% latency reduction with no accuracy regression across all test suites.";

const DEFAULT_TRADEOFFS = [
  "Cold-start overhead increases by ~120 ms on first request",
  "GPU memory footprint grows from 4.2 GB to 5.8 GB",
  "Rollback window is 48 h before config lock-in",
  "Requires updated monitoring dashboards for new metrics",
];

/* ── Animation variants ─────────────────────────────────────── */

const variants: Record<EntryAnimation, object> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.94 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
  },
};

/* ── Urgency config ─────────────────────────────────────────── */

const urgencyConfig: Record<
  Urgency,
  { label: string; dot: string; badge: string; text: string }
> = {
  low: {
    label: "Low urgency",
    dot: "bg-[#0BE09B]",
    badge: "bg-[rgba(11,224,155,0.08)] border-[rgba(11,224,155,0.18)] text-[#0BE09B]",
    text: "text-[#0BE09B]",
  },
  medium: {
    label: "Medium urgency",
    dot: "bg-accent-blue",
    badge: "bg-[rgba(0,145,255,0.08)] border-[rgba(0,145,255,0.18)] text-accent-blue",
    text: "text-accent-blue",
  },
  high: {
    label: "High urgency",
    dot: "bg-accent-warm",
    badge: "bg-[rgba(251,122,41,0.08)] border-[rgba(251,122,41,0.18)] text-accent-warm",
    text: "text-accent-warm",
  },
};

/* ── Confidence helpers ─────────────────────────────────────── */

function confidenceColor(
  c: number,
  high: string,
  mid: string,
  low: string
): string {
  if (c >= 0.75) return high;
  if (c >= 0.45) return mid;
  return low;
}

function confidenceLabel(c: number) {
  if (c >= 0.75) return "High confidence";
  if (c >= 0.45) return "Moderate confidence";
  return "Low confidence";
}

/* ── Arc SVG ────────────────────────────────────────────────── */

function ConfidenceArc({ value, color }: { value: number; color: string }) {
  const size = 80;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const arc = circumference * 0.75; // 270° sweep
  const dash = arc * Math.max(0, Math.min(1, value));

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: "rotate(135deg)" }}
    >
      {/* Track */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={stroke}
        strokeDasharray={`${arc} ${circumference - arc}`}
        strokeLinecap="round"
      />
      {/* Fill */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeLinecap="round"
        initial={{ strokeDasharray: `0 ${circumference}` }}
        animate={{ strokeDasharray: `${dash} ${circumference - dash}` }}
        transition={{ duration: 1.1, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
      />
    </svg>
  );
}

/* ── Main Component ─────────────────────────────────────────── */

export function DecisionCard({
  confidence = 0.82,
  urgency = "high",
  recommendation = DEFAULT_RECOMMENDATION,
  tradeoffs = DEFAULT_TRADEOFFS,
  entryAnimation = "slide",
  highlightPulse = false,
  borderGlow = true,
  highConfidenceColor = "#0BE09B",
  midConfidenceColor = "#0091FF",
  lowConfidenceColor = "#FB7A29",
  cardBackgroundColor = "#111113",
  textPrimaryColor = "rgba(255,255,255,0.82)",
  textSecondaryColor = "rgba(255,255,255,0.35)",
  tradeoffAccentColor = "rgba(251,122,41,0.7)",
  borderGlowColor,
}: DecisionCardProps) {
  const color = confidenceColor(
    confidence,
    highConfidenceColor,
    midConfidenceColor,
    lowConfidenceColor
  );
  const pct = Math.round(confidence * 100);
  const urg = urgencyConfig[urgency];
  const anim = variants[entryAnimation];

  const isHighConf = confidence >= 0.75;
  const isLowConf = confidence < 0.45;

  // Derived glow values fall back to the active confidence color when no
  // explicit borderGlowColor override is provided.
  const derivedGlowColor = isHighConf
    ? `rgba(11,224,155,0.18)`
    : isLowConf
    ? `rgba(251,122,41,0.18)`
    : `rgba(0,145,255,0.14)`;

  const derivedBorderColor = isHighConf
    ? `rgba(11,224,155,0.28)`
    : isLowConf
    ? `rgba(251,122,41,0.28)`
    : `rgba(0,145,255,0.24)`;

  const glowColor = borderGlowColor ? `${borderGlowColor}2E` : derivedGlowColor;
  const borderColor = borderGlowColor ? `${borderGlowColor}47` : derivedBorderColor;

  return (
    <div className="w-full flex items-center justify-center p-6 min-h-[400px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${confidence}-${urgency}-${entryAnimation}`}
          {...anim}
          transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
          className={cn(
            "w-full max-w-[860px] rounded-2xl border overflow-hidden",
            "relative"
          )}
          style={{
            background: cardBackgroundColor,
            borderColor: borderGlow ? borderColor : "rgba(255,255,255,0.07)",
            boxShadow: borderGlow
              ? `0 0 0 1px ${borderColor}, 0 8px 40px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.04)`
              : "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Pulse ring */}
          {highlightPulse && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              animate={{
                boxShadow: [
                  `0 0 0 0px ${glowColor}`,
                  `0 0 0 8px transparent`,
                ],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
          )}

          {/* Top strip */}
          <div
            className="h-px w-full"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${color}40 50%, transparent 100%)`,
            }}
          />

          {/* Card body — horizontal split */}
          <div className="flex flex-col md:flex-row">
            {/* ── Left: Confidence + Urgency ── */}
            <div
              className="md:w-[220px] shrink-0 flex flex-col items-center justify-center gap-4 p-6 border-b md:border-b-0 md:border-r"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}
            >
              {/* Arc meter */}
              <div className="relative flex items-center justify-center">
                <ConfidenceArc value={confidence} color={color} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    className="font-mono font-bold tabular-nums leading-none"
                    style={{ fontSize: 22, color }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    {pct}%
                  </motion.span>
                  <span
                    className="text-[10px] mt-0.5 font-mono"
                    style={{ color: textSecondaryColor }}
                  >
                    conf
                  </span>
                </div>
              </div>

              {/* Confidence label */}
              <div className="text-center">
                <p className="text-[11px] font-semibold" style={{ color }}>
                  {confidenceLabel(confidence)}
                </p>
              </div>

              {/* Urgency badge */}
              <div
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold",
                  urg.badge
                )}
              >
                <span
                  className={cn("w-1.5 h-1.5 rounded-full shrink-0", urg.dot)}
                />
                {urg.label}
              </div>

              {/* Confidence bar */}
              <div className="w-full px-2">
                <div className="h-1 rounded-full bg-white/[0.07] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1], delay: 0.3 }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] text-[rgba(255,255,255,0.22)] font-mono">0</span>
                  <span className="text-[9px] text-[rgba(255,255,255,0.22)] font-mono">100</span>
                </div>
              </div>
            </div>

            {/* ── Right: Recommendation + Tradeoffs ── */}
            <div className="flex-1 flex flex-col gap-0 divide-y divide-white/[0.04]">
              {/* Recommendation */}
              <div className="p-5 flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: color }}
                  />
                  <span
                    className="text-[10px] font-semibold uppercase tracking-[0.1em]"
                    style={{ color: textSecondaryColor }}
                  >
                    AI Recommendation
                  </span>
                </div>
                <p
                  className="text-[14px] leading-[1.65]"
                  style={{ color: textPrimaryColor }}
                >
                  {recommendation}
                </p>
              </div>

              {/* Tradeoffs */}
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: tradeoffAccentColor }}
                  />
                  <span
                    className="text-[10px] font-semibold uppercase tracking-[0.1em]"
                    style={{ color: textSecondaryColor }}
                  >
                    Tradeoffs &amp; Considerations
                  </span>
                </div>
                <ul className="space-y-2">
                  {tradeoffs.map((t, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start gap-2.5 group"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.07, duration: 0.35, ease: "easeOut" }}
                    >
                      <span className="mt-[5px] w-1 h-1 rounded-full bg-[rgba(255,255,255,0.2)] shrink-0 group-hover:bg-accent-warm transition-colors duration-200" />
                      <span className="text-[13px] leading-[1.6] text-[rgba(255,255,255,0.52)] group-hover:text-[rgba(255,255,255,0.7)] transition-colors duration-200">
                        {t}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Footer actions */}
              <div className="px-5 py-3 flex items-center justify-between bg-white/[0.015]">
                <span
                  className="text-[11px] font-mono"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  lumen · decision-card
                </span>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-[rgba(255,255,255,0.45)] hover:text-[rgba(255,255,255,0.7)] border border-white/[0.07] hover:border-white/[0.14] transition-all duration-150">
                    Dismiss
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-150"
                    style={{
                      background: `${color}18`,
                      color,
                      border: `1px solid ${color}35`,
                    }}
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
