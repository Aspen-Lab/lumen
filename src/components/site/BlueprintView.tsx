"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlueprintNode, NODE_COLORS, NODE_ICONS } from "@/types/blueprint";
import { cn } from "@/lib/utils";

interface BlueprintViewProps {
  nodes: BlueprintNode[];
  component: React.ReactNode;
}

// Fixed positions for each slot (percentage from center)
const POSITIONS: Record<string, { x: number; y: number }> = {
  "top-left": { x: -38, y: -35 },
  "top-right": { x: 38, y: -35 },
  "left": { x: -42, y: 0 },
  "right": { x: 42, y: 0 },
  "bottom-left": { x: -38, y: 35 },
  "bottom-right": { x: 38, y: 35 },
};

export function BlueprintView({ nodes, component }: BlueprintViewProps) {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[560px] flex items-center justify-center overflow-hidden"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* SVG connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
        {nodes.map((node, i) => {
          const pos = POSITIONS[node.position];
          if (!pos) return null;
          const color = NODE_COLORS[node.type];
          const isActive = activeNode === node.id;

          return (
            <motion.line
              key={node.id}
              x1="50%"
              y1="50%"
              x2={`${50 + pos.x}%`}
              y2={`${50 + pos.y}%`}
              stroke={color}
              strokeWidth={isActive ? 1.5 : 0.8}
              strokeOpacity={isActive ? 0.5 : 0.15}
              strokeDasharray="4 6"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            >
              {/* Flowing dash animation */}
              <animate
                attributeName="stroke-dashoffset"
                values="0;-20"
                dur="2s"
                repeatCount="indefinite"
              />
            </motion.line>
          );
        })}
      </svg>

      {/* Center component */}
      <motion.div
        className="relative z-10 pointer-events-none select-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="scale-[0.55] origin-center">
          {component}
        </div>
        {/* Label */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-white/15 uppercase tracking-widest whitespace-nowrap">
          Component
        </div>
      </motion.div>

      {/* Nodes */}
      {nodes.map((node, i) => {
        const pos = POSITIONS[node.position];
        if (!pos) return null;
        const color = NODE_COLORS[node.type];
        const icon = NODE_ICONS[node.type];
        const isActive = activeNode === node.id;
        const isExpanded = expandedNode === node.id;

        return (
          <motion.div
            key={node.id}
            className="absolute z-20"
            style={{
              left: `${50 + pos.x}%`,
              top: `${50 + pos.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.4 + i * 0.1,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <motion.div
              className={cn(
                "relative rounded-xl px-3 py-2.5 cursor-pointer select-none min-w-[140px] max-w-[200px]",
                "bg-surface-2/90 backdrop-blur-sm"
              )}
              style={{
                boxShadow: isActive
                  ? `0 0 20px ${color}20, 0 0 40px ${color}10`
                  : "0 4px 20px rgba(0,0,0,0.3)",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onHoverStart={() => setActiveNode(node.id)}
              onHoverEnd={() => setActiveNode(null)}
              onClick={() => setExpandedNode(isExpanded ? null : node.id)}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-3 right-3 h-px"
                style={{ background: `linear-gradient(to right, transparent, ${color}60, transparent)` }}
              />

              {/* Header */}
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs w-5 h-5 rounded flex items-center justify-center"
                  style={{ background: `${color}15`, color }}
                >
                  {icon}
                </span>
                <span className="text-[11px] font-mono text-white/60 truncate">
                  {node.label}
                </span>
              </div>

              {/* Description */}
              <div className="text-[10px] text-white/30 leading-relaxed">
                {node.description}
              </div>

              {/* Type badge */}
              <div className="mt-1.5 flex items-center gap-1.5">
                <span
                  className="text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={{ background: `${color}10`, color: `${color}90` }}
                >
                  {node.type}
                </span>
                {node.details && (
                  <span className="text-[8px] text-white/15 font-mono">
                    {isExpanded ? "▾" : "▸"} {node.details.length} specs
                  </span>
                )}
              </div>

              {/* Expanded details */}
              <AnimatePresence>
                {isExpanded && node.details && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 pt-2 space-y-1" style={{ borderTop: `1px solid ${color}15` }}>
                      {node.details.map((detail, j) => (
                        <div
                          key={j}
                          className="text-[9px] font-mono text-white/25 leading-relaxed pl-2"
                          style={{ borderLeft: `1px solid ${color}20` }}
                        >
                          {detail}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Connection dot */}
              <div
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: color,
                  opacity: isActive ? 0.8 : 0.3,
                  top: "50%",
                  ...(pos.x < 0 ? { right: -4 } : { left: -4 }),
                  transform: "translateY(-50%)",
                  transition: "opacity 0.2s",
                }}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
