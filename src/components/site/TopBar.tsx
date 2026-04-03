"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { springBounce } from "@/lib/motion";

const REPO = "Aspen-Lab/lumen";

export function TopBar() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${REPO}`)
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.stargazers_count === "number") setStars(d.stargazers_count);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="fixed top-3 right-4 z-40">
      <motion.a
        href={`https://github.com/${REPO}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group/gh relative flex items-center gap-2.5 px-4 py-2 rounded-xl text-white/60 hover:text-white transition-all duration-200 border border-white/[0.06] hover:border-white/[0.12]"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        }}
        whileHover={{
          boxShadow: "0 0 20px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
        whileTap={{ scale: 0.97 }}
        transition={springBounce}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white/50 group-hover/gh:text-white/80 transition-colors"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
        <span className="text-xs font-medium">Star</span>
        <Star size={12} className="text-white/20 group-hover/gh:text-yellow-400/70 transition-colors duration-300" />
        {stars !== null && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[11px] font-mono text-white/35 pl-2 border-l border-white/[0.08]"
          >
            {stars}
          </motion.span>
        )}
      </motion.a>
    </div>
  );
}
