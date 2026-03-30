"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BreakdownItem {
  label: string;
  value: number;
}

export interface ConfidenceMeterProps {
  confidence?: number;
  label?: string;
  breakdown?: BreakdownItem[];
  fillSpeed?: number;
  overshoot?: number;
  glowOnHigh?: boolean;
}

const DEFAULT_BREAKDOWN: BreakdownItem[] = [
  { label: "Data quality", value: 0.91 },
  { label: "Source consensus", value: 0.78 },
  { label: "Recency", value: 0.65 },
  { label: "Context relevance", value: 0.88 },
];

// Arc geometry — 200° sweep centered at the bottom of the SVG
const ARC_START_ANGLE = -200; // degrees from 3 o'clock (SVG convention)
const ARC_SWEEP = 200; // total degrees
const CX = 110;
const CY = 110;
const R = 80;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function arcPoint(angleDeg: number) {
  const rad = toRad(angleDeg);
  return {
    x: CX + R * Math.cos(rad),
    y: CY + R * Math.sin(rad),
  };
}

// Build an SVG arc path from startAngle to endAngle (degrees, SVG coord system)
function buildArc(startAngle: number, endAngle: number) {
  const start = arcPoint(startAngle);
  const end = arcPoint(endAngle);
  const delta = endAngle - startAngle;
  const largeArc = Math.abs(delta) > 180 ? 1 : 0;
  const sweep = delta >= 0 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${R} ${R} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
}

// Map 0-1 confidence to a color
function confidenceColor(v: number): string {
  if (v < 0.3) return "#EF4444"; // red
  if (v < 0.6) return "#FB7A29"; // orange
  return "#0BE09B"; // green
}

// Build the arc angles for the gauge
// The gauge starts at the left end and sweeps clockwise to the right end
// We use 200° sweep: from -200° to 0° (in standard math coords, but SVG inverts Y)
// Let's define the zero-point (empty) angle and the full-point angle
const GAUGE_START = -200 + 90; // = -110 degrees in SVG coords (upper-left)
const GAUGE_END = 90; // lower-right

export function ConfidenceMeter({
  confidence = 0.72,
  label = "Overall Confidence",
  breakdown = DEFAULT_BREAKDOWN,
  fillSpeed = 1,
  overshoot = 0.08,
  glowOnHigh = true,
}: ConfidenceMeterProps) {
  const safeConfidence = Math.max(0, Math.min(1, confidence));
  const safeFillSpeed = Math.max(0.3, Math.min(3, fillSpeed));
  const safeOvershoot = Math.max(0, Math.min(0.3, overshoot));

  const springConfig = {
    stiffness: 60 * safeFillSpeed,
    damping: 18 + (1 - safeOvershoot / 0.3) * 14,
    mass: 1,
  };

  const springValue = useSpring(0, springConfig);

  useEffect(() => {
    springValue.set(safeConfidence);
  }, [safeConfidence, springValue]);

  // Animated fill angle
  const fillAngle = useTransform(
    springValue,
    [0, 1],
    [GAUGE_START, GAUGE_END]
  );

  // Animated percentage text
  const [displayPct, setDisplayPct] = useState(0);
  useEffect(() => {
    const unsub = springValue.on("change", (v) => {
      setDisplayPct(Math.round(v * 100));
    });
    return unsub;
  }, [springValue]);

  const color = confidenceColor(safeConfidence);

  const isHigh = safeConfidence > 0.6;
  const showGlow = glowOnHigh && isHigh;

  // Animated arc path (updated via motion value subscriber)
  const [arcPath, setArcPath] = useState(buildArc(GAUGE_START, GAUGE_START));
  useEffect(() => {
    const unsub = fillAngle.on("change", (angle) => {
      if (angle > GAUGE_START) {
        setArcPath(buildArc(GAUGE_START, angle));
      } else {
        setArcPath("");
      }
    });
    return unsub;
  }, [fillAngle]);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-6",
        "px-8 py-8 rounded-2xl border border-[--border-default] bg-bg-elevated",
        "w-full max-w-[520px]"
      )}
    >
      {/* Ambient glow */}
      {showGlow && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(11,224,155,0.07) 0%, transparent 65%)",
          }}
        />
      )}

      {/* Top row: label */}
      <div className="w-full flex items-center justify-between">
        <span className="text-sm font-semibold text-[--text-secondary] tracking-wide uppercase text-[11px]">
          {label}
        </span>
        <span
          className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md"
          style={{
            color,
            background: `${color}18`,
            border: `1px solid ${color}30`,
          }}
        >
          {safeConfidence < 0.3 ? "Low" : safeConfidence < 0.6 ? "Medium" : "High"}
        </span>
      </div>

      {/* SVG Gauge */}
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="30 30 160 110"
          width="260"
          height="130"
          className="overflow-visible"
        >
          {/* Track */}
          <path
            d={buildArc(GAUGE_START, GAUGE_END)}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Fill */}
          {arcPath && (
            <path
              d={arcPath}
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              style={{
                filter: showGlow
                  ? `drop-shadow(0 0 6px ${color}99)`
                  : undefined,
                transition: "stroke 0.4s ease",
              }}
            />
          )}

          {/* Tip dot */}
          {arcPath && (
            <TipDot fillAngle={fillAngle} color={color} showGlow={showGlow} />
          )}
        </svg>

        {/* Center percentage */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pb-1">
          <span
            className="text-[2.2rem] font-bold font-mono leading-none tabular-nums"
            style={{ color, transition: "color 0.4s ease" }}
          >
            {displayPct}
            <span className="text-lg font-normal" style={{ color: `${color}80` }}>
              %
            </span>
          </span>
        </div>
      </div>

      {/* Breakdown bars */}
      {breakdown.length > 0 && (
        <div className="w-full space-y-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[--text-muted] mb-3">
            Breakdown
          </div>
          {breakdown.map((item, i) => (
            <BreakdownRow
              key={item.label}
              item={item}
              index={i}
              parentConfidence={safeConfidence}
              fillSpeed={safeFillSpeed}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Animated tip dot at the leading edge of the arc
function TipDot({
  fillAngle,
  color,
  showGlow,
}: {
  fillAngle: MotionValue<number>;
  color: string;
  showGlow: boolean;
}) {
  const [pos, setPos] = useState({ x: arcPoint(GAUGE_START).x, y: arcPoint(GAUGE_START).y });

  useEffect(() => {
    const unsub = fillAngle.on("change", (angle) => {
      const p = arcPoint(angle);
      setPos(p);
    });
    return unsub;
  }, [fillAngle]);

  return (
    <circle
      cx={pos.x}
      cy={pos.y}
      r={5}
      fill={color}
      style={{
        filter: showGlow ? `drop-shadow(0 0 4px ${color})` : undefined,
        transition: "fill 0.4s ease",
      }}
    />
  );
}

function BreakdownRow({
  item,
  index,
  parentConfidence,
  fillSpeed,
}: {
  item: BreakdownItem;
  index: number;
  parentConfidence: number;
  fillSpeed: number;
}) {
  const pct = Math.max(0, Math.min(1, item.value));
  const color = confidenceColor(parentConfidence);

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.07, duration: 0.3, ease: "easeOut" }}
    >
      <span className="text-[11px] text-[--text-tertiary] w-[120px] shrink-0 truncate">
        {item.label}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color, transition: "background 0.4s ease", transformOrigin: "left center" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: pct }}
          transition={{
            delay: 0.2 + index * 0.07,
            duration: 0.6 / fillSpeed,
            ease: [0.34, 1.1, 0.64, 1],
          }}
        />
      </div>
      <span className="text-[11px] font-mono text-[--text-muted] w-8 text-right tabular-nums">
        {Math.round(pct * 100)}%
      </span>
    </motion.div>
  );
}
