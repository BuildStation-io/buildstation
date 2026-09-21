import Link from "next/link";
import { partners, sectors, trustWall } from "@/content/build-lab";
import { Section } from "./section";

export function TrustWall() {
  const filled = partners.slice(0, trustWall.slots);
  const openSlots = Math.max(trustWall.slots - filled.length, 0);

  return (
    <Section id="trust" eyebrow="Partners" title={trustWall.title} lead={filled.length ? undefined : trustWall.lead}>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {filled.map((p) => (
          <li
            key={p.name}
            className="flex h-24 items-center justify-center rounded-md border border-line bg-surface/40 px-6"
          >
            {p.href ? (
              <a href={p.href} target="_blank" rel="noreferrer" className="opacity-80 transition hover:opacity-100">
                <Wordmark name={p.name} logo={p.logo} />
              </a>
            ) : (
              <Wordmark name={p.name} logo={p.logo} />
            )}
          </li>
        ))}
        {Array.from({ length: openSlots }).map((_, i) => {
          const sector = sectors[i % sectors.length].name;
          return (
            <li key={`slot-${i}`}>
              <Link
                href="#partner"
                className="flex h-24 flex-col items-center justify-center rounded-md border border-dashed border-line text-center transition hover:border-muted"
              >
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Founding partner</span>
                <span className="mt-1 text-sm text-muted">{sector}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      {openSlots > 0 && (
        <p className="mt-6 font-mono text-xs text-muted">
          {openSlots} of {trustWall.slots} slots open · logos appear here as alliances are signed.
        </p>
      )}
    </Section>
  );
}

function Wordmark({ name, logo }: { name: string; logo?: string }) {
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logo} alt={name} className="max-h-8 w-auto opacity-80 grayscale" />;
  }
  return <span className="text-lg font-medium tracking-tight text-foreground/80">{name}</span>;
}
