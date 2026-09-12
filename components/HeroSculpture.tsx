"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";

const HeroSculptureCanvas = dynamic(
  () =>
    import("./HeroSculptureCanvas").then((mod) => mod.HeroSculptureCanvas),
  { ssr: false, loading: () => <HeroFallback /> },
);

function HeroFallback() {
  return (
    <Image
      src="/buildstation-hero-mark.png"
      alt="BuildStation mark"
      fill
      priority
      className="object-contain mix-blend-lighten drop-shadow-[0_30px_80px_rgba(80,140,200,0.18)]"
      sizes="(min-width: 1024px) 40vw, 80vw"
    />
  );
}

export function HeroSculpture() {
  const [mode, setMode] = useState<"3d" | "static">("3d");

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMode(motion.matches ? "static" : "3d");
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none">
      {mode === "static" ? <HeroFallback /> : <HeroSculptureCanvas />}
    </div>
  );
}
