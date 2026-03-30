"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { componentRegistry } from "@/data/registry";
import { cn } from "@/lib/utils";

function score(query: string, component: typeof componentRegistry[0]): number {
  const q = query.toLowerCase();
  const name = component.name.toLowerCase();
  const desc = component.description.toLowerCase();
  const cat = component.category.toLowerCase();

  if (name === q) return 100;
  if (name.startsWith(q)) return 80;
  if (name.includes(q)) return 60;
  if (component.tags.some((t) => t.toLowerCase().includes(q))) return 40;
  if (desc.includes(q)) return 30;
  if (cat.includes(q)) return 20;
  return 0;
}

export function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = query.trim()
    ? componentRegistry
        .map((c) => ({ component: c, score: score(query, c) }))
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
    : componentRegistry.slice(0, 8).map((c) => ({ component: c, score: 0 }));

  const navigate = useCallback(
    (slug: string, category: string) => {
      router.push(`/components/${category}/${slug}`);
      setOpen(false);
      setQuery("");
    },
    [router]
  );

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "/" && !open && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelected(0);
    }
  }, [open]);

  // Reset selection on query change
  useEffect(() => {
    setSelected(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && results[selected]) {
      navigate(results[selected].component.slug, results[selected].component.category);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setOpen(false); setQuery(""); }}
          />

          {/* Panel */}
          <motion.div
            className="fixed top-[20%] left-1/2 z-[101] w-[90vw] max-w-[520px] rounded-2xl bg-[#0C0C14] shadow-2xl shadow-black/50 overflow-hidden"
            style={{ x: "-50%" }}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3">
              <Search size={16} className="text-white/25 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search components..."
                className="flex-1 bg-transparent text-base text-white/80 placeholder:text-white/20 outline-none"
              />
              <kbd className="text-[10px] font-mono text-white/15 bg-white/[0.04] px-1.5 py-0.5 rounded">
                ESC
              </kbd>
            </div>

            <div className="h-px bg-white/[0.06]" />

            {/* Results */}
            <div className="py-2 max-h-[320px] overflow-y-auto">
              {results.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-white/20">
                  No results found
                </div>
              ) : (
                results.map((r, i) => (
                  <button
                    key={r.component.slug}
                    onClick={() => navigate(r.component.slug, r.component.category)}
                    onMouseEnter={() => setSelected(i)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                      i === selected ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-mono text-white/70">{r.component.name}</div>
                      <div className="text-xs text-white/25 truncate">{r.component.description}</div>
                    </div>
                    <span className="text-[10px] font-mono text-white/15 capitalize shrink-0">
                      {r.component.category}
                    </span>
                    {i === selected && <ArrowRight size={12} className="text-white/20 shrink-0" />}
                  </button>
                ))
              )}
            </div>

            {/* Footer hints */}
            <div className="px-4 py-2 flex items-center gap-4 text-[10px] font-mono text-white/10">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
