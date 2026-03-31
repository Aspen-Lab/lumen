"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { PromptInput } from "@/components/library/action/PromptInput";
import { ThinkingLoader } from "@/components/library/reasoning/ThinkingLoader";
import { ReasoningSteps } from "@/components/library/reasoning/ReasoningSteps";
import { DecisionCard } from "@/components/library/decision/DecisionCard";
import { ResultReveal } from "@/components/library/output/ResultReveal";

const stages = [
  {
    id: "input",
    number: "01",
    label: "Input",
    title: "The user speaks",
    description: "Every AI interaction begins with intent. The prompt input captures context, supports multi-modal input, and communicates readiness.",
    component: PromptInput,
  },
  {
    id: "processing",
    number: "02",
    label: "Processing",
    title: "The model thinks",
    description: "While the AI reasons, the interface must communicate progress without false certainty. Pulsing rhythms map to perceived urgency.",
    component: ThinkingLoader,
  },
  {
    id: "reasoning",
    number: "03",
    label: "Reasoning",
    title: "Transparency builds trust",
    description: "Step-by-step reasoning reveal lets users verify the AI's logic. Each step carries confidence — making the invisible visible.",
    component: ReasoningSteps,
  },
  {
    id: "decision",
    number: "04",
    label: "Decision",
    title: "Confidence meets context",
    description: "AI recommendations must present tradeoffs honestly. Confidence meters calibrate expectations. Cards structure complex decisions.",
    component: DecisionCard,
  },
  {
    id: "output",
    number: "05",
    label: "Output",
    title: "The reveal",
    description: "Progressive disclosure prevents overwhelm. Blur-to-clear transitions give the brain time to process. The answer unfolds, not dumps.",
    component: ResultReveal,
  },
];

function StageSection({
  stage,
  index,
}: {
  stage: typeof stages[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [60, 0, 0, -30]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.96, 1, 1, 0.98]);

  const Component = stage.component;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, scale }}
      className="min-h-[90vh] flex items-center py-20"
    >
      <div className={cn(
        "w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center",
        !isEven && "lg:direction-rtl"
      )}>
        {/* Text side */}
        <div className={cn("space-y-6", !isEven && "lg:order-2 lg:text-left lg:direction-ltr")}>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-white/15">{stage.number}</span>
            <div className="h-px flex-1 max-w-[40px] bg-white/[0.08]" />
            <span className="text-xs font-mono text-white/25 uppercase tracking-widest">{stage.label}</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white/90 tracking-tight">
            {stage.title}
          </h2>
          <p className="text-base text-white/30 leading-relaxed max-w-md">
            {stage.description}
          </p>
          <Link
            href={`/components/${getCategory(stage.id)}/${getSlug(stage.id)}`}
            className="inline-flex items-center gap-2 text-sm text-white/20 hover:text-white/50 transition-colors"
          >
            View component
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

        {/* Component side */}
        <div className={cn(
          "relative rounded-2xl bg-surface-1/40 overflow-hidden",
          !isEven && "lg:order-1 lg:direction-ltr"
        )}>
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
              `,
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative z-[1] flex items-center justify-center p-8 lg:p-12 min-h-[360px]">
            <div className="w-full max-w-md pointer-events-none select-none">
              <Component />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function getCategory(stageId: string): string {
  const map: Record<string, string> = {
    input: "action",
    processing: "reasoning",
    reasoning: "reasoning",
    decision: "decision",
    output: "output",
  };
  return map[stageId] || "action";
}

function getSlug(stageId: string): string {
  const map: Record<string, string> = {
    input: "prompt-input",
    processing: "thinking-loader",
    reasoning: "reasoning-steps",
    decision: "decision-card",
    output: "result-reveal",
  };
  return map[stageId] || "prompt-input";
}

export default function FlowPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  return (
    <div ref={containerRef} className="-mx-6 lg:-mx-10 -my-8 lg:-my-10">
      {/* Hero */}
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="text-xs font-mono text-white/15 uppercase tracking-[0.3em]">
            The AI Experience
          </div>
          <h1 className="text-[48px] lg:text-[64px] font-bold text-white tracking-tight leading-none">
            Input to Output
          </h1>
          <p className="text-lg text-white/30 max-w-lg mx-auto leading-relaxed">
            Every AI interaction follows a flow. Lumen provides the interface
            components for each stage — designed to build trust and clarity.
          </p>
          <div className="pt-4 flex items-center gap-3 justify-center">
            {stages.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-white/20">{s.label}</span>
                {i < stages.length - 1 && (
                  <div className="w-6 h-px bg-white/[0.08]" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-5 h-8 rounded-full border border-white/[0.1] flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/20" />
          </div>
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="fixed top-14 left-0 right-0 z-40 h-px">
        <motion.div
          className="h-full bg-white/20 origin-left"
          style={{ scaleX: scrollYProgress }}
        />
      </div>

      {/* Stages */}
      <div className="px-6 lg:px-10 max-w-content mx-auto">
        {stages.map((stage, i) => (
          <StageSection key={stage.id} stage={stage} index={i} />
        ))}
      </div>

      {/* CTA */}
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-white/90 tracking-tight">
            Build with Lumen
          </h2>
          <p className="text-base text-white/30 max-w-md mx-auto">
            23 components. 12 primitives. 3 patterns.
            <br />
            Designed for AI products that respect their users.
          </p>
          <div className="flex items-center gap-3 justify-center pt-2">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-white/[0.08] text-sm font-medium text-white/70 hover:bg-white/[0.12] hover:text-white transition-all"
            >
              Browse Components
            </Link>
            <Link
              href="/patterns"
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/30 hover:text-white/60 transition-all"
            >
              View Patterns
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
