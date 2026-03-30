"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { type ReasoningStep, type ReasoningStepsProps } from "./index";

/* ── Default data (mirrored from desktop) ── */
const DEFAULT_STEPS: ReasoningStep[] = [
  {
    label: "Parse user intent",
    detail:
      "Identified the core goal as data summarisation with a secondary constraint of preserving source attribution.",
    evidence: "Keyword match: 'summarise', 'keep references' found in query.",
  },
  {
    label: "Retrieve context",
    detail:
      "Fetched 4 relevant documents from the vector store using cosine similarity (threshold 0.82).",
    evidence: "Docs: report_q3.pdf, market_data.csv, notes_v2.md, exec_brief.txt",
  },
  {
    label: "Cross-check facts",
    detail:
      "Compared figures across sources. Detected one conflicting statistic — flagged for low confidence.",
    evidence: "Revenue discrepancy: $4.2 M vs $3.9 M between two sources.",
  },
  {
    label: "Draft response",
    detail:
      "Generated structured summary with inline citations, using a neutral tone calibrated to the detected audience.",
  },
  {
    label: "Confidence validation",
    detail:
      "Final pass verified all claims map to retrieved evidence. One claim hedged due to source conflict.",
  },
];

const DEFAULT_CONFIDENCE = [0.96, 0.89, 0.71, 0.94, 0.88];

/* ── Chevron icon ── */
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={cn("transition-transform duration-200", open && "rotate-180")}
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

/* ── Check icon ── */
function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path
        d="M2 5.5L4 7.5L8 3"
        stroke="#0BE09B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Confidence pill ── */
function ConfidencePill({ value }: { value: number }) {
  const color =
    value >= 0.85 ? "#0BE09B" : value >= 0.65 ? "#FB7A29" : "#ef4444";
  return (
    <span
      className="text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded"
      style={{ color, backgroundColor: `${color}18` }}
    >
      {Math.round(value * 100)}%
    </span>
  );
}

/* ── Single step card ── */
function StepCard({
  step,
  index,
  isCompleted,
  isActive,
  isPending,
  confidence,
  showEvidence,
  revealSpeed,
  fadeIn,
}: {
  step: ReasoningStep;
  index: number;
  isCompleted: boolean;
  isActive: boolean;
  isPending: boolean;
  confidence?: number;
  showEvidence: boolean;
  revealSpeed: number;
  fadeIn: boolean;
}) {
  const [expanded, setExpanded] = useState(isActive);

  const canExpand = !isPending;

  return (
    <motion.div
      initial={fadeIn ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: isPending ? 0.4 : 1, y: 0 }}
      transition={{ duration: revealSpeed, ease: "easeOut" }}
      className={cn(
        "rounded-xl border overflow-hidden transition-colors duration-200",
        isActive
          ? "border-accent-green/25 bg-[rgba(11,224,155,0.04)]"
          : isCompleted
          ? "border-white/[0.07] bg-white/[0.02]"
          : "border-white/[0.04] bg-transparent"
      )}
    >
      {/* Header row — always visible, tap to expand */}
      <button
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 text-left",
          canExpand ? "cursor-pointer" : "cursor-default"
        )}
        onClick={() => canExpand && setExpanded((v) => !v)}
        disabled={!canExpand}
      >
        {/* Step node */}
        <div
          className={cn(
            "flex-shrink-0 w-[20px] h-[20px] rounded-full border flex items-center justify-center transition-all duration-300",
            isCompleted && "border-accent-green/50 bg-accent-green/10",
            isActive &&
              "border-accent-green bg-accent-green/20 shadow-[0_0_10px_rgba(11,224,155,0.3)]",
            isPending && "border-white/10 bg-white/[0.03]"
          )}
        >
          {isCompleted ? (
            <CheckIcon />
          ) : (
            <span
              className={cn(
                "text-[9px] font-mono font-bold",
                isActive ? "text-accent-green" : "text-[--text-muted]"
              )}
            >
              {index + 1}
            </span>
          )}
        </div>

        {/* Label */}
        <span
          className={cn(
            "flex-1 text-[13px] font-semibold leading-snug transition-colors",
            isActive
              ? "text-accent-green"
              : isCompleted
              ? "text-[--text-primary]"
              : "text-[--text-muted]"
          )}
        >
          {step.label}
        </span>

        {/* Right slot */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {confidence !== undefined && !isPending && (
            <ConfidencePill value={confidence} />
          )}
          {isActive && (
            <span className="text-[9px] font-mono uppercase tracking-wider text-accent-green/70 bg-accent-green/10 px-1.5 py-0.5 rounded hidden xs:inline">
              active
            </span>
          )}
          {canExpand && (
            <span
              className={cn(
                "transition-colors",
                isActive ? "text-accent-green" : "text-[--text-tertiary]"
              )}
            >
              <ChevronIcon open={expanded} />
            </span>
          )}
        </div>
      </button>

      {/* Expandable body */}
      <AnimatePresence initial={false}>
        {expanded && canExpand && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 space-y-2">
              {/* Divider */}
              <div className="h-px bg-white/[0.05] mb-3" />

              {/* Detail */}
              <p className="text-detail text-[--text-secondary] leading-relaxed">
                {step.detail}
              </p>

              {/* Evidence */}
              {showEvidence && step.evidence && (
                <div className="mt-2 px-2.5 py-2 rounded-lg bg-[rgba(0,145,255,0.06)] border border-[rgba(0,145,255,0.12)]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <circle
                        cx="4.5"
                        cy="4.5"
                        r="3.5"
                        stroke="#0091FF"
                        strokeWidth="1"
                      />
                      <path
                        d="M4.5 3.5V5M4.5 6V6.2"
                        stroke="#0091FF"
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#0091FF]/70">
                      Evidence
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-[--text-tertiary] leading-relaxed">
                    {step.evidence}
                  </p>
                </div>
              )}

              {/* Confidence bar */}
              {confidence !== undefined && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] text-[--text-muted]">Confidence</span>
                  <div className="flex-1 h-[3px] rounded-full bg-white/[0.08] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor:
                          confidence >= 0.85
                            ? "#0BE09B"
                            : confidence >= 0.65
                            ? "#FB7A29"
                            : "#ef4444",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${confidence * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Mobile main export ── */
export function ReasoningStepsMobile({
  steps = DEFAULT_STEPS,
  currentStep = 2,
  confidencePerStep = DEFAULT_CONFIDENCE,
  showEvidence = true,
  revealSpeed = 0.4,
  stagger = 0.12,
  fadeIn = true,
}: ReasoningStepsProps) {
  const clampedCurrent = Math.max(0, Math.min(currentStep, steps.length - 1));

  return (
    <div className="w-full max-w-[375px] mx-auto select-none">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
        <span className="text-detail font-mono uppercase tracking-[0.1em] text-[--text-tertiary]">
          Reasoning trace
        </span>
        <span className="ml-auto text-detail font-mono text-[--text-muted]">
          {clampedCurrent + 1} / {steps.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-[2px] rounded-full bg-white/[0.06] mb-5 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-accent-green/60"
          initial={{ width: 0 }}
          animate={{
            width:
              steps.length > 1
                ? `${(clampedCurrent / (steps.length - 1)) * 100}%`
                : "0%",
          }}
          transition={{ duration: revealSpeed * 1.2, ease: "easeOut" }}
        />
      </div>

      {/* Stacked step cards */}
      <div className="space-y-2">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={fadeIn ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: revealSpeed,
              delay: i * stagger,
              ease: "easeOut",
            }}
          >
            <StepCard
              step={step}
              index={i}
              isCompleted={i < clampedCurrent}
              isActive={i === clampedCurrent}
              isPending={i > clampedCurrent}
              confidence={confidencePerStep[i]}
              showEvidence={showEvidence}
              revealSpeed={revealSpeed}
              fadeIn={false}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
