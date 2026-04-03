"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface BlueprintCanvasProps {
  children: React.ReactNode;
  width: number;
  height: number;
}

export function BlueprintCanvas({ children, width, height }: BlueprintCanvasProps) {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [baseScale, setBaseScale] = useState(1);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive: scale down canvas when container is narrower than canvas width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const containerW = entry.contentRect.width;
      setBaseScale(containerW < width ? containerW / width : 1);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Don't hijack clicks on interactive nodes
    if ((e.target as HTMLElement).closest("[data-interactive]")) return;
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
  }, []);

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setZoom((z) => Math.min(1.5, Math.max(0.4, z + delta)));
  }, []);

  const handleReset = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: Math.round(680 * baseScale), cursor: dragging.current ? "grabbing" : "grab" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
    >
      {/* Grid background — follows pan */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: `${32 * zoom * baseScale}px ${32 * zoom * baseScale}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      />

      {/* Transformed canvas */}
      <div
        className="absolute"
        style={{
          width,
          height,
          left: `calc(50% - ${width / 2}px)`,
          top: `calc(50% - ${height / 2}px)`,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * baseScale})`,
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>

      {/* Controls */}
      <div className="absolute bottom-3 right-3 z-30 flex items-center gap-2">
        <div className="flex items-center rounded-lg bg-white/[0.03] overflow-hidden">
          <button
            onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))}
            className="px-2.5 py-1 text-[11px] font-mono text-white/20 hover:text-white/50 hover:bg-white/[0.04] transition-all"
          >
            −
          </button>
          <span className="px-2 py-1 text-[9px] font-mono text-white/15 min-w-[40px] text-center">
            {Math.round(zoom * baseScale * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
            className="px-2.5 py-1 text-[11px] font-mono text-white/20 hover:text-white/50 hover:bg-white/[0.04] transition-all"
          >
            +
          </button>
        </div>
        <button
          onClick={handleReset}
          className="text-[9px] font-mono text-white/15 hover:text-white/40 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-all"
        >
          Reset
        </button>
      </div>

      {/* Hint */}
      <div className="absolute bottom-3 left-3 z-30 text-[8px] font-mono text-white/8">
        scroll to zoom · drag to pan
      </div>
    </div>
  );
}
