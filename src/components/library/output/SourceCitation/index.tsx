"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Types ── */
export interface Citation {
  id: number;
  label: string;
  source: string;
  excerpt: string;
  url?: string;
}

export interface SourceCitationProps {
  citations?: Citation[];
  text?: string;
  accentColor?: string;
  chipSize?: "sm" | "md";
  showPreview?: boolean;
  /* Color props */
  chipBgColor?: string;
  previewBgColor?: string;
}

/* ── Default data ── */
const DEFAULT_CITATIONS: Citation[] = [
  {
    id: 1,
    label: "1",
    source: "Attention Is All You Need",
    excerpt:
      "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms.",
    url: "https://arxiv.org/abs/1706.03762",
  },
  {
    id: 2,
    label: "2",
    source: "Language Models are Few-Shot Learners",
    excerpt:
      "We demonstrate that scaling language models greatly improves task-agnostic, few-shot performance, sometimes matching the performance of prior state-of-the-art fine-tuning approaches.",
    url: "https://arxiv.org/abs/2005.14165",
  },
  {
    id: 3,
    label: "3",
    source: "Constitutional AI: Harmlessness from AI Feedback",
    excerpt:
      "We propose a method for training a harmless AI assistant using a set of principles and a process of self-critique and revision, reducing reliance on human feedback for harmful outputs.",
    url: "https://arxiv.org/abs/2212.08073",
  },
];

const DEFAULT_TEXT =
  "Large language models have transformed the field of natural language processing [1], demonstrating remarkable few-shot learning capabilities across diverse tasks [2]. Recent work has focused on aligning these models with human values and intent [3], paving the way for safer and more reliable AI assistants.";

/* ── Helpers ── */
function parseTextSegments(
  text: string,
  citations: Citation[]
): Array<{ type: "text"; content: string } | { type: "cite"; citation: Citation }> {
  const parts: Array<
    { type: "text"; content: string } | { type: "cite"; citation: Citation }
  > = [];

  const regex = /\[(\d+)\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

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

/* ── Preview card ── */
function PreviewCard({
  citation,
  accentColor,
  previewBgColor,
}: {
  citation: Citation;
  accentColor: string;
  previewBgColor: string;
}) {
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
        {/* Top accent line */}
        <div
          className="h-px w-full mb-3 rounded-full"
          style={{
            background: `linear-gradient(to right, ${accentColor}80, transparent)`,
          }}
        />

        {/* Source label */}
        <div className="flex items-start gap-2 mb-2">
          <div
            className="mt-[3px] flex-shrink-0 w-1 h-1 rounded-full"
            style={{ background: accentColor }}
          />
          <span
            className="text-[11px] font-semibold leading-tight"
            style={{ color: accentColor }}
          >
            {citation.source}
          </span>
        </div>

        {/* Excerpt */}
        <p className="text-[11.5px] leading-relaxed text-white/55 line-clamp-3 mb-2.5">
          {citation.excerpt}
        </p>

        {/* URL */}
        {citation.url && (
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-mono text-white/30 hover:text-white/55 transition-colors duration-150 truncate"
            onClick={(e) => e.stopPropagation()}
          >
            <svg
              width="9"
              height="9"
              viewBox="0 0 9 9"
              fill="none"
              className="flex-shrink-0"
            >
              <path
                d="M1.5 7.5L7.5 1.5M7.5 1.5H3M7.5 1.5V6"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {citation.url.replace(/^https?:\/\//, "")}
          </a>
        )}

        {/* Pointer arrow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -bottom-[5px] w-2.5 h-2.5 rotate-45 border-r border-b border-white/[0.1]"
          style={{ background: previewBgColor }}
        />
      </div>
    </motion.div>
  );
}

/* ── Citation chip ── */
function CitationChip({
  citation,
  accentColor,
  chipSize,
  chipBgColor,
  showPreview,
  previewBgColor,
}: {
  citation: Citation;
  accentColor: string;
  chipSize: "sm" | "md";
  chipBgColor: string;
  showPreview: boolean;
  previewBgColor: string;
}) {
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHovered(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setHovered(false), 120);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const sizeClasses =
    chipSize === "sm"
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
          border: `1px solid ${accentColor}33`,
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

/* ── Main component ── */
export function SourceCitation({
  citations = DEFAULT_CITATIONS,
  text = DEFAULT_TEXT,
  accentColor = "#0091FF",
  chipSize = "sm",
  showPreview = true,
  chipBgColor = "rgba(0,145,255,0.12)",
  previewBgColor = "#1A1A24",
}: SourceCitationProps) {
  const segments = parseTextSegments(text, citations);

  return (
    <div className="w-full max-w-[640px] mx-auto select-none">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: accentColor }}
        />
        <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-white/35">
          AI Response
        </span>
        <span className="ml-auto text-[11px] font-mono text-white/20">
          {citations.length} source{citations.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Body text */}
      <div
        className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-5 py-4 text-[13.5px] leading-[1.8] text-white/70"
        style={{ wordBreak: "break-word" }}
      >
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

      {/* Citation list */}
      <div className="mt-3 flex flex-col gap-1.5">
        {citations.map((c) => (
          <div key={c.id} className="flex items-start gap-2.5">
            <span
              className={cn(
                "flex-shrink-0 inline-flex items-center justify-center rounded font-mono font-bold leading-none mt-[1px]",
                chipSize === "sm"
                  ? "text-[9px] px-1.5 py-0.5 min-w-[18px]"
                  : "text-[10px] px-2 py-0.5 min-w-[22px]"
              )}
              style={{
                background: chipBgColor,
                color: accentColor,
                border: `1px solid ${accentColor}33`,
              }}
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
                    {c.url.replace(/^https?:\/\//, "")}
                  </a>
                </>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-center">
        <span className="text-[10px] font-mono text-white/15 uppercase tracking-[0.1em]">
          hover chips to preview · lumen source-citation
        </span>
      </div>
    </div>
  );
}
