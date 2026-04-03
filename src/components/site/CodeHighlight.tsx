"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { codeToHtml } from "shiki";

interface CodeHighlightProps {
  code: string;
  lang?: string;
}

export function CodeHighlight({ code, lang = "tsx" }: CodeHighlightProps) {
  const [html, setHtml] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollInfo, setScrollInfo] = useState({ ratio: 0, thumbRatio: 1 });

  useEffect(() => {
    codeToHtml(code, {
      lang,
      theme: "github-dark-default",
    }).then(setHtml);
  }, [code, lang]);

  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const thumbRatio = Math.min(clientHeight / scrollHeight, 1);
    const ratio = scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0;
    setScrollInfo({ ratio, thumbRatio });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScroll, { passive: true });
    const timer = setTimeout(updateScroll, 150);
    return () => {
      el.removeEventListener("scroll", updateScroll);
      clearTimeout(timer);
    };
  }, [html, updateScroll]);

  // Split code into sections: Usage block + source blocks
  const sections = splitSections(code);
  const lines = code.split("\n").length;
  const showMinimap = scrollInfo.thumbRatio < 0.95;

  return (
    <div className="relative flex">
      {/* Code area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto max-h-[600px]"
      >
        {sections.map((section, i) => (
          <div key={i}>
            {/* Section label */}
            {section.label && (
              <div className="sticky top-0 z-10 px-5 py-1.5 bg-white/[0.02] backdrop-blur-sm">
                <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                  {section.label}
                </span>
              </div>
            )}
            {/* Code block */}
            {html ? (
              <SyntaxBlock code={section.code} lang={lang} />
            ) : (
              <pre className="px-5 py-4 text-xs leading-relaxed font-mono text-white/40">
                <code>{section.code}</code>
              </pre>
            )}
          </div>
        ))}
      </div>

      {/* Minimap */}
      {showMinimap && (
        <div className="w-16 shrink-0 relative bg-white/[0.01]">
          {/* Mini code lines */}
          <div className="absolute inset-0 overflow-hidden px-1.5 py-2">
            {code.split("\n").slice(0, 150).map((line, i) => {
              const trimmed = line.trimStart();
              const indent = (line.length - trimmed.length) * 1.2;
              const w = Math.min(trimmed.length * 0.6, 100);
              // Color hints
              const isComment = trimmed.startsWith("//") || trimmed.startsWith("/*");
              const isImport = trimmed.startsWith("import ");
              const isKeyword = /^(export|const|function|return|if|else)/.test(trimmed);
              let color = "var(--white-12)";
              if (isComment) color = "var(--white-5)";
              if (isImport) color = "rgba(100,160,255,0.15)";
              if (isKeyword) color = "rgba(200,120,255,0.12)";

              return (
                <div
                  key={i}
                  className="h-[1.5px] mb-[0.5px] rounded-full"
                  style={{
                    width: `${Math.max(w, 3)}%`,
                    marginLeft: `${Math.min(indent, 30)}%`,
                    background: trimmed ? color : "transparent",
                  }}
                />
              );
            })}
          </div>

          {/* Viewport */}
          <div
            className="absolute left-0 right-0 rounded-sm bg-white/[0.05] transition-all duration-75"
            style={{
              top: `${scrollInfo.ratio * (1 - scrollInfo.thumbRatio) * 100}%`,
              height: `${Math.max(scrollInfo.thumbRatio * 100, 5)}%`,
            }}
          />

          {/* Line count */}
          <div className="absolute bottom-1 left-0 right-0 text-center text-[8px] font-mono text-white/10">
            {lines} lines
          </div>
        </div>
      )}
    </div>
  );
}

/* Split code into labeled sections */
function splitSections(code: string): { label: string; code: string }[] {
  const lines = code.split("\n");
  const sections: { label: string; code: string }[] = [];
  let current = { label: "", lines: [] as string[] };

  for (const line of lines) {
    // Detect section markers
    if (line.startsWith("// Usage")) {
      if (current.lines.length > 0) {
        sections.push({ label: current.label, code: current.lines.join("\n") });
      }
      current = { label: "Usage", lines: [] };
      continue;
    }
    if (line.startsWith('"use client"') && current.label === "Usage" && current.lines.length > 0) {
      sections.push({ label: current.label, code: current.lines.join("\n") });
      current = { label: "Source", lines: [line] };
      continue;
    }
    current.lines.push(line);
  }

  if (current.lines.length > 0) {
    sections.push({ label: current.label, code: current.lines.join("\n") });
  }

  return sections;
}

/* Individual syntax-highlighted block */
function SyntaxBlock({ code, lang }: { code: string; lang: string }) {
  const [blockHtml, setBlockHtml] = useState("");

  useEffect(() => {
    codeToHtml(code, { lang, theme: "github-dark-default" }).then(setBlockHtml);
  }, [code, lang]);

  if (!blockHtml) {
    return (
      <pre className="px-5 py-4 text-xs leading-relaxed font-mono text-white/40">
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div
      className="text-xs leading-relaxed [&_pre]:px-5 [&_pre]:py-4 [&_pre]:bg-transparent! [&_code]:bg-transparent!"
      dangerouslySetInnerHTML={{ __html: blockHtml }}
    />
  );
}
