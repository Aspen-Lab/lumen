"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { type RevealSection, type ProgressiveBlurRevealProps } from "./index";

/* ── Default sections (mirrored from desktop) ── */
const DEFAULT_SECTIONS: RevealSection[] = [
  {
    title: "Context Retrieval",
    content:
      "The model queries its knowledge base using semantic similarity, pulling the top-ranked passages that are most relevant to the current prompt.",
  },
  {
    title: "Chain-of-Thought Synthesis",
    content:
      "Retrieved context is fed into a structured reasoning chain. Each step is verified against source evidence before being used as input for subsequent steps.",
  },
  {
    title: "Confidence Calibration",
    content:
      "Each output claim is assigned a calibrated confidence score. Claims below the threshold are hedged or flagged before appearing in the final response.",
  },
];

/* ── Easing map ── */
const easingMap = {
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  linear: [0, 0, 1, 1] as [number, number, number, number],
  spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
};

/* ── Lock icon ── */
function LockIcon({ open }: { open: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      {open ? (
        <>
          <rect
            x="2"
            y="5.5"
            width="8"
            height="5.5"
            rx="1.2"
            stroke="currentColor"
            strokeWidth="1.1"
          />
          <path
            d="M4 5.5V3.5C4 2.12 4.89 1 6 1"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <circle cx="6" cy="8.25" r="0.9" fill="currentColor" />
        </>
      ) : (
        <>
          <rect
            x="2"
            y="5.5"
            width="8"
            height="5.5"
            rx="1.2"
            stroke="currentColor"
            strokeWidth="1.1"
          />
          <path
            d="M4 5.5V3.5C4 2.12 4.89 1 6 1C7.1 1 8 2.12 8 3.5V5.5"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <circle cx="6" cy="8.25" r="0.9" fill="currentColor" />
        </>
      )}
    </svg>
  );
}

/* ── Tap hint indicator ── */
function TapRipple() {
  return (
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/20 opacity-75" />
      <span className="relative inline-flex rounded-full h-3 w-3 bg-white/30" />
    </span>
  );
}

/* ── Mobile stacked card ── */
function MobileCard({
  section,
  index,
  revealed,
  revealTrigger,
  blurStart,
  blurEnd,
  transitionCurve,
  duration,
  onReveal,
  isTop,
}: {
  section: RevealSection;
  index: number;
  revealed: boolean;
  revealTrigger: "scroll" | "click" | "auto";
  blurStart: number;
  blurEnd: number;
  transitionCurve: "ease" | "spring" | "linear";
  duration: number;
  onReveal: () => void;
  isTop: boolean;
}) {
  const currentBlur = revealed ? blurEnd : blurStart;
  const easing = easingMap[transitionCurve];
  const isClickable = revealTrigger === "click" && !revealed;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.38, delay: index * 0.08, ease: "easeOut" }}
      className={cn(
        "relative rounded-2xl border overflow-hidden transition-all duration-200 active:scale-[0.985]",
        revealed
          ? "border-white/[0.08] bg-[#111113] shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          : "border-white/[0.05] bg-[#0D0D0F] shadow-[0_2px_12px_rgba(0,0,0,0.3)]",
        isClickable && "cursor-pointer"
      )}
      onClick={isClickable ? onReveal : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {/* Card header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        {/* Step indicator */}
        <div
          className={cn(
            "w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300",
            revealed
              ? "border-accent-green/40 bg-accent-green/10 text-accent-green"
              : "border-white/10 bg-white/[0.03] text-[--text-muted]"
          )}
        >
          <LockIcon open={revealed} />
        </div>

        {/* Title */}
        <span
          className={cn(
            "text-[13px] font-semibold flex-1 transition-colors duration-300",
            revealed ? "text-[--text-primary]" : "text-[--text-tertiary]"
          )}
        >
          {section.title}
        </span>

        {/* Right: tap hint or index */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isClickable && isTop && <TapRipple />}
          <span
            className={cn(
              "text-[10px] font-mono tabular-nums transition-colors",
              revealed ? "text-accent-green/50" : "text-[--text-muted]"
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div
        className={cn(
          "mx-4 h-px transition-colors duration-300",
          revealed ? "bg-white/[0.06]" : "bg-white/[0.03]"
        )}
      />

      {/* Blurred content body */}
      <div className="px-4 pt-3 pb-4">
        <motion.p
          animate={{ filter: `blur(${currentBlur}px)` }}
          transition={{ duration, ease: easing }}
          className="text-[13px] leading-relaxed text-[--text-secondary]"
          style={{ userSelect: revealed ? "auto" : "none" }}
        >
          {section.content}
        </motion.p>

        {/* Tap-to-reveal hint text */}
        <AnimatePresence>
          {isClickable && (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 text-[11px] font-mono text-[--text-muted]"
            >
              tap to reveal
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom reveal bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-accent-green/60 via-accent-green/20 to-transparent"
        initial={{ width: 0 }}
        animate={{ width: revealed ? "100%" : "0%" }}
        transition={{ duration: duration * 0.75, ease: easing }}
      />

      {/* Unrevealed overlay */}
      {!revealed && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/[0.01] to-transparent" />
      )}
    </motion.div>
  );
}

/* ── Mobile main export ── */
export function ProgressiveBlurRevealMobile({
  revealTrigger = "click",
  sections = DEFAULT_SECTIONS,
  blurStart = 12,
  blurEnd = 0,
  transitionCurve = "ease",
  duration = 0.7,
}: ProgressiveBlurRevealProps) {
  const [revealedSet, setRevealedSet] = useState<Set<number>>(new Set());

  /* Auto-reveal: stagger through sections */
  useEffect(() => {
    if (revealTrigger !== "auto") return;
    let cancelled = false;

    const reveal = async () => {
      for (let i = 0; i < sections.length; i++) {
        await new Promise<void>((res) => setTimeout(res, 900 + i * 700));
        if (cancelled) return;
        setRevealedSet((prev) => new Set([...prev, i]));
      }
    };

    reveal();
    return () => {
      cancelled = true;
    };
  }, [revealTrigger, sections.length]);

  const revealSection = (index: number) => {
    setRevealedSet((prev) => new Set([...prev, index]));
  };

  const allRevealed = revealedSet.size === sections.length;

  const firstUnrevealed = sections.findIndex((_, i) => !revealedSet.has(i));

  return (
    <div className="w-full max-w-[375px] mx-auto select-none">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className={cn(
            "w-1.5 h-1.5 rounded-full transition-colors duration-500",
            allRevealed ? "bg-accent-green animate-pulse" : "bg-white/20"
          )}
        />
        <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-[--text-tertiary]">
          Progressive Reveal
        </span>
        <span className="ml-auto font-mono text-[11px] text-[--text-muted]">
          {revealedSet.size}/{sections.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-[2px] rounded-full bg-white/[0.05] mb-4 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-accent-green/50"
          animate={{
            width:
              sections.length > 0
                ? `${(revealedSet.size / sections.length) * 100}%`
                : "0%",
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>

      {/* Stacked cards */}
      <div className="space-y-2.5">
        {sections.map((section, i) => (
          <MobileCard
            key={i}
            section={section}
            index={i}
            revealed={revealedSet.has(i)}
            revealTrigger={revealTrigger}
            blurStart={blurStart}
            blurEnd={blurEnd}
            transitionCurve={transitionCurve}
            duration={duration}
            onReveal={() => revealSection(i)}
            isTop={i === firstUnrevealed}
          />
        ))}
      </div>

      {/* Reset / Reveal all row */}
      {revealTrigger === "click" && (
        <div className="mt-4 flex items-center justify-between gap-3">
          {!allRevealed && (
            <button
              className="flex-1 text-[12px] font-mono text-[--text-tertiary] hover:text-[--text-secondary] transition-colors py-2.5 rounded-xl border border-white/[0.06] hover:border-white/[0.1] active:scale-[0.97]"
              onClick={() =>
                setRevealedSet(new Set(sections.map((_, i) => i)))
              }
            >
              reveal all
            </button>
          )}
          {revealedSet.size > 0 && (
            <button
              className="flex-1 text-[12px] font-mono text-[--text-muted] hover:text-[--text-tertiary] transition-colors py-2.5 rounded-xl border border-white/[0.04] hover:border-white/[0.07] active:scale-[0.97]"
              onClick={() => setRevealedSet(new Set())}
            >
              reset
            </button>
          )}
        </div>
      )}

      {/* All revealed confirmation */}
      <AnimatePresence>
        {allRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 4, height: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mt-3 overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-accent-green/20 bg-[rgba(11,224,155,0.04)]">
              <div className="w-1 h-1 rounded-full bg-accent-green animate-pulse" />
              <span className="text-[11px] font-mono text-accent-green/70">
                All sections revealed
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
