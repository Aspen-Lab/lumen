"use client";

import { Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export type Device = "desktop" | "mobile";

interface DeviceToggleProps {
  device: Device;
  onChange: (device: Device) => void;
}

export function DeviceToggle({ device, onChange }: DeviceToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl bg-surface-2/80 p-1">
      {(["desktop", "mobile"] as const).map((d) => (
        <button
          key={d}
          onClick={() => onChange(d)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
            device === d
              ? "bg-surface-4/80 text-white/80 shadow-sm"
              : "text-white/25 hover:text-white/45"
          )}
        >
          {d === "desktop" ? <Monitor size={14} /> : <Smartphone size={14} />}
          {d === "desktop" ? "Desktop" : "Mobile"}
        </button>
      ))}
    </div>
  );
}
