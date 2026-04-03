"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROLE_COLORS, type AtomRole, type AtomInteraction } from "@/types/atom";
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
        {atomRoles.map((role) => {
          const isActive = activeRole === role;
          const color = role === "all" ? "#ffffff" : ROLE_COLORS[role as AtomRole];
          return (
            <button
              key={role}
              onClick={() => onRoleChange(role)}
              className={cn(
                "relative px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors duration-150",
                isActive ? "text-white/80" : "text-white/25 hover:text-white/45"
              )}
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
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: isActive ? color : `${color}40` }}
                  />
                )}
                {role}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interaction tags + search */}
      <div className="flex items-center gap-3">
        <div className="flex flex-wrap gap-1">
          {atomInteractions.map((tag) => {
            const isActive = activeTags.has(tag);
            return (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={cn(
                  "px-2 py-1 rounded-md text-[10px] font-mono transition-all duration-100",
                  isActive
                    ? "bg-white/[0.08] text-white/60"
                    : "bg-white/[0.02] text-white/15 hover:text-white/30"
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <div className="flex-1 max-w-[200px] ml-auto">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.03] text-white/20">
            <Search size={12} />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter..."
              className="flex-1 bg-transparent text-xs text-white/60 placeholder:text-white/15 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
