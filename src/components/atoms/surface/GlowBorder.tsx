"use client";

import { motion } from "framer-motion";

/**
 * GlowBorder — Animated gradient border wrapper
 *
 * UI: Conic gradient border that rotates + outer blur glow
 * SWE: 3-layer compositing (static gradient, rotating sweep, blur halo)
 *      Focus state drives opacity transitions via CSS
 *      Rotation is a single infinite Framer Motion animation
 */

export interface GlowBorderProps {
  children: React.ReactNode;
  focused: boolean;
  intensity: number;       // 0-1
  speed: number;           // seconds per rotation
  radius: number;          // border-radius in px
  colorFrom: string;       // gradient start
  colorTo: string;         // gradient end
}

export function GlowBorder({
  children, focused, intensity, speed, radius, colorFrom, colorTo,
}: GlowBorderProps) {
  return (
    <div
      className="relative p-[2px] overflow-hidden"
      style={{ borderRadius: radius + 2 }}
    >
      {/* Layer 1: Static conic gradient — always visible, opacity scales with focus */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: radius + 2,
          background: `conic-gradient(from 0deg, ${colorFrom}, ${colorTo}, ${colorFrom})`,
          opacity: focused ? intensity : intensity * 0.4,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Layer 2: Rotating sweep — creates the "moving light" effect */}
      <motion.div
        className="absolute inset-[-50%]"
        style={{
          background: `conic-gradient(from 0deg, transparent 0%, ${colorFrom} 25%, ${colorTo} 50%, transparent 75%)`,
          opacity: focused ? intensity * 0.5 : intensity * 0.2,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      />

      {/* Layer 3: Blur halo — soft outer glow, no rotation */}
      <div
        className="absolute inset-[-8px] blur-xl"
        style={{
          borderRadius: radius + 10,
          background: `conic-gradient(from 180deg, ${colorFrom}40, ${colorTo}30, ${colorFrom}40)`,
          opacity: focused ? intensity * 0.6 : intensity * 0.15,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Content sits above all glow layers */}
      <div className="relative" style={{ borderRadius: radius }}>
        {children}
      </div>
    </div>
  );
}
