export const tagCode = `"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TagProps {
  label: string;
  color?: string;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace(/^#/, "");
  const full  = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  if (full.length !== 6) return null;
  const int = parseInt(full, 16);
  if (isNaN(int)) return null;
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

export function Tag({ label, color = "#FFFFFF", removable = false, onRemove, className }: TagProps) {
  const rgb = hexToRgb(color);

  const bg     = rgb ? \`rgba(\${rgb.r},\${rgb.g},\${rgb.b},0.05)\`  : "rgba(255,255,255,0.05)";
  const text   = rgb ? \`rgba(\${rgb.r},\${rgb.g},\${rgb.b},0.50)\`  : "rgba(255,255,255,0.50)";
  const border = rgb ? \`rgba(\${rgb.r},\${rgb.g},\${rgb.b},0.12)\`  : "rgba(255,255,255,0.12)";

  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium leading-none select-none", className)}
      style={{ backgroundColor: bg, color: text, border: \`1px solid \${border}\` }}
    >
      {label}
      {removable && (
        <motion.button
          type="button"
          aria-label={\`Remove \${label}\`}
          className="inline-flex items-center justify-center w-3 h-3 rounded-sm opacity-60 hover:opacity-100 focus-visible:outline-none"
          style={{ color: text }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          onClick={onRemove}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L7 7M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.button>
      )}
    </span>
  );
}
`;
