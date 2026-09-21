import { handbook } from "@/content/build-lab";
import { Section } from "./section";

export function Handbook() {
  return (
    <Section id="handbook" eyebrow="Handbook" title={handbook.title} lead={handbook.lead}>
      <div className="overflow-hidden rounded-lg border border-line bg-surface">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3 font-mono text-xs text-muted">
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
          <span className="ml-3">build-lab/handbook.md</span>
        </div>
        <ol className="divide-y divide-line">
          {handbook.chapters.map((c) => (
            <li key={c.id} className="grid gap-2 px-4 py-4 sm:grid-cols-[4rem_14rem_1fr] sm:px-6">
              <span className="font-mono text-xs text-muted">{c.id}</span>
              <span className="font-medium">{c.name}</span>
              <span className="text-muted">{c.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
