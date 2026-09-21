"use client";

import { useEffect, useRef, useState } from "react";
import { blackMark, HeroWaterMark } from "@/components/HeroWaterMark";

function HeroFallback() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const image = new Image();
    image.src = "/buildstation-hero-mark.png";
    image.onload = () => {
      const keyed = blackMark(image);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scale = Math.min(canvas.width / keyed.width, canvas.height / keyed.height);
      const drawWidth = keyed.width * scale;
      const drawHeight = keyed.height * scale;
      ctx.drawImage(
        keyed,
        (canvas.width - drawWidth) / 2,
        (canvas.height - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="BuildStation mark"
      className="absolute inset-0 h-full w-full"
    />
  );
}

export function HeroSculpture() {
  const [mode, setMode] = useState<"wet" | "static">("wet");

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMode(motion.matches ? "static" : "wet");
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none">
      {mode === "static" ? <HeroFallback /> : <HeroWaterMark />}
    </div>
  );
}
