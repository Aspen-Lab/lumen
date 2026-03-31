const DECISION_CARD_SOURCE = `"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────── */

type Urgency = "low" | "medium" | "high";
type EntryAnimation = "fade" | "slide" | "scale";

interface DecisionCardProps {
  confidence?: number;          // 0–1, controls color + arc fill
  urgency?: Urgency;            // low | medium | high
  recommendation?: string;      // AI recommendation text
  tradeoffs?: string[];         // list of tradeoff strings
  entryAnimation?: EntryAnimation;
  highlightPulse?: boolean;     // animated ring around card
  borderGlow?: boolean;         // confidence-colored border glow
}

/* ── Helpers ────────────────────────────────────────────────── */

function confidenceColor(c: number) {
  if (c >= 0.75) return "#0BE09B"; // green  — high confidence
  if (c >= 0.45) return "#0091FF"; // blue   — moderate
  return "#FB7A29";                // orange — low confidence
}

const urgencyConfig: Record<Urgency, { label: string; dot: string; badge: string }> = {
  low:    { label: "Low urgency",    dot: "bg-[#0BE09B]", badge: "bg-[rgba(11,224,155,0.08)] border-[rgba(11,224,155,0.18)] text-[#0BE09B]" },
  medium: { label: "Medium urgency", dot: "bg-[#0091FF]", badge: "bg-[rgba(0,145,255,0.08)] border-[rgba(0,145,255,0.18)] text-[#0091FF]"   },
  high:   { label: "High urgency",   dot: "bg-[#FB7A29]", badge: "bg-[rgba(251,122,41,0.08)] border-[rgba(251,122,41,0.18)] text-[#FB7A29]" },
};

const variants: Record<EntryAnimation, object> = {
  fade:  { initial: { opacity: 0 },               animate: { opacity: 1 },            exit: { opacity: 0 } },
  slide: { initial: { opacity: 0, y: 20 },         animate: { opacity: 1, y: 0 },      exit: { opacity: 0, y: -12 } },
  scale: { initial: { opacity: 0, scale: 0.94 },   animate: { opacity: 1, scale: 1 },  exit: { opacity: 0, scale: 0.96 } },
};

/* ── Confidence Arc SVG ─────────────────────────────────────── */

function ConfidenceArc({ value, color }: { value: number; color: string }) {
  const size = 80, stroke = 5, r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const arc = circumference * 0.75;
  const dash = arc * Math.max(0, Math.min(1, value));

  return (
    <svg width={size} height={size} viewBox={\`0 0 \${size} \${size}\`} style={{ transform: "rotate(135deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)"
        strokeWidth={stroke} strokeDasharray={\`\${arc} \${circumference - arc}\`} strokeLinecap="round" />
      <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
        strokeWidth={stroke} strokeLinecap="round"
        initial={{ strokeDasharray: \`0 \${circumference}\` }}
        animate={{ strokeDasharray: \`\${dash} \${circumference - dash}\` }}
        transition={{ duration: 1.1, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }} />
    </svg>
  );
}

/* ── Component ──────────────────────────────────────────────── */

export function DecisionCard({
  confidence = 0.82,
  urgency = "high",
  recommendation = "Deploy the new inference pipeline to production. Benchmarks show a 34% latency reduction with no accuracy regression.",
  tradeoffs = [
    "Cold-start overhead increases by ~120 ms on first request",
    "GPU memory footprint grows from 4.2 GB to 5.8 GB",
    "Rollback window is 48 h before config lock-in",
  ],
  entryAnimation = "slide",
  highlightPulse = false,
  borderGlow = true,
}: DecisionCardProps) {
  const color = confidenceColor(confidence);
  const pct = Math.round(confidence * 100);
  const urg = urgencyConfig[urgency];
  const anim = variants[entryAnimation];

  const isHighConf = confidence >= 0.75;
  const isLowConf  = confidence < 0.45;
  const glowColor   = isHighConf ? "rgba(11,224,155,0.18)" : isLowConf ? "rgba(251,122,41,0.18)" : "rgba(0,145,255,0.14)";
  const borderColor = isHighConf ? "rgba(11,224,155,0.28)" : isLowConf ? "rgba(251,122,41,0.28)" : "rgba(0,145,255,0.24)";

  return (
    <div className="w-full flex items-center justify-center p-6 min-h-[400px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={\`\${confidence}-\${urgency}-\${entryAnimation}\`}
          {...anim}
          transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
          className="w-full max-w-[860px] rounded-2xl border bg-[#111113] overflow-hidden relative"
          style={{
            borderColor: borderGlow ? borderColor : "rgba(255,255,255,0.07)",
            boxShadow: borderGlow
              ? \`0 0 0 1px \${borderColor}, 0 8px 40px \${glowColor}, inset 0 1px 0 rgba(255,255,255,0.04)\`
              : "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Pulse ring */}
          {highlightPulse && (
            <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
              animate={{ boxShadow: [\`0 0 0 0px \${glowColor}\`, \`0 0 0 8px transparent\`] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }} />
          )}

          {/* Top gradient strip */}
          <div className="h-px w-full"
            style={{ background: \`linear-gradient(90deg, transparent 0%, \${color}40 50%, transparent 100%)\` }} />

          {/* Horizontal layout */}
          <div className="flex flex-col md:flex-row">

            {/* Left — confidence + urgency */}
            <div className="md:w-[220px] shrink-0 flex flex-col items-center justify-center gap-4 p-6
              border-b md:border-b-0 md:border-r border-white/[0.05]">

              {/* Arc meter */}
              <div className="relative flex items-center justify-center">
                <ConfidenceArc value={confidence} color={color} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span className="font-mono font-bold tabular-nums leading-none"
                    style={{ fontSize: 22, color }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}>
                    {pct}%
                  </motion.span>
                  <span className="text-[10px] text-[rgba(255,255,255,0.35)] mt-0.5 font-mono">conf</span>
                </div>
              </div>

              {/* Urgency badge */}
              <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold", urg.badge)}>
                <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", urg.dot)} />
                {urg.label}
              </div>

              {/* Progress bar */}
              <div className="w-full px-2">
                <div className="h-1 rounded-full bg-white/[0.07] overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ background: color }}
                    initial={{ width: "0%" }} animate={{ width: \`\${pct}%\` }}
                    transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1], delay: 0.3 }} />
                </div>
              </div>
            </div>

            {/* Right — recommendation + tradeoffs */}
            <div className="flex-1 flex flex-col divide-y divide-white/[0.04]">

              <div className="p-5 flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[rgba(255,255,255,0.35)]">
                    AI Recommendation
                  </span>
                </div>
                <p className="text-[14px] leading-[1.65] text-[rgba(255,255,255,0.82)]">{recommendation}</p>
              </div>

              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[rgba(251,122,41,0.7)]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[rgba(255,255,255,0.35)]">
                    Tradeoffs &amp; Considerations
                  </span>
                </div>
                <ul className="space-y-2">
                  {tradeoffs.map((t, i) => (
                    <motion.li key={i} className="flex items-start gap-2.5"
                      initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.07, duration: 0.35 }}>
                      <span className="mt-[5px] w-1 h-1 rounded-full bg-[rgba(255,255,255,0.2)] shrink-0" />
                      <span className="text-[13px] leading-[1.6] text-[rgba(255,255,255,0.52)]">{t}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="px-5 py-3 flex items-center justify-end gap-2 bg-white/[0.015]">
                <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-[rgba(255,255,255,0.45)]
                  border border-white/[0.07] hover:border-white/[0.14] transition-all duration-150">
                  Dismiss
                </button>
                <button className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-150"
                  style={{ background: \`\${color}18\`, color, border: \`1px solid \${color}35\` }}>
                  Accept
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}`;

export function generateDecisionCardCode(props: Record<string, unknown>): string {
  const defaults: Record<string, unknown> = {
    confidence: 0.82,
    urgency: "high",
    entryAnimation: "slide",
    highlightPulse: false,
    borderGlow: true,
    highConfidenceColor: "#0BE09B",
    midConfidenceColor: "#0091FF",
    lowConfidenceColor: "#FB7A29",
    cardBackgroundColor: "#111113",
    textPrimaryColor: "#D1D1D1",
    textSecondaryColor: "#5A5A5A",
    tradeoffAccentColor: "#FB7A29",
    borderGlowColor: "#0BE09B",
    glowIntensity: 0.5,
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
<DecisionCard${propsBlock}/>

// Full source code below...
${DECISION_CARD_SOURCE}`;
}

export const decisionCardCode = generateDecisionCardCode({});
