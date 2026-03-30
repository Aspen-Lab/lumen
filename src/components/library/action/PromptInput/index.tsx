"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface PromptInputProps {
  placeholder?: string;
  glowIntensity?: number;
  glowSpeed?: number;
  showPrompts?: boolean;
  showAttach?: boolean;
  showMic?: boolean;
  borderRadius?: number;
  accentFrom?: string;
  accentTo?: string;
  // Color props
  inputBgColor?: string;
  textColor?: string;
  placeholderColor?: string;
  toolbarBgColor?: string;
  toolbarTextColor?: string;
  sendBgColor?: string;
  sendIconColor?: string;
  sendIconInactiveColor?: string;
  toolbarButtonBgColor?: string;
  toolbarButtonTextColor?: string;
  micActiveBgColor?: string;
  micActiveTextColor?: string;
  toggleTrackActiveColor?: string;
  toggleTrackInactiveColor?: string;
  toggleThumbColor?: string;
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
  // Color props with defaults matching original hardcoded values
  inputBgColor = "#0E0E14",
  textColor = "rgba(255,255,255,0.85)",
  placeholderColor = "rgba(255,255,255,0.25)",
  toolbarBgColor = "transparent",
  toolbarTextColor = "rgba(255,255,255,0.5)",
  sendBgColor = "rgba(255,255,255,0.06)",
  sendIconColor = "#ffffff",
  sendIconInactiveColor = "rgba(255,255,255,0.2)",
  toolbarButtonBgColor = "rgba(255,255,255,0.06)",
  toolbarButtonTextColor = "rgba(255,255,255,0.5)",
  micActiveBgColor = "rgba(255,255,255,0.1)",
  micActiveTextColor = "rgba(255,255,255,0.7)",
  toggleTrackActiveColor = "rgba(255,255,255,0.2)",
  toggleTrackInactiveColor = "rgba(255,255,255,0.08)",
  toggleThumbColor = "#ffffff",
}: PromptInputProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [value]);

  const hasContent = value.trim().length > 0;
  const animDuration = glowSpeed + "s";

  return (
    <div className="w-full max-w-[640px]">
      {/* Outer glow wrapper */}
      <div
        className="relative p-[2px] overflow-hidden"
        style={{ borderRadius: borderRadius + 2 }}
      >
        {/* Animated gradient border */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: borderRadius + 2,
            background: `conic-gradient(from 0deg, ${accentFrom}, ${accentTo}, ${accentFrom})`,
            opacity: focused ? glowIntensity : glowIntensity * 0.4,
            transition: "opacity 0.3s ease",
          }}
        />
        {/* Rotating glow */}
        <motion.div
          className="absolute inset-[-50%]"
          style={{
            background: `conic-gradient(from 0deg, transparent 0%, ${accentFrom} 25%, ${accentTo} 50%, transparent 75%)`,
            opacity: focused ? glowIntensity * 0.5 : glowIntensity * 0.2,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: parseFloat(animDuration), repeat: Infinity, ease: "linear" }}
        />

        {/* Outer blur glow */}
        <div
          className="absolute inset-[-8px] blur-xl"
          style={{
            borderRadius: borderRadius + 10,
            background: `conic-gradient(from 180deg, ${accentFrom}40, ${accentTo}30, ${accentFrom}40)`,
            opacity: focused ? glowIntensity * 0.6 : glowIntensity * 0.15,
            transition: "opacity 0.4s ease",
          }}
        />

        {/* Inner card */}
        <div
          className="relative backdrop-blur-md flex flex-col"
          style={{ borderRadius, background: inputBgColor }}
        >
          {/* Textarea */}
          <div className="px-5 pt-4 pb-2">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={placeholder}
              rows={1}
              className="w-full bg-transparent text-base outline-none resize-none leading-relaxed"
              style={{
                minHeight: 28,
                maxHeight: 120,
                color: textColor,
              }}
            />
            <style>{`
              textarea::placeholder { color: ${placeholderColor}; }
            `}</style>
          </div>

          {/* Toolbar */}
          <div
            className="flex items-center justify-between px-4 pb-3 pt-1"
            style={{ background: toolbarBgColor }}
          >
            <div className="flex items-center gap-2">
              {/* Prompts button */}
              {showPrompts && (
                <button
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: toolbarButtonBgColor,
                    color: toolbarButtonTextColor,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Prompts
                </button>
              )}

              {/* Attach */}
              {showAttach && (
                <button
                  className="p-2 rounded-lg transition-all"
                  style={{ color: toolbarTextColor }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Mic toggle */}
              {showMic && (
                <button
                  onClick={() => setMicOn(!micOn)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: micOn ? micActiveBgColor : toolbarButtonBgColor,
                    color: micOn ? micActiveTextColor : toolbarTextColor,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                  </svg>
                  Mic
                  {/* Toggle dot */}
                  <div
                    className="w-7 h-4 rounded-full relative transition-colors"
                    style={{ background: micOn ? toggleTrackActiveColor : toggleTrackInactiveColor }}
                  >
                    <div
                      className={cn(
                        "absolute top-0.5 w-3 h-3 rounded-full transition-all duration-200",
                        micOn ? "left-3.5 opacity-90" : "left-0.5 opacity-40"
                      )}
                      style={{ background: toggleThumbColor }}
                    />
                  </div>
                </button>
              )}

              {/* Send */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  background: hasContent
                    ? `linear-gradient(135deg, ${accentFrom}, ${accentTo})`
                    : sendBgColor,
                  color: hasContent ? sendIconColor : sendIconInactiveColor,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
