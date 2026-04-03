"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ROLE_COLORS, type AtomMeta } from "@/types/atom";

interface AtomCardProps {
  atom: AtomMeta;
  index: number;
}

export function AtomCard({ atom, index }: AtomCardProps) {
  const color = ROLE_COLORS[atom.role];
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setGlowPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link
        href={`/atoms/${atom.slug}`}
        className="group block rounded-xl bg-surface-1/60 overflow-hidden transition-colors duration-200 relative"
      >
        {/* Mouse-following glow */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none z-[1] transition-opacity duration-300"
          style={{
            opacity: hover ? 1 : 0,
            background: `radial-gradient(circle 120px at ${glowPos.x}% ${glowPos.y}%, ${color}08 0%, transparent 100%)`,
          }}
        />

        {/* Top accent line */}
        <motion.div
          className="h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${color}${hover ? "40" : "15"}, transparent)`,
            transition: "background 0.3s",
          }}
        />

        {/* Preview area */}
        <div className="h-[90px] flex items-center justify-center relative overflow-hidden">
          {/* Orbital ring */}
          <motion.div
            className="absolute w-16 h-16 rounded-full"
            style={{
              border: `1px solid ${color}`,
              opacity: hover ? 0.12 : 0.04,
              transition: "opacity 0.3s",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {/* Center letter */}
          <motion.span
            className="text-2xl font-bold font-mono select-none relative z-[1]"
            style={{ color }}
            animate={{
              opacity: hover ? 0.35 : 0.1,
              scale: hover ? 1.1 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {atom.name.charAt(0)}
          </motion.span>
        </div>

        {/* Meta */}
        <div className="px-3.5 py-3 space-y-1.5 relative z-[2]">
          <div className="text-sm font-semibold font-mono text-white/70 group-hover:text-white transition-colors duration-200">
            {atom.name}
          </div>
          <div className="text-[11px] text-white/25 leading-relaxed line-clamp-1">
            {atom.description}
          </div>

          {/* Badges */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span
              className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-md"
              style={{ background: `${color}12`, color: `${color}90` }}
            >
              {atom.role}
            </span>
            {atom.interactions.map((t) => (
              <span
                key={t}
                className="text-[9px] font-mono text-white/15 bg-white/[0.03] px-1.5 py-0.5 rounded-md"
              >
                {t}
              </span>
            ))}
            <span className="text-[8px] font-mono text-white/10 ml-auto capitalize">
              {atom.level}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
