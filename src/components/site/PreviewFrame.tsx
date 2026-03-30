"use client";

import { cn } from "@/lib/utils";
import { type Device } from "./DeviceToggle";

interface PreviewFrameProps {
  device: Device;
  children: React.ReactNode;
}

export function PreviewFrame({ device, children }: PreviewFrameProps) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-surface-1 overflow-hidden">
      <div
        className={cn(
          "min-h-[400px] flex items-center justify-center p-10 transition-all duration-300",
          device === "mobile" && "max-w-[375px] mx-auto"
        )}
      >
        {children}
      </div>
    </div>
  );
}
