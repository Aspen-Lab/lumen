"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Copy, Check, Share2 } from "lucide-react";
import { getComponentBySlug } from "@/data/registry";
import { loadComponent, type ComponentEntry } from "@/data/component-loader";
import { DeviceToggle, type Device } from "@/components/site/DeviceToggle";
import { ControlsPanel } from "@/components/site/ControlsPanel";
import { getPresetsForComponent } from "@/data/presets";
import { ControlDefinition } from "@/types/controls";
import { cn } from "@/lib/utils";
import { CodeHighlight } from "@/components/site/CodeHighlight";
import { CopyToast } from "@/components/site/CopyToast";

function parseSearchParams(
  searchParams: URLSearchParams,
  controls: ControlDefinition[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  controls.forEach((c) => {
    const raw = searchParams.get(c.key);
    if (raw === null) return;
    if (c.type === "toggle") result[c.key] = raw === "true";
    else if (c.type === "slider") result[c.key] = parseFloat(raw);
    else result[c.key] = raw;
  });
  return result;
}

function serializeValues(
  values: Record<string, unknown>,
  defaults: Record<string, unknown>
): string {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([k, v]) => {
    if (v !== undefined && v !== defaults[k]) {
      params.set(k, String(v));
    }
  });
  return params.toString();
}

type ViewTab = "preview" | "code";

export default function ComponentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [entry, setEntry] = useState<ComponentEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [device, setDevice] = useState<Device>("desktop");
  const [view, setView] = useState<ViewTab>("preview");
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [controlValues, setControlValues] = useState<Record<string, unknown>>({});

  const meta = getComponentBySlug(slug);

  // Lazy load component
  useEffect(() => {
    setLoading(true);
    loadComponent(slug).then((loaded) => {
      setEntry(loaded);
      if (loaded) {
        const defaults: Record<string, unknown> = {};
        loaded.controls.forEach((c) => { defaults[c.key] = c.default; });
        const fromUrl = parseSearchParams(searchParams, loaded.controls);
        setControlValues({ ...defaults, ...fromUrl });
      }
      setLoading(false);
    });
  }, [slug, searchParams]);

  const defaultValues = useMemo(() => {
    if (!entry) return {};
    const vals: Record<string, unknown> = {};
    entry.controls.forEach((c) => { vals[c.key] = c.default; });
    return vals;
  }, [entry]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-5 h-5 rounded-full border-2 border-white/10 border-t-white/40 animate-spin" />
      </div>
    );
  }

  if (!meta || !entry) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-white/25 text-sm">Component not found.</p>
      </div>
    );
  }

  const handleControlChange = (key: string, value: unknown) => {
    setControlValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleShare = async () => {
    const qs = serializeValues(controlValues, defaultValues);
    const url = `${window.location.origin}${window.location.pathname}${qs ? "?" + qs : ""}`;
    await navigator.clipboard.writeText(url);
    setShared(true);
    setTimeout(() => setShared(false), 1500);
  };

  const handleReset = () => {
    setControlValues(defaultValues);
    router.replace(window.location.pathname);
  };

  const resolvedCode = typeof entry.code === "function"
    ? entry.code(controlValues)
    : entry.code;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(resolvedCode);
    setCopied(true);
    setShowToast(true);
    setTimeout(() => setCopied(false), 1500);
    setTimeout(() => setShowToast(false), 5000);
  };

  const Component = device === "desktop" ? entry.desktop : entry.mobile;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-3">
          {meta.name}
        </h1>
        <p className="text-base text-white/35">{meta.description}</p>
      </div>

      {/* Pill toggle bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-xl bg-surface-2/80 p-1">
          {(["preview", "code"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                view === tab
                  ? "bg-surface-4/80 text-white shadow-sm"
                  : "text-white/30 hover:text-white/55"
              )}
            >
              {tab === "preview" ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  Preview
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  Code
                </>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm text-white/20 hover:text-white/50 hover:bg-white/[0.04] transition-all"
          >
            {shared ? <Check size={13} className="text-white/60" /> : <Share2 size={13} />}
            {shared ? "Copied URL" : "Share"}
          </button>

          {view === "preview" ? (
            <DeviceToggle device={device} onChange={setDevice} />
          ) : (
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all"
            >
              {copied ? <Check size={14} className="text-white/70" /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
      </div>

      {/* Main window */}
      <div className="rounded-2xl bg-surface-1/60 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/20">
        {view === "preview" ? (
          <div className="relative">
            {/* Grid background */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            />

            {/* Crosshair center lines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-6 right-6 h-px bg-white/[0.03]" />
              <div className="absolute left-1/2 top-6 bottom-6 w-px bg-white/[0.03]" />
            </div>

            {/* Corner marks */}
            {[
              "top-4 left-4",
              "top-4 right-4",
              "bottom-4 left-4",
              "bottom-4 right-4",
            ].map((pos) => (
              <div key={pos} className={`absolute ${pos} w-5 h-5 pointer-events-none`}>
                <div className={`absolute ${pos.includes("top") ? "top-0" : "bottom-0"} ${pos.includes("left") ? "left-0" : "right-0"} w-full h-px bg-white/[0.08]`} />
                <div className={`absolute ${pos.includes("top") ? "top-0" : "bottom-0"} ${pos.includes("left") ? "left-0" : "right-0"} h-full w-px bg-white/[0.08]`} />
              </div>
            ))}

            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-32 bg-white/[0.01] blur-3xl rounded-full pointer-events-none" />

            {/* Component */}
            <div
              className={cn(
                "relative z-[1] min-h-[460px] flex items-center justify-center p-12 transition-all duration-300",
                device === "mobile" && "max-w-[375px] mx-auto"
              )}
            >
              <Component {...controlValues} />
            </div>

            {/* Bottom info bar */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none z-[2]">
              <span className="text-[10px] font-mono text-white/[0.08] uppercase tracking-wider">
                {device} preview
              </span>
              <span className="text-[10px] font-mono text-white/[0.08]">
                {device === "desktop" ? "960×auto" : "375×auto"}
              </span>
            </div>
          </div>
        ) : (
          <CodeHighlight code={resolvedCode} />
        )}
      </div>

      {/* Controls */}
      {entry.controls.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white/80 mb-4">Customize</h2>
          <ControlsPanel
            controls={entry.controls}
            values={controlValues}
            onChange={handleControlChange}
            presets={getPresetsForComponent(entry.controls.map((c) => c.key))}
            onApplyPreset={(presetValues) => setControlValues((prev) => ({ ...prev, ...presetValues }))}
            onReset={handleReset}
          />
        </div>
      )}

      <CopyToast show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}
