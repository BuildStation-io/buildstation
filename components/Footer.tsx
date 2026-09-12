import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium">BuildStation</p>
          <p className="mt-2 max-w-sm text-sm text-muted">
            A network of builders shipping in public. Inspired by Crafter
            Station — not a copy.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          <Link href="/oss" className="hover:text-foreground">
            Open source
          </Link>
          <a
            href="https://github.com/BuildStation-io/buildstation"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            GitHub
          </a>
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
