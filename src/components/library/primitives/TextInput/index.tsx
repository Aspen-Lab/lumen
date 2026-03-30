"use client";

import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────── */

export interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  bgColor?: string;
  textColor?: string;
  placeholderColor?: string;
  className?: string;
}

/* ── TextInput ──────────────────────────────────────────────── */

export function TextInput({
  value,
  onChange,
  placeholder = "Type something…",
  multiline = false,
  rows = 3,
  bgColor = "rgba(255,255,255,0.04)",
  textColor = "rgba(255,255,255,0.85)",
  placeholderColor = "rgba(255,255,255,0.25)",
  className,
}: TextInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* Auto-resize textarea height */
  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    if (multiline) resize();
  }, [multiline, value, resize]);

  const sharedStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    color: textColor,
    caretColor: "#0BE09B",
    // Inject placeholder color via CSS custom property
    ["--placeholder-color" as string]: placeholderColor,
  };

  const sharedClass = cn(
    "w-full rounded-xl px-3.5 py-2.5",
    "text-sm leading-relaxed",
    "border border-transparent",
    "outline-none ring-0",
    "transition-colors duration-150",
    "focus:border-white/10 focus:bg-[rgba(255,255,255,0.06)]",
    "placeholder:opacity-100",
    "[&::placeholder]:text-[var(--placeholder-color)]",
    "resize-none",
    className,
  );

  if (multiline) {
    return (
      <textarea
        ref={textareaRef}
        className={sharedClass}
        style={sharedStyle}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          resize();
        }}
        placeholder={placeholder}
        rows={rows}
      />
    );
  }

  return (
    <input
      type="text"
      className={sharedClass}
      style={sharedStyle}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}
