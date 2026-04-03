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

const PET_WALK1 = [
  [0,0,1,0,0,1,0,0],
  [0,1,1,1,1,1,1,0],
  [0,1,2,1,1,2,1,0],
  [0,1,1,3,3,1,1,0],
  [0,0,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,0],
  [0,1,0,0,0,1,0,0],
];

const PET_WALK2 = [
  [0,0,1,0,0,1,0,0],
  [0,1,1,1,1,1,1,0],
  [0,1,2,1,1,2,1,0],
  [0,1,1,3,3,1,1,0],
  [0,0,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,0],
  [0,0,1,0,0,0,1,0],
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

// 4=angry eye
const PET_WAKING = [
  [0,0,1,0,0,1,0,0],
  [0,1,1,1,1,1,1,0],
  [0,1,0,1,1,0,1,0],
  [0,1,1,3,3,1,1,0],
  [0,0,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,0],
  [0,1,0,1,1,0,1,0],
];

const PET_ANGRY = [
  [0,0,1,0,0,1,0,0],
  [0,1,1,1,1,1,1,0],
  [0,1,4,1,1,4,1,0],
  [0,1,1,3,3,1,1,0],
  [0,0,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,0],
  [0,1,0,1,1,0,1,0],
];

interface PetProps {
  timeOfDay: string;
  time: Date;
  weather?: { icon: string; temp: string; city: string } | null;
}

function PixelPet({ timeOfDay, time, weather }: PetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const timeRef = useRef(time);
  const weatherRef = useRef(weather);
  timeRef.current = time;
  weatherRef.current = weather;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.clientWidth;
    const H = canvas.clientHeight || 44;
    const dpr = 2;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    const scene = SCENE_COLORS[timeOfDay as keyof typeof SCENE_COLORS] ?? SCENE_COLORS.day;
    const isNight = timeOfDay === "night";

    // Pet state machine: sleep → waking → angry → idle/walk → (after 10s idle) → sleep
    type PetState = "sleep" | "waking" | "angry" | "idle" | "walk";
    let state: PetState = isNight ? "sleep" : "idle";
    let petX = 10;
    let targetX = 10;
    let facingRight = true;
    const speed = 0.8;
    const px = 2;
    let stateTimer = 0; // frames in current state
    let idleTimer = 0;  // frames since last activity (for sleep timeout at night)
    let pendingTargetX = -1; // queued target for after wakeup

    let animId: number;
    let starOffsets: { x: number; y: number; b: number }[] = [];
    if (scene.stars) {
      starOffsets = Array.from({ length: 8 }, () => ({
        x: Math.random() * W,
        y: Math.random() * (H * 0.55),
        b: Math.random(),
      }));
    }

    // Click handler
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) * (W / rect.width);
      const clampedX = Math.max(4, Math.min(W - 20, clickX - 8));

      if (state === "sleep") {
        // Start wake-up sequence
        pendingTargetX = clampedX;
        state = "waking";
        stateTimer = 0;
      } else if (state === "waking" || state === "angry") {
        // Queue the target, don't interrupt animation
        pendingTargetX = clampedX;
      } else {
        targetX = clampedX;
        state = "walk";
        idleTimer = 0;
      }
    };
    canvas.addEventListener("click", onClick);

    const draw = () => {
      animId = requestAnimationFrame(draw);
      frameRef.current++;
      const f = frameRef.current;

      // ── State machine ──
      stateTimer++;

      // Waking: show sleep sprite rising for ~40 frames
      if (state === "waking" && stateTimer > 40) {
        state = "angry";
        stateTimer = 0;
      }
      // Angry: show angry face for ~50 frames, then respond
      if (state === "angry" && stateTimer > 50) {
        state = "idle";
        stateTimer = 0;
        idleTimer = 0;
        if (pendingTargetX >= 0) {
          targetX = pendingTargetX;
          pendingTargetX = -1;
          state = "walk";
        }
      }

      // Walk toward target
      if (state === "walk") {
        const dist = targetX - petX;
        if (Math.abs(dist) > 1) {
          petX += Math.sign(dist) * Math.min(speed, Math.abs(dist));
          facingRight = dist > 0;
        } else {
          state = "idle";
          idleTimer = 0;
        }
      }

      // Idle timeout at night → fall back asleep after 10s (300 frames at ~30fps)
      if (state === "idle" && isNight) {
        idleTimer++;
        if (idleTimer > 300) {
          state = "sleep";
          stateTimer = 0;
          idleTimer = 0;
        }
      }

      // Pick sprite
      let pet: number[][];
      if (state === "sleep") {
        pet = PET_SLEEP;
      } else if (state === "waking") {
        pet = PET_WAKING;
      } else if (state === "angry") {
        pet = PET_ANGRY;
      } else if (state === "walk") {
        pet = Math.floor(f / 8) % 2 === 0 ? PET_WALK1 : PET_WALK2;
      } else {
        pet = PET_IDLE;
      }

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
      const groundY = H * 0.65;
      const petY = groundY - pet.length * px;
      let bounce = 0;
      if (state === "sleep") {
        bounce = Math.sin(f * 0.015) * 0.5;
      } else if (state === "waking") {
        // Slowly rise up with a shake
        const rise = Math.min(stateTimer / 40, 1);
        bounce = (1 - rise) * 3 + Math.sin(f * 0.3) * 0.5;
      } else if (state === "angry") {
        // Quick shake
        bounce = Math.sin(f * 0.4) * 1;
      } else if (state === "walk") {
        bounce = Math.abs(Math.sin(f * 0.08)) * -1.5;
      } else {
        bounce = Math.abs(Math.sin(f * 0.04)) * -0.5;
      }

      const cols = pet[0].length;
      for (let r = 0; r < pet.length; r++) {
        for (let c = 0; c < cols; c++) {
          const sc = facingRight ? c : (cols - 1 - c);
          const v = pet[r][sc];
          if (v === 0) continue;
          if (v === 1) ctx.fillStyle = "rgba(255,255,255,0.5)";
          if (v === 2) ctx.fillStyle = "rgba(140,220,255,0.7)";
          if (v === 3) ctx.fillStyle = "rgba(255,180,200,0.5)";
          if (v === 4) ctx.fillStyle = "rgba(255,80,80,0.8)"; // angry eye
          ctx.fillRect(Math.round(petX) + c * px, petY + r * px + bounce, px, px);
        }
      }

      // Zzz for sleeping
      if (state === "sleep") {
        const zAlpha = Math.sin(f * 0.025) * 0.2 + 0.3;
        ctx.fillStyle = `rgba(255,255,255,${zAlpha})`;
        ctx.font = "5px monospace";
        ctx.fillText("z", Math.round(petX) + 18, petY - 2 + Math.sin(f * 0.02) * 2);
        ctx.fillText("z", Math.round(petX) + 22, petY - 5 + Math.sin(f * 0.02 + 1) * 2);
      }

      // ! for angry
      if (state === "angry") {
        const bAlpha = Math.abs(Math.sin(f * 0.1));
        ctx.fillStyle = `rgba(255,80,80,${0.4 + bAlpha * 0.4})`;
        ctx.font = "bold 7px monospace";
        ctx.fillText("!", Math.round(petX) + 18, petY - 3);
      }

      // ... for waking
      if (state === "waking") {
        const dots = ".".repeat(1 + Math.floor(stateTimer / 12) % 3);
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.font = "6px monospace";
        ctx.fillText(dots, Math.round(petX) + 18, petY);
      }

      // ── HUD text overlays ──

      const timeStr = formatTime(timeRef.current);
      const dateStr = formatDate(timeRef.current);

      // Time — center
      const cx = W / 2;
      ctx.textAlign = "center";
      ctx.font = "bold 16px monospace";
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fillText(timeStr, cx, H * 0.42);

      // Date — below time
      ctx.font = "10px monospace";
      ctx.fillStyle = "rgba(255,255,255,0.16)";
      ctx.fillText(dateStr, cx, H * 0.42 + 14);

      // Weather — right side
      const w = weatherRef.current;
      if (w) {
        ctx.textAlign = "right";
        ctx.font = "12px monospace";
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillText(`${w.icon} ${w.temp}`, W - 12, H * 0.38);
        ctx.font = "9px monospace";
        ctx.fillStyle = "rgba(255,255,255,0.14)";
        ctx.fillText(w.city, W - 12, H * 0.38 + 13);
      }

      ctx.textAlign = "start";
    };

    animId = requestAnimationFrame(draw);
    const onResize = () => {
      const newW = canvas.clientWidth;
      const newH = canvas.clientHeight || 44;
      canvas.width = newW * dpr;
      canvas.height = newH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeOfDay]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ imageRendering: "pixelated", cursor: "pointer" }}
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

  // Weather
  useEffect(() => {
    async function fetchGeo() {
      try {
        const wRes = await fetch(`https://wttr.in/?format=j1`);
        const wData = await wRes.json();
        const current = wData.current_condition?.[0];
        const area = wData.nearest_area?.[0];

        if (current && area) {
          setGeo({
            ip: "",
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="flex-1 h-full overflow-hidden"
      style={{ background: "rgba(0,0,0,0.15)" }}
    >
      <PixelPet
        timeOfDay={tod}
        time={time}
        weather={geo ? { icon: geo.icon, temp: geo.temp, city: geo.city } : null}
      />
    </motion.div>
  );
}
