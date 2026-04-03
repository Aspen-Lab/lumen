"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { categories, getComponentsByCategory } from "@/data/registry";
import { atomRegistry } from "@/data/atom-registry";
import { ROLE_COLORS, type AtomRole } from "@/types/atom";
import { PromptInput } from "@/components/library/action/PromptInput";
import { TiltCard } from "@/components/site/TiltCard";
import { CharacterUniverse } from "@/components/site/CharacterUniverse";
import { BohrAtom } from "@/components/site/BohrAtom";
import { ArrowRight } from "lucide-react";

const previewMap: Record<string, React.ComponentType> = {
  "prompt-input": PromptInput,
};

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, -40]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.97]);

  return (
    <div className="space-y-20">
      {/* ── Hero ── */}
      <motion.div
        ref={heroRef}
        className="relative min-h-[60vh] overflow-hidden rounded-2xl"
        style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
      >
        {/* Character Universe — fills hero, text + orbs push characters */}
        <div className="absolute inset-0 z-0">
          <CharacterUniverse />
        </div>

        {/* Edge fades */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-surface-0 to-transparent z-[1] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface-0 to-transparent z-[1] pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-surface-0 to-transparent z-[1] pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-surface-0 to-transparent z-[1] pointer-events-none" />

        {/* Content — two columns */}
        <div className="relative z-[2] flex items-center min-h-[60vh] px-8 lg:px-12 py-16">
          {/* Left — text */}
          <div className="flex-1 space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1
                className="text-[48px] lg:text-[64px] font-bold text-white tracking-tight leading-[0.95]"
                initial={{ y: 30 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              >
                Build AI
                <br />
                <span className="text-white/25">interfaces.</span>
              </motion.h1>
            </motion.div>

            <motion.p
              className="text-base text-white/20 max-w-sm leading-relaxed"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Components and atoms designed for reasoning,
              decision, action, and output.
            </motion.p>

            {/* Stats */}
            <motion.div
              className="flex items-center gap-5 pt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              {[
                { n: categories.reduce((s, c) => s + getComponentsByCategory(c.slug).length, 0), label: "Components" },
                { n: atomRegistry.length, label: "Atoms" },
                { n: Object.keys(ROLE_COLORS).length, label: "Roles" },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-baseline gap-1.5">
                  <motion.span
                    className="text-lg font-bold font-mono text-white/50"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    {stat.n}
                  </motion.span>
                  <span className="text-[9px] font-mono text-white/12 uppercase tracking-widest">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              className="flex items-center gap-3 pt-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <Link
                href="/components/action/prompt-input"
                className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] text-sm font-medium text-white/70 hover:text-white transition-all"
              >
                Explore
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/atoms"
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/25 hover:text-white/50 transition-colors"
              >
                View Atoms
              </Link>
            </motion.div>
          </div>

          {/* Right — Bohr Atom Model */}
          <motion.div
            className="hidden lg:flex items-center justify-center flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <BohrAtom />
          </motion.div>
        </div>
      </motion.div>

      {/* ── Atoms strip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-mono text-white/20 uppercase tracking-widest">Atoms</h2>
          <Link href="/atoms" className="text-xs text-white/15 hover:text-white/35 transition-colors">
            View all →
          </Link>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {atomRegistry.map((atom, i) => {
            const color = ROLE_COLORS[atom.role as AtomRole];
            return (
              <motion.div
                key={atom.slug}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <Link
                  href={`/atoms/${atom.slug}`}
                  className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-surface-1/60 hover:bg-surface-2/60 transition-all whitespace-nowrap"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: `${color}60` }}
                  />
                  <span className="text-sm font-mono text-white/40 group-hover:text-white/70 transition-colors">
                    {atom.name}
                  </span>
                  <span className="text-[9px] font-mono text-white/10 capitalize">{atom.role}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Components ── */}
      {categories.map((cat) => {
        const components = getComponentsByCategory(cat.slug);
        if (components.length === 0) return null;
        return (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xs font-mono text-white/20 uppercase tracking-widest">{cat.name}</h2>
              <div className="h-px bg-white/[0.04] flex-1" />
            </div>

            <div className="grid grid-cols-1 gap-4">
              {components.map((comp) => {
                const Preview = previewMap[comp.slug];
                return (
                  <Link key={comp.slug} href={`/components/${comp.category}/${comp.slug}`} className="block">
                    <TiltCard className="relative group rounded-2xl bg-surface-1/60 overflow-hidden">
                      <div className="relative h-[240px] flex items-center justify-center p-8 overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] rounded-full bg-purple-500/[0.04] blur-3xl pointer-events-none group-hover:bg-purple-500/[0.07] transition-all duration-500" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[120px] rounded-full bg-orange-500/[0.03] blur-2xl pointer-events-none translate-x-10 group-hover:bg-orange-500/[0.06] transition-all duration-500" />
                        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface-1 to-transparent z-10 pointer-events-none" />
                        <div className="w-full max-w-lg origin-center pointer-events-none select-none relative z-[1]">
                          {Preview && <Preview />}
                        </div>
                      </div>
                      <div className="px-5 py-4 flex items-center justify-between relative z-[3] transition-transform duration-300 group-hover:-translate-y-0.5">
                        <div>
                          <div className="text-sm font-semibold font-mono text-white/70 group-hover:text-white transition-colors duration-200">
                            {comp.name}
                          </div>
                          <div className="text-xs text-white/20 mt-0.5">{comp.description}</div>
                        </div>
                        <div className="text-white/0 group-hover:text-white/30 transition-all duration-200">
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </TiltCard>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
