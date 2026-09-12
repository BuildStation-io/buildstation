type StatsStripProps = {
  members: number;
  projects: number;
  openNeeds: number;
};

export function StatsStrip({ members, projects, openNeeds }: StatsStripProps) {
  return (
    <section className="border-y border-line">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 sm:grid-cols-3">
        <div className="border-b border-line px-5 py-8 sm:border-b-0 sm:border-r">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            The network
          </p>
          <p className="mt-6 text-5xl font-medium tracking-tight">{members}</p>
          <p className="mt-2 text-sm text-muted">people in the network</p>
        </div>
        <div className="border-b border-line px-5 py-8 sm:border-b-0 sm:border-r">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            Projects
          </p>
          <p className="mt-6 text-5xl font-medium tracking-tight">{projects}</p>
          <p className="mt-2 text-sm text-muted">community projects</p>
        </div>
        <div className="px-5 py-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            Contribute
          </p>
          <p className="mt-6 text-5xl font-medium tracking-tight">{openNeeds}</p>
          <p className="mt-2 text-sm text-muted">features open to build</p>
        </div>
      </div>
    </section>
  );
}
