"use client";

import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────── */

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  trackColor?: string;
  thumbColor?: string;
  className?: string;
}

/* ── Slider ─────────────────────────────────────────────────── */

export function Slider({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  showValue = true,
  trackColor = "#0BE09B",
  thumbColor = "#FFFFFF",
  className,
}: SliderProps) {
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;

  const trackBg = `linear-gradient(to right, ${trackColor} ${pct}%, rgba(255,255,255,0.08) ${pct}%)`;

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {/* Label row */}
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-xs text-white/50 leading-none">{label}</span>
          )}
          {showValue && (
            <span className="font-mono text-xs text-white/60 leading-none tabular-nums ml-auto">
              {Number.isInteger(step) ? value : value.toFixed(2)}
            </span>
          )}
        </div>
      )}

      {/* Track + thumb */}
      <div className="relative flex items-center h-5">
        {/* Custom-styled range input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full appearance-none bg-transparent cursor-pointer focus-visible:outline-none"
          style={
            {
              /* Track */
              "--track-bg": trackBg,
              /* Thumb */
              "--thumb-color": thumbColor,
            } as React.CSSProperties
          }
        />
      </div>

      <style>{`
        input[type="range"] {
          -webkit-appearance: none;
          height: 2px;
          background: var(--track-bg);
          border-radius: 1px;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--thumb-color);
          border: none;
          box-shadow: 0 0 0 2px rgba(0,0,0,0.4);
          transition: transform 0.1s ease;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--thumb-color);
          border: none;
          box-shadow: 0 0 0 2px rgba(0,0,0,0.4);
        }
        input[type="range"]::-moz-range-track {
          height: 2px;
          background: var(--track-bg);
          border-radius: 1px;
        }
      `}</style>
    </div>
  );
}
