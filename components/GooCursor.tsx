"use client";

import { useEffect, useRef, useState } from "react";

type GooCursorProps = {
  disabled?: boolean;
};

export function GooCursor({ disabled = false }: GooCursorProps) {
  const blobRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -80, y: -80 });
  const target = useRef({ x: -80, y: -80, scale: 1, color: "#f5f5f5" });
  const raf = useRef<number>(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (disabled) {
      setEnabled(false);
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: fine)");

    const syncEnabled = () => {
      setEnabled(!motionQuery.matches && pointerQuery.matches);
    };

    syncEnabled();
    motionQuery.addEventListener("change", syncEnabled);
    pointerQuery.addEventListener("change", syncEnabled);

    return () => {
      motionQuery.removeEventListener("change", syncEnabled);
      pointerQuery.removeEventListener("change", syncEnabled);
    };
  }, [disabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const onMove = (event: PointerEvent) => {
      target.current.x = event.clientX;
      target.current.y = event.clientY;
    };

    const onOver = (event: PointerEvent) => {
      const hit = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-goo-target]",
      );
      if (!hit) {
        target.current.scale = 1;
        target.current.color = "#f5f5f5";
        return;
      }
      target.current.scale = 2.4;
      target.current.color = hit.dataset.gooColor ?? "#f5f5f5";
    };

    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      const blob = blobRef.current;
      if (blob) {
        blob.style.transform = `translate3d(${pos.current.x - 14}px, ${pos.current.y - 14}px, 0) scale(${target.current.scale})`;
        blob.style.background = target.current.color;
      }
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      cancelAnimationFrame(raf.current);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden mix-blend-screen"
    >
      <svg className="absolute h-0 w-0" aria-hidden>
        <filter id="goo-drop">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>
      <div style={{ filter: "url(#goo-drop)" }} className="h-full w-full">
        <div
          ref={blobRef}
          className="h-7 w-7 rounded-full opacity-80 will-change-transform"
          style={{ background: "#f5f5f5" }}
        />
      </div>
    </div>
  );
}
