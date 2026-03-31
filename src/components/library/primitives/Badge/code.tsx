const STATIC_SOURCE = `"use client";

import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";
export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: string;
  dot?: boolean;
  mono?: boolean;
  className?: string;
}

const VARIANT_COLORS: Record<BadgeVariant, string> = {
  default: "#FFFFFF",
  success: "#0BE09B",
  warning: "#FB7A29",
  danger:  "#EF4444",
  info:    "#0091FF",
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return { r, g, b };
}

export function Badge({
  label,
  variant = "success",
  size = "md",
  color,
  dot = false,
  mono = false,
  className,
}: BadgeProps) {
  const resolvedColor = color ?? VARIANT_COLORS[variant];
  const rgb = hexToRgb(resolvedColor);

  const bgColor = rgb
    ? \`rgba(\${rgb.r}, \${rgb.g}, \${rgb.b}, 0.08)\`
    : "rgba(255, 255, 255, 0.08)";

  const textColor = rgb
    ? \`rgba(\${rgb.r}, \${rgb.g}, \${rgb.b}, 0.80)\`
    : "rgba(255, 255, 255, 0.80)";

  const dotColor = rgb
    ? \`rgba(\${rgb.r}, \${rgb.g}, \${rgb.b}, 1)\`
    : resolvedColor;

  const fontSize = size === "sm" ? "11px" : "13px";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium leading-none select-none",
        mono && "font-mono",
        className
      )}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        fontSize,
      }}
    >
      {dot && (
        <span
          className="relative flex-shrink-0 w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: dotColor }}
        >
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ backgroundColor: dotColor, opacity: 0.6 }}
          />
        </span>
      )}
      {label}
    </span>
  );
}`;

export function generateBadgeCode(props: Record<string, unknown>): string {
  const defaults: Record<string, unknown> = {
    variant: "success",
    size: "md",
    color: "#0BE09B",
    dot: false,
    mono: false,
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
  return `// Usage\n<Badge label="Status"${propsBlock}/>\n\n${STATIC_SOURCE}`;
}

export const badgeCode = generateBadgeCode({});
