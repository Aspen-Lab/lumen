"use client";

import Link from "next/link";
import { patternRegistry } from "@/data/patterns";
import { cn } from "@/lib/utils";

export default function PatternsPage() {
  return (
    <div className="space-y-12 py-4">
      {/* Header */}
      <div className="space-y-3 pt-4">
        <h1 className="text-[48px] font-bold tracking-tight text-white leading-none">
          Patterns
        </h1>
        <p className="text-lg text-white/35 max-w-lg leading-relaxed">
          Multi-component AI interaction flows
        </p>
      </div>

      {/* Pattern cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {patternRegistry.map((pattern) => (
          <Link
            key={pattern.slug}
            href={`/patterns/${pattern.slug}`}
            className={cn(
              "group block rounded-2xl bg-surface-1/60 overflow-hidden",
              "hover:bg-surface-2/60 transition-all duration-200 border border-white/[0.04]",
              "hover:border-white/[0.08]"
            )}
          >
            <div className="p-5 space-y-4">
              {/* Step count badge */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                  {pattern.steps.length} steps
                </span>
                {/* Arrow hint */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/10 group-hover:text-white/30 transition-colors duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transform"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>

              {/* Name and description */}
              <div className="space-y-1.5">
                <h2 className="text-base font-semibold font-mono text-white/70 group-hover:text-white transition-colors duration-200">
                  {pattern.name}
                </h2>
                <p className="text-sm text-white/25 leading-relaxed">
                  {pattern.description}
                </p>
              </div>

              {/* Step pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {pattern.steps.map((step, i) => (
                  <span
                    key={i}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
                      "bg-white/[0.04] border border-white/[0.06] text-[11px] text-white/30 font-mono"
                    )}
                  >
                    <span className="w-1 h-1 rounded-full bg-white/20 inline-block" />
                    {step.label}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
