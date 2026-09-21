import { WHATSAPP_INVITE } from "@/lib/community";

const STEPS = [
  {
    n: "01",
    title: "Join the network",
    body: "Sign in on the site so you show up in Members, or jump into the WhatsApp group and say what you want to build.",
  },
  {
    n: "02",
    title: "Pick a next step",
    body: "Pick a next step from the InmoNExo roadmap.",
  },
  {
    n: "03",
    title: "Talk, then ship",
    body: "Fork the repo, open a PR, and coordinate in WhatsApp.",
  },
];

export function ContributeSteps() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-20">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        How to contribute
      </p>
      <h2 className="mt-4 max-w-3xl text-4xl font-medium tracking-tight sm:text-5xl">
        Three steps to your first ship.
      </h2>
      <div className="mt-12 grid gap-px bg-line sm:grid-cols-3">
        {STEPS.map((step) => (
          <article key={step.n} className="bg-background p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              {step.n}
            </p>
            <h3 className="mt-6 text-2xl font-medium tracking-tight">
              {step.title}
            </h3>
            <p className="mt-4 text-sm leading-6 text-muted">{step.body}</p>
          </article>
        ))}
      </div>
      <a
        href={WHATSAPP_INVITE}
        target="_blank"
        rel="noreferrer"
        className="mt-10 inline-flex h-11 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Open WhatsApp
      </a>
    </section>
  );
}
