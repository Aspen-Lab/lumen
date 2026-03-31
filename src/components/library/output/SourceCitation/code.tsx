export const sourceCitationCode = `"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Citation {
  id: number;
  label: string;
  source: string;
  excerpt: string;
  url?: string;
}

export interface SourceCitationProps {
  citations: Citation[];
  text: string;
  accentColor?: string;
  chipSize?: "sm" | "md";
  showPreview?: boolean;
  chipBgColor?: string;
  previewBgColor?: string;
}

function parseTextSegments(text, citations) {
  const parts = [];
  const regex = /\\[(\\d+)\\]/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    const id = parseInt(match[1], 10);
    const citation = citations.find((c) => c.id === id);
    if (citation) {
      parts.push({ type: "cite", citation });
    } else {
      parts.push({ type: "text", content: match[0] });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }
  return parts;
}

function PreviewCard({ citation, accentColor, previewBgColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 6 }}
      transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
      className="absolute bottom-full left-1/2 mb-2.5 z-50 w-[280px]"
      style={{ transform: "translateX(-50%)" }}
    >
      <div
        className="rounded-xl border border-white/[0.1] p-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        style={{ background: previewBgColor }}
      >
        <div
          className="h-px w-full mb-3 rounded-full"
          style={{ background: \`linear-gradient(to right, \${accentColor}80, transparent)\` }}
        />
        <div className="flex items-start gap-2 mb-2">
          <div className="mt-[3px] flex-shrink-0 w-1 h-1 rounded-full" style={{ background: accentColor }} />
          <span className="text-[11px] font-semibold leading-tight" style={{ color: accentColor }}>
            {citation.source}
          </span>
        </div>
        <p className="text-[11.5px] leading-relaxed text-white/55 line-clamp-3 mb-2.5">
          {citation.excerpt}
        </p>
        {citation.url && (
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-mono text-white/30 hover:text-white/55 transition-colors duration-150 truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {citation.url.replace(/^https?:\\/\\//, "")}
          </a>
        )}
        <div
          className="absolute left-1/2 -translate-x-1/2 -bottom-[5px] w-2.5 h-2.5 rotate-45 border-r border-b border-white/[0.1]"
          style={{ background: previewBgColor }}
        />
      </div>
    </motion.div>
  );
}

function CitationChip({ citation, accentColor, chipSize, chipBgColor, showPreview, previewBgColor }) {
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef(null);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHovered(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setHovered(false), 120);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const sizeClasses = chipSize === "sm"
    ? "text-[9px] px-1.5 py-0.5 min-w-[18px]"
    : "text-[10px] px-2 py-0.5 min-w-[22px]";

  return (
    <span className="relative inline-block" style={{ verticalAlign: "baseline" }}>
      <motion.button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.12 }}
        className={cn(
          "inline-flex items-center justify-center rounded font-mono font-bold leading-none cursor-pointer select-none transition-all duration-150",
          sizeClasses
        )}
        style={{
          background: chipBgColor,
          color: accentColor,
          border: \`1px solid \${accentColor}33\`,
        }}
      >
        {citation.label}
      </motion.button>
      {showPreview && (
        <AnimatePresence>
          {hovered && (
            <PreviewCard
              citation={citation}
              accentColor={accentColor}
              previewBgColor={previewBgColor}
            />
          )}
        </AnimatePresence>
      )}
    </span>
  );
}

export function SourceCitation({
  citations,
  text,
  accentColor = "#0091FF",
  chipSize = "sm",
  showPreview = true,
  chipBgColor = "rgba(0,145,255,0.12)",
  previewBgColor = "#1A1A24",
}) {
  const segments = parseTextSegments(text, citations);

  return (
    <div className="w-full max-w-[640px] mx-auto select-none">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor }} />
        <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-white/35">
          AI Response
        </span>
        <span className="ml-auto text-[11px] font-mono text-white/20">
          {citations.length} source{citations.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-5 py-4 text-[13.5px] leading-[1.8] text-white/70">
        {segments.map((seg, i) =>
          seg.type === "text" ? (
            <span key={i}>{seg.content}</span>
          ) : (
            <CitationChip
              key={i}
              citation={seg.citation}
              accentColor={accentColor}
              chipSize={chipSize}
              chipBgColor={chipBgColor}
              showPreview={showPreview}
              previewBgColor={previewBgColor}
            />
          )
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1.5">
        {citations.map((c) => (
          <div key={c.id} className="flex items-start gap-2.5">
            <span
              className={cn(
                "flex-shrink-0 inline-flex items-center justify-center rounded font-mono font-bold leading-none mt-[1px]",
                chipSize === "sm" ? "text-[9px] px-1.5 py-0.5 min-w-[18px]" : "text-[10px] px-2 py-0.5 min-w-[22px]"
              )}
              style={{ background: chipBgColor, color: accentColor, border: \`1px solid \${accentColor}33\` }}
            >
              {c.label}
            </span>
            <span className="text-[11.5px] text-white/40 leading-snug">
              <span className="text-white/60 font-medium">{c.source}</span>
              {c.url && (
                <>
                  {" — "}
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/30 hover:text-white/55 transition-colors duration-150 font-mono"
                  >
                    {c.url.replace(/^https?:\\/\\//, "")}
                  </a>
                </>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}`;

export function generateSourceCitationCode(props: Record<string, unknown>): string {
  const defaults: Record<string, unknown> = {
    accentColor: "#0091FF",
    chipSize: "sm",
    showPreview: true,
    chipBgColor: "rgba(0,145,255,0.12)",
    previewBgColor: "#1A1A24",
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

  return `// Usage
<SourceCitation${propsBlock}/>

// Full source code below...
${sourceCitationCode}`;
}
