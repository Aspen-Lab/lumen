"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { getPatternBySlug } from "@/data/patterns";
import { cn } from "@/lib/utils";

import { ThinkingLoader } from "@/components/library/reasoning/ThinkingLoader";
import { ReasoningSteps } from "@/components/library/reasoning/ReasoningSteps";
import { DecisionCard } from "@/components/library/decision/DecisionCard";
import { ConfidenceMeter } from "@/components/library/decision/ConfidenceMeter";
import { ResultReveal } from "@/components/library/output/ResultReveal";
import { InsightStack } from "@/components/library/output/InsightStack";
import { SmartCTA } from "@/components/library/action/SmartCTA";
import { PromptInput } from "@/components/library/action/PromptInput";

const componentMap: Record<string, React.ComponentType> = {
  "thinking-loader": ThinkingLoader,
  "reasoning-steps": ReasoningSteps,
  "decision-card": DecisionCard,
  "confidence-meter": ConfidenceMeter,
  "result-reveal": ResultReveal,
  "insight-stack": InsightStack,
  "smart-cta": SmartCTA,
  "prompt-input": PromptInput,
};

export default function PatternDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const pattern = getPatternBySlug(slug);

  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const advance = useCallback(() => {
    if (!pattern) return;
    setCurrentStep((prev) => {
      const next = prev + 1;
      if (next >= pattern.steps.length) {
        setPlaying(false);
        return prev;
      }
      return next;
    });
  }, [pattern]);

  useEffect(() => {
    if (!pattern || !playing) {
      clearTimer();
      return;
    }
    const step = pattern.steps[currentStep];
    if (!step) return;
    timeoutRef.current = setTimeout(() => {
      advance();
    }, step.duration);
    return () => clearTimer();
  }, [playing, currentStep, pattern, advance]);

  const handlePlayPause = () => {
    if (!pattern) return;
    // If we've finished and user hits play, restart
    if (!playing && currentStep >= pattern.steps.length - 1) {
      setCurrentStep(0);
      setPlaying(true);
      return;
    }
    setPlaying((p) => !p);
  };

  const handleRestart = () => {
    clearTimer();
    setCurrentStep(0);
    setPlaying(true);
  };

  if (!pattern) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-white/25 text-sm">Pattern not found.</p>
      </div>
    );
  }

  const step = pattern.steps[currentStep];
  const PreviewComponent = componentMap[step.componentSlug];
  const isFinished = !playing && currentStep === pattern.steps.length - 1;

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="pt-2 space-y-2">
        <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-3">
          Pattern
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          {pattern.name}
        </h1>
        <p className="text-base text-white/35">{pattern.description}</p>
      </div>

      {/* Timeline bar */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          {pattern.steps.map((s, i) => {
            const isPast = i < currentStep;
            const isCurrent = i === currentStep;
            return (
              <button
                key={i}
                onClick={() => {
                  clearTimer();
                  setCurrentStep(i);
                  setPlaying(false);
                }}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1.5 group",
                  "transition-all duration-200"
                )}
              >
                {/* Segment bar */}
                <div
                  className={cn(
                    "w-full h-1 rounded-full transition-all duration-300",
                    isCurrent
                      ? "bg-white/70"
                      : isPast
                      ? "bg-white/25"
                      : "bg-white/[0.07] group-hover:bg-white/[0.14]"
                  )}
                />
                {/* Label */}
                <span
                  className={cn(
                    "text-[10px] font-mono transition-colors duration-200",
                    isCurrent
                      ? "text-white/60"
                      : isPast
                      ? "text-white/25"
                      : "text-white/15 group-hover:text-white/30"
                  )}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        {/* Step indicator */}
        <div className="text-sm text-white/30 font-mono">
          Step {currentStep + 1} of {pattern.steps.length}
          <span className="text-white/15"> — </span>
          <span className="text-white/45">{step.label}</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {/* Restart */}
          <button
            onClick={handleRestart}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm",
              "text-white/25 hover:text-white/50 hover:bg-white/[0.04]",
              "transition-all duration-150"
            )}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
            </svg>
            Restart
          </button>

          {/* Play / Pause */}
          <button
            onClick={handlePlayPause}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
              "bg-white/[0.07] hover:bg-white/[0.11] text-white/60 hover:text-white/90",
              "transition-all duration-150 border border-white/[0.07]"
            )}
          >
            {playing ? (
              <>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                {isFinished ? "Play Again" : "Play"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="rounded-2xl bg-surface-1/60 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/20 border border-white/[0.04]">
        <div className="relative">
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Crosshair center lines */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-6 right-6 h-px bg-white/[0.03]" />
            <div className="absolute left-1/2 top-6 bottom-6 w-px bg-white/[0.03]" />
          </div>

          {/* Corner marks */}
          <div className="absolute top-4 left-4 w-5 h-5 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-px bg-white/[0.08]" />
            <div className="absolute top-0 left-0 h-full w-px bg-white/[0.08]" />
          </div>
          <div className="absolute top-4 right-4 w-5 h-5 pointer-events-none">
            <div className="absolute top-0 right-0 w-full h-px bg-white/[0.08]" />
            <div className="absolute top-0 right-0 h-full w-px bg-white/[0.08]" />
          </div>
          <div className="absolute bottom-4 left-4 w-5 h-5 pointer-events-none">
            <div className="absolute bottom-0 left-0 w-full h-px bg-white/[0.08]" />
            <div className="absolute bottom-0 left-0 h-full w-px bg-white/[0.08]" />
          </div>
          <div className="absolute bottom-4 right-4 w-5 h-5 pointer-events-none">
            <div className="absolute bottom-0 right-0 w-full h-px bg-white/[0.08]" />
            <div className="absolute bottom-0 right-0 h-full w-px bg-white/[0.08]" />
          </div>

          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-32 bg-white/[0.01] blur-3xl rounded-full pointer-events-none" />

          {/* Component */}
          <div
            key={`${pattern.slug}-step-${currentStep}`}
            className="relative z-[1] min-h-[460px] flex items-center justify-center p-12"
          >
            {PreviewComponent ? (
              <PreviewComponent />
            ) : (
              <p className="text-white/20 text-sm font-mono">
                Unknown component: {step.componentSlug}
              </p>
            )}
          </div>

          {/* Bottom info bar */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none z-[2]">
            <span className="text-[10px] font-mono text-white/[0.08] uppercase tracking-wider">
              {step.label}
            </span>
            <span className="text-[10px] font-mono text-white/[0.08]">
              {step.componentSlug}
            </span>
          </div>
        </div>
      </div>

      {/* Step navigation dots */}
      <div className="flex items-center justify-center gap-2 pb-4">
        {pattern.steps.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              clearTimer();
              setCurrentStep(i);
              setPlaying(false);
            }}
            title={s.label}
            className={cn(
              "rounded-full transition-all duration-200",
              i === currentStep
                ? "w-6 h-1.5 bg-white/50"
                : i < currentStep
                ? "w-1.5 h-1.5 bg-white/20 hover:bg-white/35"
                : "w-1.5 h-1.5 bg-white/[0.07] hover:bg-white/20"
            )}
          />
        ))}
      </div>
    </div>
  );
}
