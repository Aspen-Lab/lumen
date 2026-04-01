"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Copy, Check, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getComponentBySlug } from "@/data/registry";
import { loadComponent, type ComponentEntry } from "@/data/component-loader";
import { DeviceToggle, type Device } from "@/components/site/DeviceToggle";
import { ControlsPanel } from "@/components/site/ControlsPanel";
import { getPresetsForComponent } from "@/data/presets";
import { ControlDefinition } from "@/types/controls";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/site/CodeBlock";
import { CodeHighlight } from "@/components/site/CodeHighlight";
import { CopyToast } from "@/components/site/CopyToast";
import { BlueprintView } from "@/components/site/BlueprintView";

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

function generateUsageSnippet(
  name: string,
  values: Record<string, unknown>,
  defaults: Record<string, unknown>
): string {
  const customProps = Object.entries(values)
    .filter(([k, v]) => v !== undefined && v !== defaults[k])
    .map(([k, v]) => {
      if (typeof v === "string") return `  ${k}="${v}"`;
      if (typeof v === "boolean") return v ? `  ${k}` : `  ${k}={false}`;
      return `  ${k}={${JSON.stringify(v)}}`;
    });

  const importLine = `import { ${name} } from "./${name}"`;
  const jsx = customProps.length > 0
    ? `<${name}\n${customProps.join("\n")}\n/>`
    : `<${name} />`;

  return `${importLine}\n\n${jsx}`;
}

function getSourceCode(resolvedCode: string): string {
  // Strip the "// Usage\n<Component.../>\n\n" prefix if present
  const marker = '"use client"';
  const idx = resolvedCode.indexOf(marker);
  if (idx > 0) return resolvedCode.slice(idx);
  return resolvedCode;
}

type ViewTab = "preview" | "code" | "blueprint";

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
  const [pkgMgr, setPkgMgr] = useState<"npm" | "pnpm" | "yarn" | "bun">("npm");
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
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-3">
          {meta.name}
        </h1>
        <p className="text-base text-white/35">{meta.description}</p>
      </div>

      {/* Pill toggle bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-xl bg-surface-2/80 p-1 relative">
          {(["preview", "code", "blueprint"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 z-[1]",
                view === tab
                  ? "text-white"
                  : "text-white/30 hover:text-white/55",
                tab === "blueprint" && !entry.blueprint && "hidden"
              )}
            >
              {view === tab && (
                <motion.div
                  layoutId="view-tab"
                  className="absolute inset-0 bg-surface-4/80 rounded-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-[1] flex items-center gap-2">
              {tab === "preview" ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  Preview
                </>
              ) : tab === "code" ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  Code
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M1 12h4M19 12h4M4.2 19.8l2.8-2.8M17 7l2.8-2.8"/></svg>
                  Blueprint
                </>
              )}
              </span>
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

          {view === "preview" && (
            <DeviceToggle device={device} onChange={setDevice} />
          )}
        </div>
      </div>

      {/* Tech stack + Install + Usage — code mode only */}
      {view === "code" && (
        <div className="space-y-8">
          {/* Tech Stack */}
          <div>
            <h3 className="text-lg font-semibold text-white/80 mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "React", icon: "⚛" },
                { name: "TypeScript", icon: "TS" },
                { name: "Framer Motion", icon: "FM" },
                { name: "Tailwind CSS", icon: "TW" },
                { name: "Next.js", icon: "▲" },
              ].map((t) => (
                <div
                  key={t.name}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-1/80 text-sm"
                >
                  <span className="text-[11px] font-mono text-white/25 w-5 text-center">{t.icon}</span>
                  <span className="text-white/50">{t.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Install */}
          <div>
            <h3 className="text-lg font-semibold text-white/80 mb-3">Install</h3>
            <div className="flex items-center gap-2 mb-3">
              {(["npm", "pnpm", "yarn", "bun"] as const).map((pm) => (
                <button
                  key={pm}
                  onClick={() => setPkgMgr(pm)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-mono transition-all",
                    pkgMgr === pm
                      ? "bg-white/[0.08] text-white/70"
                      : "text-white/25 hover:text-white/45"
                  )}
                >
                  {pm}
                </button>
              ))}
            </div>
            <CodeBlock
              code={
                pkgMgr === "npm" ? "npm install framer-motion clsx tailwind-merge" :
                pkgMgr === "pnpm" ? "pnpm add framer-motion clsx tailwind-merge" :
                pkgMgr === "yarn" ? "yarn add framer-motion clsx tailwind-merge" :
                "bun add framer-motion clsx tailwind-merge"
              }
              lang="bash"
            />
          </div>

          {/* Usage */}
          <div>
            <h3 className="text-lg font-semibold text-white/80 mb-3">Usage</h3>
            <CodeBlock code={generateUsageSnippet(meta.name, controlValues, defaultValues)} />
          </div>
        </div>
      )}

      {/* Main window — Code label when in code mode */}
      {view === "code" && (
        <h3 className="text-lg font-semibold text-white/80">Code</h3>
      )}

      <div className="rounded-2xl bg-surface-1/60 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/20">
        <AnimatePresence mode="wait">
        {view === "preview" ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative"
            data-cursor="preview"
          >
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
                "relative z-[1] min-h-[460px] flex items-center justify-center p-12 transition-all duration-300 [&]:cursor-none",
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
          </motion.div>
        ) : null}
        {view === "code" && (
          <motion.div
            key="code"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CodeHighlight code={getSourceCode(resolvedCode)} />
          </motion.div>
        )}
        {view === "blueprint" && entry.blueprint && (
          <motion.div
            key="blueprint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <BlueprintView
              nodes={entry.blueprint}
              component={<Component {...controlValues} />}
            />
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      {/* Controls — only in preview mode */}
      {view === "preview" && entry.controls.length > 0 && (
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
    </motion.div>
  );
}
