const STATIC_SOURCE = `"use client";

import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

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

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = \`\${el.scrollHeight}px\`;
  }, []);

  useEffect(() => {
    if (multiline) resize();
  }, [multiline, value, resize]);

  const sharedStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    color: textColor,
    caretColor: "#0BE09B",
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
`;

export function generateTextInputCode(props: Record<string, unknown>): string {
  const defaults: Record<string, unknown> = {
    placeholder: "Type something…",
    multiline: false,
    rows: 3,
    bgColor: "rgba(255,255,255,0.04)",
    textColor: "rgba(255,255,255,0.85)",
    placeholderColor: "rgba(255,255,255,0.25)",
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
  return `// Usage\n<TextInput${propsBlock}/>\n\n${STATIC_SOURCE}`;
}

export const textInputCode = generateTextInputCode({});
