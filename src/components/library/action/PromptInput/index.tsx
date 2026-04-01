"use client";

/**
 * PromptInput — AI prompt input panel
 *
 * Architecture (5 parts):
 * ┌─────────────────────────────────────────┐
 * │ GlowBorder                              │  ← animated gradient border wrapper
 * │ ┌─────────────────────────────────────┐ │
 * │ │ AutoTextarea                        │ │  ← self-sizing text input
 * │ ├─────────────────────────────────────┤ │
 * │ │ Toolbar                             │ │
 * │ │ ┌──────────┐ ┌──┐  ┌────────┐ ┌──┐ │ │
 * │ │ │ Prompts  │ │📎│  │MicToggle│ │➤ │ │ │
 * │ │ │ToolbarBtn│ │TB│  │        │ │SB│ │ │
 * │ │ └──────────┘ └──┘  └────────┘ └──┘ │ │
 * │ └─────────────────────────────────────┘ │
 * └─────────────────────────────────────────┘
 *
 * State:
 *   value (string)  — controlled by AutoTextarea
 *   focused (bool)  — drives GlowBorder intensity
 *   micOn (bool)    — controlled by MicToggle
 *
 * Data flow:
 *   User types → AutoTextarea.onChange → setValue → hasContent derived
 *   User focuses → AutoTextarea.onFocusChange → setFocused → GlowBorder reacts
 *   User clicks mic → MicToggle.onToggle → setMicOn
 *   User clicks send → SendButton.onClick (future: onSubmit callback)
 */

import { useState } from "react";
import { GlowBorder } from "./parts/GlowBorder";
import { AutoTextarea } from "./parts/AutoTextarea";
import { ToolbarButton } from "./parts/ToolbarButton";
import { MicToggle } from "./parts/MicToggle";
import { SendButton } from "./parts/SendButton";

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

  const hasContent = value.trim().length > 0;

  return (
    <div className="w-full max-w-[640px]">
      <GlowBorder
        focused={focused}
        intensity={glowIntensity}
        speed={glowSpeed}
        radius={borderRadius}
        colorFrom={accentFrom}
        colorTo={accentTo}
      >
        <div className="backdrop-blur-md flex flex-col" style={{ borderRadius, background: inputBgColor }}>
          {/* Input area */}
          <AutoTextarea
            value={value}
            onChange={setValue}
            onFocusChange={setFocused}
            placeholder={placeholder}
            textColor={textColor}
            placeholderColor={placeholderColor}
            bgColor="transparent"
          />

          {/* Toolbar */}
          <div
            className="flex items-center justify-between px-4 pb-3 pt-1"
            style={{ background: toolbarBgColor }}
          >
            {/* Left actions */}
            <div className="flex items-center gap-2">
              {showPrompts && (
                <ToolbarButton
                  icon={<PromptsIcon />}
                  label="Prompts"
                  bgColor={toolbarButtonBgColor}
                  textColor={toolbarButtonTextColor}
                />
              )}
              {showAttach && (
                <ToolbarButton
                  icon={<AttachIcon />}
                  bgColor="transparent"
                  textColor={toolbarTextColor}
                />
              )}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {showMic && (
                <MicToggle
                  active={micOn}
                  onToggle={() => setMicOn(!micOn)}
                  activeBgColor={micActiveBgColor}
                  activeTextColor={micActiveTextColor}
                  inactiveBgColor={toolbarButtonBgColor}
                  inactiveTextColor={toolbarTextColor}
                  trackActiveColor={toggleTrackActiveColor}
                  trackInactiveColor={toggleTrackInactiveColor}
                  thumbColor={toggleThumbColor}
                />
              )}
              <SendButton
                hasContent={hasContent}
                accentFrom={accentFrom}
                accentTo={accentTo}
                inactiveBgColor={sendBgColor}
                activeIconColor={sendIconColor}
                inactiveIconColor={sendIconInactiveColor}
              />
            </div>
          </div>
        </div>
      </GlowBorder>
    </div>
  );
}

/* ── Icons ── */

function PromptsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function AttachIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}
