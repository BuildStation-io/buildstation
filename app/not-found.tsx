import Link from "next/link";
import { WHATSAPP_INVITE } from "@/lib/community";

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col px-5 py-24 sm:py-32">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        404
      </p>
      <h1 className="mt-6 max-w-3xl text-5xl font-medium leading-[0.95] tracking-tight sm:text-7xl">
        This page is not on the map.
      </h1>
      <p className="mt-8 max-w-xl text-lg leading-8 text-muted">
        The link may be old, or the page was never shipped. The network is
        still here.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Link
          href="/projects"
          className="inline-flex h-11 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Browse projects
        </Link>
        <a
          href={WHATSAPP_INVITE}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm text-foreground/80 transition-colors hover:text-foreground"
        >
          WhatsApp
        </a>
      </div>
    </section>
  );
}
