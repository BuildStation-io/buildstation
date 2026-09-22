import { TEAM } from "@/lib/team";

export function TeamDirectory() {
  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-5 pb-20 pt-24 sm:pt-32">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          Team
        </p>
        <h1 className="mt-6 max-w-4xl text-5xl font-medium leading-[0.95] tracking-tight sm:text-7xl">
          The people growing an AI culture for infrastructure projects.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-muted">
          BuildStation is built to apply AI to infrastructure projects:
          construction, mining, energy, and real estate. Founders stay here,
          static on purpose.
        </p>
      </section>
      <section className="border-t border-line">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {TEAM.map((person) => (
            <article
              key={person.githubUsername}
              className="flex h-full flex-col items-center gap-5 border-b border-r border-line px-6 py-12 text-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={person.avatarUrl}
                alt={person.name}
                className="h-24 w-24 rounded-full border border-line object-cover"
              />
              <div>
                <p className="text-lg font-medium tracking-tight">{person.name}</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  {person.role}
                </p>
                <p className="mt-2 text-sm text-muted">{person.location}</p>
              </div>
              <div className="mt-auto flex h-12 w-full max-w-[9.75rem] items-center justify-center rounded-md bg-[#e8e5e0] px-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={person.company.logoUrl}
                  alt={person.company.name}
                  className="max-h-9 w-auto max-w-full object-contain"
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
