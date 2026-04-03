"use client";

import { cn } from "@/lib/utils";

/**
 * MicToggle — Microphone on/off toggle with inline track
 *
 * UI: Icon + "Mic" label + pill toggle, all in one tappable button
 * SWE: Controlled component (value + onChange)
 *      Track/thumb colors fully parameterized
 *      CSS transitions only — no Framer Motion needed here
 */

export interface MicToggleProps {
  active: boolean;
  onToggle: () => void;
  activeBgColor: string;
  activeTextColor: string;
  inactiveBgColor: string;
  inactiveTextColor: string;
  trackActiveColor: string;
  trackInactiveColor: string;
  thumbColor: string;
}

export function MicToggle({
  active, onToggle,
  activeBgColor, activeTextColor,
  inactiveBgColor, inactiveTextColor,
  trackActiveColor, trackInactiveColor, thumbColor,
}: MicToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
      style={{
        background: active ? activeBgColor : inactiveBgColor,
        color: active ? activeTextColor : inactiveTextColor,
      }}
    >
      <MicIcon />
      Mic
      <div
        className="w-7 h-4 rounded-full relative transition-colors"
        style={{ background: active ? trackActiveColor : trackInactiveColor }}
      >
        <div
          className={cn(
            "absolute top-0.5 w-3 h-3 rounded-full transition-all duration-200",
            active ? "left-3.5 opacity-90" : "left-0.5 opacity-40"
          )}
          style={{ background: thumbColor }}
        />
      </div>
    </button>
  );
}

function MicIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}
