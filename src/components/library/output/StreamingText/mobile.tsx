"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { type StreamingTextProps, type TokenizeMode } from "./index";

/* ── Default text (shorter for mobile) ── */
const DEFAULT_TEXT_MOBILE =
  "Revenue grew 23% quarter-over-quarter, driven by enterprise accounts. Churn risk is elevated in the SMB segment — three cohorts show declining engagement over the past 45 days.";

/* ── Helpers ── */
function tokenizeText(text: string, mode: TokenizeMode): string[] {
  if (mode === "char") return text.split("");
  return text.match(/\S+\s*/g) ?? [];
}

/* ── Mobile export ── */
export function StreamingTextMobile({
  text = DEFAULT_TEXT_MOBILE,
  speed = 30,
  cursor = true,
  cursorChar = "▌",
  blur = false,
  tokenize = "word",
  onComplete,
  textColor = "#FFFFFF",
  cursorColor = "#0BE09B",
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
    <div className="w-full max-w-[390px] mx-auto select-none">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3.5">
        <div className="flex items-center gap-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: cursorColor }}
            animate={
              done
                ? { opacity: 0.4, scale: 1 }
                : { opacity: [0.4, 1, 0.4], scale: [1, 1.15, 1] }
            }
            transition={
              done
                ? { duration: 0.3 }
                : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
            }
          />
          <span
            className="text-[9px] font-mono uppercase tracking-[0.12em]"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            AI Response
          </span>
        </div>

        <span
          className="px-1.5 py-0.5 rounded-full text-[8px] font-mono uppercase tracking-wider border border-white/[0.07]"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          {done ? "complete" : "streaming"}
        </span>

        {/* Token counter */}
        <span
          className="ml-auto text-[10px] font-mono tabular-nums"
          style={{ color: "rgba(255,255,255,0.22)" }}
        >
          <motion.span
            key={revealed}
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            style={{ color: `${cursorColor}cc` }}
          >
            {revealed}
          </motion.span>
          <span> / {total}</span>
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-[2px] rounded-full mb-3.5 overflow-hidden"
        style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: `${cursorColor}70` }}
          animate={{ width: total > 0 ? `${(revealed / total) * 100}%` : "0%" }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>

      {/* Text body */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#111113] px-4 py-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
        <p className="text-[13px] leading-[1.75] break-words" style={{ color: textColor }}>
          {tokens.map((token, i) => {
            if (i < revealed) {
              return (
                <motion.span
                  key={`${key}-${i}`}
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
                  key={`${key}-blur-${i}`}
                  className="inline-block select-none"
                  style={{
                    color: textColor,
                    filter: "blur(5px)",
                    opacity: 0.2,
                    whiteSpace: "pre-wrap",
                  }}
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
                  style={{ color: cursorColor, marginLeft: "1px" }}
                >
                  {cursorChar}
                </motion.span>
              )}
            </AnimatePresence>
          )}
        </p>
      </div>

      {/* Replay button */}
      <div className="mt-3 flex justify-end">
        <button
          onClick={handleReplay}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-[0.08em] border transition-all duration-200",
            "border-white/[0.08] text-white/30 hover:border-white/[0.15] hover:text-white/55 active:scale-95"
          )}
        >
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
            <path
              d="M1.5 5C1.5 3.067 3.067 1.5 5 1.5c1.105 0 2.09.504 2.75 1.296"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <path
              d="M7.75 1.5v2.25H5.5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 5c0 1.933-1.567 3.5-3.5 3.5S1.5 6.933 1.5 5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          Replay
        </button>
      </div>
    </div>
  );
}
