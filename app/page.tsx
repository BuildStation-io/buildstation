import Link from "next/link";
import { HeroSculpture } from "@/components/HeroSculpture";
import { HomeStats } from "@/components/HomeStats";
import { WhatsAppLink } from "@/components/WhatsAppLink";

const CRAFT = [
  {
    href: "/projects",
    title: "Projects",
    body: "InmoNExo is live. Open features sit on the project card. Take one and ship with the group.",
  },
  {
    href: "/members",
    title: "Members",
    body: "Sign in to count in the network. Run the CLI and join with GitHub to show up as a Builder.",
  },
  {
    href: "/blog",
    title: "Blog",
    body: "Posts live as MDX in the repo. Open a PR to publish. No CMS, no admin editor.",
  },
  {
    href: "/build-lab",
    title: "Build Lab",
    body: "Bring one field problem. A squad ships it in two-week sprints.",
  },
] as const;

export default function Home() {
  return (
    <>
      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-16 pt-16 sm:pt-24 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            BuildStation
          </p>
          <h1 className="mt-6 max-w-xl text-5xl font-medium leading-[0.95] tracking-tight sm:text-7xl">
            AI for AEC-Energy.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-muted">
            A community applying AI to architecture, engineering, construction,
            and energy. Meet, learn, and ship together, starting with InmoNExo.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/projects"
              data-goo-target
              data-goo-color="#ffffff"
              className="inline-flex h-11 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Browse projects
            </Link>
            <Link
              href="/members"
              data-goo-target
              data-goo-color="#67e8f9"
              className="inline-flex h-11 items-center gap-2 rounded-full px-2 text-sm text-foreground/80 transition-colors hover:text-foreground"
            >
              See members
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line">
                ↗
              </span>
            </Link>
            <WhatsAppLink className="inline-flex h-11 items-center gap-2 rounded-full px-2 text-sm text-foreground/80 transition-colors hover:text-foreground" />
          </div>
        </div>
        <HeroSculpture />
      </section>
      <HomeStats />
      <section className="mx-auto w-full max-w-6xl px-5 py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          What we ship
        </p>
        <h2 className="mt-4 max-w-3xl text-4xl font-medium tracking-tight">
          Our projects. Our builders. Our words.
        </h2>
        <div className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {CRAFT.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="bg-background p-6 transition-colors hover:bg-surface/60 sm:p-8"
            >
              <h3 className="text-2xl font-medium tracking-tight">{item.title}</h3>
              <p className="mt-4 text-sm leading-6 text-muted">{item.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
