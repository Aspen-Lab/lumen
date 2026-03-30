"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react";

interface CodePanelProps {
  code: string;
}

export function CodePanel({ code }: CodePanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border border-white/[0.06] bg-surface-1 overflow-hidden">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 px-5 py-3 text-xs font-medium text-white/40 uppercase tracking-widest hover:text-white/60 transition-colors"
        >
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          Code
        </button>
        {expanded && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-3 text-xs text-white/25 hover:text-white/50 transition-colors"
          >
            {copied ? <Check size={12} className="text-white/60" /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
      {expanded && (
        <div className="border-t border-white/[0.04]">
          <pre className="p-5 overflow-x-auto text-xs leading-relaxed font-mono text-white/40">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
