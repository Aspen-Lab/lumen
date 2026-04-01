"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { categories, getComponentsByCategory } from "@/data/registry";
import { PromptInput } from "@/components/library/action/PromptInput";
import { TiltCard } from "@/components/site/TiltCard";

const previewMap: Record<string, React.ComponentType> = {
  "prompt-input": PromptInput,
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage() {
  return (
    <motion.div
      className="py-4"
      initial="hidden"
      animate="show"
      variants={stagger}
    >
      {/* Hero */}
      <motion.div className="space-y-4 pt-4 mb-14" variants={fadeUp}>
        <p className="text-base text-white/30 max-w-md leading-relaxed">
          Interactive components for AI-native interfaces.
          <br />
          Reasoning, decision, action, output.
        </p>
      </motion.div>

      {/* Components */}
      <motion.div variants={stagger}>
        {categories.map((cat) => {
          const components = getComponentsByCategory(cat.slug);
          return (
            <motion.div key={cat.slug} variants={fadeUp}>
              {/* Category label with line */}
              <motion.h2
                className="text-xs font-medium text-white/25 uppercase tracking-widest mb-4 flex items-center gap-3"
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -8 }}
                viewport={{ once: true }}
              >
                <span>{cat.name}</span>
                <motion.div
                  className="h-px bg-white/[0.06] flex-1"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  style={{ originX: 0 }}
                />
              </motion.h2>

              <div className="grid grid-cols-1 gap-4">
                {components.map((comp) => {
                  const Preview = previewMap[comp.slug];
                  return (
                    <motion.div key={comp.slug} variants={fadeUp}>
                      <Link href={`/components/${comp.category}/${comp.slug}`} className="block">
                        <TiltCard className="relative group rounded-2xl bg-surface-1/60 overflow-hidden">
                          {/* Live preview */}
                          <div className="relative h-[240px] flex items-center justify-center p-8 overflow-hidden">
                            {/* Ambient glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] rounded-full bg-purple-500/[0.04] blur-3xl pointer-events-none group-hover:bg-purple-500/[0.07] transition-all duration-500" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[120px] rounded-full bg-orange-500/[0.03] blur-2xl pointer-events-none translate-x-10 group-hover:bg-orange-500/[0.06] transition-all duration-500" />

                            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface-1 to-transparent z-10 pointer-events-none" />
                            <div className="w-full max-w-lg origin-center pointer-events-none select-none relative z-[1]">
                              {Preview && <Preview />}
                            </div>
                          </div>

                          {/* Info — slides up subtly on hover */}
                          <div className="px-5 py-4 flex items-center justify-between relative z-[3] transition-transform duration-300 group-hover:-translate-y-0.5">
                            <div>
                              <div className="text-sm font-semibold font-mono text-white/70 group-hover:text-white transition-colors duration-200">
                                {comp.name}
                              </div>
                              <div className="text-xs text-white/20 mt-0.5">
                                {comp.description}
                              </div>
                            </div>
                            {/* Arrow appears on hover */}
                            <motion.div
                              className="text-white/0 group-hover:text-white/30 transition-all duration-200"
                              initial={false}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                              </svg>
                            </motion.div>
                          </div>
                        </TiltCard>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
