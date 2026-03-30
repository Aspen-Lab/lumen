"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { type ResultSection, type RevealMode, type ResultRevealProps } from "./index";

/* ── Default data (mirrored from desktop) ── */
const DEFAULT_SECTIONS: ResultSection[] = [
  {
    title: "Executive Summary",
    content:
      "Analysis of the Q3 dataset reveals a 27% uplift in conversion rate driven primarily by the redesigned onboarding flow. Retention at the 30-day mark climbed to 68%, surpassing the previous benchmark of 54%.",
  },
  {
    title: "Key Findings",
    content:
      "Three cohorts were examined across the trial period. Cohort A showed the strongest signal — median session length grew from 4.2 min to 11.7 min week-over-week. Cohort B plateaued at week 4, suggesting a mid-funnel friction point.",
  },
  {
    title: "Confidence Assessment",
    content:
      "Overall model confidence sits at 91% for the primary claim and 74% for the secondary retention figures. The lower confidence is attributable to a 12-day gap in telemetry, now resolved.",
  },
  {
    title: "Recommended Actions",
    content:
      "Prioritise the mid-funnel redesign sprint for Q4. Allocate additional instrumentation resources and schedule a cross-functional review with growth and data teams.",
  },
];

/* ── Single slide-up card ── */
function SlideCard({
  section,
  index,
  revealed,
  revealDuration,
  stagger,
}: {
  section: ResultSection;
  index: number;
  revealed: boolean;
  revealDuration: number;
  stagger: number;
}) {
  const delay = index * stagger;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={
        revealed
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 22 }
      }
      transition={{ duration: revealDuration, delay, ease: [0.32, 0.72, 0, 1] }}
      className={cn(
        "rounded-2xl border px-4 py-4 bg-[#111113] transition-shadow duration-500",
        revealed
          ? "border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
          : "border-white/[0.04]"
      )}
    >
      {/* Card header */}
      <div className="flex items-center gap-2 mb-2.5">
        {/* Index chip */}
        <span
          className={cn(
            "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono font-bold transition-all duration-300 shrink-0",
            revealed
              ? "bg-[#0BE09B]/15 text-[#0BE09B] border border-[#0BE09B]/30"
              : "bg-white/[0.05] text-white/25 border border-white/[0.08]"
          )}
        >
          {index + 1}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/35 flex-1">
          {section.title}
        </span>

        {/* Shimmer dot when revealed */}
        {revealed && (
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[#0BE09B]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: delay + revealDuration * 0.6 }}
          />
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.05] mb-3" />

      {/* Content */}
      <p className="text-[12.5px] leading-[1.7] text-white/65">{section.content}</p>
    </motion.div>
  );
}

/* ── Scroll-triggered card wrapper ── */
function ScrollSlideCard(props: {
  section: ResultSection;
  index: number;
  revealDuration: number;
  stagger: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref}>
      <SlideCard {...props} revealed={inView} />
    </div>
  );
}

/* ── Mobile main export ── */
export function ResultRevealMobile({
  sections = DEFAULT_SECTIONS,
  revealMode = "progressive",
  blurAmount: _blurAmount = 12,
  revealDuration = 0.8,
  stagger = 0.18,
}: ResultRevealProps) {
  const clampedDuration = Math.max(0.3, Math.min(3, revealDuration));
  const clampedStagger = Math.max(0.05, Math.min(0.5, stagger));

  const [revealedCount, setRevealedCount] = useState(0);
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
        const nextDelay = (clampedDuration + clampedStagger) * 1000 + 200;
        setTimeout(() => revealNext(idx + 1), nextDelay);
      };

      const t = setTimeout(() => revealNext(0), 400);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealMode, sections.length, clampedDuration, clampedStagger]);

  const totalSections = sections.length;
  const visibleCount =
    revealMode === "all-at-once"
      ? allRevealed ? totalSections : 0
      : revealMode === "progressive"
      ? revealedCount
      : totalSections;

  return (
    <div className="w-full max-w-[390px] mx-auto select-none">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-[#0BE09B]"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-white/35">
          AI Result
        </span>
        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider border border-white/[0.07] text-white/25 ml-1">
          {revealMode}
        </span>

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

      {/* Progress bar */}
      {revealMode !== "on-scroll" && (
        <div className="h-[2px] rounded-full bg-white/[0.05] mb-4 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[#0BE09B]/50"
            initial={{ width: "0%" }}
            animate={{
              width:
                totalSections > 0
                  ? `${(visibleCount / totalSections) * 100}%`
                  : "0%",
            }}
            transition={{ duration: clampedDuration * 0.6, ease: "easeOut" }}
          />
        </div>
      )}

      {/* Cards */}
      <div className="space-y-3">
        {revealMode === "on-scroll"
          ? sections.map((section, i) => (
              <ScrollSlideCard
                key={i}
                section={section}
                index={i}
                revealDuration={clampedDuration}
                stagger={0}
              />
            ))
          : sections.map((section, i) => (
              <SlideCard
                key={i}
                section={section}
                index={i}
                revealed={
                  revealMode === "all-at-once" ? allRevealed : i < revealedCount
                }
                revealDuration={clampedDuration}
                stagger={revealMode === "all-at-once" ? clampedStagger : 0}
              />
            ))}
      </div>
    </div>
  );
}
