"use client";

import { motion } from "framer-motion";
import { ROLE_COLORS, type AtomRole } from "@/types/atom";

const ELECTRONS = [
  { name: "Input", role: "input" as AtomRole, orbit: 70, speed: 12, start: 0 },
  { name: "Action", role: "action" as AtomRole, orbit: 70, speed: 10, start: 180 },
  { name: "Control", role: "control" as AtomRole, orbit: 110, speed: 16, start: 60 },
  { name: "Display", role: "display" as AtomRole, orbit: 110, speed: 14, start: 200 },
  { name: "Surface", role: "surface" as AtomRole, orbit: 150, speed: 22, start: 30 },
  { name: "Layout", role: "layout" as AtomRole, orbit: 150, speed: 20, start: 150 },
  { name: "Feedback", role: "feedback" as AtomRole, orbit: 150, speed: 18, start: 270 },
];

export function BohrAtom() {
  return (
    <div className="relative w-[340px] h-[340px]">
      {/* Orbit rings */}
      {[70, 110, 150].map((r) => (
        <div
          key={r}
          className="absolute rounded-full"
          style={{
            width: r * 2,
            height: r * 2,
            top: `calc(50% - ${r}px)`,
            left: `calc(50% - ${r}px)`,
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        />
      ))}

      {/* Nucleus */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: "radial-gradient(circle, rgba(124,92,252,0.3) 0%, rgba(124,92,252,0.1) 60%, transparent 100%)",
          boxShadow: "0 0 40px rgba(124,92,252,0.15), 0 0 80px rgba(124,92,252,0.05)",
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white/30" />
        </div>
      </motion.div>
      {/* Nucleus label */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-5 text-[8px] font-mono text-white/15 uppercase tracking-widest">
        Lumen
      </div>

      {/* Electrons */}
      {ELECTRONS.map((e) => {
        const color = ROLE_COLORS[e.role];
        return (
          <motion.div
            key={e.name}
            className="absolute top-1/2 left-1/2"
            style={{
              width: e.orbit * 2,
              height: e.orbit * 2,
              marginLeft: -e.orbit,
              marginTop: -e.orbit,
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: e.speed,
              repeat: Infinity,
              ease: "linear",
              delay: -(e.start / 360) * e.speed,
            }}
          >
            {/* Electron dot at top of orbit */}
            <motion.div
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 group/electron"
              whileHover={{ scale: 1.6 }}
            >
              {/* Glow */}
              <div
                className="absolute -inset-3 rounded-full blur-md"
                style={{ background: `${color}20` }}
              />
              {/* Dot */}
              <div
                className="relative w-3 h-3 rounded-full"
                style={{
                  background: color,
                  boxShadow: `0 0 8px ${color}60`,
                }}
              />
              {/* Label — counter-rotates to stay readable */}
              <motion.div
                className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap"
                style={{ rotate: 0 }}
                animate={{ rotate: -360 }}
                transition={{
                  duration: e.speed,
                  repeat: Infinity,
                  ease: "linear",
                  delay: -(e.start / 360) * e.speed,
                }}
              >
                <span
                  className="text-[8px] font-mono uppercase tracking-wider"
                  style={{ color: `${color}70` }}
                >
                  {e.name}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
