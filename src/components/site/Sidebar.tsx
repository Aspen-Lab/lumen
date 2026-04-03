"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Menu, MessageSquare, Sparkles, Gamepad2, FileText, Search, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { springTight, springBounce, stagger } from "@/lib/motion";
import { categories, getComponentsByCategory } from "@/data/registry";
import { atomRegistry } from "@/data/atom-registry";
import { ROLE_COLORS, type AtomRole } from "@/types/atom";
import { Logo } from "./Logo";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const componentIcons: Record<string, React.ElementType> = {
  "prompt-input": MessageSquare,
};

// Group atoms by role, filtering out empty groups
const atomsByRole = Object.entries(
  atomRegistry.reduce<Record<string, typeof atomRegistry>>((acc, atom) => {
    (acc[atom.role] ??= []).push(atom);
    return acc;
  }, {})
);

export function Sidebar({ open, onClose }: SidebarProps) {
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
          "fixed top-0 left-0 z-50 h-full w-sidebar flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] backdrop-blur-3xl backdrop-saturate-150",
          "lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          background: "linear-gradient(180deg, rgba(12,12,18,0.55) 0%, rgba(8,8,14,0.65) 50%, rgba(6,6,10,0.7) 100%)",
        }}
      >
        {/* Right edge — soft light border */}
        <div
          className="absolute top-0 right-0 bottom-0 w-px"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 60%, transparent 100%)",
          }}
        />
        {/* Frosted noise overlay — faint grain texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />

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
        <div className="px-3 flex items-center gap-1 mb-2 mt-2">
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
                  "relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                  isActive ? "text-white/70" : "text-white/25 hover:text-white/50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-nav"
                    className="absolute inset-0 rounded-lg border border-white/[0.08]"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
                    }}
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
            whileHover={{ borderColor: "rgba(255,255,255,0.1)" }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/25 cursor-pointer border border-white/[0.05] transition-colors duration-200"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
            }}
          >
            <Search size={13} className="text-white/20" />
            <span className="text-sm text-white/20">Search...</span>
            <span
              className="ml-auto text-[10px] font-mono text-white/15 px-1.5 py-0.5 rounded border border-white/[0.06]"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              /
            </span>
          </motion.div>
        </div>

        {/* Content — switches between Components and Atoms */}
        <nav className="flex-1 overflow-y-auto py-2 px-3">
          <AnimatePresence mode="wait">
            {isAtomsPage ? (
              <motion.div
                key="atoms"
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
              >
                {atomsByRole.map(([role, atoms]) => (
                  <div key={role} className="mb-3">
                    <div className="px-3 pt-3 pb-1.5">
                      <span className="text-[10px] font-mono font-medium text-white/15 uppercase tracking-widest">{role}</span>
                    </div>
                    {atoms.map((atom, i) => {
                      const color = ROLE_COLORS[atom.role];
                      const href = `/atoms/${atom.slug}`;
                      const isActive = pathname === href;
                      return (
                        <motion.div
                          key={atom.slug}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={stagger(i)}
                        >
                          <Link
                            href={href}
                            onClick={onClose}
                            className={cn(
                              "group/item relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                              isActive ? "text-white" : "text-white/40 hover:text-white/65"
                            )}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="sidebar-active"
                                className="absolute inset-0 rounded-lg border border-white/[0.08]"
                                style={{
                                  background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                                }}
                                transition={springTight}
                              />
                            )}
                            <div
                              className={cn(
                                "relative z-[1] flex items-center justify-center w-7 h-7 rounded-md transition-all duration-150",
                                isActive
                                  ? "border border-white/[0.1]"
                                  : "border border-white/[0.04] group-hover/item:border-white/[0.08]"
                              )}
                              style={{
                                background: isActive ? `${color}18` : "rgba(255,255,255,0.03)",
                                boxShadow: isActive ? `inset 0 1px 0 ${color}15` : undefined,
                              }}
                            >
                              <Circle
                                size={8}
                                fill={isActive ? color : "transparent"}
                                stroke={color}
                                strokeWidth={isActive ? 0 : 1.5}
                                className="transition-all duration-150"
                                style={{ opacity: isActive ? 0.8 : 0.3 }}
                              />
                            </div>
                            <span className="relative z-[1] font-medium font-mono text-[13px]">{atom.name}</span>
                            {isActive && (
                              <motion.div
                                className="absolute right-3 w-1 h-1 rounded-full"
                                style={{ background: `${color}60` }}
                                layoutId="sidebar-dot"
                                transition={springBounce}
                              />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="components"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.15 }}
              >
                {categories.map((cat) => {
                  const components = getComponentsByCategory(cat.slug);
                  if (components.length === 0) return null;
                  return (
                    <div key={cat.slug} className="mb-3">
                      <div className="px-3 pt-3 pb-1.5">
                        <span className="text-[10px] font-mono font-medium text-white/15 uppercase tracking-widest">{cat.name}</span>
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
                                "group/item relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                                isActive ? "text-white" : "text-white/40 hover:text-white/65"
                              )}
                            >
                              {isActive && (
                                <motion.div
                                  layoutId="sidebar-active"
                                  className="absolute inset-0 rounded-lg border border-white/[0.08]"
                                  style={{
                                    background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                                  }}
                                  transition={springTight}
                                />
                              )}
                              <div
                                className={cn(
                                  "relative z-[1] flex items-center justify-center w-7 h-7 rounded-md transition-all duration-150",
                                  isActive
                                    ? "bg-white/[0.08] border border-white/[0.1]"
                                    : "bg-white/[0.03] border border-white/[0.04] group-hover/item:bg-white/[0.06] group-hover/item:border-white/[0.08]"
                                )}
                                style={isActive ? { boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" } : {}}
                              >
                                <Icon size={14} className={cn(isActive ? "text-white/70" : "text-white/25 group-hover/item:text-white/50 transition-colors")} />
                              </div>
                              <span className="relative z-[1] font-medium">{comp.name}</span>
                              {isActive && (
                                <motion.div
                                  className="absolute right-3 w-1 h-1 rounded-full bg-white/30"
                                  layoutId="sidebar-dot"
                                  transition={springBounce}
                                />
                              )}
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Footer links */}
        <div className="px-3 py-3">
          <div className="mb-2" />
          {[
            { label: "Playground", icon: Gamepad2 },
            { label: "Docs", icon: FileText },
          ].map(({ label, icon: Icon }) => (
            <Link
              key={label}
              href={`/${label.toLowerCase()}`}
              className="group/foot flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/25 hover:text-white/45 transition-all duration-150"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-white/[0.03] border border-white/[0.04] group-hover/foot:bg-white/[0.05] group-hover/foot:border-white/[0.07] transition-all duration-150">
                <Icon size={13} className="text-white/20 group-hover/foot:text-white/35 transition-colors" />
              </div>
              <span>{label}</span>
              <span
                className="ml-auto text-[8px] font-mono text-white/12 px-1.5 py-0.5 rounded border border-white/[0.04] uppercase tracking-wider"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                soon
              </span>
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
