import Link from "next/link";
import { AuthButtons } from "./AuthButtons";
import { BrandMark } from "./BrandMark";
import { MobileMenu } from "./MobileMenu";
import { WhatsAppLink } from "./WhatsAppLink";

const NAV_LINKS = [
  { href: "/team", label: "Team" },
  { href: "/members", label: "Builders" },
  { href: "/ideas", label: "Ideas" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/build-lab", label: "Build Lab" },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-background/80 backdrop-blur-sm">
      <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
        <Link
          href="/"
          data-goo-target
          data-goo-color="#ffffff"
          className="flex items-center gap-2.5 text-sm font-medium tracking-tight"
        >
          <BrandMark className="h-8 w-8" />
          BuildStation
        </Link>
        <nav className="hidden items-center gap-5 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-goo-target
              data-goo-color="#67e8f9"
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/70 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <WhatsAppLink
            label=""
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#25d366] transition-opacity hover:opacity-80"
            iconClassName="h-4 w-4"
          />
          <AuthButtons />
        </nav>
        <MobileMenu links={NAV_LINKS} />
      </div>
    </header>
  );
}
