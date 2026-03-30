"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Types ── */
export interface RevealSection {
  title: string;
  content: string;
}

export interface ProgressiveBlurRevealProps {
  revealTrigger?: "scroll" | "click" | "auto";
  sections?: RevealSection[];
  blurStart?: number;
  blurEnd?: number;
  transitionCurve?: "ease" | "spring" | "linear";
  duration?: number;
  /* ── Color props ── */
  accentColor?: string;
  cardBgColor?: string;
  cardBgDimColor?: string;
  titleColor?: string;
  textColor?: string;
  progressBarColor?: string;
  buttonColor?: string;
}

/* ── Default sections ── */
const DEFAULT_SECTIONS: RevealSection[] = [
  {
    title: "Context Retrieval",
    content:
      "The model queries its knowledge base using semantic similarity, pulling the top-ranked passages that are most relevant to the current prompt. Relevance is scored using cosine distance in embedding space.",
  },
  {
    title: "Chain-of-Thought Synthesis",
    content:
      "Retrieved context is fed into a structured reasoning chain. Each intermediate step is verified against source evidence before being used as input for subsequent steps, minimising hallucination drift.",
  },
  {
    title: "Confidence Calibration",
    content:
      "Each output claim is assigned a calibrated confidence score. Claims below the acceptance threshold are hedged or flagged. The final response reflects only assertions that pass the validity gate.",
  },
];

/* ── Easing map ── */
const easingMap = {
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  linear: [0, 0, 1, 1] as [number, number, number, number],
  spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
};

/* ── Hex color → rgba helper ── */
function hexToRgba(hex: string, alpha: number): string {
  const sanitised = hex.replace("#", "");
  const full =
    sanitised.length === 3
      ? sanitised
          .split("")
          .map((c) => c + c)
          .join("")
      : sanitised;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ── Eye icon ── */
function EyeIcon({ revealed }: { revealed: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="flex-shrink-0"
    >
      {revealed ? (
        <>
          <path
            d="M1 7C1 7 3 3 7 3C11 3 13 7 13 7C13 7 11 11 7 11C3 11 1 7 1 7Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2" />
        </>
      ) : (
        <>
          <path
            d="M1 7C1 7 3 3 7 3C11 3 13 7 13 7C13 7 11 11 7 11C3 11 1 7 1 7Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.4"
          />
          <path
            d="M2 2L12 12"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

/* ── Section card ── */
function SectionCard({
  section,
  index,
  revealed,
  revealTrigger,
  blurStart,
  blurEnd,
  transitionCurve,
  duration,
  onReveal,
  accentColor,
  cardBgColor,
  cardBgDimColor,
  titleColor,
  textColor,
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
  accentColor: string;
  cardBgColor: string;
  cardBgDimColor: string;
  titleColor: string;
  textColor: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  useEffect(() => {
    if (revealTrigger === "scroll" && isInView) {
      onReveal();
    }
  }, [isInView, revealTrigger, onReveal]);

  const currentBlur = revealed ? blurEnd : blurStart;
  const easing = easingMap[transitionCurve];

  const isClickable = revealTrigger === "click" && !revealed;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.1, ease: "easeOut" }}
      className={cn(
        "relative rounded-xl border overflow-hidden transition-colors duration-200",
        isClickable && "cursor-pointer"
      )}
      style={{
        backgroundColor: revealed ? cardBgColor : cardBgDimColor,
        borderColor: revealed
          ? "rgba(255,255,255,0.08)"
          : "rgba(255,255,255,0.05)",
      }}
      onClick={isClickable ? onReveal : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) =>
              e.key === "Enter" || e.key === " " ? onReveal() : undefined
          : undefined
      }
    >
      {/* Index badge */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {!revealed && revealTrigger === "click" && (
          <span className="text-[10px] font-mono uppercase tracking-wider text-white/25 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
            click to reveal
          </span>
        )}
        <span
          className="text-[10px] font-mono tabular-nums transition-colors"
          style={{ color: revealed ? accentColor : "var(--text-muted)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Content */}
      <div className="px-5 py-4 pr-24">
        {/* Title row */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="transition-colors duration-300"
            style={{
              color: revealed ? accentColor : "var(--text-tertiary)",
            }}
          >
            <EyeIcon revealed={revealed} />
          </span>
          <h3
            className="text-[13px] font-semibold tracking-tight transition-colors duration-300"
            style={{
              color: revealed ? titleColor : "var(--text-tertiary)",
            }}
          >
            {section.title}
          </h3>
          {revealed && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="ml-auto h-px flex-1 max-w-[60px] origin-left"
              style={{ backgroundColor: hexToRgba(accentColor, 0.3) }}
            />
          )}
        </div>

        {/* Blurred content */}
        <motion.p
          animate={{ filter: `blur(${currentBlur}px)` }}
          transition={{ duration, ease: easing }}
          className="text-[13px] leading-relaxed select-none"
          style={{
            color: textColor,
            userSelect: revealed ? "auto" : "none",
          }}
        >
          {section.content}
        </motion.p>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 h-[1.5px]"
        style={{
          background: `linear-gradient(to right, ${hexToRgba(accentColor, 0.5)}, ${hexToRgba(accentColor, 0.2)}, transparent)`,
        }}
        initial={{ width: 0 }}
        animate={{ width: revealed ? "100%" : "0%" }}
        transition={{ duration: duration * 0.8, ease: easing }}
      />

      {/* Overlay shimmer for unrevealed */}
      {!revealed && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/[0.01] to-transparent" />
      )}
    </motion.div>
  );
}

/* ── Main component ── */
export function ProgressiveBlurReveal({
  revealTrigger = "click",
  sections = DEFAULT_SECTIONS,
  blurStart = 12,
  blurEnd = 0,
  transitionCurve = "ease",
  duration = 0.7,
  accentColor = "#0BE09B",
  cardBgColor = "#111113",
  cardBgDimColor = "#0D0D0F",
  titleColor = "#ffffff",
  textColor = "var(--text-secondary)",
  progressBarColor = "#0BE09B",
  buttonColor = "#0BE09B",
}: ProgressiveBlurRevealProps) {
  const [revealedSet, setRevealedSet] = useState<Set<number>>(new Set());

  /* Auto-reveal: stagger through sections */
  useEffect(() => {
    if (revealTrigger !== "auto") return;
    let cancelled = false;

    const reveal = async () => {
      for (let i = 0; i < sections.length; i++) {
        await new Promise<void>((res) => setTimeout(res, 900 + i * 600));
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

  const handleRevealAll = () => {
    setRevealedSet(new Set(sections.map((_, i) => i)));
  };

  const handleReset = () => {
    setRevealedSet(new Set());
  };

  return (
    <div className="w-full max-w-[600px] mx-auto select-none">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div
          className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
          style={{
            backgroundColor: allRevealed
              ? accentColor
              : "rgba(255,255,255,0.2)",
          }}
        />
        <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-white/35">
          Progressive Reveal
        </span>

        {/* Progress counter */}
        <span className="font-mono text-[11px] text-white/25">
          {revealedSet.size}/{sections.length}
        </span>

        {/* Controls */}
        <div className="ml-auto flex items-center gap-2">
          {revealTrigger === "click" && !allRevealed && (
            <button
              className="text-[11px] font-mono transition-colors px-2 py-1 rounded border"
              style={{
                color: buttonColor,
                borderColor: hexToRgba(buttonColor, 0.2),
              }}
              onClick={handleRevealAll}
            >
              reveal all
            </button>
          )}
          {revealedSet.size > 0 && (
            <button
              className="text-[11px] font-mono text-white/25 hover:text-white/35 transition-colors"
              onClick={handleReset}
            >
              reset
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[2px] rounded-full bg-white/[0.05] mb-5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: hexToRgba(progressBarColor, 0.5) }}
          animate={{
            width:
              sections.length > 0
                ? `${(revealedSet.size / sections.length) * 100}%`
                : "0%",
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Section cards */}
      <div className="space-y-3">
        {sections.map((section, i) => (
          <SectionCard
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
            accentColor={accentColor}
            cardBgColor={cardBgColor}
            cardBgDimColor={cardBgDimColor}
            titleColor={titleColor}
            textColor={textColor}
          />
        ))}
      </div>

      {/* All revealed state */}
      {allRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-lg border"
          style={{
            borderColor: hexToRgba(accentColor, 0.2),
            backgroundColor: hexToRgba(accentColor, 0.04),
          }}
        >
          <div
            className="w-1 h-1 rounded-full animate-pulse"
            style={{ backgroundColor: accentColor }}
          />
          <span
            className="text-[11px] font-mono"
            style={{ color: hexToRgba(accentColor, 0.7) }}
          >
            All sections revealed
          </span>
          <span className="ml-auto text-[10px] font-mono text-white/25">
            {sections.length} / {sections.length}
          </span>
        </motion.div>
      )}
    </div>
  );
}
