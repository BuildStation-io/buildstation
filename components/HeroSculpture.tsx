"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { HeroWaterMark } from "@/components/HeroWaterMark";

function HeroFallback() {
  return (
    <Image
      src="/buildstation-mark.png"
      alt="BuildStation mark"
      fill
      className="object-contain"
      sizes="(min-width: 1024px) 40vw, 80vw"
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
