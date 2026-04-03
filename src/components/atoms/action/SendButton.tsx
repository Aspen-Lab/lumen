"use client";

import { motion } from "framer-motion";

/**
 * SendButton — Gradient submit button
 *
 * UI: Circle button, gradient when active, muted when empty
 *     Press animation via whileTap scale
 * SWE: Visual state derived from `hasContent` boolean
 *      Gradient colors match the GlowBorder accent — visual coherence
 */

export interface SendButtonProps {
  hasContent: boolean;
  accentFrom: string;
  accentTo: string;
  inactiveBgColor: string;
  activeIconColor: string;
  inactiveIconColor: string;
  onClick?: () => void;
}

export function SendButton({
  hasContent, accentFrom, accentTo,
  inactiveBgColor, activeIconColor, inactiveIconColor, onClick,
}: SendButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
      style={{
        background: hasContent
          ? `linear-gradient(135deg, ${accentFrom}, ${accentTo})`
          : inactiveBgColor,
        color: hasContent ? activeIconColor : inactiveIconColor,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
      </svg>
    </motion.button>
  );
}
