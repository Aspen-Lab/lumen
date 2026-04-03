"use client";

/**
 * ToolbarButton — Reusable action button for the input toolbar
 *
 * UI: Icon + optional label, consistent sizing and hover states
 * SWE: Pure presentational — no state, fully controlled via props
 *      Two variants: "labeled" (icon + text) and "icon" (icon only)
 */

export interface ToolbarButtonProps {
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
  bgColor: string;
  textColor: string;
  className?: string;
}

export function ToolbarButton({
  icon, label, onClick, bgColor, textColor, className = "",
}: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg text-sm font-medium transition-all ${
        label ? "px-3 py-1.5" : "p-2"
      } ${className}`}
      style={{ background: bgColor, color: textColor }}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
}
