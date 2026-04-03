"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAtomBySlug } from "@/data/atom-registry";
import { ROLE_COLORS } from "@/types/atom";

export default function AtomDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const atom = getAtomBySlug(slug);

  if (!atom) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-white/25 text-sm">Atom not found.</p>
      </div>
    );
  }

  const color = ROLE_COLORS[atom.role];

  return (
    <motion.div
      className="py-4 space-y-8"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Back */}
      <Link
        href="/atoms"
        className="inline-flex items-center gap-2 text-xs text-white/20 hover:text-white/45 transition-colors"
      >
        <ArrowLeft size={12} />
        All atoms
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-3xl font-bold font-mono text-white tracking-tight">
            {atom.name}
          </h1>
          <span
            className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md"
            style={{ background: `${color}12`, color: `${color}90` }}
          >
            {atom.role}
          </span>
          <span className="text-[10px] font-mono text-white/15">{atom.level}</span>
        </div>
        <p className="text-base text-white/35">{atom.description}</p>
      </div>

      {/* Specs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl bg-surface-1/60 p-5 space-y-3">
          <h3 className="text-xs font-mono text-white/25 uppercase tracking-widest">Definition</h3>
          <p className="text-sm text-white/50 leading-relaxed">{atom.definition}</p>
        </div>

        <div className="rounded-xl bg-surface-1/60 p-5 space-y-3">
          <h3 className="text-xs font-mono text-white/25 uppercase tracking-widest">Intent</h3>
          <p className="text-sm text-white/50 leading-relaxed">{atom.intent}</p>
        </div>
      </div>

      {/* Classification */}
      <div className="rounded-xl bg-surface-1/60 p-5">
        <h3 className="text-xs font-mono text-white/25 uppercase tracking-widest mb-4">Classification</h3>
        <div className="flex flex-wrap gap-6">
          <div>
            <div className="text-[10px] text-white/15 mb-1.5">Role</div>
            <span
              className="text-sm font-mono font-medium px-2.5 py-1 rounded-lg capitalize"
              style={{ background: `${color}12`, color: `${color}80` }}
            >
              {atom.role}
            </span>
          </div>
          <div>
            <div className="text-[10px] text-white/15 mb-1.5">Interactions</div>
            <div className="flex gap-1.5">
              {atom.interactions.map((t) => (
                <span key={t} className="text-xs font-mono text-white/30 bg-white/[0.04] px-2 py-1 rounded-lg">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-white/15 mb-1.5">Visual Level</div>
            <span className="text-xs font-mono text-white/30 bg-white/[0.04] px-2 py-1 rounded-lg capitalize">
              {atom.level}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
