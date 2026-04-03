"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Menu, MessageSquare, Sparkles, Gamepad2, FileText, Search, Circle, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { springTight, springBounce } from "@/lib/motion";
import { categories, getComponentsByCategory } from "@/data/registry";
import { atomRegistry } from "@/data/atom-registry";
import { ROLE_COLORS, type AtomRole } from "@/types/atom";
import { Logo } from "./Logo";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const componentIcons: Record<string, React.ElementType> = {
  "prompt-input": MessageSquare,
};

const atomsByRole = Object.entries(
  atomRegistry.reduce<Record<string, typeof atomRegistry>>((acc, atom) => {
    (acc[atom.role] ??= []).push(atom);
    return acc;
  }, {})
);

export function Sidebar({ open, onClose, collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const isAtomsPage = pathname.startsWith("/atoms");

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
          "fixed top-0 left-0 z-50 h-full flex flex-col transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] bg-[#0c0c0f]",
          "lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-auto",
          collapsed ? "w-[60px]" : "w-sidebar",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Right edge */}
        <div className="absolute top-0 right-0 bottom-0 w-px bg-white/[0.06]" />

        {/* Header: logo + toggle */}
        <div className={cn(
          "flex items-center shrink-0",
          collapsed ? "flex-col pt-4 pb-2 gap-1" : "h-14 px-4 justify-between"
        )}>
          <Link href="/" className="py-1" onClick={onClose}>
            <Logo className={cn("w-auto transition-all duration-300", collapsed ? "h-[22px]" : "h-[20px]")} collapsed={collapsed} />
          </Link>
          {!collapsed && (
            <>
              <button
                onClick={onClose}
                className="lg:hidden p-1.5 rounded-md text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
              >
                <X size={16} />
              </button>
              <button
                onClick={onToggleCollapse}
                className="hidden lg:block p-1.5 rounded-md text-white/20 hover:text-white/50 hover:bg-white/[0.06] transition-colors"
              >
                <PanelLeftClose size={15} />
              </button>
            </>
          )}
        </div>

        {/* Collapsed: icon rail */}
        {collapsed && (
          <div className="flex flex-col items-center gap-1 px-2 pt-2">
            <button
              onClick={onToggleCollapse}
              className="p-2.5 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
              title="Expand"
            >
              <PanelLeftOpen size={18} />
            </button>
            <Link
              href="/"
              className={cn(
                "p-2.5 rounded-lg transition-colors",
                !isAtomsPage ? "text-white/60 bg-white/[0.06]" : "text-white/25 hover:text-white/50 hover:bg-white/[0.04]"
              )}
              title="Components"
            >
              <Sparkles size={18} />
            </Link>
            <Link
              href="/atoms"
              className={cn(
                "p-2.5 rounded-lg transition-colors",
                isAtomsPage ? "text-white/60 bg-white/[0.06]" : "text-white/25 hover:text-white/50 hover:bg-white/[0.04]"
              )}
              title="Atoms"
            >
              <Circle size={18} />
            </Link>
            <div
              className="p-2.5 rounded-lg text-white/25 hover:text-white/50 hover:bg-white/[0.04] cursor-pointer transition-colors"
              title="Search"
            >
              <Search size={18} />
            </div>
          </div>
        )}

        {/* Expanded content */}
        {!collapsed && (
          <>
            {/* Search */}
            <div className="px-3 mb-1">
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.06] text-white/25 cursor-pointer transition-colors">
                <Search size={14} />
                <span className="text-sm">Search</span>
                <span className="ml-auto text-[10px] font-mono text-white/12">/</span>
              </div>
            </div>

            {/* Nav tabs */}
            <div className="px-3 flex items-center gap-0.5 mb-2">
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
                      "relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                      isActive ? "text-white/70" : "text-white/25 hover:text-white/50"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-nav"
                        className="absolute inset-0 rounded-lg bg-white/[0.06]"
                        transition={springTight}
                      />
                    )}
                    <span className="relative z-[1]">{label}</span>
                  </Link>
                );
              })}
            </div>

            {/* List */}
            <nav className="flex-1 overflow-y-auto px-2">
              <AnimatePresence mode="wait">
                {isAtomsPage ? (
                  <motion.div
                    key="atoms"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                  >
                    {atomsByRole.map(([role, atoms]) => (
                      <div key={role} className="mt-3 first:mt-0">
                        <div className="px-3 py-1.5 text-[10px] font-mono text-white/20 uppercase tracking-widest">
                          {role}
                        </div>
                        {atoms.map((atom) => {
                          const color = ROLE_COLORS[atom.role];
                          const href = `/atoms/${atom.slug}`;
                          const isActive = pathname === href;
                          return (
                            <Link
                              key={atom.slug}
                              href={href}
                              onClick={onClose}
                              className={cn(
                                "relative flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm transition-colors",
                                isActive
                                  ? "text-white bg-white/[0.08]"
                                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                              )}
                            >
                              <span
                                className="w-2 h-2 rounded-full shrink-0 transition-opacity"
                                style={{
                                  background: color,
                                  opacity: isActive ? 0.7 : 0.25,
                                }}
                              />
                              <span className="font-mono text-[13px]">{atom.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="components"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                  >
                    {categories.map((cat) => {
                      const components = getComponentsByCategory(cat.slug);
                      if (components.length === 0) return null;
                      return (
                        <div key={cat.slug} className="mt-3 first:mt-0">
                          <div className="px-3 py-1.5 text-[10px] font-mono text-white/20 uppercase tracking-widest">
                            {cat.name}
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
                                  "relative flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm transition-colors",
                                  isActive
                                    ? "text-white bg-white/[0.08]"
                                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                                )}
                              >
                                <Icon size={15} className={cn("shrink-0", isActive ? "text-white/60" : "text-white/25")} />
                                <span>{comp.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </nav>

            {/* Footer */}
            <div className="px-2 py-3 mt-auto">
              {[
                { label: "Playground", icon: Gamepad2 },
                { label: "Docs", icon: FileText },
              ].map(({ label, icon: Icon }) => (
                <Link
                  key={label}
                  href={`/${label.toLowerCase()}`}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm text-white/20 hover:text-white/40 hover:bg-white/[0.04] transition-colors"
                >
                  <Icon size={15} className="text-white/15" />
                  <span>{label}</span>
                  <span className="ml-auto text-[9px] font-mono text-white/10">soon</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export function SidebarTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
    >
      <Menu size={18} />
    </button>
  );
}
