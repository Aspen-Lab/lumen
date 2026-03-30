export const statusDotCode = `"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type StatusDotState = "active" | "complete" | "pending" | "error";
export type StatusDotSize  = "sm" | "md" | "lg";

export interface StatusDotProps {
  state?: StatusDotState;
  size?: StatusDotSize;
  pulse?: boolean;
  color?: string;
  className?: string;
}

const STATE_COLORS: Record<StatusDotState, string> = {
  active:   "#0BE09B",
  complete: "#FFFFFF",
  pending:  "rgba(255,255,255,0.20)",
  error:    "#EF4444",
};

const SIZE_PX: Record<StatusDotSize, number> = {
  sm: 6,
  md: 8,
  lg: 12,
};

export function StatusDot({
  state = "active",
  size = "md",
  pulse = false,
  color,
  className,
}: StatusDotProps) {
  const resolvedColor = color ?? STATE_COLORS[state];
  const px = SIZE_PX[size];
  const ringPx = px + 8;

  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: ringPx, height: ringPx }}
    >
      {pulse && (
        <motion.span
          className="absolute rounded-full"
          style={{
            width: ringPx,
            height: ringPx,
            backgroundColor: resolvedColor,
            opacity: 0,
          }}
          animate={{ scale: [1, 1.6, 1.6], opacity: [0.5, 0, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      <span
        className="rounded-full shrink-0"
        style={{
          width: px,
          height: px,
          backgroundColor: resolvedColor,
        }}
      />
    </span>
  );
}
`;
