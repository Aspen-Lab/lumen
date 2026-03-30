"use client";

import { useEffect, useRef } from "react";

export function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const GAP = 28;
    const BASE_R = 1;
    const MAX_R = 2.2;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(dpr, dpr);
    };

    const draw = () => {
      time += 0.004;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      const cols = Math.ceil(w / GAP) + 1;
      const rows = Math.ceil(h / GAP) + 1;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * GAP;
          const y = row * GAP;

          // Wave pattern — two overlapping sine waves
          const wave1 = Math.sin(x * 0.008 + time * 1.2) * Math.cos(y * 0.006 + time * 0.8);
          const wave2 = Math.sin((x + y) * 0.005 + time * 0.6);
          const wave = (wave1 + wave2) * 0.5;

          // Fade out towards edges
          const fx = 1 - Math.pow(Math.abs(x / w - 0.5) * 2, 2);
          const fy = 1 - Math.pow(y / h, 1.5);
          const fade = fx * fy;

          const intensity = (wave * 0.5 + 0.5) * fade;
          const r = BASE_R + (MAX_R - BASE_R) * intensity;
          const alpha = 0.03 + 0.08 * intensity;

          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
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
