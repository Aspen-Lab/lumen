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
      const rect = canvas.parentElement?.getBoundingClientRect();
      w = rect ? rect.width : canvas.clientWidth;
      h = rect ? rect.height : canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layoutText();
    };

    const FONT = "12px monospace";
    const LINE_H = 18;
    let usePretextLayout = false;

    function layoutWithPretext(prepareFn: Function, layoutFn: Function) {
      try {
        const prepared = prepareFn(CODE_TEXT, FONT);
        const result = layoutFn(prepared, w - 40, LINE_H);
        const totalLines = Math.max(result.lineCount, 1);
        const cpl = Math.floor(CODE_TEXT.length / totalLines);
        textLines = [];
        for (let i = 0; i < CODE_TEXT.length; i += cpl) {
          textLines.push(CODE_TEXT.slice(i, i + cpl));
        }
        usePretextLayout = true;
      } catch {
        layoutFallback();
      }
      fillLines();
    }

    function layoutFallback() {
      const cpl = Math.floor((w - 40) / 7.2);
      textLines = [];
      for (let i = 0; i < CODE_TEXT.length; i += cpl) {
        textLines.push(CODE_TEXT.slice(i, i + cpl));
      }
    }

    function fillLines() {
      while (textLines.length * LINE_H < h + 100) {
        textLines.push(...textLines.slice(0, 10));
      }
    }

    function layoutText() {
      layoutFallback();
      fillLines();
    }

    resize();

    // Load Pretext client-side for accurate text measurement
    (async () => {
      try {
        const pretext = await import(/* webpackIgnore: true */ "https://esm.sh/@chenglou/pretext@0.18.4");
        layoutWithPretext(pretext.prepare, pretext.layout);
      } catch {
        // Pretext unavailable, fallback already running
      }
    })();

    // Ghost orbs — invisible, just push text away from UI elements
    // Title area (left side, ~top 40%)
    const ghostOrbs: Orb[] = [
      { x: w * 0.25, y: h * 0.35, vx: 0, vy: 0, r: 80, name: "", color: "#ffffff" },
      { x: w * 0.2, y: h * 0.55, vx: 0, vy: 0, r: 50, name: "", color: "#ffffff" },
      // Bohr atom area (right side, center)
      { x: w * 0.75, y: h * 0.5, vx: 0, vy: 0, r: 100, name: "", color: "#7C5CFC" },
    ];

    // Atom orbs — visible, moving
    const orbs: Orb[] = ATOM_ORBS.map((a) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      r: a.r,
      name: a.name,
      color: a.color,
    }));

    // Mouse — relative to canvas container
    let mouseX = w / 2;
    let mouseY = h / 2;
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const scrollY = 0;

    let animId: number;
    let lastTime = 0;

    const draw = (now: number) => {
      animId = requestAnimationFrame(draw);
      if (now - lastTime < 33) return; // ~30fps
      lastTime = now;

      ctx.clearRect(0, 0, w, h);

      // ── Update orbs first ──
      for (const orb of orbs) {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < orb.r || orb.x > w - orb.r) orb.vx *= -1;
        if (orb.y < orb.r || orb.y > h - orb.r) orb.vy *= -1;
        const dx = orb.x - mouseX;
        const dy = orb.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120 * 0.5;
          orb.vx += (dx / dist) * force;
          orb.vy += (dy / dist) * force;
        }
        orb.vx *= 0.995;
        orb.vy *= 0.995;
        const speed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
        if (speed > 2) { orb.vx = (orb.vx / speed) * 2; orb.vy = (orb.vy / speed) * 2; }
      }

      // ── Text wall — optimized: only per-char near orbs ──
      const CHAR_W = 7.2;
      const scrollOffset = (scrollY * 0.15) % LINE_H;
      const PUSH_R = 60;

      ctx.font = FONT;

      // Pre-compute which line ranges are near any orb
      // Combine ghost + visible orbs for text displacement
      const allPushOrbs = [...ghostOrbs, ...orbs];
      const allPushRGB = allPushOrbs.map((o) => ({
        r: parseInt(o.color.slice(1, 3), 16) || 255,
        g: parseInt(o.color.slice(3, 5), 16) || 255,
        b: parseInt(o.color.slice(5, 7), 16) || 255,
      }));

      const orbLineRanges: { minLine: number; maxLine: number }[] = allPushOrbs.map((orb) => ({
        minLine: Math.floor((orb.y - PUSH_R - 10 + scrollOffset) / LINE_H) - 1,
        maxLine: Math.ceil((orb.y + PUSH_R + 10 + scrollOffset) / LINE_H) + 1,
      }));

      // Pre-parse orb colors once
      const orbRGB = orbs.map((o) => ({
        r: parseInt(o.color.slice(1, 3), 16),
        g: parseInt(o.color.slice(3, 5), 16),
        b: parseInt(o.color.slice(5, 7), 16),
      }));

      for (let i = 0; i < textLines.length; i++) {
        const baseY = i * LINE_H - scrollOffset;
        if (baseY > h + 20 || baseY < -20) continue;

        // Is this line near any push orb?
        let nearOrb = false;
        for (let oi = 0; oi < allPushOrbs.length; oi++) {
          if (i >= orbLineRanges[oi].minLine && i <= orbLineRanges[oi].maxLine) {
            nearOrb = true;
            break;
          }
        }

        if (!nearOrb) {
          // Fast path — draw whole line
          ctx.fillStyle = "rgba(255,255,255,0.04)";
          ctx.fillText(textLines[i], 20, baseY);
          continue;
        }

        // Slow path — per-character displacement
        const line = textLines[i];
        for (let c = 0; c < line.length; c++) {
          let cx = 20 + c * CHAR_W;
          let cy = baseY;
          let alpha = 0.04;
          let cr = 255, cg = 255, cb = 255;

          for (let oi = 0; oi < allPushOrbs.length; oi++) {
            const orb = allPushOrbs[oi];
            const dx = cx - orb.x;
            const dy = cy - orb.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < PUSH_R) {
              const s = 1 - dist / PUSH_R;
              const push = s * s * 25;
              const nd = dist > 0.1 ? 1 / dist : 0;
              cx += dx * nd * push;
              cy += dy * nd * push;
              alpha = Math.max(alpha, 0.04 + s * 0.14);
              const m = s * 0.8;
              cr = Math.round(cr * (1 - m) + allPushRGB[oi].r * m);
              cg = Math.round(cg * (1 - m) + allPushRGB[oi].g * m);
              cb = Math.round(cb * (1 - m) + allPushRGB[oi].b * m);
            }
          }

          ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
          ctx.fillText(line[c], cx, cy);
        }
      }

      // ── Draw orbs ──
      for (const orb of orbs) {
        // Glow
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r * 3);
        gradient.addColorStop(0, orb.color + "15");
        gradient.addColorStop(0.5, orb.color + "08");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r * 3, 0, Math.PI * 2);
        ctx.fill();

        // Circle
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fillStyle = orb.color + "18";
        ctx.fill();
        ctx.strokeStyle = orb.color + "30";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Label
        ctx.font = "500 9px monospace";
        ctx.fillStyle = orb.color + "60";
        ctx.textAlign = "center";
        ctx.fillText(orb.name, orb.x, orb.y + 3);
        ctx.textAlign = "start";
        ctx.font = FONT;
      }
    };

    animId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
