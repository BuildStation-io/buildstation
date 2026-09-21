"use client";

import { useEffect, useRef } from "react";
import { sampleWater, waterField } from "@/lib/waterField";

function punchWhite(source: HTMLImageElement): HTMLCanvasElement {
  const punched = document.createElement("canvas");
  punched.width = source.naturalWidth;
  punched.height = source.naturalHeight;
  const ctx = punched.getContext("2d");
  if (!ctx) {
    return punched;
  }
  ctx.drawImage(source, 0, 0);
  const frame = ctx.getImageData(0, 0, punched.width, punched.height);
  const pixels = frame.data;
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i] ?? 0;
    const g = pixels[i + 1] ?? 0;
    const b = pixels[i + 2] ?? 0;
    if (r > 236 && g > 236 && b > 236) {
      pixels[i + 3] = 0;
    }
  }
  ctx.putImageData(frame, 0, 0);
  return punched;
}

export function HeroWaterMark() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      return;
    }

    const image = new Image();
    image.src = "/buildstation-hero-mark.png";
    let source: HTMLCanvasElement | HTMLImageElement = image;

    image.onload = () => {
      source = punchWhite(image);
    };

    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(Math.max(1, canvas.clientWidth) * dpr);
      canvas.height = Math.floor(Math.max(1, canvas.clientHeight) * dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      if (source instanceof HTMLImageElement && !source.complete) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      const slice = 2;
      const segments = 18;
      const srcW = source.width;
      const srcH = source.height;
      const srcSlice = Math.max(1, (slice / height) * srcH);
      const destSeg = width / segments;
      const srcSeg = srcW / segments;

      for (let y = 0; y < height; y += slice) {
        const srcY = (y / height) * srcH;
        for (let s = 0; s < segments; s += 1) {
          const u = (s + 0.5) / segments;
          const pageX = (rect.left + rect.width * u) / window.innerWidth;
          const pageY =
            (rect.top + (y / height) * rect.height) / window.innerHeight;
          const wave = sampleWater(pageX, pageY);
          const grad =
            sampleWater(pageX + 0.012, pageY) -
            sampleWater(pageX - 0.012, pageY);
          ctx.drawImage(
            source,
            s * srcSeg,
            srcY,
            srcSeg,
            srcSlice,
            s * destSeg + grad * 14,
            y + wave * 0.55,
            destSeg + 1,
            slice,
          );
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
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
