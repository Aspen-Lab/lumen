"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { DecisionCardProps, Urgency, EntryAnimation } from "./index";

/* ── Re-use helpers from desktop ────────────────────────────── */

const DEFAULT_RECOMMENDATION =
  "Deploy the new inference pipeline to production. Current benchmarks show a 34% latency reduction with no accuracy regression.";

const DEFAULT_TRADEOFFS = [
  "Cold-start overhead increases by ~120 ms on first request",
  "GPU memory footprint grows from 4.2 GB to 5.8 GB",
  "Rollback window is 48 h before config lock-in",
  "Requires updated monitoring dashboards for new metrics",
];

function confidenceColor(c: number) {
  if (c >= 0.75) return "#0BE09B";
  if (c >= 0.45) return "#0091FF";
  return "#FB7A29";
}

function confidenceLabel(c: number) {
  if (c >= 0.75) return "High confidence";
  if (c >= 0.45) return "Moderate confidence";
  return "Low confidence";
}

const urgencyConfig: Record<
  Urgency,
  { label: string; dot: string; badge: string }
> = {
  low: {
    label: "Low urgency",
    dot: "bg-[#0BE09B]",
    badge: "bg-[rgba(11,224,155,0.08)] border-[rgba(11,224,155,0.18)] text-[#0BE09B]",
  },
  medium: {
    label: "Medium urgency",
    dot: "bg-accent-blue",
    badge: "bg-[rgba(0,145,255,0.08)] border-[rgba(0,145,255,0.18)] text-accent-blue",
  },
  high: {
    label: "High urgency",
    dot: "bg-accent-warm",
    badge: "bg-[rgba(251,122,41,0.08)] border-[rgba(251,122,41,0.18)] text-accent-warm",
  },
};

const entryVariants: Record<EntryAnimation, object> = {
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  slide: { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } },
  scale: { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.97 } },
};

/* ── Tab types ──────────────────────────────────────────────── */

type Tab = "overview" | "tradeoffs";

const tabs: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "tradeoffs", label: "Tradeoffs" },
];

/* ── Mini arc ───────────────────────────────────────────────── */

function MiniArc({ value, color }: { value: number; color: string }) {
  const size = 64;
  const stroke = 4.5;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const arc = circumference * 0.75;
  const dash = arc * Math.max(0, Math.min(1, value));

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(135deg)" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} strokeDasharray={`${arc} ${circumference - arc}`} strokeLinecap="round" />
      <motion.circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={`${dash} ${circumference - dash}`} strokeLinecap="round" initial={{ strokeDasharray: `0 ${circumference}` }} animate={{ strokeDasharray: `${dash} ${circumference - dash}` }} transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1], delay: 0.15 }} />
    </svg>
  );
}

/* ── Mobile Component ───────────────────────────────────────── */

export function DecisionCardMobile({
  confidence = 0.82,
  urgency = "high",
  recommendation = DEFAULT_RECOMMENDATION,
  tradeoffs = DEFAULT_TRADEOFFS,
  entryAnimation = "slide",
  highlightPulse = false,
  borderGlow = true,
}: DecisionCardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const color = confidenceColor(confidence);
  const pct = Math.round(confidence * 100);
  const urg = urgencyConfig[urgency];
  const anim = entryVariants[entryAnimation];

  const isHighConf = confidence >= 0.75;
  const isLowConf = confidence < 0.45;

  const glowColor = isHighConf
    ? "rgba(11,224,155,0.16)"
    : isLowConf
    ? "rgba(251,122,41,0.16)"
    : "rgba(0,145,255,0.13)";

  const borderColor = isHighConf
    ? "rgba(11,224,155,0.26)"
    : isLowConf
    ? "rgba(251,122,41,0.26)"
    : "rgba(0,145,255,0.22)";

  return (
    <div className="w-full flex items-center justify-center p-4 min-h-[480px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={`mobile-${confidence}-${urgency}-${entryAnimation}`}
          {...anim}
          transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
          className="w-full max-w-[390px] rounded-2xl border bg-[#111113] overflow-hidden relative"
          style={{
            borderColor: borderGlow ? borderColor : "rgba(255,255,255,0.07)",
            boxShadow: borderGlow
              ? `0 0 0 1px ${borderColor}, 0 6px 32px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.04)`
              : "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Pulse */}
          {highlightPulse && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              animate={{ boxShadow: [`0 0 0 0px ${glowColor}`, `0 0 0 7px transparent`] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
          )}

          {/* Top strip */}
          <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 0%, ${color}40 50%, transparent 100%)` }} />

          {/* Header row */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            {/* Compact arc + pct */}
            <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
              <MiniArc value={confidence} color={color} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono font-bold tabular-nums leading-none text-[16px]" style={{ color }}>
                  {pct}%
                </span>
              </div>
            </div>

            {/* Labels */}
            <div className="flex-1 ml-3 flex flex-col gap-1.5">
              <p className="text-[12px] font-semibold" style={{ color }}>
                {confidenceLabel(confidence)}
              </p>
              <div className={cn("self-start flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-semibold", urg.badge)}>
                <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", urg.dot)} />
                {urg.label}
              </div>
            </div>

            {/* Confidence bar vertical */}
            <div className="flex flex-col items-center gap-1 ml-2">
              <div className="w-1 h-14 rounded-full bg-white/[0.07] overflow-hidden flex flex-col-reverse">
                <motion.div
                  className="w-full rounded-full"
                  style={{ background: color }}
                  initial={{ height: "0%" }}
                  animate={{ height: `${pct}%` }}
                  transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
                />
              </div>
            </div>
          </div>

          {/* Tab bar */}
          <div className="px-4 flex gap-1 border-b border-white/[0.05]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative pb-2.5 px-1 text-[12px] font-semibold transition-colors duration-150",
                  activeTab === tab.id
                    ? "text-[rgba(255,255,255,0.85)]"
                    : "text-[rgba(255,255,255,0.35)] hover:text-[rgba(255,255,255,0.55)]"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="mobile-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{ background: color }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="min-h-[200px]">
            <AnimatePresence mode="wait">
              {activeTab === "overview" ? (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[rgba(255,255,255,0.32)]">
                      AI Recommendation
                    </span>
                  </div>
                  <p className="text-[13px] leading-[1.65] text-[rgba(255,255,255,0.78)]">
                    {recommendation}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="tradeoffs"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[rgba(251,122,41,0.7)]" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[rgba(255,255,255,0.32)]">
                      Tradeoffs
                    </span>
                  </div>
                  <ul className="space-y-2.5">
                    {tradeoffs.map((t, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start gap-2.5"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.25, ease: "easeOut" }}
                      >
                        <span className="mt-[6px] w-1 h-1 rounded-full bg-[rgba(255,255,255,0.2)] shrink-0" />
                        <span className="text-[12px] leading-[1.6] text-[rgba(255,255,255,0.52)]">{t}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-4 pb-4 flex gap-2">
            <button className="flex-1 py-2 rounded-xl text-[12px] font-medium text-[rgba(255,255,255,0.45)] border border-white/[0.07] hover:border-white/[0.14] hover:text-[rgba(255,255,255,0.65)] transition-all duration-150">
              Dismiss
            </button>
            <button
              className="flex-1 py-2 rounded-xl text-[12px] font-semibold transition-all duration-150"
              style={{ background: `${color}18`, color, border: `1px solid ${color}35` }}
            >
              Accept
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
