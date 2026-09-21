import { sectors } from "@/content/build-lab";
import { Section } from "./section";

export function Sectors() {
  return (
    <Section
      id="sectors"
      eyebrow="Where we work"
      title="Four sectors. Real sites, real data."
      lead="Each engagement starts from a problem the partner already has, and from the access only the partner can give."
    >
      <div className="grid gap-px bg-line sm:grid-cols-2">
        {sectors.map((s) => (
          <article key={s.name} className="bg-background p-6 sm:p-8">
            <h3 className="text-2xl font-medium tracking-tight">{s.name}</h3>
            <ul className="mt-6 space-y-2">
              {s.problems.map((problem) => (
                <li key={problem} className="flex gap-3 text-muted">
                  <span aria-hidden className="mt-2.5 inline-block size-1.5 shrink-0 rounded-full bg-foreground" />
                  {problem}
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-line pt-4 font-mono text-xs text-muted">
              <span className="uppercase tracking-widest">Partner access:</span> {s.access}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}
