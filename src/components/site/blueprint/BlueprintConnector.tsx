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
  const path = buildPath(fromX, fromY, toX, toY, side, laneIndex);

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

function buildPath(
  nodeX: number, nodeY: number,
  portX: number, portY: number,
  side: "left" | "right",
  lane: number
): string {
  const r = 6;

  // Straight horizontal if same Y
  if (Math.abs(nodeY - portY) < 2) {
    return `M ${nodeX} ${nodeY} L ${portX} ${portY}`;
  }

  // Determine the lane X position (vertical segment)
  // Left-side nodes: lane runs between node and component, offset per lane
  // Right-side nodes: same but mirrored
  const laneGap = 20;

  if (side === "right") {
    // Node is LEFT of component. Exit right, lane midway to port.
    const midX = nodeX + (portX - nodeX) / 2;
    const laneX = midX + lane * laneGap;
    return orthogonal(nodeX, nodeY, laneX, portX, portY, r);
  } else {
    // Node is RIGHT of component. Exit left, lane midway to port.
    const midX = portX + (nodeX - portX) / 2;
    const laneX = midX - lane * laneGap;
    return orthogonal(nodeX, nodeY, laneX, portX, portY, r);
  }
}

// 3-segment orthogonal path: horizontal → vertical → horizontal
// with rounded corners at both bends
function orthogonal(
  startX: number, startY: number,
  bendX: number,
  endX: number, endY: number,
  r: number
): string {
  const dy = endY - startY;
  const goingDown = dy > 0;

  // First bend: horizontal to vertical
  const bend1X = bendX;
  const bend1Y = startY;

  // Second bend: vertical to horizontal
  const bend2X = bendX;
  const bend2Y = endY;

  // Direction signs for corner arcs
  const hDir1 = bendX > startX ? 1 : -1; // horizontal direction at first bend
  const vDir = goingDown ? 1 : -1;         // vertical direction
  const hDir2 = endX > bendX ? 1 : -1;    // horizontal direction at second bend

  return [
    // Start
    `M ${startX} ${startY}`,

    // Horizontal to first bend
    `L ${bend1X - hDir1 * r} ${bend1Y}`,

    // First corner: horizontal → vertical
    `Q ${bend1X} ${bend1Y} ${bend1X} ${bend1Y + vDir * r}`,

    // Vertical segment
    `L ${bend2X} ${bend2Y - vDir * r}`,

    // Second corner: vertical → horizontal
    `Q ${bend2X} ${bend2Y} ${bend2X + hDir2 * r} ${bend2Y}`,

    // Horizontal to port
    `L ${endX} ${endY}`,
  ].join(" ");
}
