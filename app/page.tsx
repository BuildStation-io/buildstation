import Image from "next/image";
import Link from "next/link";
import { HomeStats } from "@/components/HomeStats";

export default function Home() {
  return (
    <>
      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-16 pt-16 sm:pt-24 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            BuildStation
          </p>
          <h1 className="mt-6 max-w-xl text-5xl font-medium leading-[0.95] tracking-tight sm:text-7xl">
            The network of builders.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-muted">
            A community of shippers, an open-source ecosystem, and a public
            portfolio of repos you can contribute to. Meet, learn, and build in
            public.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/oss"
              data-goo-target
              data-goo-color="#ffffff"
              className="inline-flex h-11 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Browse open source
            </Link>
            <Link
              href="/sign-in"
              data-goo-target
              data-goo-color="#67e8f9"
              className="inline-flex h-11 items-center gap-2 rounded-full px-2 text-sm text-foreground/80 transition-colors hover:text-foreground"
            >
              Sign in with GitHub
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line">
                ↗
              </span>
            </Link>
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none">
          <Image
            src="/buildstation-hero-mark.png"
            alt="BuildStation mark"
            fill
            priority
            className="object-contain drop-shadow-[0_30px_80px_rgba(80,140,200,0.18)]"
            sizes="(min-width: 1024px) 40vw, 80vw"
          />
        </div>
      </section>
      <HomeStats />
      <section className="mx-auto w-full max-w-6xl px-5 py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          What we craft
        </p>
        <h2 className="mt-4 max-w-3xl text-4xl font-medium tracking-tight">
          Open source first. Community next.
        </h2>
        <div className="mt-12 grid gap-px bg-line sm:grid-cols-3">
          {[
            {
              title: "Open source",
              body: "A curated directory of repos with live stars, issues, and a path to your first PR.",
            },
            {
              title: "Members",
              body: "Sign in with GitHub. Your profile, avatar, and handle become part of the network.",
            },
            {
              title: "Ships",
              body: "The same stack we use in public: Next.js, Clerk, Convex, deployed on Vercel.",
            },
          ].map((item) => (
            <article key={item.title} className="bg-background p-6 sm:p-8">
              <h3 className="text-2xl font-medium tracking-tight">{item.title}</h3>
              <p className="mt-4 text-sm leading-6 text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
