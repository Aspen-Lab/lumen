"use client";

import { useEffect, useRef } from "react";
import { ROLE_COLORS, type AtomRole } from "@/types/atom";

interface Electron {
  name: string;
  role: AtomRole;
  orbit: number;
  speed: number;
  angle: number;
  // Each electron has its own orbital plane orientation
  planeAngle: number; // rotation of the orbital plane around Y axis
}

const ELECTRONS: Electron[] = [
  { name: "Input", role: "input", orbit: 70, speed: 0.018, angle: 0, planeAngle: 0 },
  { name: "Action", role: "action", orbit: 70, speed: 0.015, angle: Math.PI, planeAngle: Math.PI * 0.66 },
  { name: "Control", role: "control", orbit: 110, speed: 0.012, angle: 0.8, planeAngle: Math.PI * 0.33 },
  { name: "Display", role: "display", orbit: 110, speed: 0.01, angle: 3.5, planeAngle: Math.PI },
  { name: "Surface", role: "surface", orbit: 150, speed: 0.008, angle: 0.3, planeAngle: Math.PI * 0.2 },
  { name: "Layout", role: "layout", orbit: 150, speed: 0.007, angle: 2.5, planeAngle: Math.PI * 0.7 },
  { name: "Feedback", role: "feedback", orbit: 150, speed: 0.006, angle: 4.5, planeAngle: Math.PI * 1.3 },
];

const SIZE = 340;
const CX = SIZE / 2;
const CY = SIZE / 2;
const TILT = 0.55; // higher = more 3D depth, keeps circles round

export function BohrAtom() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const particles = ELECTRONS.map((e) => ({ ...e }));
    let nucleusPulse = 0;
    let animId: number;

    // Project a point on a tilted circular orbit to 2D
    function project(angle: number, orbit: number, planeAngle: number) {
      // Point on circle in orbital plane
      const lx = Math.cos(angle) * orbit;
      const ly = Math.sin(angle) * orbit;

      // Rotate the orbital plane around the vertical axis
      const cosP = Math.cos(planeAngle);
      const sinP = Math.sin(planeAngle);

      // x stays as horizontal, ly splits into y (vertical on screen) and z (depth)
      // No squash — circles stay round. Depth from tilt only affects z.
      const x = lx * cosP - ly * TILT * sinP;
      const y = ly;
      const z = lx * sinP + ly * TILT * cosP;

      return { px: CX + x, py: CY + y, z };
    }

    const draw = () => {
      animId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, SIZE, SIZE);
      nucleusPulse += 0.015;

      // ── Orbit rings — glow near electrons, transparent elsewhere ──
      // First compute current electron positions
      const electronPositions = particles.map((p) => {
        const { px, py } = project(p.angle, p.orbit, p.planeAngle);
        return { px, py, orbit: p.orbit, planeAngle: p.planeAngle, color: ROLE_COLORS[p.role] };
      });

      // Draw orbits as short segments, coloring each by proximity to electrons
      const orbits = [
        { r: 70, planes: [0, Math.PI * 0.66] },
        { r: 110, planes: [Math.PI * 0.33, Math.PI] },
        { r: 150, planes: [Math.PI * 0.2, Math.PI * 0.7, Math.PI * 1.3] },
      ];

      const GLOW_RANGE = 40; // px distance for ring glow

      for (const orb of orbits) {
        for (const plane of orb.planes) {
          const step = 0.04;
          for (let a = 0; a < Math.PI * 2; a += step) {
            const p1 = project(a, orb.r, plane);
            const p2 = project(a + step, orb.r, plane);

            // Find closest electron on this same orbit+plane
            let bestAlpha = 0;
            let bestColor = "255,255,255";

            for (const ep of electronPositions) {
              if (ep.orbit !== orb.r || ep.planeAngle !== plane) continue;
              const dx = (p1.px + p2.px) / 2 - ep.px;
              const dy = (p1.py + p2.py) / 2 - ep.py;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < GLOW_RANGE) {
                const s = 1 - dist / GLOW_RANGE;
                const r = parseInt(ep.color.slice(1, 3), 16);
                const g = parseInt(ep.color.slice(3, 5), 16);
                const b = parseInt(ep.color.slice(5, 7), 16);
                if (s > bestAlpha) {
                  bestAlpha = s;
                  bestColor = `${r},${g},${b}`;
                }
              }
            }

            const alpha = bestAlpha > 0 ? bestAlpha * 0.3 : 0.015;
            const color = bestAlpha > 0 ? bestColor : "255,255,255";

            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.strokeStyle = `rgba(${color},${alpha})`;
            ctx.lineWidth = bestAlpha > 0 ? 1 + bestAlpha : 0.5;
            ctx.stroke();
          }
        }
      }

      // ── Collect items for depth sort ──
      const items: { z: number; draw: () => void }[] = [];

      // Nucleus
      const ns = 1 + Math.sin(nucleusPulse) * 0.05;
      items.push({
        z: 0,
        draw: () => {
          const nr = 18 * ns;
          // Glow
          const g = ctx.createRadialGradient(CX, CY, 0, CX, CY, nr * 2.5);
          g.addColorStop(0, "rgba(124,92,252,0.18)");
          g.addColorStop(0.5, "rgba(124,92,252,0.05)");
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(CX, CY, nr * 2.5, 0, Math.PI * 2);
          ctx.fill();
          // Core
          const c = ctx.createRadialGradient(CX, CY, 0, CX, CY, nr);
          c.addColorStop(0, "rgba(255,255,255,0.2)");
          c.addColorStop(0.6, "rgba(124,92,252,0.15)");
          c.addColorStop(1, "transparent");
          ctx.fillStyle = c;
          ctx.beginPath();
          ctx.arc(CX, CY, nr, 0, Math.PI * 2);
          ctx.fill();
          // Dot
          ctx.fillStyle = "rgba(255,255,255,0.3)";
          ctx.beginPath();
          ctx.arc(CX, CY, 3, 0, Math.PI * 2);
          ctx.fill();
        },
      });

      // Electrons
      for (const p of particles) {
        // Non-linear speed — faster near "nucleus" side of orbit (Kepler-like)
        // sin(angle) peaks at π/2, so speed peaks when angle crosses that region
        const speedMod = 1 + 0.6 * Math.sin(p.angle * 2); // oscillates 0.4x to 1.6x
        p.angle += p.speed * speedMod;
        const { px, py, z } = project(p.angle, p.orbit, p.planeAngle);

        // Depth: z ranges roughly -orbit to +orbit
        const maxZ = p.orbit;
        const depthNorm = (z + maxZ) / (2 * maxZ); // 0=far, 1=near
        const dotR = 3.5 + depthNorm * 3.5;
        const alpha = 0.25 + depthNorm * 0.75;
        const color = ROLE_COLORS[p.role];

        items.push({
          z,
          draw: () => {
            // Glow
            const g = ctx.createRadialGradient(px, py, 0, px, py, dotR * 3);
            g.addColorStop(0, color + hex(alpha * 0.25));
            g.addColorStop(1, "transparent");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(px, py, dotR * 3, 0, Math.PI * 2);
            ctx.fill();

            // Dot
            ctx.globalAlpha = alpha;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(px, py, dotR, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;

            // Label
            ctx.font = "500 7px monospace";
            ctx.fillStyle = color + hex(alpha * 0.4);
            ctx.textAlign = "center";
            ctx.fillText(p.name.toUpperCase(), px, py + dotR + 10);
            ctx.textAlign = "start";
          },
        });
      }

      items.sort((a, b) => a.z - b.z);
      for (const item of items) item.draw();
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} style={{ width: SIZE, height: SIZE }} />;
}

function hex(a: number): string {
  return Math.round(Math.min(1, Math.max(0, a)) * 255)
    .toString(16)
    .padStart(2, "0");
}
