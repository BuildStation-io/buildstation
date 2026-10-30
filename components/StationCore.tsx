"use client";

import { useEffect, useRef } from "react";
import BrandMark from "./BrandMark";

export default function StationCore({ variant = "card" }: { variant?: "card" | "emblem" }) {
  const emblem = variant === "emblem";
  const rotor = useRef<HTMLSpanElement>(null);
  const turn = useRef<Animation | null>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => { if (preference.matches) turn.current?.cancel(); };
    preference.addEventListener("change", stop);
    return () => {
      preference.removeEventListener("change", stop);
      turn.current?.cancel();
    };
  }, []);

  function spin() {
    const element = rotor.current;
    if (!element || turn.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Freeze the idle turn and make one full revolution from its current angle.
    // The matching end pose lets the CSS loop resume without snapping.
    const idle = element.getAnimations();
    idle.forEach((animation) => animation.pause());
    const pose = getComputedStyle(element).transform;
    const base = pose === "none" ? "" : pose;
    const animation = element.animate([
      { transform: `${base} rotateY(0deg)` },
      { transform: `${base} rotateY(360deg)` },
    ], { duration: 1800, easing: "cubic-bezier(.4, 0, .2, 1)" });
    turn.current = animation;
    const resume = () => {
      idle.forEach((loop) => { if (loop.playState === "paused") loop.play(); });
      turn.current = null;
    };
    animation.onfinish = resume;
    animation.oncancel = resume;
  }

  return (
    <button
      type="button"
      className={`station-core${emblem ? " station-core-emblem" : ""}`}
      aria-label={emblem ? "Girar el logo de BuildStation" : "Girar el naipe de BuildStation"}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") spin(); }}
      onClick={spin}
    >
      <span className="core-float">
        <span className="core-rotor" ref={rotor}>
          <span className="core-face core-front" aria-hidden="true"><span className="core-inner"><BrandMark sizes={emblem ? "(max-width: 640px) 190px, 260px" : undefined} />{!emblem && <span>BUILD TOGETHER</span>}</span></span>
          <span className="core-face core-back" aria-hidden="true"><span className="core-inner"><BrandMark sizes={emblem ? "(max-width: 640px) 190px, 260px" : undefined} />{!emblem && <span>BUILD. SHARE. REPEAT.</span>}</span></span>
        </span>
      </span>
    </button>
  );
}
