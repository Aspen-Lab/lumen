"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

// ── Time helpers ──

function getTimeOfDay(h: number) {
  if (h >= 0 && h < 6) return "night";
  if (h >= 6 && h < 8) return "dawn";
  if (h >= 8 && h < 17) return "day";
  if (h >= 17 && h < 20) return "dusk";
  return "evening";
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── Weather / IP ──

interface GeoWeather {
  ip: string;
  city: string;
  temp: string;
  condition: string;
  icon: string;
}

const WEATHER_ICONS: Record<string, string> = {
  Clear: "☀",
  "Partly cloudy": "⛅",
  Cloudy: "☁",
  Overcast: "☁",
  Rain: "🌧",
  "Light rain": "🌦",
  Snow: "❄",
  Fog: "🌫",
  Thunder: "⛈",
};

function matchWeatherIcon(desc: string): string {
  for (const [key, icon] of Object.entries(WEATHER_ICONS)) {
    if (desc.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return "☁";
}

// ── Pixel Pet Scene ──

const SCENE_COLORS = {
  night:   { sky: "#0a0a1a", ground: "#0d0f14", stars: true,  sun: false, moon: true  },
  dawn:    { sky: "#1a1028", ground: "#14121a", stars: false, sun: false, moon: false },
  day:     { sky: "#141825", ground: "#12141a", stars: false, sun: true,  moon: false },
  dusk:    { sky: "#1a1420", ground: "#14101a", stars: false, sun: false, moon: false },
  evening: { sky: "#0e0e1e", ground: "#0c0e16", stars: true,  sun: false, moon: false },
};

// Simple pixel pet (cat) as a grid
// 0=transparent 1=body 2=eye 3=nose
const PET_IDLE = [
  [0,0,1,0,0,1,0,0],
  [0,1,1,1,1,1,1,0],
  [0,1,2,1,1,2,1,0],
  [0,1,1,3,3,1,1,0],
  [0,0,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,0],
  [0,1,0,1,1,0,1,0],
];

const PET_SLEEP = [
  [0,0,1,0,0,1,0,0],
  [0,1,1,1,1,1,1,0],
  [0,1,0,1,1,0,1,0],
  [0,1,1,3,3,1,1,0],
  [0,0,1,1,1,1,0,0],
  [0,0,1,1,1,1,0,0],
  [0,0,0,1,1,0,0,0],
];

interface PetProps {
  timeOfDay: string;
  time: Date;
  weather?: { icon: string; temp: string; city: string } | null;
}

function PixelPet({ timeOfDay, time, weather }: PetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.clientWidth;
    const H = 36;
    const dpr = 2;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    const scene = SCENE_COLORS[timeOfDay as keyof typeof SCENE_COLORS] ?? SCENE_COLORS.day;
    const isSleeping = timeOfDay === "night";
    const pet = isSleeping ? PET_SLEEP : PET_IDLE;

    let animId: number;
    let starOffsets: { x: number; y: number; b: number }[] = [];
    if (scene.stars) {
      starOffsets = Array.from({ length: 8 }, () => ({
        x: Math.random() * W,
        y: Math.random() * (H * 0.55),
        b: Math.random(),
      }));
    }

    const draw = () => {
      animId = requestAnimationFrame(draw);
      frameRef.current++;
      const f = frameRef.current;

      ctx.clearRect(0, 0, W, H);

      // Sky
      ctx.fillStyle = scene.sky;
      ctx.fillRect(0, 0, W, H * 0.65);

      // Ground
      ctx.fillStyle = scene.ground;
      ctx.fillRect(0, H * 0.65, W, H * 0.35);

      // Ground line
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fillRect(0, Math.floor(H * 0.65), W, 1);

      // Stars
      if (scene.stars) {
        for (const s of starOffsets) {
          const twinkle = Math.sin(f * 0.03 + s.b * 10) * 0.3 + 0.4;
          ctx.fillStyle = `rgba(255,255,255,${twinkle * 0.4})`;
          ctx.fillRect(Math.floor(s.x), Math.floor(s.y), 1, 1);
        }
      }

      // Moon
      if (scene.moon) {
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.beginPath();
        ctx.arc(65, 8, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = scene.sky;
        ctx.beginPath();
        ctx.arc(67, 7, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sun
      if (scene.sun) {
        const pulse = Math.sin(f * 0.02) * 0.5 + 1.5;
        ctx.fillStyle = "rgba(255,200,100,0.08)";
        ctx.beginPath();
        ctx.arc(62, 10, 6 + pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,220,150,0.15)";
        ctx.beginPath();
        ctx.arc(62, 10, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Dawn/dusk gradient accent
      if (timeOfDay === "dawn") {
        ctx.fillStyle = "rgba(255,140,60,0.04)";
        ctx.fillRect(0, H * 0.5, W, H * 0.2);
      }
      if (timeOfDay === "dusk") {
        ctx.fillStyle = "rgba(200,80,120,0.04)";
        ctx.fillRect(0, H * 0.45, W, H * 0.25);
      }

      // Pet
      const px = 2; // pixel size
      const petX = 10;
      const petY = H * 0.65 - pet.length * px;
      const bounce = isSleeping
        ? Math.sin(f * 0.015) * 0.5
        : Math.abs(Math.sin(f * 0.04)) * -1;

      for (let r = 0; r < pet.length; r++) {
        for (let c = 0; c < pet[r].length; c++) {
          const v = pet[r][c];
          if (v === 0) continue;
          if (v === 1) ctx.fillStyle = "rgba(255,255,255,0.5)";
          if (v === 2) ctx.fillStyle = "rgba(140,220,255,0.7)";
          if (v === 3) ctx.fillStyle = "rgba(255,180,200,0.5)";
          ctx.fillRect(petX + c * px, petY + r * px + bounce, px, px);
        }
      }

      // Zzz for sleeping
      if (isSleeping) {
        const zAlpha = Math.sin(f * 0.025) * 0.2 + 0.3;
        ctx.fillStyle = `rgba(255,255,255,${zAlpha})`;
        ctx.font = "5px monospace";
        ctx.fillText("z", petX + 18, petY - 2 + Math.sin(f * 0.02) * 2);
        ctx.fillText("z", petX + 22, petY - 5 + Math.sin(f * 0.02 + 1) * 2);
      }
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [timeOfDay]);

  return (
    <canvas
      ref={canvasRef}
      className="rounded-md"
      style={{ width: 80, height: 40, imageRendering: "pixelated" }}
    />
  );
}

// ── StatusBar ──

export function StatusBar() {
  const [time, setTime] = useState(new Date());
  const [geo, setGeo] = useState<GeoWeather | null>(null);

  // Clock
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // IP + Weather
  useEffect(() => {
    async function fetchGeo() {
      try {
        // Get IP
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();
        const ip = ipData.ip;

        // Get weather by IP geolocation
        const wRes = await fetch(`https://wttr.in/?format=j1`);
        const wData = await wRes.json();
        const current = wData.current_condition?.[0];
        const area = wData.nearest_area?.[0];

        if (current && area) {
          setGeo({
            ip,
            city: area.areaName?.[0]?.value ?? "—",
            temp: current.temp_C + "°C",
            condition: current.weatherDesc?.[0]?.value ?? "",
            icon: matchWeatherIcon(current.weatherDesc?.[0]?.value ?? ""),
          });
        }
      } catch {
        // Silently fail
      }
    }
    fetchGeo();
  }, []);

  const hour = time.getHours();
  const tod = getTimeOfDay(hour);

  return (
    <div className="flex items-center gap-4">
      {/* Pixel pet scene */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="hidden lg:block rounded-lg overflow-hidden border border-white/[0.05]"
        style={{
          background: "rgba(0,0,0,0.3)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
        }}
      >
        <PixelPet timeOfDay={tod} />
      </motion.div>

      {/* Info chips */}
      <div className="flex items-center gap-2">
        {/* Time */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.05] font-mono"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <span className="text-[10px] text-white/15">{formatDate(time)}</span>
          <span className="text-[11px] text-white/40 tabular-nums">{formatTime(time)}</span>
        </motion.div>

        {/* Weather + Location */}
        {geo && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.05] font-mono"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <span className="text-[11px]">{geo.icon}</span>
            <span className="text-[11px] text-white/35">{geo.temp}</span>
            <span className="text-[10px] text-white/15">{geo.city}</span>
          </motion.div>
        )}

        {/* IP */}
        {geo && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex items-center px-3 py-1.5 rounded-lg border border-white/[0.05] font-mono"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <span className="text-[10px] text-white/20">{geo.ip}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
