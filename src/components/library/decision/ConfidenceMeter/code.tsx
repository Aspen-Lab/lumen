const CONFIDENCE_METER_SOURCE = `"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BreakdownItem {
  label: string;
  value: number; // 0–1
}

export interface ConfidenceMeterProps {
  confidence?: number;       // 0–1
  label?: string;
  breakdown?: BreakdownItem[];
  fillSpeed?: number;        // 0.3–3
  overshoot?: number;        // 0–0.3
  glowOnHigh?: boolean;
}

const DEFAULT_BREAKDOWN: BreakdownItem[] = [
  { label: "Data quality",      value: 0.91 },
  { label: "Source consensus",  value: 0.78 },
  { label: "Recency",           value: 0.65 },
  { label: "Context relevance", value: 0.88 },
];

// --- Arc geometry (200° sweep) ---
const CX = 110, CY = 110, R = 80;
const GAUGE_START = -110; // degrees in SVG coords
const GAUGE_END   =  90;

function toRad(d: number) { return (d * Math.PI) / 180; }

function arcPoint(deg: number) {
  return { x: CX + R * Math.cos(toRad(deg)), y: CY + R * Math.sin(toRad(deg)) };
}

function buildArc(s: number, e: number) {
  const p1 = arcPoint(s), p2 = arcPoint(e);
  const delta = e - s;
  return \`M \${p1.x} \${p1.y} A \${R} \${R} 0 \${Math.abs(delta) > 180 ? 1 : 0} \${delta >= 0 ? 1 : 0} \${p2.x} \${p2.y}\`;
}

function color(v: number) {
  return v < 0.3 ? "#EF4444" : v < 0.6 ? "#FB7A29" : "#0BE09B";
}

export function ConfidenceMeter({
  confidence = 0.72,
  label = "Overall Confidence",
  breakdown = DEFAULT_BREAKDOWN,
  fillSpeed = 1,
  overshoot = 0.08,
  glowOnHigh = true,
}: ConfidenceMeterProps) {
  const c     = Math.max(0, Math.min(1, confidence));
  const speed = Math.max(0.3, Math.min(3, fillSpeed));
  const over  = Math.max(0, Math.min(0.3, overshoot));

  const spring = useSpring(0, {
    stiffness: 60 * speed,
    damping: 18 + (1 - over / 0.3) * 14,
    mass: 1,
  });

  useEffect(() => { spring.set(c); }, [c, spring]);

  const fillAngle = useTransform(spring, [0, 1], [GAUGE_START, GAUGE_END]);
  const [pct, setPct]       = useState(0);
  const [arc, setArc]       = useState("");
  const [tipPos, setTipPos] = useState(arcPoint(GAUGE_START));

  useEffect(() => {
    const u1 = spring.on("change",    (v) => setPct(Math.round(v * 100)));
    const u2 = fillAngle.on("change", (a) => {
      if (a > GAUGE_START) { setArc(buildArc(GAUGE_START, a)); setTipPos(arcPoint(a)); }
      else setArc("");
    });
    return () => { u1(); u2(); };
  }, [spring, fillAngle]);

  const clr     = color(c);
  const showGlow = glowOnHigh && c > 0.6;

  return (
    <div className={cn(
      "relative flex flex-col items-center gap-6 px-8 py-8",
      "rounded-2xl border border-white/[0.06] bg-[#161618] w-full max-w-[520px]"
    )}>
      {showGlow && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(11,224,155,0.07) 0%, transparent 65%)" }}
        />
      )}

      <div className="w-full flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-white/55">
          {label}
        </span>
        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md"
          style={{ color: clr, background: clr + "18", border: \`1px solid \${clr}30\` }}>
          {c < 0.3 ? "Low" : c < 0.6 ? "Medium" : "High"}
        </span>
      </div>

      <div className="relative flex items-center justify-center">
        <svg viewBox="30 30 160 110" width="260" height="130" className="overflow-visible">
          <path d={buildArc(GAUGE_START, GAUGE_END)} fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeLinecap="round" />
          {arc && (
            <path d={arc} fill="none" stroke={clr} strokeWidth="10" strokeLinecap="round"
              style={{ filter: showGlow ? \`drop-shadow(0 0 6px \${clr}99)\` : undefined, transition: "stroke 0.4s ease" }} />
          )}
          {arc && (
            <circle cx={tipPos.x} cy={tipPos.y} r={5} fill={clr}
              style={{ filter: showGlow ? \`drop-shadow(0 0 4px \${clr})\` : undefined, transition: "fill 0.4s ease" }} />
          )}
        </svg>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pb-1">
          <span className="text-[2.2rem] font-bold font-mono leading-none tabular-nums"
            style={{ color: clr, transition: "color 0.4s ease" }}>
            {pct}<span className="text-lg font-normal" style={{ color: clr + "80" }}>%</span>
          </span>
        </div>
      </div>

      {breakdown.length > 0 && (
        <div className="w-full space-y-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/25 mb-3">
            Breakdown
          </div>
          {breakdown.map((item, i) => (
            <motion.div key={item.label} className="flex items-center gap-3"
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.3 }}>
              <span className="text-[11px] text-white/35 w-[120px] shrink-0 truncate">
                {item.label}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div className="h-full rounded-full"
                  style={{ background: clr, transformOrigin: "left center", transition: "background 0.4s ease" }}
                  initial={{ scaleX: 0 }} animate={{ scaleX: Math.max(0, Math.min(1, item.value)) }}
                  transition={{ delay: 0.2 + i * 0.07, duration: 0.6 / speed, ease: [0.34, 1.1, 0.64, 1] }} />
              </div>
              <span className="text-[11px] font-mono text-white/25 w-8 text-right tabular-nums">
                {Math.round(Math.max(0, Math.min(1, item.value)) * 100)}%
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}`;

export function generateConfidenceMeterCode(props: Record<string, unknown>): string {
  const defaults: Record<string, unknown> = {
    confidence: 0.72,
    fillSpeed: 1,
    overshoot: 0.08,
    glowOnHigh: true,
    highColor: "#0BE09B",
    midColor: "#FB7A29",
    lowColor: "#EF4444",
    trackColor: "#FFFFFF0F",
    labelColor: "",
    arcOpacity: 0.9,
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
<ConfidenceMeter${propsBlock}/>

// Full source code below...
${CONFIDENCE_METER_SOURCE}`;
}

export const confidenceMeterCode = generateConfidenceMeterCode({});
