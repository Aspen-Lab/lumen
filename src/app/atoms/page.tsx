"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { atomRegistry } from "@/data/atom-registry";
import { AtomFilter } from "@/components/site/AtomFilter";
import { AtomCard } from "@/components/site/AtomCard";

export default function AtomsPage() {
  const [activeRole, setActiveRole] = useState("all");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return atomRegistry.filter((atom) => {
      // Role filter
      if (activeRole !== "all" && atom.role !== activeRole) return false;

      // Tag filter — atom must have ALL selected tags
      if (activeTags.size > 0) {
        for (const tag of activeTags) {
          if (!atom.interactions.includes(tag as any)) return false;
        }
      }

      // Search
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

  return (
    <motion.div
      className="py-4 space-y-8"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-white tracking-tight">Atoms</h1>
        <p className="text-sm text-white/30 max-w-lg leading-relaxed">
          The smallest UX units. Each atom is self-contained — it exists independently,
          requires no other elements, and fulfills exactly one interaction intent.
        </p>
      </div>

      {/* Filters */}
      <AtomFilter
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        activeTags={activeTags}
        onTagToggle={handleTagToggle}
        search={search}
        onSearchChange={setSearch}
      />

      {/* Results count */}
      <div className="text-[10px] font-mono text-white/15">
        {filtered.length} of {atomRegistry.length} atoms
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((atom, i) => (
          <AtomCard key={atom.slug} atom={atom} index={i} />
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-white/15 text-sm">
          No atoms match the current filters.
        </div>
      )}
    </motion.div>
  );
}
