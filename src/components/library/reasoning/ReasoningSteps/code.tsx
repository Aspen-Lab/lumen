export const reasoningStepsCode = `"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ReasoningStep {
  label: string;
  detail: string;
  evidence?: string;
}

export interface ReasoningStepsProps {
  steps: ReasoningStep[];
  currentStep?: number;
  confidencePerStep?: number[];
  showEvidence?: boolean;
  revealSpeed?: number;
  stagger?: number;
  fadeIn?: boolean;
}

function ConfidenceBar({ value }: { value: number }) {
  const color =
    value >= 0.85 ? "#0BE09B" : value >= 0.65 ? "#FB7A29" : "#ef4444";

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex-1 h-[3px] rounded-full bg-white/[0.08] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: \`\${value * 100}%\` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <span className="text-[10px] font-mono tabular-nums" style={{ color }}>
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}

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

export function ReasoningSteps({
  steps,
  currentStep = 0,
  confidencePerStep = [],
  showEvidence = true,
  revealSpeed = 0.4,
  stagger = 0.12,
  fadeIn = true,
}: ReasoningStepsProps) {
  const clampedCurrent = Math.max(0, Math.min(currentStep, steps.length - 1));

  return (
    <div className="w-full max-w-[560px] mx-auto select-none">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-[#0BE09B] animate-pulse" />
        <span className="text-xs font-mono uppercase tracking-[0.1em] text-white/35">
          Reasoning trace
        </span>
        <span className="ml-auto text-xs font-mono text-white/25">
          {clampedCurrent + 1} / {steps.length}
        </span>
      </div>

      <div className="relative pl-7">
        <div className="absolute left-[10px] top-0 bottom-0 w-px bg-white/[0.06]" />

        <motion.div
          className="absolute left-[10px] top-0 w-px bg-[#0BE09B]/40 origin-top"
          initial={{ scaleY: 0 }}
          animate={{
            scaleY: steps.length > 1 ? clampedCurrent / (steps.length - 1) : 0,
          }}
          transition={{ duration: revealSpeed * 1.5, ease: "easeOut" }}
          style={{ height: "100%", transformOrigin: "top" }}
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
                transition={{ duration: revealSpeed, delay: i * stagger, ease: "easeOut" }}
                className="relative mb-5 last:mb-0"
              >
                <div
                  className={cn(
                    "absolute -left-7 top-[2px] w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-all duration-300 z-10",
                    isCompleted && "border-[#0BE09B]/50 bg-[#0BE09B]/10",
                    isActive && "border-[#0BE09B] bg-[#0BE09B]/20 shadow-[0_0_12px_rgba(11,224,155,0.3)]",
                    isPending && "border-white/10 bg-white/[0.03]"
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon />
                  ) : (
                    <span className={cn("text-[9px] font-mono font-bold", isActive ? "text-[#0BE09B]" : "text-white/25")}>
                      {i + 1}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      className="absolute inset-[-4px] rounded-full border border-[#0BE09B]/30"
                      animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                </div>

                <div
                  className={cn(
                    "rounded-lg border px-4 py-3 transition-all duration-300",
                    isActive
                      ? "border-[#0BE09B]/25 bg-[rgba(11,224,155,0.04)] shadow-[0_0_24px_rgba(11,224,155,0.06)]"
                      : isCompleted
                      ? "border-white/[0.06] bg-white/[0.02]"
                      : "border-white/[0.04] bg-transparent"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-sm font-semibold transition-colors",
                      isActive ? "text-[#0BE09B]" : isCompleted ? "text-white/85" : "text-white/25"
                    )}>
                      {step.label}
                    </span>
                    {isActive && (
                      <span className="ml-auto text-[10px] font-mono uppercase tracking-wider text-[#0BE09B]/70 bg-[#0BE09B]/10 px-1.5 py-0.5 rounded">
                        active
                      </span>
                    )}
                  </div>

                  {!isPending && (
                    <motion.div
                      initial={fadeIn ? { opacity: 0, height: 0 } : false}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: revealSpeed * 0.8, ease: "easeOut" }}
                    >
                      <p className="text-xs text-white/55 mt-1.5 leading-relaxed">{step.detail}</p>

                      {showEvidence && step.evidence && (
                        <div className="mt-2 px-2.5 py-1.5 rounded-md bg-[rgba(0,145,255,0.06)] border border-[rgba(0,145,255,0.12)]">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#0091FF]/70 mb-0.5">
                            Evidence
                          </p>
                          <p className="text-[11px] font-mono text-white/35 leading-relaxed">
                            {step.evidence}
                          </p>
                        </div>
                      )}

                      {confidencePerStep[i] !== undefined && (
                        <ConfidenceBar value={confidencePerStep[i]} />
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
}`;
