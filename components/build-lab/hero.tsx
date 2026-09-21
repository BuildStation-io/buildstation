import Link from "next/link";
import { hero, principles, stats } from "@/content/build-lab";

export function Hero() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--line)_1px,transparent_0)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
        />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-20 sm:pt-28">
          <p className="mb-6 font-mono text-xs uppercase tracking-widest text-muted">{hero.eyebrow}</p>
          <h1 className="max-w-4xl text-5xl font-medium leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
            {hero.title}
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted sm:text-xl">{hero.lead}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={hero.primary.href}
              className="inline-flex h-11 items-center rounded-md bg-foreground px-5 text-sm font-medium text-background transition hover:bg-white"
            >
              {hero.primary.label}
            </Link>
            <Link
              href={hero.secondary.href}
              className="inline-flex h-11 items-center rounded-md border border-line px-5 text-sm font-medium text-foreground transition hover:border-muted"
            >
              {hero.secondary.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-line">
        <div className="mx-auto grid w-full max-w-6xl md:grid-cols-3">
          {principles.map((p, i) => (
            <div
              key={p.kicker}
              className={`px-5 py-10 ${i > 0 ? "border-t border-line md:border-l md:border-t-0" : ""}`}
            >
              <p className="font-mono text-xs uppercase tracking-widest text-muted">0{i + 1}</p>
              <h3 className="mt-3 text-lg font-medium">{p.kicker}</h3>
              <p className="mt-2 text-muted">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px bg-line md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-background px-5 py-8">
              <p className="text-3xl font-medium tracking-tight sm:text-4xl">{s.value}</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
