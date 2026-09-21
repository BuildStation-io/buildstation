import { process } from "@/content/build-lab";
import { Section } from "./section";

export function Process() {
  return (
    <Section
      id="process"
      eyebrow="How it works"
      title="One problem. Four steps. Something running on your site in weeks."
      lead="The cadence is Scrum. The paperwork is the handbook. The output is software people use."
    >
      <ol className="grid gap-px bg-line md:grid-cols-4">
        {process.map((p) => (
          <li key={p.step} className="flex flex-col bg-background p-6">
            <span className="font-mono text-xs text-muted">{p.step}</span>
            <h3 className="mt-6 text-xl font-medium">{p.name}</h3>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted">{p.duration}</p>
            <p className="mt-4 text-muted">{p.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
