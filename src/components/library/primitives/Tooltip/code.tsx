export const tooltipCode = `"use client";

import { useState, useRef, ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type TooltipSide = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: string | ReactNode;
  side?: TooltipSide;
  children: ReactNode;
  className?: string;
}

const ARROW_SIZE = 5;

function Arrow({ side }: { side: TooltipSide }) {
  const base: React.CSSProperties = { position: "absolute", width: 0, height: 0 };
  const styles: Record<TooltipSide, React.CSSProperties> = {
    top:    { ...base, bottom: -ARROW_SIZE, left: "50%", transform: "translateX(-50%)", borderLeft: \`\${ARROW_SIZE}px solid transparent\`, borderRight: \`\${ARROW_SIZE}px solid transparent\`, borderTop: \`\${ARROW_SIZE}px solid rgba(22,22,30,0.97)\` },
    bottom: { ...base, top: -ARROW_SIZE, left: "50%", transform: "translateX(-50%)", borderLeft: \`\${ARROW_SIZE}px solid transparent\`, borderRight: \`\${ARROW_SIZE}px solid transparent\`, borderBottom: \`\${ARROW_SIZE}px solid rgba(22,22,30,0.97)\` },
    left:   { ...base, right: -ARROW_SIZE, top: "50%", transform: "translateY(-50%)", borderTop: \`\${ARROW_SIZE}px solid transparent\`, borderBottom: \`\${ARROW_SIZE}px solid transparent\`, borderLeft: \`\${ARROW_SIZE}px solid rgba(22,22,30,0.97)\` },
    right:  { ...base, left: -ARROW_SIZE, top: "50%", transform: "translateY(-50%)", borderTop: \`\${ARROW_SIZE}px solid transparent\`, borderBottom: \`\${ARROW_SIZE}px solid transparent\`, borderRight: \`\${ARROW_SIZE}px solid rgba(22,22,30,0.97)\` },
  };
  return <span style={styles[side]} />;
}

const OFFSET = 10;
const SIDE_VARIANTS = {
  top:    { initial: { opacity: 0, scale: 0.92, y: 4 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.92, y: 4 }, position: (rect: DOMRect, tip: { w: number; h: number }) => ({ top: rect.top + window.scrollY - tip.h - OFFSET, left: rect.left + window.scrollX + rect.width / 2 - tip.w / 2 }) },
  bottom: { initial: { opacity: 0, scale: 0.92, y: -4 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.92, y: -4 }, position: (rect: DOMRect, tip: { w: number; h: number }) => ({ top: rect.bottom + window.scrollY + OFFSET, left: rect.left + window.scrollX + rect.width / 2 - tip.w / 2 }) },
  left:   { initial: { opacity: 0, scale: 0.92, x: 4 }, animate: { opacity: 1, scale: 1, x: 0 }, exit: { opacity: 0, scale: 0.92, x: 4 }, position: (rect: DOMRect, tip: { w: number; h: number }) => ({ top: rect.top + window.scrollY + rect.height / 2 - tip.h / 2, left: rect.left + window.scrollX - tip.w - OFFSET }) },
  right:  { initial: { opacity: 0, scale: 0.92, x: -4 }, animate: { opacity: 1, scale: 1, x: 0 }, exit: { opacity: 0, scale: 0.92, x: -4 }, position: (rect: DOMRect, tip: { w: number; h: number }) => ({ top: rect.top + window.scrollY + rect.height / 2 - tip.h / 2, left: rect.right + window.scrollX + OFFSET }) },
};

export function Tooltip({ content, side = "top", children, className }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords,  setCoords]  = useState({ top: 0, left: 0 });
  const [tipSize, setTipSize] = useState({ w: 0, h: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tipRef     = useRef<HTMLDivElement>(null);
  const sv = SIDE_VARIANTS[side];

  function show() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const w = tipRef.current?.offsetWidth  ?? tipSize.w;
    const h = tipRef.current?.offsetHeight ?? tipSize.h;
    setCoords(sv.position(rect, { w, h }));
    setVisible(true);
  }

  useEffect(() => {
    if (visible && tipRef.current) {
      const w = tipRef.current.offsetWidth;
      const h = tipRef.current.offsetHeight;
      if (w !== tipSize.w || h !== tipSize.h) {
        setTipSize({ w, h });
        const rect = triggerRef.current?.getBoundingClientRect();
        if (rect) setCoords(sv.position(rect, { w, h }));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <>
      <span ref={triggerRef} className="inline-flex" onMouseEnter={show} onMouseLeave={() => setVisible(false)} onFocus={show} onBlur={() => setVisible(false)}>
        {children}
      </span>
      <AnimatePresence>
        {visible && (
          <motion.div
            ref={tipRef}
            key="tooltip"
            role="tooltip"
            className={cn("fixed z-[9999] pointer-events-none px-2.5 py-1.5 rounded-lg text-[11px] font-medium leading-snug text-white/80 shadow-xl shadow-black/30", className)}
            style={{ top: coords.top, left: coords.left, backgroundColor: "rgba(22,22,30,0.97)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(8px)" }}
            initial={sv.initial}
            animate={sv.animate}
            exit={sv.exit}
            transition={{ duration: 0.14, ease: "easeOut" }}
          >
            {content}
            <Arrow side={side} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
`;
