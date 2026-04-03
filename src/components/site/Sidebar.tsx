"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Menu, MessageSquare, Sparkles, BookOpen, Gamepad2, FileText, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { springTight, springBounce, stagger } from "@/lib/motion";
import { categories, getComponentsByCategory } from "@/data/registry";
import { Logo } from "./Logo";

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
          "fixed top-0 left-0 z-50 h-full w-sidebar bg-[#0A0A10] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          "lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="absolute top-0 right-0 bottom-0 w-px bg-white/[0.06]" />

        {/* Logo + close */}
        <div className="flex items-center justify-between px-5 h-14">
          <Link href="/" className="overflow-visible py-1" onClick={onClose}>
            <Logo className="h-[22px] w-auto" />
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-white/30 hover:text-white/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav tabs */}
        <div className="px-3 flex items-center gap-1 mb-1">
          {[
            { href: "/", label: "Components", match: (p: string) => p === "/" || p.startsWith("/components") },
            { href: "/atoms", label: "Atoms", match: (p: string) => p.startsWith("/atoms") },
          ].map(({ href, label, match }) => {
            const isActive = match(pathname);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200",
                  isActive ? "text-white/60" : "text-white/20 hover:text-white/40"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-nav"
                    className="absolute inset-0 bg-white/[0.05] rounded-lg"
                    transition={springTight}
                  />
                )}
                <span className="relative z-[1]">{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Search */}
        <div className="px-3 py-1">
          <motion.div
            whileHover={{ backgroundColor: "var(--white-5)" }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.03] text-white/20 cursor-pointer"
          >
            <Search size={14} />
            <span className="text-sm">Search...</span>
            <span className="ml-auto text-[10px] font-mono text-white/10 bg-white/[0.04] px-1.5 py-0.5 rounded">/</span>
          </motion.div>
        </div>

        {/* Components */}
        <nav className="flex-1 overflow-y-auto py-2 px-3">
          {categories.map((cat) => {
            const components = getComponentsByCategory(cat.slug);
            return (
              <div key={cat.slug} className="mb-1">
                <div className="px-3 pt-3 pb-1.5">
                  <span className="text-xs font-medium text-white/25">{cat.name}</span>
                </div>

                {components.map((comp, i) => {
                  const href = `/components/${comp.category}/${comp.slug}`;
                  const isActive = pathname === href;
                  const Icon = componentIcons[comp.slug] || Sparkles;
                  return (
                    <motion.div
                      key={comp.slug}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={stagger(i)}
                    >
                      <Link
                        href={href}
                        onClick={onClose}
                        className={cn(
                          "group/item relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150",
                          isActive ? "text-white" : "text-white/40 hover:text-white/70"
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute inset-0 bg-white/[0.07] rounded-lg"
                            transition={springTight}
                          />
                        )}
                        <motion.div
                          className="relative z-[1]"
                          whileHover={{ rotate: 12 }}
                          transition={springBounce}
                        >
                          <Icon size={16} className={cn(isActive ? "text-white/60" : "text-white/20 group-hover/item:text-white/50 transition-colors")} />
                        </motion.div>
                        <span className="relative z-[1]">{comp.name}</span>
                        <motion.div className="absolute right-3 w-0 h-px bg-white/20 group-hover/item:w-3 transition-all duration-200" />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Footer links */}
        <div className="px-3 py-3">
          <div className="h-px bg-white/[0.04] mb-2" />
          {[
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
      transition={springBounce}
    >
      <Menu size={20} />
    </motion.button>
  );
}
