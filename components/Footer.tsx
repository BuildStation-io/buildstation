import Link from "next/link";
import { WhatsAppLink } from "./WhatsAppLink";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium">BuildStation</p>
          <p className="mt-2 max-w-sm text-sm text-muted">
            AI to improve infrastructure projects. Built in Lima, shipping for LatAm.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          <Link href="/team" className="hover:text-foreground">
            Team
          </Link>
          <Link href="/members" className="hover:text-foreground">
            Builders
          </Link>
          <Link href="/ideas" className="hover:text-foreground">
            Ideas
          </Link>
          <Link href="/projects" className="hover:text-foreground">
            Projects
          </Link>
          <Link href="/blog" className="hover:text-foreground">
            Blog
          </Link>
          <Link href="/build-lab" className="hover:text-foreground">
            Build Lab
          </Link>
          <WhatsAppLink className="inline-flex items-center gap-2 hover:text-foreground" />
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-5 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          © {new Date().getFullYear()} BuildStation. Built fast, built well.
        </p>
      </div>
    </footer>
  );
}
