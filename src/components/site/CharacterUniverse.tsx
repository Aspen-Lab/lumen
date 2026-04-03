"use client";

import { useEffect, useRef } from "react";

const CODE_TEXT = `const prepare = (text, font) => { const segments = analyze(text); return measure(segments, font); }; export function layout(prepared, width, lineHeight) { let y = 0; let line = 0; for (const seg of prepared.segments) { if (seg.x + seg.w > width) { y += lineHeight; line++; } } return { height: y + lineHeight, lineCount: line + 1 }; } type AtomRole = "input" | "action" | "control" | "display" | "surface" | "layout" | "feedback"; interface AtomMeta { slug: string; name: string; role: AtomRole; intent: string; } const atoms = [FAB, TextArea, ChipButton, IconButton, ToggleChip, GlowSurface, Toolbar]; export default function render() { return atoms.map(a => <Component key={a.slug} {...a} />); } async function stream(prompt: string) { const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ prompt }) }); const reader = res.body?.getReader(); while (true) { const { done, value } = await reader.read(); if (done) break; yield decode(value); } } const springSnap = { type: "spring", stiffness: 400, damping: 20 }; const colors = { input: "#0BE09B", action: "#F97316", control: "#22D3EE", surface: "#7C5CFC" }; function buildPath(from, to, radius) { const dx = to.x - from.x; const dy = to.y - from.y; return \`M \${from.x} \${from.y} Q \${from.x + dx/2} \${from.y} \${to.x} \${to.y}\`; }`;

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
    let animId: number;
    let lastTime = 0;

    const FONT = "12px monospace";
    const LINE_H = 18;
    const CHAR_W = 7.2;

    function rebuild() {
      const rect = canvas.parentElement?.getBoundingClientRect();
      w = rect ? rect.width : 800;
      h = rect ? rect.height : 500;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cpl = Math.max(Math.floor((w - 40) / CHAR_W), 20);
      textLines = [];
      for (let i = 0; i < CODE_TEXT.length; i += cpl) {
        textLines.push(CODE_TEXT.slice(i, i + cpl));
      }
      while (textLines.length * LINE_H < h + 100) {
        textLines.push(...textLines.slice(0, 10));
      }
    }

    rebuild();

    // Load Pretext for better line breaking
    (async () => {
      try {
        const pretext = await import(/* webpackIgnore: true */ "https://esm.sh/@chenglou/pretext@0.18.4");
        const prepared = pretext.prepare(CODE_TEXT, FONT);
        const result = pretext.layout(prepared, w - 40, LINE_H);
        const cpl = Math.max(Math.floor(CODE_TEXT.length / result.lineCount), 20);
        textLines = [];
        for (let i = 0; i < CODE_TEXT.length; i += cpl) {
          textLines.push(CODE_TEXT.slice(i, i + cpl));
        }
        while (textLines.length * LINE_H < h + 100) {
          textLines.push(...textLines.slice(0, 10));
        }
      } catch { /* fallback already running */ }
    })();

    let mouseX = w / 2;
    let mouseY = h / 2;
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const draw = (now: number) => {
      animId = requestAnimationFrame(draw);
      if (now - lastTime < 33) return;
      lastTime = now;

      ctx.clearRect(0, 0, w, h);

      // Ghost push zones — recalculated every frame based on current w/h
      const pushZones = [
        // Title area
        { x: w * 0.22, y: h * 0.32, r: 160 },
        // Subtitle + stats
        { x: w * 0.25, y: h * 0.58, r: 130 },
        // Bohr atom
        { x: w * 0.72, y: h * 0.48, r: 190 },
        // Mouse cursor — small push
        { x: mouseX, y: mouseY, r: 50 },
      ];

      ctx.font = FONT;

      for (let i = 0; i < textLines.length; i++) {
        const baseY = i * LINE_H;
        if (baseY > h + 20 || baseY < -20) continue;

        // Check if any zone is near this line
        let nearZone = false;
        for (const z of pushZones) {
          if (Math.abs(baseY - z.y) < z.r + 20) {
            nearZone = true;
            break;
          }
        }

        if (!nearZone) {
          ctx.fillStyle = "rgba(255,255,255,0.035)";
          ctx.fillText(textLines[i], 20, baseY);
          continue;
        }

        // Per-character with displacement
        const line = textLines[i];
        for (let c = 0; c < line.length; c++) {
          let cx = 20 + c * CHAR_W;
          let cy = baseY;
          let alpha = 0.035;

          for (const z of pushZones) {
            const dx = cx - z.x;
            const dy = cy - z.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < z.r) {
              const s = 1 - dist / z.r;
              const push = s * s * 35;
              if (dist > 0.1) {
                cx += (dx / dist) * push;
                cy += (dy / dist) * push;
              }
              alpha = Math.max(alpha, 0.035 + s * 0.08);
            }
          }

          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.fillText(line[c], cx, cy);
        }
      }
    };

    animId = requestAnimationFrame(draw);
    window.addEventListener("resize", rebuild);

    return () => {
      window.removeEventListener("resize", rebuild);
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
