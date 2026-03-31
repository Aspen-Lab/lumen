const STATIC_SOURCE = `"use client";

import { cn } from "@/lib/utils";

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

  const trackBg = \`linear-gradient(to right, \${trackColor} \${pct}%, rgba(255,255,255,0.08) \${pct}%)\`;

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
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

      <div className="relative flex items-center h-5">
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
              "--track-bg": trackBg,
              "--thumb-color": thumbColor,
            } as React.CSSProperties
          }
        />
      </div>

      <style>{\`
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
      \`}</style>
    </div>
  );
}`;

export function generateSliderCode(props: Record<string, unknown>): string {
  const defaults: Record<string, unknown> = {
    min: 0,
    max: 100,
    step: 1,
    label: "Volume",
    showValue: true,
    trackColor: "#0BE09B",
    thumbColor: "#FFFFFF",
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
  const min = props.min ?? defaults.min;
  const max = props.max ?? defaults.max;
  return `// Usage\n<Slider\n  value={50}\n  onChange={setValue}\n  min={${min}}\n  max={${max}}${propsBlock}/>\n\n${STATIC_SOURCE}`;
}

export const sliderCode = generateSliderCode({});
