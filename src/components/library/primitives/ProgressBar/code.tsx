const STATIC_SOURCE = `"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  /** 0–1 */
  value: number;
  /** Spring-animate the fill from 0 on mount */
  animated?: boolean;
  /** Fill color */
  color?: string;
  /** Track background color */
  trackColor?: string;
  /** Track height in px */
  height?: number;
  /** Rounded ends */
  rounded?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  animated = false,
  color = "#0BE09B",
  trackColor = "rgba(255,255,255,0.06)",
  height = 4,
  rounded = true,
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, value));

  // Spring drives 0→1 when animated, otherwise instant
  const spring = useSpring(animated ? 0 : clamped, {
    stiffness: 120,
    damping: 20,
    mass: 0.8,
  });

  const widthPct = useTransform(spring, (v) => \`\${v * 100}%\`);

  // When animated, kick spring to target on mount / value change
  useEffect(() => {
    if (animated) {
      spring.set(clamped);
    } else {
      spring.jump(clamped);
    }
  }, [animated, clamped, spring]);

  const radius = rounded ? height / 2 : 0;

  return (
    <div
      className={cn("w-full overflow-hidden", className)}
      style={{
        height,
        borderRadius: radius,
        backgroundColor: trackColor,
      }}
      role="progressbar"
      aria-valuenow={Math.round(clamped * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        style={{
          width: widthPct,
          height: "100%",
          backgroundColor: color,
          borderRadius: radius,
        }}
      />
    </div>
  );
}`;

export function generateProgressBarCode(props: Record<string, unknown>): string {
  const defaults: Record<string, unknown> = {
    value: 0.6,
    height: 4,
    rounded: true,
    animated: false,
    color: "#0BE09B",
    trackColor: "rgba(255,255,255,0.06)",
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
  return `// Usage\n<ProgressBar${propsBlock}/>\n\n${STATIC_SOURCE}`;
}

export const progressBarCode = generateProgressBarCode({});
