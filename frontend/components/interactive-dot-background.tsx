"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const GAP = 52;
const DOT_SIZE = 4;
const MAX_SCALE = 2.2;
const WAVE_DURATION_MS = 3000;
const WAVE_WIDTH = 0.18;
const HOVER_RADIUS = 100;

function useMousePosition() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener("mousemove", handler);
    return () => {
      window.removeEventListener("mousemove", handler);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return pos;
}

export function InteractiveDotBackground() {
  const mouse = useMousePosition();
  const [size, setSize] = useState({ w: 1920, h: 1080 });
  const [waveT, setWaveT] = useState(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    const update = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    startRef.current = performance.now();
    let rafId: number;

    const tick = () => {
      const elapsed = performance.now() - startRef.current;
      const t = (elapsed / WAVE_DURATION_MS) % 1;
      setWaveT(t);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const dots = useMemo(() => {
    const cols = Math.ceil(size.w / GAP) + 1;
    const rows = Math.ceil(size.h / GAP) + 1;
    const paddingX = (size.w - (cols - 1) * GAP) / 2;
    const paddingY = (size.h - (rows - 1) * GAP) / 2;
    const list: { x: number; y: number; phase: number }[] = [];
    const maxPhase = cols - 1 + rows - 1;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = paddingX + col * GAP;
        const y = paddingY + row * GAP;
        const phase = (cols - 1 - col + row) / maxPhase;
        list.push({ x, y, phase });
      }
    }
    return list;
  }, [size.w, size.h]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    >
      {dots.map((dot, i) => {
        let waveDist = (dot.phase - waveT + 1) % 1;
        if (waveDist > 0.5) waveDist = 1 - waveDist;
        const waveScale =
          waveDist < WAVE_WIDTH
            ? 1 + (1 - waveDist / WAVE_WIDTH) * (MAX_SCALE - 1)
            : 1;

        const dx = mouse ? mouse.x - dot.x : 0;
        const dy = mouse ? mouse.y - dot.y : 0;
        const mouseDist = Math.sqrt(dx * dx + dy * dy);
        const mouseScale =
          mouse && mouseDist < HOVER_RADIUS
            ? 1 + (1 - mouseDist / HOVER_RADIUS) * (MAX_SCALE - 1)
            : 1;

        const scale = Math.max(waveScale, mouseScale);

        return (
          <div
            key={i}
            className="absolute rounded-full bg-primary/50 transition-none"
            style={{
              left: dot.x - DOT_SIZE / 2,
              top: dot.y - DOT_SIZE / 2,
              width: DOT_SIZE,
              height: DOT_SIZE,
              transform: `scale(${scale})`,
              transformOrigin: "center",
              willChange: "transform",
            }}
          />
        );
      })}
    </div>
  );
}
