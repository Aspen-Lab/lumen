export const arcGaugeCode = `"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ArcGaugeProps {
  /** 0 – 1 */
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export function ArcGauge({
  value,
  size = 160,
  strokeWidth = 8,
  color = "#0BE09B",
  trackColor = "rgba(255,255,255,0.06)",
  showLabel = true,
  animated = true,
  className,
}: ArcGaugeProps) {
  const clamped = Math.max(0, Math.min(1, value));

  const SWEEP_DEG  = 200;
  const START_DEG  = 90 + (360 - SWEEP_DEG) / 2;
  const END_DEG    = START_DEG + SWEEP_DEG;

  const cx = size / 2;
  const cy = size / 2;
  const r  = (size - strokeWidth * 2) / 2;

  function polarToXY(deg: number) {
    const rad = (deg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  const start = polarToXY(START_DEG);
  const end   = polarToXY(END_DEG);

  const trackPath =
    \`M \${start.x} \${start.y} A \${r} \${r} 0 1 1 \${end.x} \${end.y}\`;

  const circumference = (SWEEP_DEG / 360) * (2 * Math.PI * r);

  const spring = useSpring(animated ? 0 : clamped, {
    stiffness: 100,
    damping: 18,
    mass: 0.8,
  });

  useEffect(() => {
    if (animated) {
      spring.set(clamped);
    } else {
      spring.jump(clamped);
    }
  }, [animated, clamped, spring]);

  const dashOffset = useTransform(spring, (v) => circumference * (1 - v));
  const pctLabel   = useTransform(spring, (v) => \`\${Math.round(v * 100)}%\`);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={\`0 0 \${size} \${size}\`}
        fill="none"
        overflow="visible"
      >
        <path
          d={trackPath}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
        <motion.path
          d={trackPath}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: dashOffset,
          }}
        />
      </svg>

      {showLabel && (
        <motion.span
          className="absolute font-mono font-semibold tabular-nums"
          style={{
            fontSize: size * 0.14,
            color: "#FFFFFF",
            lineHeight: 1,
          }}
        >
          {pctLabel}
        </motion.span>
      )}
    </div>
  );
}
`;
