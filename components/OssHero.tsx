import Link from "next/link";

type OssHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  tertiaryHref?: string;
  tertiaryLabel?: string;
};

export function OssHero({
  eyebrow = "Open source",
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  tertiaryHref,
  tertiaryLabel,
}: OssHeroProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-20 pt-24 sm:pt-32">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        {eyebrow}
      </p>
      <h1 className="mt-6 max-w-4xl text-5xl font-medium leading-[0.95] tracking-tight sm:text-7xl">
        {title}
      </h1>
      <p className="mt-8 max-w-2xl text-lg leading-8 text-muted">{description}</p>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Link
          href={primaryHref}
          data-goo-target
          data-goo-color="#ffffff"
          className="inline-flex h-11 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          {primaryLabel}
        </Link>
        {secondaryHref && secondaryLabel ? (
          <a
            href={secondaryHref}
            target="_blank"
            rel="noreferrer"
            data-goo-target
            data-goo-color="#67e8f9"
            className="inline-flex h-11 items-center gap-2 rounded-full px-2 text-sm text-foreground/80 transition-colors hover:text-foreground"
          >
            {secondaryLabel}
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line">
              ↗
            </span>
          </a>
        ) : null}
        {tertiaryHref && tertiaryLabel ? (
          <Link
            href={tertiaryHref}
            data-goo-target
            data-goo-color="#f5e6a8"
            className="inline-flex h-11 items-center gap-2 rounded-full px-2 text-sm text-foreground/80 transition-colors hover:text-foreground"
          >
            {tertiaryLabel}
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line">
              ↗
            </span>
          </Link>
        ) : null}
      </div>
    </section>
  );
}
