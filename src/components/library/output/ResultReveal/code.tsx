const RESULT_REVEAL_SOURCE = `"use client";

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
      initial={{ opacity: 0.4, filter: \`blur(\${blurAmount}px)\` }}
      animate={
        revealed
          ? { opacity: 1, filter: "blur(0px)" }
          : { opacity: 0.4, filter: \`blur(\${blurAmount}px)\` }
      }
      transition={{ duration: revealDuration, delay, ease: [0.32, 0.72, 0, 1] }}
      className={cn(
        "rounded-xl border bg-[#111113] px-5 py-4 transition-shadow duration-500",
        revealed
          ? "border-white/[0.09] shadow-[0_2px_20px_rgba(0,0,0,0.35)]"
          : "border-white/[0.04]"
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <motion.div
          className="w-1 h-1 rounded-full bg-[#0BE09B]"
          animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.6 }}
          transition={{ duration: revealDuration * 0.6, delay: delay + revealDuration * 0.5 }}
        />
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/35">
          {section.title}
        </span>
        <motion.span
          className="ml-auto text-[9px] font-mono uppercase tracking-wider text-[#0BE09B]/60 bg-[#0BE09B]/10 px-1.5 py-0.5 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 0.3, delay: delay + revealDuration * 0.7 }}
        >
          revealed
        </motion.span>
      </div>
      <p className="text-[13px] leading-[1.72] text-white/70">{section.content}</p>
    </motion.div>
  );
}

/* ── ScrollRevealCard ── */
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

/* ── ResultReveal ── */
export function ResultReveal({
  sections = [],
  revealMode = "progressive",
  blurAmount = 12,
  revealDuration = 0.8,
  stagger = 0.18,
}: ResultRevealProps) {
  const clampedBlur = Math.max(0, Math.min(20, blurAmount));
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
        const nextDelay = (clampedDuration + clampedStagger) * 1000 + 220;
        setTimeout(() => revealNext(idx + 1), nextDelay);
      };
      const t = setTimeout(() => revealNext(0), 400);
      return () => clearTimeout(t);
    }
  }, [revealMode, sections.length, clampedDuration, clampedStagger]);

  const totalSections = sections.length;
  const visibleCount =
    revealMode === "all-at-once"
      ? allRevealed ? totalSections : 0
      : revealMode === "progressive"
      ? revealedCount
      : totalSections;

  return (
    <div className="w-full max-w-[620px] mx-auto select-none">
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
        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider border border-white/[0.08] text-white/30">
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

      {revealMode !== "on-scroll" && (
        <div className="h-px rounded-full bg-white/[0.06] mb-5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[#0BE09B]/50"
            initial={{ width: "0%" }}
            animate={{
              width: totalSections > 0 ? \`\${(visibleCount / totalSections) * 100}%\` : "0%",
            }}
            transition={{ duration: clampedDuration * 0.6, ease: "easeOut" }}
          />
        </div>
      )}

      <div className="space-y-3">
        {revealMode === "on-scroll"
          ? sections.map((section, i) => (
              <ScrollRevealCard
                key={i}
                section={section}
                index={i}
                blurAmount={clampedBlur}
                revealDuration={clampedDuration}
                stagger={0}
              />
            ))
          : sections.map((section, i) => (
              <SectionCard
                key={i}
                section={section}
                index={revealMode === "all-at-once" ? i : 0}
                revealed={
                  revealMode === "all-at-once" ? allRevealed : i < revealedCount
                }
                blurAmount={clampedBlur}
                revealDuration={clampedDuration}
                stagger={revealMode === "all-at-once" ? clampedStagger : 0}
              />
            ))}
      </div>
    </div>
  );
}`;

export function generateResultRevealCode(props: Record<string, unknown>): string {
  const defaults: Record<string, unknown> = {
    revealMode: "progressive",
    blurAmount: 12,
    revealDuration: 0.8,
    stagger: 0.18,
    accentColor: "#0BE09B",
    cardBgColor: "#111113",
    headerColor: "rgba(255,255,255,0.30)",
    progressBarColor: "rgba(255,255,255,0.06)",
    textColor: "rgba(255,255,255,0.70)",
    sectionTitleColor: "rgba(255,255,255,0.35)",
  };

  const customProps = Object.entries(props)
    .filter(([k, v]) => v !== undefined && v !== defaults[k])
    .map(([k, v]) => {
      if (typeof v === "string") return `  ${k}="${v}"`;
      if (typeof v === "boolean") return v ? `  ${k}` : `  ${k}={false}`;
      return `  ${k}={${JSON.stringify(v)}}`;
    })
    .join("\n");

  const propsBlock = customProps ? `\n${customProps}\n` : "";

  return `// Usage
<ResultReveal${propsBlock}/>

// Full source code below...
${RESULT_REVEAL_SOURCE}`;
}

export const resultRevealCode = generateResultRevealCode({});
