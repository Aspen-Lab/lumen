"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Types ── */
export interface ReasoningStep {
  label: string;
  detail: string;
  evidence?: string;
}

export interface ReasoningStepsProps {
  steps?: ReasoningStep[];
  currentStep?: number;
  confidencePerStep?: number[];
  showEvidence?: boolean;
  revealSpeed?: number;
  stagger?: number;
  fadeIn?: boolean;

  /* ── Color props ── */
  /** Primary accent color used for the active step, progress fill, check icon, and header dot. */
  accentColor?: string;
  /** Color used for the evidence block icon, label, and border. */
  evidenceColor?: string;
  /** Confidence bar color when value >= 0.85. */
  confidenceHighColor?: string;
  /** Confidence bar color when value >= 0.65 and < 0.85. */
  confidenceMidColor?: string;
  /** Confidence bar color when value < 0.65. */
  confidenceLowColor?: string;
  /** Color of the vertical timeline rail (background track). */
  railColor?: string;
  /** Border color of completed step nodes and cards. */
  completedBorderColor?: string;
  /** Background color of completed step cards. */
  completedBgColor?: string;
  /** Text color for the active step label. Defaults to accentColor. */
  activeLabelColor?: string;
  /** Text color for completed step labels. */
  completedLabelColor?: string;
  /** Text color for pending (future) step labels. */
  pendingLabelColor?: string;
  /** Text color for step detail paragraphs. */
  detailTextColor?: string;
  /** Text color for evidence body text. */
  evidenceTextColor?: string;
}

/* ── Default data ── */
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

/* ── Helpers ── */
/** Convert a hex/rgb color string to an rgba string with the given alpha. */
function withAlpha(color: string, alpha: number): string {
  // If already an rgba string, replace the alpha
  const rgbaMatch = color.match(
    /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/
  );
  if (rgbaMatch) {
    return `rgba(${rgbaMatch[1]},${rgbaMatch[2]},${rgbaMatch[3]},${alpha})`;
  }

  // Expand 3-digit hex
  let hex = color.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (hex.length !== 6) return color; // fallback — return as-is

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ── Sub-components ── */
interface ConfidenceBarProps {
  value: number;
  highColor: string;
  midColor: string;
  lowColor: string;
}

function ConfidenceBar({ value, highColor, midColor, lowColor }: ConfidenceBarProps) {
  const color = value >= 0.85 ? highColor : value >= 0.65 ? midColor : lowColor;

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex-1 h-[3px] rounded-full bg-white/[0.08] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <span className="text-[10px] font-mono tabular-nums" style={{ color }}>
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}

interface CheckIconProps {
  color: string;
}

function CheckIcon({ color }: CheckIconProps) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path
        d="M2 5.5L4 7.5L8 3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Main component ── */
export function ReasoningSteps({
  steps = DEFAULT_STEPS,
  currentStep = 2,
  confidencePerStep = DEFAULT_CONFIDENCE,
  showEvidence = true,
  revealSpeed = 0.4,
  stagger = 0.12,
  fadeIn = true,

  accentColor = "#0BE09B",
  evidenceColor = "#0091FF",
  confidenceHighColor = "#0BE09B",
  confidenceMidColor = "#FB7A29",
  confidenceLowColor = "#ef4444",
  railColor = "rgba(255,255,255,0.06)",
  completedBorderColor = "rgba(255,255,255,0.06)",
  completedBgColor = "rgba(255,255,255,0.02)",
  activeLabelColor,
  completedLabelColor = "var(--text-primary)",
  pendingLabelColor = "var(--text-muted)",
  detailTextColor = "var(--text-secondary)",
  evidenceTextColor = "var(--text-tertiary)",
}: ReasoningStepsProps) {
  const clampedCurrent = Math.max(0, Math.min(currentStep, steps.length - 1));

  // Derive accent-based values once so JSX stays readable
  const resolvedActiveLabelColor = activeLabelColor ?? accentColor;

  const activeNodeBorder = withAlpha(accentColor, 1);
  const activeNodeBg = withAlpha(accentColor, 0.2);
  const activeNodeShadow = `0 0 12px ${withAlpha(accentColor, 0.3)}`;
  const activeCardBorder = withAlpha(accentColor, 0.25);
  const activeCardBg = withAlpha(accentColor, 0.04);
  const activeCardShadow = `0 0 24px ${withAlpha(accentColor, 0.06)}`;
  const activeBadgeBg = withAlpha(accentColor, 0.1);
  const activeBadgeText = withAlpha(accentColor, 0.7);
  const pulseRingColor = withAlpha(accentColor, 0.3);
  const progressFill = withAlpha(accentColor, 0.4);

  const completedNodeBorder = withAlpha(accentColor, 0.5);
  const completedNodeBg = withAlpha(accentColor, 0.1);

  const evidenceBg = withAlpha(evidenceColor, 0.06);
  const evidenceBorder = withAlpha(evidenceColor, 0.12);
  const evidenceLabelColor = withAlpha(evidenceColor, 0.7);

  return (
    <div className="w-full max-w-[560px] mx-auto select-none">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: accentColor }}
        />
        <span className="text-detail font-mono uppercase tracking-[0.1em] text-white/35">
          Reasoning trace
        </span>
        <span className="ml-auto text-detail font-mono text-white/25">
          {clampedCurrent + 1} / {steps.length}
        </span>
      </div>

      {/* Timeline */}
      <div className="relative pl-7">
        {/* Vertical rail */}
        <div
          className="absolute left-[10px] top-0 bottom-0 w-px"
          style={{ backgroundColor: railColor }}
        />

        {/* Progress fill */}
        <motion.div
          className="absolute left-[10px] top-0 w-px origin-top"
          style={{
            height: "100%",
            transformOrigin: "top",
            backgroundColor: progressFill,
          }}
          initial={{ scaleY: 0 }}
          animate={{
            scaleY: steps.length > 1 ? clampedCurrent / (steps.length - 1) : 0,
          }}
          transition={{ duration: revealSpeed * 1.5, ease: "easeOut" }}
        />

        <AnimatePresence initial={false}>
          {steps.map((step, i) => {
            const isCompleted = i < clampedCurrent;
            const isActive = i === clampedCurrent;
            const isPending = i > clampedCurrent;

            return (
              <motion.div
                key={i}
                initial={fadeIn ? { opacity: 0, x: -8 } : false}
                animate={{ opacity: isPending ? 0.35 : 1, x: 0 }}
                transition={{
                  duration: revealSpeed,
                  delay: i * stagger,
                  ease: "easeOut",
                }}
                className="relative mb-5 last:mb-0"
              >
                {/* Step node */}
                <div
                  className={cn(
                    "absolute -left-7 top-[2px] w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-all duration-300 z-10"
                  )}
                  style={
                    isCompleted
                      ? {
                          borderColor: completedNodeBorder,
                          backgroundColor: completedNodeBg,
                        }
                      : isActive
                      ? {
                          borderColor: activeNodeBorder,
                          backgroundColor: activeNodeBg,
                          boxShadow: activeNodeShadow,
                        }
                      : {
                          borderColor: "rgba(255,255,255,0.1)",
                          backgroundColor: "rgba(255,255,255,0.03)",
                        }
                  }
                >
                  {isCompleted ? (
                    <CheckIcon color={accentColor} />
                  ) : (
                    <span
                      className="text-[9px] font-mono font-bold"
                      style={{
                        color: isActive ? resolvedActiveLabelColor : "var(--text-muted)",
                      }}
                    >
                      {i + 1}
                    </span>
                  )}

                  {/* Active pulse ring */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-[-4px] rounded-full border"
                      style={{ borderColor: pulseRingColor }}
                      animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                      transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  )}
                </div>

                {/* Step card */}
                <div
                  className="rounded-lg border px-4 py-3 transition-all duration-300"
                  style={
                    isActive
                      ? {
                          borderColor: activeCardBorder,
                          backgroundColor: activeCardBg,
                          boxShadow: activeCardShadow,
                        }
                      : isCompleted
                      ? {
                          borderColor: completedBorderColor,
                          backgroundColor: completedBgColor,
                        }
                      : {
                          borderColor: "rgba(255,255,255,0.04)",
                          backgroundColor: "transparent",
                        }
                  }
                >
                  {/* Label row */}
                  <div className="flex items-center gap-2">
                    <span
                      className="text-body font-semibold transition-colors"
                      style={{
                        color: isActive
                          ? resolvedActiveLabelColor
                          : isCompleted
                          ? completedLabelColor
                          : pendingLabelColor,
                      }}
                    >
                      {step.label}
                    </span>
                    {isActive && (
                      <span
                        className="ml-auto text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{
                          color: activeBadgeText,
                          backgroundColor: activeBadgeBg,
                        }}
                      >
                        active
                      </span>
                    )}
                  </div>

                  {/* Detail */}
                  {!isPending && (
                    <motion.div
                      initial={fadeIn ? { opacity: 0, height: 0 } : false}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: revealSpeed * 0.8, ease: "easeOut" }}
                    >
                      <p
                        className="text-detail mt-1.5 leading-relaxed"
                        style={{ color: detailTextColor }}
                      >
                        {step.detail}
                      </p>

                      {/* Evidence */}
                      {showEvidence && step.evidence && (
                        <div
                          className="mt-2 px-2.5 py-1.5 rounded-md border"
                          style={{
                            backgroundColor: evidenceBg,
                            borderColor: evidenceBorder,
                          }}
                        >
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                              <circle
                                cx="4.5"
                                cy="4.5"
                                r="3.5"
                                stroke={evidenceColor}
                                strokeWidth="1"
                              />
                              <path
                                d="M4.5 3.5V5M4.5 6V6.2"
                                stroke={evidenceColor}
                                strokeWidth="1"
                                strokeLinecap="round"
                              />
                            </svg>
                            <span
                              className="text-[10px] font-semibold uppercase tracking-[0.08em]"
                              style={{ color: evidenceLabelColor }}
                            >
                              Evidence
                            </span>
                          </div>
                          <p
                            className="text-[11px] font-mono leading-relaxed"
                            style={{ color: evidenceTextColor }}
                          >
                            {step.evidence}
                          </p>
                        </div>
                      )}

                      {/* Confidence bar */}
                      {confidencePerStep[i] !== undefined && (
                        <ConfidenceBar
                          value={confidencePerStep[i]}
                          highColor={confidenceHighColor}
                          midColor={confidenceMidColor}
                          lowColor={confidenceLowColor}
                        />
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
