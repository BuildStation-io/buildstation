"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { CliJoinSnippet } from "./CliJoinSnippet";
import { WhatsAppLink } from "./WhatsAppLink";
import { api } from "@/convex/_generated/api";
import { TEAM } from "@/lib/team";

type BuilderCard = {
  _id: string;
  name: string;
  avatarUrl?: string;
  githubUsername?: string;
  githubUrl?: string;
  bio?: string;
};

function githubHref(builder: BuilderCard) {
  if (builder.githubUrl) {
    return builder.githubUrl;
  }
  if (builder.githubUsername) {
    return `https://github.com/${builder.githubUsername}`;
  }
  return undefined;
}

function BuilderGrid({ builders }: { builders: BuilderCard[] }) {
  if (builders.length === 0) {
    return (
      <section className="border-t border-line">
        <div className="mx-auto w-full max-w-6xl px-5 py-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            Builders
          </p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight">
            Registered builders.
          </h2>
        </div>
        <div className="mx-auto w-full max-w-6xl border-t border-line px-6 py-16 text-center">
          <p className="text-2xl font-medium tracking-tight">
            Be the first Builder.
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted">
            Run the CLI and sign in with GitHub. Login alone counts in the
            network. A Builder card needs a GitHub profile.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex h-11 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background"
            >
              Join with GitHub
            </Link>
            <WhatsAppLink className="inline-flex h-11 items-center gap-2 text-sm text-foreground/80 hover:text-foreground" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-5 py-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          Builders
        </p>
        <h2 className="mt-3 text-3xl font-medium tracking-tight">
          Registered builders.
        </h2>
      </div>
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 border-t border-line sm:grid-cols-2 md:grid-cols-3">
        {builders.map((builder, index) => {
          const href = githubHref(builder);
          const handle = builder.githubUsername
            ? `@${builder.githubUsername}`
            : null;

          return (
            <article
              key={builder._id}
              className="relative flex flex-col items-start gap-4 border-b border-r border-line p-8"
            >
              <span className="absolute right-5 top-5 font-mono text-[11px] text-muted">
                {String(index + 1).padStart(3, "0")}
              </span>
              {builder.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={builder.avatarUrl}
                  alt=""
                  className="h-16 w-16 rounded-full border border-line object-cover"
                />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-line font-mono text-sm">
                  {builder.name.slice(0, 1).toUpperCase()}
                </span>
              )}
              <div className="pr-8">
                <p className="text-xl font-medium tracking-tight">
                  {builder.name}
                </p>
                {handle ? (
                  href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block font-mono text-[12px] text-muted hover:text-foreground"
                    >
                      {handle}
                    </a>
                  ) : (
                    <p className="mt-1 font-mono text-[12px] text-muted">
                      {handle}
                    </p>
                  )
                ) : null}
                {builder.bio ? (
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {builder.bio}
                  </p>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function BuildersHero({ count }: { count: number }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-16 pt-24 sm:pt-32">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        The builders
      </p>
      <h1 className="mt-6 max-w-4xl text-5xl font-medium leading-[0.95] tracking-tight sm:text-7xl">
        Meet the Builders.
      </h1>
      <p className="mt-8 max-w-2xl text-lg leading-8 text-muted">
        People applying AI to infrastructure projects. Sign in to count in the network. Run
        the CLI and join with GitHub to show a photo, handle, and bio.
      </p>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
        <Link href="/team" className="text-foreground hover:underline">
          Founders are on Team
        </Link>
        . Saw a slow process on a site, in an office, or at a mine? Leave it on{" "}
        <Link href="/ideas" className="text-foreground hover:underline">
          Ideas
        </Link>
        .
      </p>
      <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1">
          <CliJoinSnippet />
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
            Paste it to open Join in your browser. Sign in with GitHub so we
            can sync your card.
          </p>
        </div>
        <div className="shrink-0 border border-line px-6 py-5 text-right">
          <p className="text-5xl font-medium tracking-tight">{count}</p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            People in the network
          </p>
        </div>
      </div>
    </section>
  );
}

function LiveDirectory() {
  const builders = useQuery(api.members.listBuilders, {});
  const count = TEAM.length + (builders?.length ?? 0);

  return (
    <>
      <BuildersHero count={count} />
      {builders === undefined ? (
        <section className="mx-auto w-full max-w-6xl px-5 py-16 text-sm text-muted">
          Loading builders…
        </section>
      ) : (
        <BuilderGrid builders={builders} />
      )}
    </>
  );
}

export function MembersDirectory() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return (
      <>
        <BuildersHero count={TEAM.length} />
        <BuilderGrid builders={[]} />
      </>
    );
  }
  return <LiveDirectory />;
}
