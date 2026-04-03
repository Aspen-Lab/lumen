"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROLE_COLORS, type AtomRole } from "@/types/atom";
import { atomRoles, atomInteractions } from "@/data/atom-registry";

interface AtomFilterProps {
  activeRole: string;
  onRoleChange: (role: string) => void;
  activeTags: Set<string>;
  onTagToggle: (tag: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export function AtomFilter({
  activeRole, onRoleChange, activeTags, onTagToggle, search, onSearchChange,
}: AtomFilterProps) {
  return (
    <div className="space-y-3">
      {/* Role pills */}
      <div className="flex flex-wrap gap-1.5">
        {atomRoles.map((role, i) => {
          const isActive = activeRole === role;
          const color = role === "all" ? "#ffffff" : ROLE_COLORS[role as AtomRole];
          return (
            <motion.button
              key={role}
              onClick={() => onRoleChange(role)}
              className={cn(
                "relative px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors duration-150",
                isActive ? "text-white/80" : "text-white/25 hover:text-white/45"
              )}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02, duration: 0.2 }}
            >
              {isActive && (
                <motion.div
                  layoutId="atom-role"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: `${color}12` }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-[1] flex items-center gap-1.5">
                {role !== "all" && (
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: isActive ? color : `${color}40` }}
                    animate={{ scale: isActive ? [1, 1.4, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                {role}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Interaction tags + search */}
      <div className="flex items-center gap-3">
        <div className="flex flex-wrap gap-1">
          {atomInteractions.map((tag) => {
            const isActive = activeTags.has(tag);
            return (
              <motion.button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={cn(
                  "px-2 py-1 rounded-md text-[10px] font-mono transition-all duration-100",
                  isActive
                    ? "bg-white/[0.1] text-white/60"
                    : "bg-white/[0.02] text-white/15 hover:text-white/30"
                )}
                whileTap={{ scale: 0.92 }}
                animate={{
                  y: isActive ? -1 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {isActive && (
                  <motion.span
                    className="inline-block w-1 h-1 rounded-full bg-white/40 mr-1 align-middle"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  />
                )}
                {tag}
              </motion.button>
            );
          })}
        </div>

        <div className="flex-1 max-w-[200px] ml-auto">
          <motion.div
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.03] text-white/20"
            whileFocus={{ background: "rgba(255,255,255,0.05)" }}
          >
            <Search size={12} />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter..."
              className="flex-1 bg-transparent text-xs text-white/60 placeholder:text-white/15 outline-none"
            />
            {search && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => onSearchChange("")}
                className="text-white/20 hover:text-white/50 text-[10px]"
              >
                ✕
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
