"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BlueprintNode } from "@/types/blueprint";
import { BlueprintCanvas } from "./blueprint/BlueprintCanvas";
import { BlueprintConnector } from "./blueprint/BlueprintConnector";
import { BlueprintNodeCard } from "./blueprint/BlueprintNodeCard";

interface BlueprintViewProps {
  nodes: BlueprintNode[];
  component: React.ReactNode;
}

const W = 900;
const H = 680;
const CX = W / 2;
const CY = H / 2;

// Actual rendered size of center component at scale-75
// PromptInput: max-w-[640px] → 640*0.75 = 480, height ~80*0.75 ≈ 60
const COMP_W = 480;
const COMP_H = 60;

const SLOTS: Record<string, {
  x: number;
  y: number;
  side: "left" | "right";
  portX: number;
  portY: number;
}> = {
  "top-left":     { x: 120, y: 110, side: "right", portX: CX - COMP_W / 2 - 10,  portY: CY - COMP_H / 2 - 10 },
  "top-right":    { x: 780, y: 110, side: "left",  portX: CX + COMP_W / 2 + 10,  portY: CY - COMP_H / 2 - 10 },
  "left":         { x: 120, y: CY,  side: "right", portX: CX - COMP_W / 2 - 10,  portY: CY },
  "right":        { x: 780, y: CY,  side: "left",  portX: CX + COMP_W / 2 + 10,  portY: CY },
  "bottom-left":  { x: 120, y: 570, side: "right", portX: CX - COMP_W / 2 - 10,  portY: CY + COMP_H / 2 + 10 },
  "bottom-right": { x: 780, y: 570, side: "left",  portX: CX + COMP_W / 2 + 10,  portY: CY + COMP_H / 2 + 10 },
};

export function BlueprintView({ nodes, component }: BlueprintViewProps) {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  // Compute lane indices per side
  const leftNodes = nodes.filter((n) => SLOTS[n.position]?.side === "right");
  const rightNodes = nodes.filter((n) => SLOTS[n.position]?.side === "left");
  const laneMap = new Map<string, number>();
  leftNodes.forEach((n, i) => laneMap.set(n.id, i));
  rightNodes.forEach((n, i) => laneMap.set(n.id, i));

  return (
    <BlueprintCanvas width={W} height={H}>
      {/* SVG layer for connectors */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={W}
        height={H}
        style={{ overflow: "visible" }}
      >
        {nodes.map((node, i) => {
          const slot = SLOTS[node.position];
          if (!slot) return null;
          // Node card is 200px wide. Connect from the correct edge.
          const edgeX = slot.side === "right"
            ? slot.x + 100  // right edge of left-side node
            : slot.x - 100; // left edge of right-side node
          return (
            <BlueprintConnector
              key={node.id}
              fromX={edgeX}
              fromY={slot.y}
              toX={slot.portX}
              toY={slot.portY}
              side={slot.side}
              laneIndex={laneMap.get(node.id) ?? 0}
              active={activeNode === node.id}
              delay={0.2 + i * 0.08}
            />
          );
        })}
      </svg>

      {/* Center component */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: CX,
          top: CY,
          transform: "translate(-50%, -50%)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="scale-75 origin-center">
          {component}
        </div>
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-white/12 uppercase tracking-[0.2em] whitespace-nowrap">
          Component
        </div>
      </motion.div>

      {/* Node cards */}
      {nodes.map((node, i) => {
        const slot = SLOTS[node.position];
        if (!slot) return null;
        return (
          <BlueprintNodeCard
            key={node.id}
            node={node}
            x={slot.x}
            y={slot.y}
            connectorSide={slot.side}
            active={activeNode === node.id}
            expanded={expandedNode === node.id}
            onHover={setActiveNode}
            onToggle={(id) => setExpandedNode(expandedNode === id ? null : id)}
            delay={0.3 + i * 0.08}
          />
        );
      })}
    </BlueprintCanvas>
  );
}
