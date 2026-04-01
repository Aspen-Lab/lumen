"use client";

import { motion } from "framer-motion";

interface BlueprintConnectorProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  side: "left" | "right";
  laneIndex: number;
  active: boolean;
  delay: number;
}

export function BlueprintConnector({
  fromX, fromY, toX, toY, side, laneIndex, active, delay,
}: BlueprintConnectorProps) {
  const r = 6;
  const path = buildOrthogonalPath(fromX, fromY, toX, toY, side, laneIndex, r);

  return (
    <motion.path
      d={path}
      fill="none"
      stroke="white"
      strokeWidth={active ? 1 : 0.5}
      strokeOpacity={active ? 0.25 : 0.08}
      strokeDasharray="4 4"
      initial={{ opacity: 0, pathLength: 0 }}
      animate={{ opacity: 1, pathLength: 1 }}
      transition={{ delay, duration: 0.6 }}
      style={{ transition: "stroke-opacity 0.2s, stroke-width 0.2s" }}
    />
  );
}

function buildOrthogonalPath(
  fromX: number, fromY: number,
  toX: number, toY: number,
  side: "left" | "right",
  lane: number,
  r: number
): string {
  const dy = toY - fromY;
  const signY = dy === 0 ? 0 : dy > 0 ? 1 : -1;

  if (signY === 0) {
    return `M ${fromX} ${fromY} L ${toX} ${toY}`;
  }

  if (side === "right") {
    // Node is left of center → exit right → lane → turn → arrive
    const laneX = fromX + 30 + lane * 18;
    return `M ${fromX} ${fromY} ` +
      `L ${laneX - r} ${fromY} ` +
      `Q ${laneX} ${fromY} ${laneX} ${fromY + signY * r} ` +
      `L ${laneX} ${toY - signY * r} ` +
      `Q ${laneX} ${toY} ${laneX + r} ${toY} ` +
      `L ${toX} ${toY}`;
  }

  // side === "left" → node is right of center → exit left
  const laneX = fromX - 30 - lane * 18;
  return `M ${fromX} ${fromY} ` +
    `L ${laneX + r} ${fromY} ` +
    `Q ${laneX} ${fromY} ${laneX} ${fromY + signY * r} ` +
    `L ${laneX} ${toY - signY * r} ` +
    `Q ${laneX} ${toY} ${laneX - r} ${toY} ` +
    `L ${toX} ${toY}`;
}
