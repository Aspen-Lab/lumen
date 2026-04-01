"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Menu, MessageSquare, Sparkles, BookOpen, Gamepad2, FileText, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { categories, getComponentsByCategory } from "@/data/registry";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const componentIcons: Record<string, React.ElementType> = {
  "prompt-input": MessageSquare,
};

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed top-14 left-0 z-50 h-[calc(100%-56px)] w-sidebar bg-[#0A0A10] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          "lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="absolute top-0 right-0 bottom-0 w-px bg-white/[0.06]" />

        {/* Search */}
        <div className="px-3 pt-3 pb-1">
          <motion.div
            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.03] text-white/20 cursor-pointer"
          >
            <Search size={14} />
            <span className="text-sm">Search...</span>
            <span className="ml-auto text-[10px] font-mono text-white/10 bg-white/[0.04] px-1.5 py-0.5 rounded">/</span>
          </motion.div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-3">
          {categories.map((cat) => {
            const components = getComponentsByCategory(cat.slug);
            return (
              <div key={cat.slug} className="mb-1">
                <div className="px-3 pt-4 pb-1.5">
                  <span className="text-xs font-medium text-white/25">{cat.name}</span>
                </div>

                {components.map((comp) => {
                  const href = `/components/${comp.category}/${comp.slug}`;
                  const isActive = pathname === href;
                  const Icon = componentIcons[comp.slug] || Sparkles;
                  return (
                    <Link
                      key={comp.slug}
                      href={href}
                      onClick={onClose}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150",
                        isActive
                          ? "text-white"
                          : "text-white/40 hover:text-white/70"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute inset-0 bg-white/[0.07] rounded-lg"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                      <Icon size={16} className={cn("relative z-[1]", isActive ? "text-white/60" : "text-white/20")} />
                      <span className="relative z-[1]">{comp.name}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3">
          <div className="h-px bg-white/[0.04] mb-2" />
          {[
            { label: "Patterns", icon: BookOpen },
            { label: "Playground", icon: Gamepad2 },
            { label: "Docs", icon: FileText },
          ].map(({ label, icon: Icon }) => (
            <Link
              key={label}
              href={`/${label.toLowerCase()}`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/20 hover:text-white/40 hover:bg-white/[0.02] transition-colors duration-150"
            >
              <Icon size={15} className="text-white/12" />
              <span>{label}</span>
              <span className="ml-auto text-[9px] font-mono text-white/8">soon</span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}

export function SidebarTrigger({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="lg:hidden p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.05]"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Menu size={20} />
    </motion.button>
  );
}
