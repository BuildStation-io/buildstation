import Image from "next/image";
import officialMark from "@/public/brand/official-mark.png";

export default function BrandMark({ className = "", sizes = "(max-width: 640px) 140px, 180px" }: { className?: string; sizes?: string }) {
  return (
    <Image
      src={officialMark}
      alt=""
      aria-hidden="true"
      className={`brand-mark ${className}`.trim()}
      sizes={sizes}
    />
  );
}
