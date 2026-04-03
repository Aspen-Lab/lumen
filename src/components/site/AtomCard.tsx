"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ROLE_COLORS, type AtomMeta } from "@/types/atom";
import { getComponentsUsingAtom, getComponentName } from "@/data/composition-registry";

const AtomDemo = dynamic(() => import("./AtomDemo"), {
  ssr: false,
  loading: () => <div className="w-full h-full" />,
});

interface AtomCardProps {
  atom: AtomMeta;
  index: number;
}

export function AtomCard({ atom, index }: AtomCardProps) {
  const color = ROLE_COLORS[atom.role];
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const usedBy = getComponentsUsingAtom(atom.slug);

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
      className="group rounded-xl bg-surface-1/60 overflow-hidden transition-colors duration-200 relative"
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

      {/* Preview area — live demo */}
      <div className="h-[90px] flex items-center justify-center relative overflow-hidden px-3">
        <AtomDemo slug={atom.slug} />
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

        {/* Reverse association — used by */}
        {usedBy.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1.5">
            <span className="text-[9px] font-mono text-white/12">used by</span>
            {usedBy.map((slug) => (
              <span
                key={slug}
                className="text-[9px] font-mono text-white/30 bg-white/[0.04] px-1.5 py-0.5 rounded-md hover:text-white/50 hover:bg-white/[0.06] transition-colors"
              >
                {getComponentName(slug)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
