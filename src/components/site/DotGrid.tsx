"use client";

export function DotGrid() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      {/* Static dot grid — pure CSS, zero JS */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 65%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 65%)",
        }}
      />
    </div>
  );
}
