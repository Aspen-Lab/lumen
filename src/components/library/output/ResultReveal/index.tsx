"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Types ── */
export interface ResultSection {
  title: string;
  content: string;
}

export type RevealMode = "all-at-once" | "progressive" | "on-scroll";

export interface ResultRevealProps {
  sections?: ResultSection[];
  revealMode?: RevealMode;
  blurAmount?: number;
  revealDuration?: number;
  stagger?: number;
}

/* ── Default data ── */
const DEFAULT_SECTIONS: ResultSection[] = [
  {
    title: "Executive Summary",
    content:
      "Analysis of the Q3 dataset reveals a 27% uplift in conversion rate driven primarily by the redesigned onboarding flow. Retention at the 30-day mark climbed to 68%, surpassing the previous benchmark of 54%. These results validate the hypothesis that reducing time-to-value during setup directly correlates with long-term engagement.",
  },
  {
    title: "Key Findings",
    content:
      "Three cohorts were examined across the trial period. Cohort A (early adopters) showed the strongest signal — median session length grew from 4.2 min to 11.7 min week-over-week. Cohort B demonstrated moderate improvement with a plateau at week 4, suggesting a friction point in the mid-funnel that warrants further investigation. Cohort C data is incomplete pending a delayed export from the data warehouse.",
  },
  {
    title: "Confidence Assessment",
    content:
      "Overall model confidence sits at 91% for the primary claim and 74% for the secondary retention figures. The lower confidence on retention is attributable to a 12-day gap in telemetry caused by an instrumentation bug, now resolved. Projections beyond the 60-day window carry an uncertainty band of ±8 percentage points.",
  },
  {
    title: "Recommended Actions",
    content:
      "Prioritise the mid-funnel redesign sprint slated for Q4. Allocate additional instrumentation resources to close the telemetry gap before the next cohort study. Schedule a cross-functional review with the growth and data teams to align on the revised KPI definitions that reflect the new onboarding architecture.",
  },
];

/* ── Section card ── */
function SectionCard({
  section,
  index,
  revealed,
  blurAmount,
  revealDuration,
  stagger,
}: {
  section: ResultSection;
  index: number;
  revealed: boolean;
  blurAmount: number;
  revealDuration: number;
  stagger: number;
}) {
  const delay = index * stagger;

  return (
    <motion.div
      initial={{ opacity: 0.4, filter: `blur(${blurAmount}px)` }}
      animate={
        revealed
          ? { opacity: 1, filter: "blur(0px)" }
          : { opacity: 0.4, filter: `blur(${blurAmount}px)` }
      }
      transition={{ duration: revealDuration, delay, ease: [0.32, 0.72, 0, 1] }}
      className={cn(
        "rounded-xl border bg-[#111113] px-5 py-4 transition-shadow duration-500",
        revealed
          ? "border-white/[0.09] shadow-[0_2px_20px_rgba(0,0,0,0.35)]"
          : "border-white/[0.04]"
      )}
    >
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3">
        <motion.div
          className="w-1 h-1 rounded-full bg-[#0BE09B]"
          animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.6 }}
          transition={{ duration: revealDuration * 0.6, delay: delay + revealDuration * 0.5 }}
        />
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/35">
          {section.title}
        </span>

        {/* Revealed indicator */}
        <motion.span
          className="ml-auto text-[9px] font-mono uppercase tracking-wider text-[#0BE09B]/60 bg-[#0BE09B]/10 px-1.5 py-0.5 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 0.3, delay: delay + revealDuration * 0.7 }}
        >
          revealed
        </motion.span>
      </div>

      {/* Content */}
      <p className="text-[13px] leading-[1.72] text-white/70">{section.content}</p>
    </motion.div>
  );
}

/* ── ScrollRevealCard — wraps SectionCard with in-view trigger ── */
function ScrollRevealCard(props: {
  section: ResultSection;
  index: number;
  blurAmount: number;
  revealDuration: number;
  stagger: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref}>
      <SectionCard {...props} revealed={inView} />
    </div>
  );
}

/* ── Main component ── */
export function ResultReveal({
  sections = DEFAULT_SECTIONS,
  revealMode = "progressive",
  blurAmount = 12,
  revealDuration = 0.8,
  stagger = 0.18,
}: ResultRevealProps) {
  const clampedBlur = Math.max(0, Math.min(20, blurAmount));
  const clampedDuration = Math.max(0.3, Math.min(3, revealDuration));
  const clampedStagger = Math.max(0.05, Math.min(0.5, stagger));

  /* Track which sections are revealed for "progressive" mode */
  const [revealedCount, setRevealedCount] = useState(0);

  /* For all-at-once: trigger everything together after a short mount delay */
  const [allRevealed, setAllRevealed] = useState(false);

  useEffect(() => {
    setRevealedCount(0);
    setAllRevealed(false);

    if (revealMode === "all-at-once") {
      const t = setTimeout(() => setAllRevealed(true), 300);
      return () => clearTimeout(t);
    }

    if (revealMode === "progressive") {
      if (sections.length === 0) return;

      const revealNext = (idx: number) => {
        if (idx >= sections.length) return;
        setRevealedCount(idx + 1);
        const nextDelay = (clampedDuration + clampedStagger) * 1000 + 220;
        const t = setTimeout(() => revealNext(idx + 1), nextDelay);
        return t;
      };

      const t = setTimeout(() => revealNext(0), 400);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealMode, sections.length, clampedDuration, clampedStagger]);

  /* ── Header ── */
  const totalSections = sections.length;
  const visibleCount =
    revealMode === "all-at-once"
      ? allRevealed ? totalSections : 0
      : revealMode === "progressive"
      ? revealedCount
      : totalSections; /* on-scroll counts are handled per-card */

  return (
    <div className="w-full max-w-[620px] mx-auto select-none">
      {/* Header bar */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[#0BE09B]"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-white/35">
            AI Result
          </span>
        </div>

        {/* Mode badge */}
        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider border border-white/[0.08] text-white/30">
          {revealMode}
        </span>

        {/* Section counter (not shown for on-scroll) */}
        {revealMode !== "on-scroll" && (
          <span className="ml-auto text-[11px] font-mono tabular-nums text-white/30">
            <motion.span
              key={visibleCount}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-[#0BE09B]/80"
            >
              {visibleCount}
            </motion.span>
            <span> / {totalSections}</span>
          </span>
        )}
      </div>

      {/* Progress bar (progressive + all-at-once only) */}
      {revealMode !== "on-scroll" && (
        <div className="h-px rounded-full bg-white/[0.06] mb-5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[#0BE09B]/50"
            initial={{ width: "0%" }}
            animate={{
              width: totalSections > 0 ? `${(visibleCount / totalSections) * 100}%` : "0%",
            }}
            transition={{ duration: clampedDuration * 0.6, ease: "easeOut" }}
          />
        </div>
      )}

      {/* Sections */}
      <div className="space-y-3">
        {revealMode === "on-scroll"
          ? sections.map((section, i) => (
              <ScrollRevealCard
                key={i}
                section={section}
                index={i}
                blurAmount={clampedBlur}
                revealDuration={clampedDuration}
                stagger={0} /* each card triggers independently */
              />
            ))
          : sections.map((section, i) => (
              <SectionCard
                key={i}
                section={section}
                index={revealMode === "all-at-once" ? i : 0}
                revealed={
                  revealMode === "all-at-once"
                    ? allRevealed
                    : i < revealedCount
                }
                blurAmount={clampedBlur}
                revealDuration={clampedDuration}
                stagger={revealMode === "all-at-once" ? clampedStagger : 0}
              />
            ))}
      </div>
    </div>
  );
}
