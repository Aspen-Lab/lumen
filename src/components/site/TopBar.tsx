"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TopBar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Components" },
    { href: "/patterns", label: "Patterns" },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-6 lg:px-10 bg-surface-0/80 backdrop-blur-md">
      {/* Left */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.img
            src="/images/logo.png"
            alt="Lumen"
            className="h-5 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          />
        </Link>

        <nav className="hidden md:flex items-center gap-1 relative">
          {navItems.map(({ href, label }) => {
            const isActive = href === "/"
              ? pathname === "/" || pathname.startsWith("/components")
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "text-white/70"
                    : "text-white/25 hover:text-white/50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white/[0.05] rounded-lg"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-[1]">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right */}
      <motion.a
        href="https://github.com/Aspen-Lab/lumen"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.05]"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
        <Star size={12} className="text-white/15" />
      </motion.a>
    </header>
  );
}
