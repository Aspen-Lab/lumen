export const progressiveBlurRevealCode = `"use client";

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
      "Retrieved context is fed into a structured reasoning chain. Each intermediate step is verified against source evidence before being used as input for subsequent steps.",
  },
  {
    title: "Confidence Calibration",
    content:
      "Each output claim is assigned a calibrated confidence score. Claims below the acceptance threshold are hedged or flagged. The final response reflects only assertions that pass the validity gate.",
  },
];

/* ── Easing map ── */
const easingMap = {
  ease: [0.25, 0.1, 0.25, 1],
  linear: [0, 0, 1, 1],
  spring: [0.34, 1.56, 0.64, 1],
};

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
        revealed
          ? "border-white/[0.08] bg-[#111113]"
          : "border-white/[0.05] bg-[#0D0D0F]",
        isClickable && "cursor-pointer hover:border-white/[0.12]"
      )}
      onClick={isClickable ? onReveal : undefined}
    >
      {/* Index badge */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {!revealed && revealTrigger === "click" && (
          <span className="text-[10px] font-mono uppercase tracking-wider text-white/25 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
            click to reveal
          </span>
        )}
        <span className={cn(
          "text-[10px] font-mono tabular-nums transition-colors",
          revealed ? "text-[#0BE09B]/60" : "text-white/25"
        )}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Content */}
      <div className="px-5 py-4 pr-24">
        <h3 className={cn(
          "text-[13px] font-semibold tracking-tight mb-3 transition-colors duration-300",
          revealed ? "text-white/85" : "text-white/35"
        )}>
          {section.title}
        </h3>

        <motion.p
          animate={{ filter: \`blur(\${currentBlur}px)\` }}
          transition={{ duration, ease: easing }}
          className="text-[13px] leading-relaxed text-white/55"
          style={{ userSelect: revealed ? "auto" : "none" }}
        >
          {section.content}
        </motion.p>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-[#0BE09B]/50 via-[#0BE09B]/20 to-transparent"
        initial={{ width: 0 }}
        animate={{ width: revealed ? "100%" : "0%" }}
        transition={{ duration: duration * 0.8, ease: easing }}
      />
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
}: ProgressiveBlurRevealProps) {
  const [revealedSet, setRevealedSet] = useState<Set<number>>(new Set());

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
    return () => { cancelled = true; };
  }, [revealTrigger, sections.length]);

  const revealSection = (index: number) => {
    setRevealedSet((prev) => new Set([...prev, index]));
  };

  const allRevealed = revealedSet.size === sections.length;

  return (
    <div className="w-full max-w-[600px] mx-auto select-none">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className={cn(
          "w-1.5 h-1.5 rounded-full transition-colors duration-500",
          allRevealed ? "bg-[#0BE09B] animate-pulse" : "bg-white/20"
        )} />
        <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-white/35">
          Progressive Reveal
        </span>
        <span className="font-mono text-[11px] text-white/25">
          {revealedSet.size}/{sections.length}
        </span>
        <div className="ml-auto flex items-center gap-2">
          {revealTrigger === "click" && !allRevealed && (
            <button
              className="text-[11px] font-mono text-white/35 hover:text-white/55 transition-colors px-2 py-1 rounded border border-white/[0.06]"
              onClick={() => setRevealedSet(new Set(sections.map((_, i) => i)))}
            >
              reveal all
            </button>
          )}
          {revealedSet.size > 0 && (
            <button
              className="text-[11px] font-mono text-white/25 hover:text-white/35 transition-colors"
              onClick={() => setRevealedSet(new Set())}
            >
              reset
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[2px] rounded-full bg-white/[0.05] mb-5 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-[#0BE09B]/50"
          animate={{ width: \`\${(revealedSet.size / sections.length) * 100}%\` }}
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
          />
        ))}
      </div>

      {allRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#0BE09B]/20 bg-[rgba(11,224,155,0.04)]"
        >
          <div className="w-1 h-1 rounded-full bg-[#0BE09B] animate-pulse" />
          <span className="text-[11px] font-mono text-[#0BE09B]/70">
            All sections revealed
          </span>
        </motion.div>
      )}
    </div>
  );
}`;
