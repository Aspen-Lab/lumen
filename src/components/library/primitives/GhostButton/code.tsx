const STATIC_SOURCE = `"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type GhostButtonSize = "sm" | "md";

export interface GhostButtonProps {
  label: string;
  size?: GhostButtonSize;
  color?: string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace(/^#/, "");
  const full =
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean;
  const int = parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return \`rgba(\${r},\${g},\${b},\${alpha})\`;
}

const sizes: Record<GhostButtonSize, {
  px: string; py: string; gap: string;
  textSize: string; iconSize: string;
  radius: string;
}> = {
  sm: {
    px: "px-3", py: "py-1.5",
    gap: "gap-1.5",
    textSize: "text-xs",
    iconSize: "w-3.5 h-3.5",
    radius: "rounded-lg",
  },
  md: {
    px: "px-4", py: "py-2",
    gap: "gap-2",
    textSize: "text-sm",
    iconSize: "w-4 h-4",
    radius: "rounded-xl",
  },
};

export function GhostButton({
  label,
  size = "md",
  color = "#FFFFFF",
  icon,
  onClick,
  className,
}: GhostButtonProps) {
  const s = sizes[size];

  const textColor = hexToRgba(color, 0.75);
  const hoverBg   = hexToRgba(color, 0.04);
  const activeBg  = hexToRgba(color, 0.07);

  return (
    <motion.button
      className={cn(
        "relative inline-flex items-center border border-transparent",
        "select-none cursor-pointer transition-colors duration-150",
        "focus-visible:outline-none",
        s.px, s.py, s.gap, s.radius,
        className,
      )}
      style={{ color: textColor, background: "transparent" }}
      whileHover={{
        backgroundColor: hoverBg,
        borderColor: hexToRgba(color, 0.1),
      }}
      whileTap={{ scale: 0.97, backgroundColor: activeBg }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      onClick={onClick}
    >
      {icon && (
        <span className={cn("shrink-0 flex items-center justify-center", s.iconSize)}>
          {icon}
        </span>
      )}
      <span className={cn("font-medium leading-none", s.textSize)}>{label}</span>
    </motion.button>
  );
}`;

export function generateGhostButtonCode(props: Record<string, unknown>): string {
  const defaults: Record<string, unknown> = {
    label: "Button",
    size: "md",
    color: "#FFFFFF",
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
  const labelProp = typeof props.label === "string" ? props.label : "Button";
  return `// Usage\n<GhostButton label="${labelProp}"${propsBlock}/>\n\n${STATIC_SOURCE}`;
}

export const ghostButtonCode = generateGhostButtonCode({});
