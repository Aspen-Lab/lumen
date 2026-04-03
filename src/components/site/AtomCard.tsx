"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ROLE_COLORS, type AtomMeta } from "@/types/atom";

interface AtomCardProps {
  atom: AtomMeta;
  index: number;
}

export function AtomCard({ atom, index }: AtomCardProps) {
  const color = ROLE_COLORS[atom.role];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <Link
        href={`/atoms/${atom.slug}`}
        className="group block rounded-xl bg-surface-1/60 overflow-hidden hover:bg-surface-2/60 transition-all duration-200"
      >
        {/* Preview area */}
        <div className="h-[100px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle glow */}
          <div
            className="absolute w-20 h-20 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"
            style={{ background: color }}
          />
          {/* Type icon / name as preview placeholder */}
          <span
            className="text-2xl font-bold font-mono opacity-10 group-hover:opacity-20 transition-opacity select-none"
            style={{ color }}
          >
            {atom.name.charAt(0)}
          </span>
        </div>

        {/* Meta */}
        <div className="px-3.5 py-3 space-y-2">
          <div className="text-sm font-semibold font-mono text-white/70 group-hover:text-white transition-colors">
            {atom.name}
          </div>
          <div className="text-[11px] text-white/25 leading-relaxed line-clamp-2">
            {atom.description}
          </div>

          {/* Badges */}
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
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
            <span className="text-[8px] font-mono text-white/10 ml-auto">
              {atom.level}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
