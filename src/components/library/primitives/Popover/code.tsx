export const popoverCode = `"use client";

import {
  ReactNode,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type PopoverSide  = "top" | "bottom";
export type PopoverAlign = "start" | "center" | "end";

export interface PopoverProps {
  trigger: ReactNode;
  content: ReactNode;
  side?: PopoverSide;
  align?: PopoverAlign;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const OFFSET = 8;

export function Popover({
  trigger,
  content,
  side = "bottom",
  align = "start",
  open: controlledOpen,
  onOpenChange,
  className,
}: PopoverProps) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? controlledOpen : internalOpen;

  const triggerRef  = useRef<HTMLButtonElement>(null);
  const popoverRef  = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const setOpen = useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  const reposition = useCallback(() => {
    const tRect = triggerRef.current?.getBoundingClientRect();
    const pEl   = popoverRef.current;
    if (!tRect) return;
    const pw = pEl?.offsetWidth  ?? 220;
    const ph = pEl?.offsetHeight ?? 0;
    let top: number;
    let left: number;
    if (side === "bottom") {
      top = tRect.bottom + window.scrollY + OFFSET;
    } else {
      top = tRect.top + window.scrollY - ph - OFFSET;
    }
    if (align === "start") {
      left = tRect.left + window.scrollX;
    } else if (align === "end") {
      left = tRect.right + window.scrollX - pw;
    } else {
      left = tRect.left + window.scrollX + tRect.width / 2 - pw / 2;
    }
    setCoords({ top, left });
  }, [side, align]);

  useEffect(() => {
    if (open) reposition();
  }, [open, reposition]);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: PointerEvent) {
      if (!triggerRef.current?.contains(e.target as Node) && !popoverRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open, setOpen]);

  const initial = side === "bottom" ? { opacity: 0, scale: 0.96, y: -6 } : { opacity: 0, scale: 0.96, y: 6 };

  return (
    <>
      <button ref={triggerRef} className="inline-flex focus-visible:outline-none" onClick={() => setOpen(!open)} type="button">
        {trigger}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={popoverRef}
            key="popover"
            className={cn("fixed z-[9998] min-w-[200px] rounded-2xl p-2 shadow-2xl shadow-black/50", className)}
            style={{ top: coords.top, left: coords.left, backgroundColor: "rgba(22,22,30,0.97)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}
            initial={initial}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={initial}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
`;
