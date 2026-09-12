import Image from "next/image";

type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className = "h-6 w-6" }: BrandMarkProps) {
  return (
    <Image
      src="/buildstation-mark.png"
      alt=""
      width={48}
      height={48}
      className={className}
      priority
    />
  );
}
