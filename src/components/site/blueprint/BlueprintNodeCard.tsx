"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BlueprintNode, NODE_COLORS, NODE_ICONS } from "@/types/blueprint";

interface BlueprintNodeCardProps {
  node: BlueprintNode;
  x: number;
  y: number;
  connectorSide: "left" | "right";
  active: boolean;
  expanded: boolean;
  onHover: (id: string | null) => void;
  onToggle: (id: string) => void;
  delay: number;
}

export function BlueprintNodeCard({
  node, x, y, connectorSide, active, expanded, onHover, onToggle, delay,
}: BlueprintNodeCardProps) {
  const color = NODE_COLORS[node.type];
  const icon = NODE_ICONS[node.type];

  return (
    <motion.div
      className="absolute z-20"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay,
        type: "spring",
        stiffness: 350,
        damping: 25,
      }}
    >
      <motion.div
        data-interactive
        className="relative rounded-lg px-3.5 py-2.5 cursor-pointer w-[200px] bg-[#13131B]"
        style={{
          boxShadow: active
            ? "0 0 20px rgba(255,255,255,0.04), 0 2px 12px rgba(0,0,0,0.4)"
            : "0 2px 16px rgba(0,0,0,0.4)",
          transition: "box-shadow 0.2s",
        }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => onHover(node.id)}
        onHoverEnd={() => onHover(null)}
        onClick={() => onToggle(node.id)}
      >
        <div className="absolute top-0 left-3 right-3 h-px bg-white/[0.06]" />

        {/* Header */}
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="text-[10px] w-5 h-5 rounded flex items-center justify-center bg-white/[0.04]"
            style={{ color: `${color}80` }}
          >
            {icon}
          </span>
          <span className="text-[12px] font-mono text-white/55 truncate flex-1">
            {node.label}
          </span>
        </div>

        {/* Description */}
        <div className="text-[11px] text-white/30 leading-relaxed">
          {node.description}
        </div>

        {/* Badge */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/[0.03] text-white/20">
            {node.type}
          </span>
          {node.details && (
            <span className="text-[9px] text-white/15 font-mono">
              {expanded ? "▾" : "▸"} {node.details.length} specs
            </span>
          )}
        </div>

        {/* Expandable details */}
        <AnimatePresence>
          {expanded && node.details && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-2 pt-2 space-y-1.5 border-t border-white/[0.04]">
                {node.details.map((detail, j) => (
                  <div
                    key={j}
                    className="text-[10px] font-mono text-white/20 leading-relaxed pl-2 border-l border-white/[0.06]"
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
          className="absolute w-2 h-2 rounded-full bg-white"
          style={{
            opacity: active ? 0.35 : 0.08,
            top: "50%",
            transform: "translateY(-50%)",
            ...(connectorSide === "right" ? { right: -5 } : { left: -5 }),
            transition: "opacity 0.2s",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
