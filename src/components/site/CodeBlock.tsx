"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  lang?: string;
  maxHeight?: number;
}

export function CodeBlock({ code, lang = "tsx", maxHeight }: CodeBlockProps) {
  const [html, setHtml] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    codeToHtml(code.trim(), {
      lang,
      theme: "github-dark-default",
    }).then(setHtml);
  }, [code, lang]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const lines = code.trim().split("\n");

  return (
    <div className="relative group/code rounded-xl bg-surface-1/80 overflow-hidden">
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-white/[0.04] text-white/20 hover:text-white/60 hover:bg-white/[0.08] opacity-0 group-hover/code:opacity-100 transition-all"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>

      <div
        className="overflow-auto"
        style={maxHeight ? { maxHeight } : undefined}
      >
        <div className="flex">
          {/* Line numbers */}
          <div className="shrink-0 py-4 pl-4 pr-2 select-none">
            {lines.map((_, i) => (
              <div
                key={i}
                className="text-[12px] leading-[1.7] font-mono text-white/10 text-right"
                style={{ minWidth: lines.length >= 100 ? 28 : 20 }}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code */}
          <div className="flex-1 py-4 pr-4 min-w-0 overflow-x-auto">
            {html ? (
              <div
                className="text-[12px] leading-[1.7] [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!m-0 [&_code]:!bg-transparent"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <pre className="text-[12px] leading-[1.7] font-mono text-white/40">
                <code>{code.trim()}</code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
