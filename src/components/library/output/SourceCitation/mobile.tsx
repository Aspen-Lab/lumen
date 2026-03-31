"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { type Citation, type SourceCitationProps } from "./index";

/* ── Default data (mirrored from desktop) ── */
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

/* ── Bottom sheet ── */
function BottomSheet({
  citation,
  onClose,
  accentColor,
  previewBgColor,
}: {
  citation: Citation;
  onClose: () => void;
  accentColor: string;
  previewBgColor: string;
}) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTouchOutside = (e: TouchEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("touchstart", handleTouchOutside);
    return () => document.removeEventListener("touchstart", handleTouchOutside);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-black/50"
        onTouchStart={onClose}
      />

      {/* Sheet */}
      <motion.div
        ref={sheetRef}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-white/[0.1] pb-safe"
        style={{ background: previewBgColor }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full bg-white/20" />
        </div>

        <div className="px-5 pb-8 pt-3">
          {/* Top accent line */}
          <div
            className="h-px w-full mb-4 rounded-full"
            style={{
              background: `linear-gradient(to right, ${accentColor}80, transparent)`,
            }}
          />

          {/* Citation number badge */}
          <div className="flex items-center gap-2.5 mb-3">
            <span
              className="inline-flex items-center justify-center rounded text-[10px] font-mono font-bold px-2 py-0.5 min-w-[22px]"
              style={{
                background: `${accentColor}1F`,
                color: accentColor,
                border: `1px solid ${accentColor}33`,
              }}
            >
              {citation.label}
            </span>
            <span
              className="text-[13px] font-semibold leading-tight"
              style={{ color: accentColor }}
            >
              {citation.source}
            </span>
          </div>

          {/* Excerpt */}
          <p className="text-[13px] leading-relaxed text-white/55 mb-4">
            {citation.excerpt}
          </p>

          {/* URL button */}
          {citation.url && (
            <a
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-lg border border-white/[0.1] py-3 text-[12px] font-medium text-white/60 active:bg-white/[0.05] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M2 10L10 2M10 2H5M10 2V7"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Open source
            </a>
          )}

          {/* Close button */}
          <button
            className="mt-2.5 flex items-center justify-center w-full rounded-lg py-3 text-[12px] text-white/30 active:text-white/50 transition-colors"
            onClick={onClose}
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </>
  );
}

/* ── Mobile citation chip ── */
function CitationChipMobile({
  citation,
  accentColor,
  chipSize,
  chipBgColor,
  showPreview,
  onTap,
}: {
  citation: Citation;
  accentColor: string;
  chipSize: "sm" | "md";
  chipBgColor: string;
  showPreview: boolean;
  onTap: (citation: Citation) => void;
}) {
  const sizeClasses =
    chipSize === "sm"
      ? "text-[9px] px-1.5 py-0.5 min-w-[18px]"
      : "text-[10px] px-2 py-0.5 min-w-[22px]";

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.1 }}
      onTouchEnd={(e) => {
        e.preventDefault();
        if (showPreview) onTap(citation);
      }}
      onClick={() => {
        if (showPreview) onTap(citation);
      }}
      className={cn(
        "inline-flex items-center justify-center rounded font-mono font-bold leading-none cursor-pointer select-none",
        sizeClasses
      )}
      style={{
        background: chipBgColor,
        color: accentColor,
        border: `1px solid ${accentColor}33`,
        verticalAlign: "baseline",
      }}
    >
      {citation.label}
    </motion.button>
  );
}

/* ── Mobile main export ── */
export function SourceCitationMobile({
  citations = DEFAULT_CITATIONS,
  text = DEFAULT_TEXT,
  accentColor = "#0091FF",
  chipSize = "sm",
  showPreview = true,
  chipBgColor = "rgba(0,145,255,0.12)",
  previewBgColor = "#1A1A24",
}: SourceCitationProps) {
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  const segments = parseTextSegments(text, citations);

  return (
    <div className="w-full max-w-[375px] mx-auto select-none">
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
      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-4 text-[13px] leading-[1.85] text-white/70">
        {segments.map((seg, i) =>
          seg.type === "text" ? (
            <span key={i}>{seg.content}</span>
          ) : (
            <CitationChipMobile
              key={i}
              citation={seg.citation}
              accentColor={accentColor}
              chipSize={chipSize}
              chipBgColor={chipBgColor}
              showPreview={showPreview}
              onTap={setActiveCitation}
            />
          )
        )}
      </div>

      {/* Citation list */}
      <div className="mt-3 flex flex-col gap-1.5">
        {citations.map((c) => (
          <button
            key={c.id}
            className="flex items-start gap-2.5 text-left active:opacity-70 transition-opacity"
            onClick={() => showPreview && setActiveCitation(c)}
          >
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
            <span className="text-[11px] text-white/40 leading-snug">
              <span className="text-white/60 font-medium">{c.source}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-center">
        <span className="text-[10px] font-mono text-white/15 uppercase tracking-[0.1em]">
          tap chips to preview · lumen source-citation
        </span>
      </div>

      {/* Bottom sheet portal */}
      <AnimatePresence>
        {activeCitation && (
          <BottomSheet
            citation={activeCitation}
            onClose={() => setActiveCitation(null)}
            accentColor={accentColor}
            previewBgColor={previewBgColor}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
