"use client";

import { useEffect, useRef, useState } from "react";

const COLS = 180;
const ROWS = 110;
const DAMPING = 0.965;
const SPREAD = 0.5;

export function WaterSurface() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(!motionQuery.matches);
    sync();
    motionQuery.addEventListener("change", sync);
    return () => motionQuery.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      return;
    }

    const buffer = document.createElement("canvas");
    buffer.width = COLS;
    buffer.height = ROWS;
    const bufferCtx = buffer.getContext("2d");
    if (!bufferCtx) {
      return;
    }

    const cells = COLS * ROWS;
    let current = new Float32Array(cells);
    let previous = new Float32Array(cells);
    let raf = 0;
    let lastX = -1;
    let lastY = -1;

    const image = bufferCtx.createImageData(COLS, ROWS);
    const pixels = image.data;

    const drop = (clientX: number, clientY: number, force: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor(((clientX - rect.left) / rect.width) * COLS);
      const y = Math.floor(((clientY - rect.top) / rect.height) * ROWS);
      if (x < 2 || y < 2 || x > COLS - 3 || y > ROWS - 3) {
        return;
      }
      for (let oy = -1; oy <= 1; oy += 1) {
        for (let ox = -1; ox <= 1; ox += 1) {
          previous[(y + oy) * COLS + (x + ox)] += force;
        }
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
    };

    const onMove = (event: PointerEvent) => {
      if (lastX >= 0) {
        const dist = Math.hypot(event.clientX - lastX, event.clientY - lastY);
        drop(event.clientX, event.clientY, Math.min(16, 4 + dist * 0.2));
      }
      lastX = event.clientX;
      lastY = event.clientY;
    };

    const onDown = (event: PointerEvent) => {
      drop(event.clientX, event.clientY, 32);
    };

    const tick = () => {
      if (Math.random() < 0.08) {
        const rx = 2 + Math.floor(Math.random() * (COLS - 4));
        const ry = 2 + Math.floor(Math.random() * (ROWS - 4));
        previous[ry * COLS + rx] += 6 + Math.random() * 8;
      }

      for (let y = 1; y < ROWS - 1; y += 1) {
        const row = y * COLS;
        for (let x = 1; x < COLS - 1; x += 1) {
          const i = row + x;
          const next =
            (previous[i - 1]! +
              previous[i + 1]! +
              previous[i - COLS]! +
              previous[i + COLS]!) *
              SPREAD -
            current[i]!;
          current[i] = next * DAMPING;
        }
      }

      const swap = previous;
      previous = current;
      current = swap;

      for (let y = 1; y < ROWS - 1; y += 1) {
        const row = y * COLS;
        for (let x = 1; x < COLS - 1; x += 1) {
          const i = row + x;
          const h = current[i]!;
          const dx = current[i - 1]! - current[i + 1]!;
          const dy = current[i - COLS]! - current[i + COLS]!;
          const light = Math.max(0, 1 - (dx + dy + 0.35) * 0.08);
          const wave = Math.max(-18, Math.min(18, h));
          const p = i * 4;
          pixels[p] = Math.min(255, 10 + wave * 2 + light * 28);
          pixels[p + 1] = Math.min(255, 36 + wave * 3.2 + light * 70);
          pixels[p + 2] = Math.min(255, 58 + wave * 4.4 + light * 120);
          pixels[p + 3] = Math.min(150, 36 + Math.abs(wave) * 5 + light * 40);
        }
      }

      bufferCtx.putImageData(image, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(buffer, 0, 0, canvas.width, canvas.height);
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
