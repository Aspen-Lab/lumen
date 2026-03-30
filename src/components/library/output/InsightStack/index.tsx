"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Types ── */
export interface Insight {
  title: string;
  summary: string;
  detail: string;
  priority: number;
}

export interface InsightStackProps {
  insights?: Insight[];
  priorityOrder?: boolean;
  highlightTop?: boolean;
  expandSpeed?: number;
  stackOffset?: number;
  parallax?: boolean;
}

/* ── Default data ── */
const DEFAULT_INSIGHTS: Insight[] = [
  {
    title: "Anomaly detected in request volume",
    summary: "Traffic spiked 340% above baseline in the past 15 minutes.",
    detail:
      "The model identified a sudden surge in API request volume originating from three geographic clusters. Cross-referencing with historical patterns suggests this is atypical for the time of day. A rate-limiting response has been staged and is awaiting your approval before deployment.",
    priority: 1,
  },
  {
    title: "Model drift approaching threshold",
    summary: "Prediction accuracy has declined 4.2% over the last 72 hours.",
    detail:
      "Gradual input distribution shift has been tracked since Tuesday. The primary feature contributing to drift is session_duration, which now skews 18% higher than training distribution. Retraining with the latest 30-day window is estimated to restore accuracy to baseline within 6 hours.",
    priority: 2,
  },
  {
    title: "Cost optimisation opportunity",
    summary: "Switching inference tier could reduce monthly spend by $2,400.",
    detail:
      "Analysis of your request latency requirements shows 78% of calls tolerate up to 800 ms response time. Routing these to the standard inference tier while keeping latency-sensitive calls on the premium tier would achieve the projected saving with no measurable impact on user experience.",
    priority: 3,
  },
  {
    title: "Knowledge base out of date",
    summary: "14 documents have not been re-indexed since last quarter.",
    detail:
      "The retrieval pipeline flagged 14 source documents whose embeddings were generated against an older model version. Re-indexing is estimated to take 22 minutes and will improve semantic search recall by approximately 11% based on benchmark tests run on a representative sample.",
    priority: 4,
  },
];

/* ── Priority badge ── */
function PriorityBadge({ value }: { value: number }) {
  const isTop = value === 1;
  return (
    <span
      className={cn(
        "inline-flex items-center text-[9px] font-mono font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded",
        isTop
          ? "bg-[rgba(11,224,155,0.12)] text-[#0BE09B]"
          : "bg-white/[0.06] text-white/30"
      )}
    >
      P{value}
    </span>
  );
}

/* ── Chevron icon ── */
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={cn("transition-transform duration-300", open && "rotate-180")}
    >
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Single insight card ── */
function InsightCard({
  insight,
  index,
  total,
  isTop,
  highlightTop,
  expandSpeed,
  stackOffset,
  parallax,
}: {
  insight: Insight;
  index: number;
  total: number;
  isTop: boolean;
  highlightTop: boolean;
  expandSpeed: number;
  stackOffset: number;
  parallax: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [mouseY, setMouseY] = useState(0);

  const topHighlight = isTop && highlightTop;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!parallax) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    setMouseY(y);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setMouseY(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: expandSpeed * 0.8, delay: index * 0.06, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={parallax && hovered ? { rotateX: -mouseY * 0.4 } : undefined}
      className="group cursor-default"
    >
      <motion.div
        animate={{ y: hovered ? -(stackOffset * 0.5) : 0 }}
        transition={{ duration: expandSpeed * 0.6, ease: [0.32, 0.72, 0, 1] }}
        className={cn(
          "relative rounded-xl border overflow-hidden transition-all duration-300",
          topHighlight
            ? "border-[rgba(11,224,155,0.3)] bg-[rgba(11,224,155,0.025)] shadow-[0_0_30px_rgba(11,224,155,0.07)]"
            : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.03]",
          hovered && "shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
        )}
      >
        {/* Top accent strip */}
        {topHighlight && (
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#0BE09B]/50 to-transparent" />
        )}

        {/* Card header */}
        <div className="flex items-start gap-3 px-5 py-4">
          {/* Stack depth indicator */}
          <div
            className="flex-shrink-0 w-1.5 self-stretch rounded-full mt-0.5"
            style={{
              background: topHighlight
                ? "linear-gradient(180deg, #0BE09B 0%, rgba(11,224,155,0.15) 100%)"
                : `rgba(255,255,255,${0.06 + (total - index) * 0.015})`,
            }}
          />

          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-center gap-2 mb-1.5">
              <PriorityBadge value={insight.priority} />
              <span
                className={cn(
                  "text-[13px] font-semibold leading-snug transition-colors duration-200",
                  topHighlight
                    ? "text-[#0BE09B]"
                    : "text-white/75 group-hover:text-white/90"
                )}
              >
                {insight.title}
              </span>
            </div>

            {/* Summary */}
            <p className="text-[12px] leading-relaxed text-white/45 group-hover:text-white/55 transition-colors duration-200">
              {insight.summary}
            </p>
          </div>

          {/* Expand chevron */}
          <span
            className={cn(
              "flex-shrink-0 mt-0.5 transition-colors duration-200",
              hovered
                ? topHighlight
                  ? "text-[#0BE09B]"
                  : "text-white/50"
                : "text-white/20"
            )}
          >
            <ChevronIcon open={hovered} />
          </span>
        </div>

        {/* Expandable detail */}
        <AnimatePresence initial={false}>
          {hovered && (
            <motion.div
              key="detail"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: expandSpeed * 0.7, ease: [0.32, 0.72, 0, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-4 pt-0">
                <div className="h-px bg-white/[0.05] mb-3 ml-4" />
                <div className="ml-4">
                  <p className="text-[12.5px] leading-[1.7] text-white/55">
                    {insight.detail}
                  </p>

                  {/* Footer row */}
                  <div className="flex items-center gap-3 mt-3">
                    <div
                      className={cn(
                        "flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.08em]",
                        topHighlight ? "text-[#0BE09B]/60" : "text-[#0091FF]/60"
                      )}
                    >
                      <div
                        className="w-1 h-1 rounded-full"
                        style={{
                          background: topHighlight ? "#0BE09B" : "#0091FF",
                        }}
                      />
                      AI analysis
                    </div>
                    <span className="text-[10px] text-white/20 font-mono ml-auto">
                      priority {insight.priority} of {total}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ── Main component ── */
export function InsightStack({
  insights = DEFAULT_INSIGHTS,
  priorityOrder = true,
  highlightTop = true,
  expandSpeed = 0.35,
  stackOffset = 4,
  parallax = true,
}: InsightStackProps) {
  const sorted = priorityOrder
    ? [...insights].sort((a, b) => a.priority - b.priority)
    : insights;

  const topPriority = sorted[0]?.priority;

  return (
    <div className="w-full max-w-[620px] mx-auto select-none">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#0BE09B] animate-pulse" />
        <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-white/35">
          AI Insights
        </span>
        <span className="ml-auto text-[11px] font-mono text-white/20">
          {sorted.length} finding{sorted.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Stack */}
      <div
        className="flex flex-col"
        style={{ gap: `${Math.max(4, stackOffset * 1.5)}px` }}
      >
        {sorted.map((insight, i) => (
          <InsightCard
            key={insight.title}
            insight={insight}
            index={i}
            total={sorted.length}
            isTop={insight.priority === topPriority}
            highlightTop={highlightTop}
            expandSpeed={expandSpeed}
            stackOffset={stackOffset}
            parallax={parallax}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-center">
        <span className="text-[10px] font-mono text-white/15 uppercase tracking-[0.1em]">
          hover to expand · lumen insight-stack
        </span>
      </div>
    </div>
  );
}
