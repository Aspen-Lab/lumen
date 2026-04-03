"use client";

import { useState } from "react";
import { GlowBorder } from "@/components/atoms/surface/GlowBorder";
import { AutoTextarea } from "@/components/atoms/input/AutoTextarea";
import { ToolbarButton } from "@/components/atoms/action/ToolbarButton";
import { SendButton } from "@/components/atoms/action/SendButton";
import { MicToggle } from "@/components/atoms/control/MicToggle";

function GlowSurfaceDemo() {
  const [focused, setFocused] = useState(false);
  return (
    <div
      className="w-full max-w-[140px]"
      onMouseEnter={() => setFocused(true)}
      onMouseLeave={() => setFocused(false)}
    >
      <GlowBorder
        focused={focused}
        intensity={0.6}
        speed={3}
        radius={12}
        colorFrom="#7C5CFC"
        colorTo="#F97316"
      >
        <div className="h-8 rounded-xl bg-[#0E0E14]" />
      </GlowBorder>
    </div>
  );
}

function TextAreaDemo() {
  const [value, setValue] = useState("");
  return (
    <div className="w-full max-w-[160px] rounded-lg bg-white/[0.03] overflow-hidden">
      <AutoTextarea
        value={value}
        onChange={setValue}
        onFocusChange={() => {}}
        placeholder="Type..."
        textColor="rgba(255,255,255,0.85)"
        placeholderColor="rgba(255,255,255,0.25)"
        bgColor="transparent"
      />
    </div>
  );
}

function ChipButtonDemo() {
  return (
    <ToolbarButton
      icon={
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      }
      label="Prompts"
      bgColor="rgba(255,255,255,0.06)"
      textColor="rgba(255,255,255,0.5)"
    />
  );
}

function IconButtonDemo() {
  return (
    <ToolbarButton
      icon={
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
        </svg>
      }
      bgColor="transparent"
      textColor="rgba(255,255,255,0.5)"
    />
  );
}

function ToggleChipDemo() {
  const [on, setOn] = useState(false);
  return (
    <MicToggle
      active={on}
      onToggle={() => setOn(!on)}
      activeBgColor="rgba(255,255,255,0.1)"
      activeTextColor="rgba(255,255,255,0.7)"
      inactiveBgColor="rgba(255,255,255,0.06)"
      inactiveTextColor="rgba(255,255,255,0.5)"
      trackActiveColor="rgba(255,255,255,0.2)"
      trackInactiveColor="rgba(255,255,255,0.08)"
      thumbColor="#ffffff"
    />
  );
}

function FABDemo() {
  const [active, setActive] = useState(false);
  return (
    <div onClick={() => setActive(!active)} className="cursor-pointer">
      <SendButton
        hasContent={active}
        accentFrom="#7C5CFC"
        accentTo="#F97316"
        inactiveBgColor="rgba(255,255,255,0.06)"
        activeIconColor="#ffffff"
        inactiveIconColor="rgba(255,255,255,0.2)"
      />
    </div>
  );
}

function ToolbarDemo() {
  return (
    <div className="w-full max-w-[180px] flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/[0.03]">
      <div className="flex gap-1.5">
        <div className="w-5 h-5 rounded bg-white/[0.06]" />
        <div className="w-5 h-5 rounded bg-white/[0.06]" />
      </div>
      <div className="w-5 h-5 rounded-full bg-white/[0.06]" />
    </div>
  );
}

const demos: Record<string, React.ComponentType> = {
  "glow-surface": GlowSurfaceDemo,
  "text-area": TextAreaDemo,
  "chip-button": ChipButtonDemo,
  "icon-button": IconButtonDemo,
  "toggle-chip": ToggleChipDemo,
  "fab": FABDemo,
  "toolbar": ToolbarDemo,
};

interface AtomDemoProps {
  slug: string;
}

export default function AtomDemo({ slug }: AtomDemoProps) {
  const Demo = demos[slug];
  if (!Demo) return null;
  return (
    <div className="flex items-center justify-center">
      <Demo />
    </div>
  );
}
