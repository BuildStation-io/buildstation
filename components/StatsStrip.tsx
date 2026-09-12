import { formatCompact } from "@/lib/format";

type StatsStripProps = {
  stars: number;
  repos: number;
  openIssues: number;
  label?: string;
};

export function StatsStrip({
  stars,
  repos,
  openIssues,
  label = "The network",
}: StatsStripProps) {
  return (
    <section className="border-y border-line">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 sm:grid-cols-3">
        <div className="border-b border-line px-5 py-8 sm:border-b-0 sm:border-r">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            {label}
          </p>
          <p className="mt-6 text-5xl font-medium tracking-tight">
            {formatCompact(stars)}
          </p>
          <p className="mt-2 text-sm text-muted">stars</p>
        </div>
        <div className="border-b border-line px-5 py-8 sm:border-b-0 sm:border-r">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            Repos
          </p>
          <p className="mt-6 text-5xl font-medium tracking-tight">{repos}</p>
          <p className="mt-2 text-sm text-muted">curated public projects</p>
        </div>
        <div className="px-5 py-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            Contribute
          </p>
          <p className="mt-6 text-5xl font-medium tracking-tight">
            {formatCompact(openIssues)}
          </p>
          <p className="mt-2 text-sm text-muted">issues open for contribution</p>
        </div>
      </div>
    </section>
  );
}
