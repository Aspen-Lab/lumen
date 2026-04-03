"use client";

import { useEffect, useRef } from "react";

// Source code text that fills the background — a dense wall of code tokens
const CODE_TEXT = `const prepare = (text, font) => { const segments = analyze(text); return measure(segments, font); }; export function layout(prepared, width, lineHeight) { let y = 0; let line = 0; for (const seg of prepared.segments) { if (seg.x + seg.w > width) { y += lineHeight; line++; } } return { height: y + lineHeight, lineCount: line + 1 }; } type AtomRole = "input" | "action" | "control" | "display" | "surface" | "layout" | "feedback"; interface AtomMeta { slug: string; name: string; role: AtomRole; intent: string; } const atoms = [FAB, TextArea, ChipButton, IconButton, ToggleChip, GlowSurface, Toolbar]; export default function render() { return atoms.map(a => <Component key={a.slug} {...a} />); } async function stream(prompt: string) { const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ prompt }) }); const reader = res.body?.getReader(); while (true) { const { done, value } = await reader.read(); if (done) break; yield decode(value); } } const springSnap = { type: "spring", stiffness: 400, damping: 20 }; const colors = { input: "#0BE09B", action: "#F97316", control: "#22D3EE", surface: "#7C5CFC" }; function buildPath(from, to, radius) { const dx = to.x - from.x; const dy = to.y - from.y; return \`M \${from.x} \${from.y} Q \${from.x + dx/2} \${from.y} \${to.x} \${to.y}\`; }`;

const ATOM_ORBS = [
  { name: "FAB", color: "#F97316", r: 18 },
  { name: "TextArea", color: "#0BE09B", r: 22 },
  { name: "Toggle", color: "#22D3EE", r: 16 },
  { name: "Surface", color: "#7C5CFC", r: 20 },
  { name: "Icon", color: "#A78BFA", r: 14 },
];

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  name: string;
  color: string;
}

export function CharacterUniverse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let textLines: string[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layoutText();
    };

    const FONT = "12px monospace";
    const LINE_H = 18;
    function layoutText() {
      const cpl = Math.floor((w - 40) / 7.2); // chars per line based on monospace ~7.2px
      textLines = [];
      for (let i = 0; i < CODE_TEXT.length; i += cpl) {
        textLines.push(CODE_TEXT.slice(i, i + cpl));
      }
      while (textLines.length * LINE_H < h + 100) {
        textLines.push(...textLines.slice(0, 10));
      }
    }

    resize();

    // Atom orbs
    const orbs: Orb[] = ATOM_ORBS.map((a) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      r: a.r,
      name: a.name,
      color: a.color,
    }));

    // Mouse
    let mouseX = w / 2;
    let mouseY = h / 2;
    const onMouse = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    window.addEventListener("mousemove", onMouse, { passive: true });

    // Scroll offset for text movement
    let scrollY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    let animId: number;
    let lastTime = 0;

    const draw = (now: number) => {
      animId = requestAnimationFrame(draw);
      if (now - lastTime < 33) return; // ~30fps
      lastTime = now;

      ctx.clearRect(0, 0, w, h);

      // ── Text wall ──
      ctx.font = FONT;
      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";

      const scrollOffset = (scrollY * 0.15) % LINE_H;
      for (let i = 0; i < textLines.length; i++) {
        const y = i * LINE_H - scrollOffset;
        if (y > h + 20 || y < -20) continue;
        ctx.fillText(textLines[i], 20, y);
      }

      // ── Orbs ──
      for (const orb of orbs) {
        // Move
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Bounce off walls
        if (orb.x < orb.r || orb.x > w - orb.r) orb.vx *= -1;
        if (orb.y < orb.r || orb.y > h - orb.r) orb.vy *= -1;

        // Mouse repulsion
        const dx = orb.x - mouseX;
        const dy = orb.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120 * 0.5;
          orb.vx += (dx / dist) * force;
          orb.vy += (dy / dist) * force;
        }

        // Damping
        orb.vx *= 0.995;
        orb.vy *= 0.995;

        // Speed limit
        const speed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
        if (speed > 2) {
          orb.vx = (orb.vx / speed) * 2;
          orb.vy = (orb.vy / speed) * 2;
        }

        // Glow
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r * 3);
        gradient.addColorStop(0, orb.color + "12");
        gradient.addColorStop(0.5, orb.color + "06");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r * 3, 0, Math.PI * 2);
        ctx.fill();

        // Orb circle
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fillStyle = orb.color + "15";
        ctx.fill();
        ctx.strokeStyle = orb.color + "25";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Label
        ctx.font = "500 9px monospace";
        ctx.fillStyle = orb.color + "50";
        ctx.textAlign = "center";
        ctx.fillText(orb.name, orb.x, orb.y + 3);
        ctx.textAlign = "start";

        // Distort text near orb — brighten characters close to the orb
        ctx.font = FONT;
        const nearY = Math.floor(orb.y / LINE_H);
        for (let li = nearY - 2; li <= nearY + 2; li++) {
          if (li < 0 || li >= textLines.length) continue;
          const lineY = li * LINE_H - scrollOffset;
          const lineDist = Math.abs(lineY - orb.y);
          if (lineDist < orb.r * 2.5) {
            const brightness = 1 - lineDist / (orb.r * 2.5);
            ctx.fillStyle = orb.color + Math.floor(brightness * 25).toString(16).padStart(2, "0");
            ctx.fillText(textLines[li], 20, lineY);
          }
        }
      }
    };

    animId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
