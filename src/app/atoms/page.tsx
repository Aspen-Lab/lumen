"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { atomRegistry } from "@/data/atom-registry";
import { AtomFilter } from "@/components/site/AtomFilter";
import { AtomCard } from "@/components/site/AtomCard";
import { ROLE_COLORS, type AtomRole } from "@/types/atom";

export default function AtomsPage() {
  const [activeRole, setActiveRole] = useState("all");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return atomRegistry.filter((atom) => {
      if (activeRole !== "all" && atom.role !== activeRole) return false;
      if (activeTags.size > 0) {
        for (const tag of activeTags) {
          if (!atom.interactions.includes(tag as never)) return false;
        }
      }
      if (search) {
        const q = search.toLowerCase();
        return (
          atom.name.toLowerCase().includes(q) ||
          atom.description.toLowerCase().includes(q) ||
          atom.role.includes(q)
        );
      }
      return true;
    });
  }, [activeRole, activeTags, search]);

  const handleTagToggle = (tag: string) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  // Active role color for accent
  const accentColor = activeRole === "all" ? "#ffffff" : ROLE_COLORS[activeRole as AtomRole];

  return (
    <motion.div
      className="py-4 space-y-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header with accent underline */}
      <div className="space-y-3">
        <motion.h1
          className="text-3xl font-bold text-white tracking-tight"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          Atoms
        </motion.h1>
        <motion.p
          className="text-sm text-white/30 max-w-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          The smallest UX units. Each atom is self-contained — it exists independently,
          requires no other elements, and fulfills exactly one interaction intent.
        </motion.p>
        {/* Accent line that changes color with active role */}
        <motion.div
          className="h-px w-16 rounded-full"
          style={{ background: accentColor }}
          animate={{ width: activeRole === "all" ? 64 : 48, opacity: activeRole === "all" ? 0.1 : 0.3 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        <AtomFilter
          activeRole={activeRole}
          onRoleChange={setActiveRole}
          activeTags={activeTags}
          onTagToggle={handleTagToggle}
          search={search}
          onSearchChange={setSearch}
        />
      </motion.div>

      {/* Count with animated number */}
      <div className="flex items-center gap-2">
        <motion.span
          key={filtered.length}
          className="text-[10px] font-mono text-white/20"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {filtered.length}
        </motion.span>
        <span className="text-[10px] font-mono text-white/10">
          of {atomRegistry.length} atoms
        </span>
        {activeRole !== "all" && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-[9px] font-mono px-1.5 py-0.5 rounded-md capitalize"
            style={{ background: `${accentColor}12`, color: `${accentColor}70` }}
          >
            {activeRole}
          </motion.span>
        )}
      </div>

      {/* Grid with layout animation */}
      <LayoutGroup>
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((atom, i) => (
              <motion.div
                key={atom.slug}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  layout: { type: "spring", stiffness: 350, damping: 30 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 },
                }}
              >
                <AtomCard atom={atom} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {/* Empty state */}
      <AnimatePresence>
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-center py-16 space-y-3"
          >
            <div className="text-2xl text-white/8">∅</div>
            <div className="text-white/15 text-sm">No atoms match the current filters.</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
