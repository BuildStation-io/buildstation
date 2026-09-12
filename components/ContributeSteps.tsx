const STEPS = [
  {
    n: "01",
    title: "Pick a repo",
    body: "Start with whatever you already use. The stack on this site is TypeScript, Next.js, Clerk, and Convex.",
  },
  {
    n: "02",
    title: "Find an issue",
    body: "Look for good-first-issue and help-wanted labels, or open an issue proposing what you want to build before writing code.",
  },
  {
    n: "03",
    title: "Ship the PR",
    body: "Small, focused pull requests with conventional commits get reviewed fastest. Ask in the community if you get stuck.",
  },
];

export function ContributeSteps() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-20">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        How to contribute
      </p>
      <h2 className="mt-4 max-w-3xl text-4xl font-medium tracking-tight sm:text-5xl">
        Three steps to your first merged PR.
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
    </section>
  );
}
