"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthButtons } from "./AuthButtons";
import { WhatsAppLink } from "./WhatsAppLink";

type NavLink = {
  href: string;
  label: string;
};

type MobileMenuProps = {
  links: readonly NavLink[];
};

export function MobileMenu({ links }: MobileMenuProps) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  function setOpen(next: boolean) {
    setOpenPath(next ? pathname : null);
  }

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : previous;
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-line"
      >
        <span aria-hidden className="relative block h-3 w-4">
          <span
            className={`absolute left-0 top-0 block h-px w-4 bg-foreground transition ${open ? "top-1.5 rotate-45" : ""}`}
          />
          <span
            className={`absolute left-0 top-1.5 block h-px w-4 bg-foreground transition ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`absolute left-0 top-3 block h-px w-4 bg-foreground transition ${open ? "top-1.5 -rotate-45" : ""}`}
          />
        </span>
      </button>
      {open ? (
        <div
          id="mobile-nav"
          className="absolute inset-x-0 top-16 z-50 border-b border-line bg-background px-5 py-6 shadow-2xl"
        >
          <nav className="flex flex-col gap-5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-[12px] uppercase tracking-[0.16em] text-foreground/80 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <WhatsAppLink className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-foreground/80 hover:text-foreground" />
            <div className="pt-1">
              <AuthButtons />
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
