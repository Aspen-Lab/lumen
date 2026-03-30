"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Copy, Check } from "lucide-react";
import { getComponentBySlug } from "@/data/registry";
import { DeviceToggle, type Device } from "@/components/site/DeviceToggle";
import { PreviewFrame } from "@/components/site/PreviewFrame";
import { ControlsPanel } from "@/components/site/ControlsPanel";
import { ControlDefinition } from "@/types/controls";
import { cn } from "@/lib/utils";
import { CodeHighlight } from "@/components/site/CodeHighlight";

import { ThinkingLoader } from "@/components/library/reasoning/ThinkingLoader";
import { ThinkingLoaderMobile } from "@/components/library/reasoning/ThinkingLoader/mobile";
import { thinkingLoaderControls } from "@/components/library/reasoning/ThinkingLoader/controls";
import { thinkingLoaderCode } from "@/components/library/reasoning/ThinkingLoader/code";

import { ReasoningSteps } from "@/components/library/reasoning/ReasoningSteps";
import { ReasoningStepsMobile } from "@/components/library/reasoning/ReasoningSteps/mobile";
import { reasoningStepsControls } from "@/components/library/reasoning/ReasoningSteps/controls";
import { reasoningStepsCode } from "@/components/library/reasoning/ReasoningSteps/code";

import { DecisionCard } from "@/components/library/decision/DecisionCard";
import { DecisionCardMobile } from "@/components/library/decision/DecisionCard/mobile";
import { decisionCardControls } from "@/components/library/decision/DecisionCard/controls";
import { decisionCardCode } from "@/components/library/decision/DecisionCard/code";

import { ConfidenceMeter } from "@/components/library/decision/ConfidenceMeter";
import { ConfidenceMeterMobile } from "@/components/library/decision/ConfidenceMeter/mobile";
import { confidenceMeterControls } from "@/components/library/decision/ConfidenceMeter/controls";
import { confidenceMeterCode } from "@/components/library/decision/ConfidenceMeter/code";

import { ResultReveal } from "@/components/library/output/ResultReveal";
import { ResultRevealMobile } from "@/components/library/output/ResultReveal/mobile";
import { resultRevealControls } from "@/components/library/output/ResultReveal/controls";
import { resultRevealCode } from "@/components/library/output/ResultReveal/code";

import { InsightStack } from "@/components/library/output/InsightStack";
import { InsightStackMobile } from "@/components/library/output/InsightStack/mobile";
import { insightStackControls } from "@/components/library/output/InsightStack/controls";
import { insightStackCode } from "@/components/library/output/InsightStack/code";

import { SmartCTA } from "@/components/library/action/SmartCTA";
import { SmartCTAMobile } from "@/components/library/action/SmartCTA/mobile";
import { smartCTAControls } from "@/components/library/action/SmartCTA/controls";
import { smartCTACode } from "@/components/library/action/SmartCTA/code";

import { ProgressiveBlurReveal } from "@/components/library/motion/ProgressiveBlurReveal";
import { ProgressiveBlurRevealMobile } from "@/components/library/motion/ProgressiveBlurReveal/mobile";
import { progressiveBlurRevealControls } from "@/components/library/motion/ProgressiveBlurReveal/controls";
import { progressiveBlurRevealCode } from "@/components/library/motion/ProgressiveBlurReveal/code";

interface ComponentEntry {
  desktop: React.ComponentType<Record<string, unknown>>;
  mobile: React.ComponentType<Record<string, unknown>>;
  controls: ControlDefinition[];
  code: string;
}

const componentMap: Record<string, ComponentEntry> = {
  "thinking-loader": {
    desktop: ThinkingLoader as React.ComponentType<Record<string, unknown>>,
    mobile: ThinkingLoaderMobile as React.ComponentType<Record<string, unknown>>,
    controls: thinkingLoaderControls,
    code: thinkingLoaderCode,
  },
  "reasoning-steps": {
    desktop: ReasoningSteps as React.ComponentType<Record<string, unknown>>,
    mobile: ReasoningStepsMobile as React.ComponentType<Record<string, unknown>>,
    controls: reasoningStepsControls,
    code: reasoningStepsCode,
  },
  "decision-card": {
    desktop: DecisionCard as React.ComponentType<Record<string, unknown>>,
    mobile: DecisionCardMobile as React.ComponentType<Record<string, unknown>>,
    controls: decisionCardControls,
    code: decisionCardCode,
  },
  "confidence-meter": {
    desktop: ConfidenceMeter as React.ComponentType<Record<string, unknown>>,
    mobile: ConfidenceMeterMobile as React.ComponentType<Record<string, unknown>>,
    controls: confidenceMeterControls,
    code: confidenceMeterCode,
  },
  "result-reveal": {
    desktop: ResultReveal as React.ComponentType<Record<string, unknown>>,
    mobile: ResultRevealMobile as React.ComponentType<Record<string, unknown>>,
    controls: resultRevealControls,
    code: resultRevealCode,
  },
  "insight-stack": {
    desktop: InsightStack as React.ComponentType<Record<string, unknown>>,
    mobile: InsightStackMobile as React.ComponentType<Record<string, unknown>>,
    controls: insightStackControls,
    code: insightStackCode,
  },
  "smart-cta": {
    desktop: SmartCTA as React.ComponentType<Record<string, unknown>>,
    mobile: SmartCTAMobile as React.ComponentType<Record<string, unknown>>,
    controls: smartCTAControls,
    code: smartCTACode,
  },
  "progressive-blur-reveal": {
    desktop: ProgressiveBlurReveal as React.ComponentType<Record<string, unknown>>,
    mobile: ProgressiveBlurRevealMobile as React.ComponentType<Record<string, unknown>>,
    controls: progressiveBlurRevealControls,
    code: progressiveBlurRevealCode,
  },
};

type ViewTab = "preview" | "code";

export default function ComponentPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [device, setDevice] = useState<Device>("desktop");
  const [view, setView] = useState<ViewTab>("preview");
  const [copied, setCopied] = useState(false);

  const meta = getComponentBySlug(slug);
  const entry = componentMap[slug];

  const defaultValues = useMemo(() => {
    if (!entry) return {};
    const vals: Record<string, unknown> = {};
    entry.controls.forEach((c) => {
      vals[c.key] = c.default;
    });
    return vals;
  }, [entry]);

  const [controlValues, setControlValues] = useState<Record<string, unknown>>(defaultValues);

  if (!meta || !entry) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-white/25 text-sm">Component not found.</p>
      </div>
    );
  }

  const handleControlChange = (key: string, value: unknown) => {
    setControlValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(entry.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const Component = device === "desktop" ? entry.desktop : entry.mobile;

  return (
    <div className="space-y-8">
      {/* Header — big name like React Bits */}
      <div className="pt-2">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-3">
          {meta.name}
        </h1>
        <p className="text-base text-white/35">{meta.description}</p>
      </div>

      {/* Pill toggle bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-xl bg-surface-2/80 p-1">
          {(["preview", "code"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                view === tab
                  ? "bg-surface-4/80 text-white shadow-sm"
                  : "text-white/30 hover:text-white/55"
              )}
            >
              {tab === "preview" ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  Preview
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  Code
                </>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {view === "preview" ? (
            <DeviceToggle device={device} onChange={setDevice} />
          ) : (
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all"
            >
              {copied ? <Check size={14} className="text-white/70" /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
      </div>

      {/* Main window */}
      <div className="rounded-2xl bg-surface-1/60 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/20">
        {view === "preview" ? (
          <div
            className={cn(
              "min-h-[460px] flex items-center justify-center p-12 transition-all duration-300",
              device === "mobile" && "max-w-[375px] mx-auto"
            )}
          >
            <Component {...controlValues} />
          </div>
        ) : (
          <CodeHighlight code={entry.code} />
        )}
      </div>

      {/* Controls — "Customize" section */}
      {entry.controls.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white/80 mb-4">Customize</h2>
          <ControlsPanel controls={entry.controls} values={controlValues} onChange={handleControlChange} />
        </div>
      )}
    </div>
  );
}
