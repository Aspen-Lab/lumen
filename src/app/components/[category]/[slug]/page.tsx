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

import { PromptInput } from "@/components/library/action/PromptInput";
import { PromptInputMobile } from "@/components/library/action/PromptInput/mobile";
import { promptInputControls } from "@/components/library/action/PromptInput/controls";
import { promptInputCode } from "@/components/library/action/PromptInput/code";

import { GlowButton } from "@/components/library/primitives/GlowButton";
import { glowButtonControls } from "@/components/library/primitives/GlowButton/controls";
import { glowButtonCode } from "@/components/library/primitives/GlowButton/code";

import { GhostButton } from "@/components/library/primitives/GhostButton";
import { ghostButtonControls } from "@/components/library/primitives/GhostButton/controls";
import { ghostButtonCode } from "@/components/library/primitives/GhostButton/code";

import { Toggle as TogglePrimitive } from "@/components/library/primitives/Toggle";
import { toggleControls } from "@/components/library/primitives/Toggle/controls";
import { toggleCode } from "@/components/library/primitives/Toggle/code";

import { Slider as SliderPrimitive } from "@/components/library/primitives/Slider";
import { sliderControls } from "@/components/library/primitives/Slider/controls";
import { sliderCode } from "@/components/library/primitives/Slider/code";

import { Badge } from "@/components/library/primitives/Badge";
import { badgeControls } from "@/components/library/primitives/Badge/controls";
import { badgeCode } from "@/components/library/primitives/Badge/code";

import { StatusDot } from "@/components/library/primitives/StatusDot";
import { statusDotControls } from "@/components/library/primitives/StatusDot/controls";
import { statusDotCode } from "@/components/library/primitives/StatusDot/code";

import { ProgressBar } from "@/components/library/primitives/ProgressBar";
import { progressBarControls } from "@/components/library/primitives/ProgressBar/controls";
import { progressBarCode } from "@/components/library/primitives/ProgressBar/code";

import { ArcGauge } from "@/components/library/primitives/ArcGauge";
import { arcGaugeControls } from "@/components/library/primitives/ArcGauge/controls";
import { arcGaugeCode } from "@/components/library/primitives/ArcGauge/code";

import { TextInput } from "@/components/library/primitives/TextInput";
import { textInputControls } from "@/components/library/primitives/TextInput/controls";
import { textInputCode } from "@/components/library/primitives/TextInput/code";

import { Tooltip as TooltipPrimitive } from "@/components/library/primitives/Tooltip";
import { tooltipControls } from "@/components/library/primitives/Tooltip/controls";
import { tooltipCode } from "@/components/library/primitives/Tooltip/code";

import { Popover as PopoverPrimitive } from "@/components/library/primitives/Popover";
import { popoverControls } from "@/components/library/primitives/Popover/controls";
import { popoverCode } from "@/components/library/primitives/Popover/code";

import { Tag } from "@/components/library/primitives/Tag";
import { tagControls } from "@/components/library/primitives/Tag/controls";
import { tagCode } from "@/components/library/primitives/Tag/code";

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
  "prompt-input": {
    desktop: PromptInput as React.ComponentType<Record<string, unknown>>,
    mobile: PromptInputMobile as React.ComponentType<Record<string, unknown>>,
    controls: promptInputControls,
    code: promptInputCode,
  },
  "glow-button": {
    desktop: GlowButton as React.ComponentType<Record<string, unknown>>,
    mobile: GlowButton as React.ComponentType<Record<string, unknown>>,
    controls: glowButtonControls,
    code: glowButtonCode,
  },
  "ghost-button": {
    desktop: GhostButton as React.ComponentType<Record<string, unknown>>,
    mobile: GhostButton as React.ComponentType<Record<string, unknown>>,
    controls: ghostButtonControls,
    code: ghostButtonCode,
  },
  "toggle": {
    desktop: TogglePrimitive as React.ComponentType<Record<string, unknown>>,
    mobile: TogglePrimitive as React.ComponentType<Record<string, unknown>>,
    controls: toggleControls,
    code: toggleCode,
  },
  "slider": {
    desktop: SliderPrimitive as React.ComponentType<Record<string, unknown>>,
    mobile: SliderPrimitive as React.ComponentType<Record<string, unknown>>,
    controls: sliderControls,
    code: sliderCode,
  },
  "badge": {
    desktop: Badge as React.ComponentType<Record<string, unknown>>,
    mobile: Badge as React.ComponentType<Record<string, unknown>>,
    controls: badgeControls,
    code: badgeCode,
  },
  "status-dot": {
    desktop: StatusDot as React.ComponentType<Record<string, unknown>>,
    mobile: StatusDot as React.ComponentType<Record<string, unknown>>,
    controls: statusDotControls,
    code: statusDotCode,
  },
  "progress-bar": {
    desktop: ProgressBar as React.ComponentType<Record<string, unknown>>,
    mobile: ProgressBar as React.ComponentType<Record<string, unknown>>,
    controls: progressBarControls,
    code: progressBarCode,
  },
  "arc-gauge": {
    desktop: ArcGauge as React.ComponentType<Record<string, unknown>>,
    mobile: ArcGauge as React.ComponentType<Record<string, unknown>>,
    controls: arcGaugeControls,
    code: arcGaugeCode,
  },
  "text-input": {
    desktop: TextInput as React.ComponentType<Record<string, unknown>>,
    mobile: TextInput as React.ComponentType<Record<string, unknown>>,
    controls: textInputControls,
    code: textInputCode,
  },
  "tooltip": {
    desktop: TooltipPrimitive as React.ComponentType<Record<string, unknown>>,
    mobile: TooltipPrimitive as React.ComponentType<Record<string, unknown>>,
    controls: tooltipControls,
    code: tooltipCode,
  },
  "popover": {
    desktop: PopoverPrimitive as React.ComponentType<Record<string, unknown>>,
    mobile: PopoverPrimitive as React.ComponentType<Record<string, unknown>>,
    controls: popoverControls,
    code: popoverCode,
  },
  "tag": {
    desktop: Tag as React.ComponentType<Record<string, unknown>>,
    mobile: Tag as React.ComponentType<Record<string, unknown>>,
    controls: tagControls,
    code: tagCode,
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
          <div className="relative">
            {/* Grid background */}
            <div className="absolute inset-0 opacity-[0.03]"
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
              className={cn(
                "relative z-[1] min-h-[460px] flex items-center justify-center p-12 transition-all duration-300",
                device === "mobile" && "max-w-[375px] mx-auto"
              )}
            >
              <Component {...controlValues} />
            </div>

            {/* Bottom info bar */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none z-[2]">
              <span className="text-[10px] font-mono text-white/[0.08] uppercase tracking-wider">
                {device} preview
              </span>
              <span className="text-[10px] font-mono text-white/[0.08]">
                {device === "desktop" ? "960×auto" : "375×auto"}
              </span>
            </div>
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
