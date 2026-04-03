"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ControlDefinition, ThemePreset } from "@/types/controls";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Layers, Zap, Palette } from "lucide-react";

function useThrottled(fn: (key: string, value: unknown) => void, ms = 50) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastArgs = useRef<[string, unknown]>(["", ""]);

  return useCallback((key: string, value: unknown) => {
    lastArgs.current = [key, value];
    if (!timer.current) {
      fn(key, value);
      timer.current = setTimeout(() => {
        timer.current = null;
        fn(lastArgs.current[0], lastArgs.current[1]);
      }, ms);
    }
  }, [fn, ms]);
}

interface ControlsPanelProps {
  controls: ControlDefinition[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  presets?: ThemePreset[];
  onApplyPreset?: (values: Record<string, unknown>) => void;
  onReset?: () => void;
}

const LAYER_META = {
  architecture: { label: "Architecture", icon: Layers },
  motion: { label: "Motion", icon: Zap },
  color: { label: "Color", icon: Palette },
} as const;

type Layer = keyof typeof LAYER_META;

export function ControlsPanel({ controls, values, onChange, presets, onApplyPreset, onReset }: ControlsPanelProps) {
  const availableLayers = (["architecture", "motion", "color"] as const).filter(
    (l) => controls.some((c) => c.layer === l)
  );

  const [activeTab, setActiveTab] = useState<Layer>(availableLayers[0]);

  const activeControls = controls.filter((c) => c.layer === activeTab);

  return (
    <div>
      {/* Presets row */}
      {presets && presets.length > 0 && onApplyPreset && (
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <span className="text-[10px] font-mono text-white/15 uppercase tracking-widest mr-1">Presets</span>
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => onApplyPreset(p.values)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white/[0.03] text-white/35 hover:text-white/60 hover:bg-white/[0.06] transition-all"
            >
              <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
              {p.name}
            </button>
          ))}
          {onReset && (
            <button
              onClick={onReset}
              className="px-2.5 py-1.5 rounded-lg text-xs text-white/15 hover:text-white/35 hover:bg-white/[0.03] transition-all ml-auto"
            >
              Reset
            </button>
          )}
        </div>
      )}

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
                "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 z-[1]",
                activeTab === layer
                  ? "text-white"
                  : "text-white/25 hover:text-white/50"
              )}
            >
              {activeTab === layer && (
                <motion.div
                  layoutId="ctrl-tab"
                  className="absolute inset-0 bg-surface-4/80 rounded-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-[1] flex items-center gap-2">
                <Icon size={14} />
                {meta.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Controls — animated entrance */}
      <motion.div
        key={activeTab}
        className="space-y-5"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeControls.map((c, i) => (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03, duration: 0.2 }}
          >
            <ControlItem control={c} value={values[c.key]} onChange={onChange} />
          </motion.div>
        ))}
      </motion.div>
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
    return <ColorPicker control={control} value={v} onChange={onChange} />;
  }

  return null;
}

/* ── Custom Color Picker ── */

const PRESET_COLORS = [
  "#0BE09B", "#0091FF", "#7C5CFC", "#F97316", "#EF4444",
  "#F472B6", "#FACC15", "#22D3EE", "#A78BFA", "#FFFFFF",
];

// Global recent colors (persists across all pickers in session)
const recentColors: string[] = [];
const MAX_RECENT = 8;

function addRecent(hex: string) {
  const normalized = hex.toLowerCase();
  const idx = recentColors.indexOf(normalized);
  if (idx !== -1) recentColors.splice(idx, 1);
  recentColors.unshift(normalized);
  if (recentColors.length > MAX_RECENT) recentColors.pop();
}

function hsvToHex(h: number, s: number, v: number): string {
  const i = Math.floor(h / 60) % 6;
  const f = h / 60 - Math.floor(h / 60);
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r = 0, g = 0, b = 0;
  switch (i) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return `#${[r, g, b].map((c) => Math.round(c * 255).toString(16).padStart(2, "0")).join("")}`;
}

function hexToHsv(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const m = clean.length === 3
    ? clean.split("").map((c) => c + c)
    : clean.match(/.{2}/g);
  if (!m || m.length < 3) return [0, 0, 1];
  const [r, g, b] = m.map((x) => parseInt(x, 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d > 0) {
    if (max === r) h = 60 * (((g - b) / d + 6) % 6);
    else if (max === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
  }
  const s = max === 0 ? 0 : d / max;
  return [h, s, max];
}

function ColorPicker({
  control,
  value,
  onChange,
}: {
  control: ControlDefinition;
  value: unknown;
  onChange: (key: string, value: unknown) => void;
}) {
  const raw = String(value ?? control.default);
  const hex = raw.startsWith("#") ? raw : "#ffffff";
  const [open, setOpen] = useState(false);
  const [hsv, setHsv] = useState<[number, number, number]>(() => hexToHsv(hex));
  const interacting = useRef(false);
  const popRef = useRef<HTMLDivElement>(null);

  // Only sync external value when NOT interacting
  useEffect(() => {
    if (interacting.current) return;
    const incoming = raw.startsWith("#") ? raw : "#ffffff";
    const [h, s, v] = hexToHsv(incoming);
    setHsv([h, s, v]);
  }, [raw]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const interactTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [, forceRender] = useState(0);

  const commit = (h: number, s: number, v: number) => {
    interacting.current = true;
    setHsv([h, s, v]);
    const hex = hsvToHex(h, s, v);
    onChange(control.key, hex);
    clearTimeout(interactTimer.current);
    interactTimer.current = setTimeout(() => { interacting.current = false; }, 150);
  };

  const commitAndTrack = (h: number, s: number, v: number) => {
    commit(h, s, v);
    addRecent(hsvToHex(h, s, v));
    forceRender((n) => n + 1);
  };

  const pickSwatch = (color: string) => {
    const [h, s, v] = hexToHsv(color);
    commit(h, s, v);
    addRecent(color);
    forceRender((n) => n + 1);
  };

  return (
    <div className="flex items-center gap-6 relative">
      <span className="text-sm text-white/50 w-40 shrink-0">{control.label}</span>

      {/* Swatch trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-lg ring-1 ring-white/[0.06] cursor-pointer transition-all hover:ring-white/[0.12]"
        style={{ background: hex }}
      />
      <span className="text-sm font-mono text-white/25">{hex}</span>

      {/* Popover */}
      {open && (
        <div
          ref={popRef}
          className="absolute left-40 bottom-0 z-50 rounded-xl bg-[#0C0C12] shadow-2xl shadow-black/60 overflow-hidden"
          style={{ width: 240 }}
        >
          {/* Top accent line */}
          <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${hex}, transparent)` }} />

          <div className="p-3">
            {/* SV area with corner marks */}
            <div className="relative mb-2.5">
              <SatValPad hue={hsv[0]} sat={hsv[1]} val={hsv[2]} onChange={(s, v) => commit(hsv[0], s, v)} />
              {/* Corner marks */}
              {[["top-0 left-0", "top left"], ["top-0 right-0", "top right"], ["bottom-0 left-0", "bottom left"], ["bottom-0 right-0", "bottom right"]].map(([pos, key]) => (
                <div key={key} className={`absolute ${pos} w-2 h-2 pointer-events-none`}>
                  <div className={`absolute ${pos.includes("top") ? "top-0" : "bottom-0"} ${pos.includes("left") ? "left-0" : "right-0"} ${pos.includes("left") ? "w-full" : "w-full"} h-px bg-white/10`} />
                  <div className={`absolute ${pos.includes("top") ? "top-0" : "bottom-0"} ${pos.includes("left") ? "left-0" : "right-0"} w-px ${pos.includes("top") ? "h-full" : "h-full"} bg-white/10`} />
                </div>
              ))}
            </div>

            {/* Hue strip */}
            <HueStrip hue={hsv[0]} onChange={(h) => commit(h, hsv[1], hsv[2])} />

            {/* Data row — HUD style */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-1.5 bg-white/[0.03] rounded-md px-2 py-1.5">
                <span className="text-[9px] text-white/20 font-mono">HEX</span>
                <input
                  className="flex-1 bg-transparent text-xs font-mono text-white/60 outline-none"
                  value={hsvToHex(hsv[0], hsv[1], hsv[2]).replace("#", "").toUpperCase()}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
                    if (v.length === 6) {
                      const [h, s, val] = hexToHsv("#" + v);
                      commitAndTrack(h, s, val);
                    }
                  }}
                  maxLength={6}
                />
              </div>
              {/* HSV readout */}
              <div className="flex gap-1.5 text-[9px] font-mono text-white/15">
                <span>H{Math.round(hsv[0])}</span>
                <span>S{Math.round(hsv[1] * 100)}</span>
                <span>V{Math.round(hsv[2] * 100)}</span>
              </div>
            </div>

            {/* Presets + Recent */}
            <div className="mt-3 pt-2.5" style={{ borderTop: "1px solid var(--white-5)" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono text-white/15 uppercase tracking-widest">Presets</span>
                <span className="text-[9px] font-mono text-white/10">{PRESET_COLORS.length}</span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => pickSwatch(c)}
                    className="w-[18px] h-[18px] rounded-[4px] ring-1 ring-white/[0.04] hover:ring-white/[0.1] transition-all hover:scale-125 active:scale-95"
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>

            {recentColors.length > 0 && (
              <div className="mt-2.5 pt-2.5" style={{ borderTop: "1px solid var(--white-5)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono text-white/15 uppercase tracking-widest">Recent</span>
                  <span className="text-[9px] font-mono text-white/10">{recentColors.length}</span>
                </div>
                <div className="flex gap-1.5">
                  {recentColors.map((c, i) => (
                    <button
                      key={`${c}-${i}`}
                      onClick={() => pickSwatch(c)}
                      className="w-[18px] h-[18px] rounded-[4px] ring-1 ring-white/[0.04] hover:ring-white/[0.1] transition-all hover:scale-125 active:scale-95"
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom accent line */}
          <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${hex}40, transparent)` }} />
        </div>
      )}
    </div>
  );
}

/* Saturation-Value pad */
function SatValPad({
  hue,
  sat,
  val,
  onChange,
}: {
  hue: number;
  sat: number;
  val: number;
  onChange: (s: number, v: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const update = useCallback((e: MouseEvent | React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const s = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const v = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
    onChangeRef.current(s, v);
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent) => { if (dragging.current) update(e); };
    const up = () => { dragging.current = false; };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [update]);

  const thumbX = `${sat * 100}%`;
  const thumbY = `${(1 - val) * 100}%`;

  return (
    <div
      ref={ref}
      className="w-full h-36 rounded-lg relative cursor-crosshair overflow-hidden"
      style={{
        background: `
          linear-gradient(to top, #000, transparent),
          linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))
        `,
      }}
      onMouseDown={(e) => {
        dragging.current = true;
        update(e);
      }}
    >
      {/* Crosshair lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute h-px bg-white/[0.15]" style={{ top: thumbY, left: 0, right: 0 }} />
        <div className="absolute w-px bg-white/[0.15]" style={{ left: thumbX, top: 0, bottom: 0 }} />
      </div>

      {/* Thumb — ring + inner dot */}
      <div
        className="absolute pointer-events-none"
        style={{ left: thumbX, top: thumbY, transform: "translate(-50%, -50%)" }}
      >
        <div className="w-4 h-4 rounded-full ring-[1.5px] ring-white/40 shadow-lg shadow-black/50"
          style={{ background: hsvToHex(hue, sat, val) }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-white/60" />
        </div>
      </div>

      {/* Scale ticks on left edge */}
      <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-between py-1 pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-1.5 h-px bg-white/[0.08]" />
        ))}
      </div>
    </div>
  );
}

function HueStrip({
  hue,
  onChange,
}: {
  hue: number;
  onChange: (h: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const update = useCallback((e: MouseEvent | React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const h = Math.max(0, Math.min(360, ((e.clientX - rect.left) / rect.width) * 360));
    onChangeRef.current(h);
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent) => { if (dragging.current) update(e); };
    const up = () => { dragging.current = false; };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [update]);

  return (
    <div className="relative mt-2.5">
      {/* Track */}
      <div
        ref={ref}
        className="w-full h-2.5 rounded-sm relative cursor-pointer"
        style={{
          background: "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
        }}
        onMouseDown={(e) => {
          dragging.current = true;
          update(e);
        }}
      >
        {/* Thumb — vertical bar style */}
        <div
          className="absolute top-[-3px] bottom-[-3px] w-[3px] rounded-full bg-white shadow-md shadow-black/50 pointer-events-none"
          style={{
            left: `${(hue / 360) * 100}%`,
            transform: "translateX(-50%)",
            boxShadow: `0 0 6px ${`hsl(${hue}, 100%, 50%)`}60`,
          }}
        />
      </div>
      {/* Degree readout */}
      <div className="flex justify-between mt-1">
        <span className="text-[8px] font-mono text-white/10">0°</span>
        <span className="text-[8px] font-mono text-white/20">{Math.round(hue)}°</span>
        <span className="text-[8px] font-mono text-white/10">360°</span>
      </div>
    </div>
  );
}
