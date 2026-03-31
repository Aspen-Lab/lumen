const STATIC_SOURCE = `"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface PromptInputProps {
  placeholder?: string;
  glowIntensity?: number;
  glowSpeed?: number;
  showPrompts?: boolean;
  showAttach?: boolean;
  showMic?: boolean;
  borderRadius?: number;
  accentFrom?: string;
  accentTo?: string;
}

export function PromptInput({
  placeholder = "Ask anything...",
  glowIntensity = 0.6,
  glowSpeed = 3,
  showPrompts = true,
  showAttach = true,
  showMic = true,
  borderRadius = 24,
  accentFrom = "#7C5CFC",
  accentTo = "#F97316",
}: PromptInputProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [value]);

  const hasContent = value.trim().length > 0;

  return (
    <div className="w-full max-w-[640px]">
      <div
        className="relative p-[2px] overflow-hidden"
        style={{ borderRadius: borderRadius + 2 }}
      >
        {/* Animated gradient border */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: borderRadius + 2,
            background: \\\`conic-gradient(from 0deg, \\\${accentFrom}, \\\${accentTo}, \\\${accentFrom})\\\`,
            opacity: focused ? glowIntensity : glowIntensity * 0.4,
            transition: "opacity 0.3s ease",
          }}
        />
        <motion.div
          className="absolute inset-[-50%]"
          style={{
            background: \\\`conic-gradient(from 0deg, transparent 0%, \\\${accentFrom} 25%, \\\${accentTo} 50%, transparent 75%)\\\`,
            opacity: focused ? glowIntensity * 0.5 : glowIntensity * 0.2,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: glowSpeed, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner card */}
        <div
          className="relative bg-[#0E0E14] flex flex-col"
          style={{ borderRadius }}
        >
          <div className="px-5 pt-4 pb-2">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={placeholder}
              rows={1}
              className="w-full bg-transparent text-white/85 text-base placeholder:text-white/25 outline-none resize-none"
              style={{ minHeight: 28, maxHeight: 120 }}
            />
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 pb-3 pt-1">
            {/* Left actions */}
            <div className="flex items-center gap-2">
              {showPrompts && (
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.06] text-white/50 text-sm">
                  Prompts
                </button>
              )}
              {showAttach && (
                <button className="p-2 rounded-lg text-white/30">📎</button>
              )}
            </div>
            {/* Right actions */}
            <div className="flex items-center gap-2">
              {showMic && (
                <button className="px-3 py-1.5 rounded-lg bg-white/[0.04] text-white/30 text-sm">
                  🎙 Mic
                </button>
              )}
              <motion.button
                whileTap={{ scale: 0.92 }}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: hasContent
                    ? \\\`linear-gradient(135deg, \\\${accentFrom}, \\\${accentTo})\\\`
                    : "rgba(255,255,255,0.06)",
                }}
              >
                ▶
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;

export function generatePromptInputCode(props: Record<string, unknown>): string {
  const defaults: Record<string, unknown> = {
    placeholder: "Ask anything...",
    glowIntensity: 0.6,
    glowSpeed: 3,
    showPrompts: true,
    showAttach: true,
    showMic: true,
    borderRadius: 24,
    accentFrom: "#7C5CFC",
    accentTo: "#F97316",
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
  return `// Usage\n<PromptInput${propsBlock}/>\n\n${STATIC_SOURCE}`;
}

export const promptInputCode = generatePromptInputCode({});
