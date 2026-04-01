"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type CursorState = "default" | "pointer" | "text" | "pressing" | "preview";

export function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [state, setState] = useState<CursorState>("default");
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  const detect = useCallback((target: HTMLElement): CursorState => {
    if (target.closest("[data-cursor='preview']")) return "preview";
    if (target.closest("input, textarea, [contenteditable]")) return "text";
    if (target.closest("a, button, [role='button'], select, label, [data-cursor='pointer']")) return "pointer";
    return "default";
  }, []);

  useEffect(() => {
    setIsTouch("ontouchstart" in window);
  }, []);

  useEffect(() => {
    if (isTouch) return;

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
      setState((prev) => prev === "pressing" ? prev : detect(e.target as HTMLElement));
    };

    const onDown = () => setState("pressing");
    const onUp = (e: MouseEvent) => setState(detect(e.target as HTMLElement));
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [isTouch, visible, detect]);

  if (isTouch) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ left: pos.x, top: pos.y }}
    >
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={state}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.1 }}
            className="absolute"
            style={{ transform: "translate(-50%, -50%)" }}
          >
            {state === "default" && <DefaultCursor />}
            {state === "pointer" && <PointerCursor />}
            {state === "text" && <TextCursor />}
            {state === "pressing" && <PressCursor />}
            {state === "preview" && <PreviewCursor />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Cursor shapes ── */

function DefaultCursor() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ overflow: "visible" }}>
      {/* Crosshair */}
      <line x1="8" y1="3" x2="8" y2="13" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
      <line x1="3" y1="8" x2="13" y2="8" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
      {/* Center dot */}
      <circle cx="8" cy="8" r="1.5" fill="white" fillOpacity="0.8" />
    </svg>
  );
}

function PointerCursor() {
  return (
    <svg width="20" height="20" viewBox="0 0 21 21" fill="none" style={{ overflow: "visible" }}>
      {/* Lumen star shape */}
      <path
        d="M9.21145 1.03058C9.52098 -0.343528 11.479 -0.343524 11.7886 1.03058L13.1091 6.89266C13.2211 7.39026 13.6097 7.77886 14.1073 7.89095L19.9694 9.21145C21.3435 9.52098 21.3435 11.479 19.9694 11.7886L14.1073 13.1091C13.6097 13.2211 13.2211 13.6097 13.1091 14.1073L11.7886 19.9694C11.479 21.3435 9.52098 21.3435 9.21145 19.9694L7.89095 14.1073C7.77885 13.6097 7.39026 13.2211 6.89266 13.1091L1.03058 11.7886C-0.343528 11.479 -0.343524 9.52098 1.03058 9.21145L6.89266 7.89095C7.39026 7.77885 7.77886 7.39026 7.89095 6.89266L9.21145 1.03058Z"
        fill="white"
        fillOpacity="0.85"
      />
    </svg>
  );
}

function TextCursor() {
  return (
    <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
      {/* I-beam */}
      <line x1="6" y1="0" x2="6" y2="20" stroke="white" strokeOpacity="0.7" strokeWidth="1.5" />
      <line x1="3" y1="0" x2="9" y2="0" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
      <line x1="3" y1="20" x2="9" y2="20" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
    </svg>
  );
}

function PreviewCursor() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ overflow: "visible" }}>
      {/* Scope ring */}
      <circle cx="12" cy="12" r="9" stroke="white" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 3" />
      {/* Targeting lines */}
      <line x1="12" y1="0" x2="12" y2="6" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
      <line x1="12" y1="18" x2="12" y2="24" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
      <line x1="0" y1="12" x2="6" y2="12" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
      <line x1="18" y1="12" x2="24" y2="12" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
      {/* Center diamond */}
      <path d="M12 9 L15 12 L12 15 L9 12 Z" fill="white" fillOpacity="0.6" />
    </svg>
  );
}

function PressCursor() {
  return (
    <svg width="14" height="14" viewBox="0 0 21 21" fill="none" style={{ overflow: "visible" }}>
      {/* Compressed star */}
      <path
        d="M9.21145 1.03058C9.52098 -0.343528 11.479 -0.343524 11.7886 1.03058L13.1091 6.89266C13.2211 7.39026 13.6097 7.77886 14.1073 7.89095L19.9694 9.21145C21.3435 9.52098 21.3435 11.479 19.9694 11.7886L14.1073 13.1091C13.6097 13.2211 13.2211 13.6097 13.1091 14.1073L11.7886 19.9694C11.479 21.3435 9.52098 21.3435 9.21145 19.9694L7.89095 14.1073C7.77885 13.6097 7.39026 13.2211 6.89266 13.1091L1.03058 11.7886C-0.343528 11.479 -0.343524 9.52098 1.03058 9.21145L6.89266 7.89095C7.39026 7.77885 7.77886 7.39026 7.89095 6.89266L9.21145 1.03058Z"
        fill="white"
        fillOpacity="1"
      />
    </svg>
  );
}
