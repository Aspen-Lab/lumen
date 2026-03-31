const STREAMING_TEXT_SOURCE = `"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Types ── */
export type TokenizeMode = "word" | "char";

export interface StreamingTextProps {
  text?: string;
  speed?: number;
  cursor?: boolean;
  cursorChar?: string;
  blur?: boolean;
  tokenize?: TokenizeMode;
  onComplete?: () => void;
}

/* ── Default text ── */
const DEFAULT_TEXT =
  "Based on your dataset, revenue grew 23% quarter-over-quarter, driven primarily by enterprise accounts. Churn risk is elevated in the SMB segment — three cohorts show declining engagement over the past 45 days. I recommend prioritising retention outreach before the end of the billing cycle.";

/* ── Helpers ── */
function tokenizeText(text: string, mode: TokenizeMode): string[] {
  if (mode === "char") return text.split("");
  return text.match(/\\S+\\s*/g) ?? [];
}

/* ── Main component ── */
export function StreamingText({
  text = DEFAULT_TEXT,
  speed = 30,
  cursor = true,
  cursorChar = "▌",
  blur = false,
  tokenize = "word",
  onComplete,
}: StreamingTextProps) {
  const tokens = tokenizeText(text, tokenize);
  const total = tokens.length;

  const [revealed, setRevealed] = useState(0);
  const [done, setDone] = useState(false);
  const [key, setKey] = useState(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const scheduleNext = useCallback(
    (current: number) => {
      if (current >= total) {
        setDone(true);
        onComplete?.();
        return;
      }
      timerRef.current = setTimeout(() => {
        setRevealed(current + 1);
        scheduleNext(current + 1);
      }, speed);
    },
    [total, speed, onComplete]
  );

  useEffect(() => {
    setRevealed(0);
    setDone(false);
    clearTimer();
    timerRef.current = setTimeout(() => scheduleNext(0), 350);
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, text, speed, tokenize]);

  const handleReplay = () => {
    clearTimer();
    setKey((k) => k + 1);
  };

  return (
    <div className="w-full max-w-[620px] mx-auto select-none">
      {/* Header bar */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[#0BE09B]"
            animate={
              done
                ? { opacity: 0.4, scale: 1 }
                : { opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }
            }
            transition={
              done
                ? { duration: 0.3 }
                : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
            }
          />
          <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-white/35">
            AI Response
          </span>
        </div>

        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider border border-white/[0.08] text-white/28">
          {done ? "complete" : "streaming"}
        </span>

        <span className="ml-auto text-[11px] font-mono tabular-nums text-white/25">
          <motion.span
            key={revealed}
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="text-[#0BE09B]/80"
          >
            {revealed}
          </motion.span>
          <span> / {total}</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-px rounded-full bg-white/[0.06] mb-5 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-[#0BE09B]/70"
          animate={{ width: total > 0 ? \`\${(revealed / total) * 100}%\` : "0%" }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>

      {/* Text body */}
      <div className="rounded-xl border border-white/[0.07] bg-[#111113] px-5 py-4 shadow-[0_2px_20px_rgba(0,0,0,0.35)]">
        <p className="text-[14px] leading-[1.8] text-white break-words">
          {tokens.map((token, i) => {
            if (i < revealed) {
              return (
                <motion.span
                  key={\`\${key}-\${i}\`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {token}
                </motion.span>
              );
            }
            if (blur && i >= revealed) {
              return (
                <span
                  key={\`\${key}-blur-\${i}\`}
                  className="inline-block select-none"
                  style={{ filter: "blur(6px)", opacity: 0.25, whiteSpace: "pre-wrap" }}
                >
                  {token}
                </span>
              );
            }
            return null;
          })}

          {cursor && (
            <AnimatePresence>
              {!done && (
                <motion.span
                  key="cursor"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: [1, 0, 1] }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "steps(1)" }}
                  className="text-[#0BE09B] ml-px"
                >
                  {cursorChar}
                </motion.span>
              )}
            </AnimatePresence>
          )}
        </p>
      </div>

      {/* Replay button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleReplay}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase tracking-[0.08em] border transition-all duration-200",
            "border-white/[0.08] text-white/35 hover:border-white/[0.16] hover:text-white/60 active:scale-95"
          )}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5C1.5 3.067 3.067 1.5 5 1.5c1.105 0 2.09.504 2.75 1.296" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M7.75 1.5v2.25H5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.5 5c0 1.933-1.567 3.5-3.5 3.5S1.5 6.933 1.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          Replay
        </button>
      </div>
    </div>
  );
}`;

export function generateStreamingTextCode(props: Record<string, unknown>): string {
  const defaults: Record<string, unknown> = {
    speed: 30,
    cursor: true,
    cursorChar: "▌",
    blur: false,
    tokenize: "word",
    textColor: "#FFFFFF",
    cursorColor: "#0BE09B",
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
<StreamingText${propsBlock}/>

// Full source code below...
${STREAMING_TEXT_SOURCE}`;
}

export const streamingTextCode = generateStreamingTextCode({});
