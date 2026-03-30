"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

interface CodeHighlightProps {
  code: string;
  lang?: string;
}

export function CodeHighlight({ code, lang = "tsx" }: CodeHighlightProps) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    codeToHtml(code, {
      lang,
      theme: "github-dark-default",
    }).then(setHtml);
  }, [code, lang]);

  if (!html) {
    return (
      <pre className="p-6 overflow-auto max-h-[560px] text-sm leading-relaxed font-mono text-white/40">
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div
      className="overflow-auto max-h-[560px] text-sm leading-relaxed [&_pre]:p-6 [&_pre]:bg-transparent! [&_code]:bg-transparent!"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
