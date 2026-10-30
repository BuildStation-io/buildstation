import Image from "next/image";
import officialWordmark from "@/public/brand/official-wordmark-dark.png";

export default function BrandLogo() {
  return (
    <Image
      src={officialWordmark}
      alt="BuildStation"
      className="brand-wordmark"
      sizes="(max-width: 640px) 190px, 220px"
    />
  );
}
