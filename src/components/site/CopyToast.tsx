"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Package } from "lucide-react";
import { useState } from "react";

interface CopyToastProps {
  show: boolean;
  onClose: () => void;
}

const DEPS = "npm install framer-motion clsx tailwind-merge";

export function CopyToast({ show, onClose }: CopyToastProps) {
  const [depsCopied, setDepsCopied] = useState(false);

  const handleCopyDeps = async () => {
    await navigator.clipboard.writeText(DEPS);
    setDepsCopied(true);
    setTimeout(() => setDepsCopied(false), 1500);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 rounded-xl bg-surface-1 shadow-2xl shadow-black/40 p-4 max-w-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
              <Check size={14} className="text-white/60" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white/70">Code copied</div>
              <div className="text-xs text-white/30 mt-1">Make sure you have the dependencies:</div>
              <button
                onClick={handleCopyDeps}
                className="mt-2 flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] transition-colors text-left"
              >
                <Package size={12} className="text-white/25 shrink-0" />
                <code className="text-xs font-mono text-white/40 truncate flex-1">{DEPS}</code>
                {depsCopied ? (
                  <Check size={12} className="text-white/50 shrink-0" />
                ) : (
                  <Copy size={12} className="text-white/20 shrink-0" />
                )}
              </button>
            </div>
            <button onClick={onClose} className="text-white/15 hover:text-white/40 transition-colors text-xs">
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
