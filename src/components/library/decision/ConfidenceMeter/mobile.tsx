"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import type { BreakdownItem, ConfidenceMeterProps } from "./index";

// Mobile arc geometry — compact semicircle
const CX = 72;
const CY = 72;
const R = 54;

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

function buildArc(startAngle: number, endAngle: number) {
  const start = arcPoint(startAngle);
  const end = arcPoint(endAngle);
  const delta = endAngle - startAngle;
  const largeArc = Math.abs(delta) > 180 ? 1 : 0;
  const sweep = delta >= 0 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${R} ${R} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
}

const GAUGE_START = -200 + 90; // -110°
const GAUGE_END = 90; // 90°

function confidenceColor(v: number): string {
  if (v < 0.3) return "#EF4444";
  if (v < 0.6) return "#FB7A29";
  return "#0BE09B";
}

function confidenceLabel(v: number): string {
  if (v < 0.3) return "Low";
  if (v < 0.6) return "Medium";
  return "High";
}

export function ConfidenceMeterMobile({
  confidence = 0.72,
  label = "Overall Confidence",
  breakdown,
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

  const fillAngle = useTransform(springValue, [0, 1], [GAUGE_START, GAUGE_END]);

  const [displayPct, setDisplayPct] = useState(0);
  useEffect(() => {
    const unsub = springValue.on("change", (v) => {
      setDisplayPct(Math.round(v * 100));
    });
    return unsub;
  }, [springValue]);

  const [arcPath, setArcPath] = useState("");
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

  const color = confidenceColor(safeConfidence);
  const isHigh = safeConfidence > 0.6;
  const showGlow = glowOnHigh && isHigh;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-4",
        "px-5 py-5 rounded-2xl border border-[--border-default] bg-bg-elevated",
        "w-full max-w-[280px]"
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
              "radial-gradient(ellipse at 50% 40%, rgba(11,224,155,0.08) 0%, transparent 65%)",
          }}
        />
      )}

      {/* Label */}
      <span className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[--text-muted] self-start">
        {label}
      </span>

      {/* Compact arc gauge */}
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="18 18 108 78"
          width="180"
          height="100"
          className="overflow-visible"
        >
          {/* Track */}
          <path
            d={buildArc(GAUGE_START, GAUGE_END)}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Fill */}
          {arcPath && (
            <path
              d={arcPath}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              style={{
                filter: showGlow ? `drop-shadow(0 0 5px ${color}99)` : undefined,
                transition: "stroke 0.4s ease",
              }}
            />
          )}
          {/* Tip dot */}
          {arcPath && (
            <MobileTipDot fillAngle={fillAngle} color={color} showGlow={showGlow} />
          )}
        </svg>

        {/* Center readout */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pb-0.5">
          <span
            className="text-[1.75rem] font-bold font-mono leading-none tabular-nums"
            style={{ color, transition: "color 0.4s ease" }}
          >
            {displayPct}
            <span className="text-sm font-normal" style={{ color: `${color}70` }}>
              %
            </span>
          </span>
        </div>
      </div>

      {/* Confidence badge */}
      <div className="flex items-center gap-2 self-stretch justify-between">
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-lg font-mono"
          style={{
            color,
            background: `${color}18`,
            border: `1px solid ${color}30`,
          }}
        >
          {confidenceLabel(safeConfidence)}
        </span>

        {/* Mini breakdown dots */}
        {breakdown && breakdown.length > 0 && (
          <div className="flex items-center gap-1">
            {breakdown.slice(0, 4).map((item, i) => {
              const dotColor = confidenceColor(item.value);
              return (
                <motion.div
                  key={item.label}
                  className="w-2 h-2 rounded-full"
                  style={{ background: dotColor, opacity: 0.7 + item.value * 0.3 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.06, type: "spring", stiffness: 300, damping: 20 }}
                  title={`${item.label}: ${Math.round(item.value * 100)}%`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function MobileTipDot({
  fillAngle,
  color,
  showGlow,
}: {
  fillAngle: MotionValue<number>;
  color: string;
  showGlow: boolean;
}) {
  const [pos, setPos] = useState(arcPoint(GAUGE_START));

  useEffect(() => {
    const unsub = fillAngle.on("change", (angle) => {
      setPos(arcPoint(angle));
    });
    return unsub;
  }, [fillAngle]);

  return (
    <circle
      cx={pos.x}
      cy={pos.y}
      r={4}
      fill={color}
      style={{
        filter: showGlow ? `drop-shadow(0 0 3px ${color})` : undefined,
        transition: "fill 0.4s ease",
      }}
    />
  );
}
