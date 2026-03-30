"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories, getComponentsByCategory } from "@/data/registry";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-sidebar bg-surface-0 flex flex-col transition-transform duration-200",
          "lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 h-16">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <span className="text-xl font-bold text-white tracking-tight">
              Lumen
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-white/30 hover:text-white/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-4">
          {categories.map((cat) => {
            const components = getComponentsByCategory(cat.slug);
            return (
              <div key={cat.slug} className="mb-5">
                <div className="px-2 mb-2 text-xs font-medium text-white/25 uppercase tracking-widest">
                  {cat.name}
                </div>
                {components.map((comp) => {
                  const href = `/components/${comp.category}/${comp.slug}`;
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={comp.slug}
                      href={href}
                      onClick={onClose}
                      className={cn(
                        "block px-2 py-2 rounded-lg text-sm transition-colors duration-100",
                        isActive
                          ? "bg-white/[0.07] text-white"
                          : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                      )}
                    >
                      {comp.name}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-5 flex flex-col gap-1">
          {["Patterns", "Playground", "Docs"].map((label) => (
            <Link
              key={label}
              href={`/${label.toLowerCase()}`}
              className="px-2 py-1.5 text-xs text-white/20 hover:text-white/40 transition-colors"
            >
              {label}
              <span className="ml-2 text-[10px] text-white/10">soon</span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}

export function SidebarTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-colors"
    >
      <Menu size={20} />
    </button>
  );
}
