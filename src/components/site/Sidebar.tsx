"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X, Menu, MessageSquare, Zap, Brain, Activity,
  Scale, BarChart3, Sparkles, Layers, Play, Eye,
  BookOpen, Gamepad2, FileText, Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { categories, getComponentsByCategory } from "@/data/registry";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const categoryIcons: Record<string, React.ElementType> = {
  action: Zap,
  reasoning: Brain,
  decision: Scale,
  output: Sparkles,
  motion: Play,
};

const componentIcons: Record<string, React.ElementType> = {
  "prompt-input": MessageSquare,
  "smart-cta": Zap,
  "thinking-loader": Activity,
  "reasoning-steps": Layers,
  "decision-card": Scale,
  "confidence-meter": BarChart3,
  "result-reveal": Eye,
  "insight-stack": Layers,
  "progressive-blur-reveal": Play,
};

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
          "fixed top-14 left-0 z-50 h-[calc(100%-56px)] w-sidebar bg-[#0A0A10] flex flex-col transition-transform duration-200",
          "lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="absolute top-0 right-0 bottom-0 w-px bg-white/[0.06]" />

        {/* Search placeholder */}
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.03] text-white/20 cursor-pointer hover:bg-white/[0.05] transition-colors">
            <Search size={14} />
            <span className="text-sm">Search...</span>
            <span className="ml-auto text-[10px] font-mono text-white/10 bg-white/[0.04] px-1.5 py-0.5 rounded">/</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-3">
          {categories.map((cat) => {
            const components = getComponentsByCategory(cat.slug);
            return (
              <div key={cat.slug} className="mb-1">
                {/* Category header */}
                <div className="px-3 pt-4 pb-1.5">
                  <span className="text-xs font-medium text-white/25">
                    {cat.name}
                  </span>
                </div>

                {/* Items */}
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
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-100",
                        isActive
                          ? "bg-white/[0.07] text-white"
                          : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                      )}
                    >
                      <Icon size={16} className={isActive ? "text-white/60" : "text-white/20"} />
                      <span>{comp.name}</span>
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
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/20 hover:text-white/40 hover:bg-white/[0.02] transition-colors"
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
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-colors"
    >
      <Menu size={20} />
    </button>
  );
}
