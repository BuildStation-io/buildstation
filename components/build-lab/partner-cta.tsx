import { Section } from "./section";
import { PartnerForm } from "./partner-form";

export function PartnerCta() {
  return (
    <Section id="partner">
      <div className="grid gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">Propose a partnership</p>
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">Bring us a problem from the field.</h2>
          <p className="mt-4 text-lg text-muted">
            Tell us what is slow, manual or invisible on your sites today. We reply with a Sprint 0 proposal and a
            draft charter within a week.
          </p>
          <ul className="mt-8 space-y-3 text-muted">
            <li className="flex gap-3">
              <span className="font-mono text-xs text-foreground">→</span>
              No commitment before the charter is signed.
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-xs text-foreground">→</span>
              Data and drone permits are agreed before Sprint 1.
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-xs text-foreground">→</span>
              You keep everything we build.
            </li>
          </ul>
        </div>
        <div className="rounded-lg border border-line bg-surface/60 p-6 sm:p-8">
          <PartnerForm />
        </div>
      </div>
    </Section>
  );
}
