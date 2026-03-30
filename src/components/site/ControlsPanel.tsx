"use client";

import { useState } from "react";
import { ControlDefinition } from "@/types/controls";
import { cn } from "@/lib/utils";
import { Layers, Zap, Palette } from "lucide-react";

interface ControlsPanelProps {
  controls: ControlDefinition[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

const LAYER_META = {
  architecture: { label: "Architecture", icon: Layers },
  motion: { label: "Motion", icon: Zap },
  color: { label: "Color", icon: Palette },
} as const;

type Layer = keyof typeof LAYER_META;

export function ControlsPanel({ controls, values, onChange }: ControlsPanelProps) {
  const availableLayers = (["architecture", "motion", "color"] as const).filter(
    (l) => controls.some((c) => c.layer === l)
  );

  const [activeTab, setActiveTab] = useState<Layer>(availableLayers[0]);

  const activeControls = controls.filter((c) => c.layer === activeTab);

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 rounded-xl bg-surface-2/60 p-1 w-fit">
        {availableLayers.map((layer) => {
          const meta = LAYER_META[layer];
          const Icon = meta.icon;
          return (
            <button
              key={layer}
              onClick={() => setActiveTab(layer)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                activeTab === layer
                  ? "bg-surface-4/80 text-white shadow-sm"
                  : "text-white/25 hover:text-white/50"
              )}
            >
              <Icon size={14} />
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="space-y-5">
        {activeControls.map((c) => (
          <ControlItem key={c.key} control={c} value={values[c.key]} onChange={onChange} />
        ))}
      </div>
    </div>
  );
}

function ControlItem({
  control,
  value,
  onChange,
}: {
  control: ControlDefinition;
  value: unknown;
  onChange: (key: string, value: unknown) => void;
}) {
  const v = value ?? control.default;

  if (control.type === "slider") {
    return (
      <div className="flex items-center gap-6">
        <span className="text-sm text-white/50 w-40 shrink-0">{control.label}</span>
        <input
          type="range"
          min={control.min ?? 0}
          max={control.max ?? 1}
          step={control.step ?? 0.01}
          value={Number(v)}
          onChange={(e) => onChange(control.key, parseFloat(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm font-mono text-white/30 w-14 text-right shrink-0">{String(v)}</span>
      </div>
    );
  }

  if (control.type === "select") {
    return (
      <div className="flex items-center gap-6">
        <span className="text-sm text-white/50 w-40 shrink-0">{control.label}</span>
        <div className="flex items-center gap-2 flex-wrap">
          {control.options?.map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => onChange(control.key, opt.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-100",
                String(v) === String(opt.value)
                  ? "bg-white/[0.1] text-white/80"
                  : "bg-white/[0.03] text-white/25 hover:text-white/45 hover:bg-white/[0.06]"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (control.type === "toggle") {
    return (
      <div className="flex items-center gap-6">
        <span className="text-sm text-white/50 w-40 shrink-0">{control.label}</span>
        <button
          onClick={() => onChange(control.key, !v)}
          className={cn(
            "w-10 h-[22px] rounded-full transition-colors duration-150 relative",
            v ? "bg-white/30" : "bg-white/[0.08]"
          )}
        >
          <div
            className={cn(
              "absolute top-[3px] w-4 h-4 rounded-full bg-white transition-all duration-150",
              v ? "left-[22px]" : "left-[3px]",
              v ? "opacity-90" : "opacity-40"
            )}
          />
        </button>
      </div>
    );
  }

  if (control.type === "color") {
    return (
      <div className="flex items-center gap-6">
        <span className="text-sm text-white/50 w-40 shrink-0">{control.label}</span>
        <input
          type="color"
          value={String(v)}
          onChange={(e) => onChange(control.key, e.target.value)}
          className="w-8 h-8 rounded-lg bg-transparent cursor-pointer"
        />
        <span className="text-sm font-mono text-white/25">{String(v)}</span>
      </div>
    );
  }

  return null;
}
