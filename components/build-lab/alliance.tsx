import { alliance } from "@/content/build-lab";
import { Section } from "./section";

export function Alliance() {
  const columns = [alliance.partner, alliance.buildstation];
  return (
    <Section
      id="alliance"
      eyebrow="The alliance"
      title="A strategic alliance, not a purchase order."
      lead="Both sides put something on the table. That is what makes the data, the sites and the airspace available in the first place."
    >
      <div className="grid gap-px bg-line md:grid-cols-2">
        {columns.map((col) => (
          <div key={col.title} className="bg-background p-6 sm:p-8">
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted">{col.title}</h3>
            <ul className="mt-6 divide-y divide-line">
              {col.items.map((item) => (
                <li key={item} className="py-3 text-lg">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
