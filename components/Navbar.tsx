import Link from "next/link";
import { AuthButtons } from "./AuthButtons";
import { BrandMark } from "./BrandMark";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
        <Link
          href="/"
          data-goo-target
          data-goo-color="#ffffff"
          className="flex items-center gap-2.5 text-sm font-medium tracking-tight"
        >
          <BrandMark className="h-7 w-7" />
          BuildStation
        </Link>
        <nav className="flex items-center gap-5">
          <Link
            href="/oss"
            data-goo-target
            data-goo-color="#67e8f9"
            className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/70 transition-colors hover:text-foreground sm:inline"
          >
            Open source
          </Link>
          <AuthButtons />
        </nav>
      </div>
    </header>
  );
}
