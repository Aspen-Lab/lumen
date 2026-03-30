"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type PromptInputProps } from "./index";

export function PromptInputMobile({
  placeholder = "Ask anything...",
  glowIntensity = 0.6,
  glowSpeed = 3,
  showPrompts = true,
  showAttach = true,
  showMic = true,
  borderRadius = 20,
  accentFrom = "#7C5CFC",
  accentTo = "#F97316",
}: PromptInputProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 100) + "px";
  }, [value]);

  const hasContent = value.trim().length > 0;

  return (
    <div className="w-full max-w-[375px]">
      <div
        className="relative p-[2px] overflow-hidden"
        style={{ borderRadius: borderRadius + 2 }}
      >
        {/* Gradient border */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: borderRadius + 2,
            background: `conic-gradient(from 0deg, ${accentFrom}, ${accentTo}, ${accentFrom})`,
            opacity: focused ? glowIntensity : glowIntensity * 0.3,
            transition: "opacity 0.3s ease",
          }}
        />
        <motion.div
          className="absolute inset-[-50%]"
          style={{
            background: `conic-gradient(from 0deg, transparent 0%, ${accentFrom} 25%, ${accentTo} 50%, transparent 75%)`,
            opacity: focused ? glowIntensity * 0.4 : glowIntensity * 0.15,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: glowSpeed, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner */}
        <div className="relative bg-[#0E0E14] flex flex-col" style={{ borderRadius }}>
          {/* Input */}
          <div className="px-4 pt-3 pb-1">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={placeholder}
              rows={1}
              className="w-full bg-transparent text-white/85 text-sm placeholder:text-white/25 outline-none resize-none leading-relaxed"
              style={{ minHeight: 24, maxHeight: 100 }}
            />
          </div>

          {/* Toolbar — compact */}
          <div className="flex items-center justify-between px-3 pb-2.5 pt-0.5">
            <div className="flex items-center gap-1">
              {showPrompts && (
                <button className="p-2 rounded-lg text-white/30 hover:text-white/60 transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </button>
              )}
              {showAttach && (
                <button className="p-2 rounded-lg text-white/30 hover:text-white/60 transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>
              )}
              {showMic && (
                <button className="p-2 rounded-lg text-white/30 hover:text-white/60 transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                  </svg>
                </button>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                hasContent ? "text-white" : "text-white/20"
              )}
              style={{
                background: hasContent
                  ? `linear-gradient(135deg, ${accentFrom}, ${accentTo})`
                  : "rgba(255,255,255,0.06)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
