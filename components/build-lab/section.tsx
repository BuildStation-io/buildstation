import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  lead?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, eyebrow, title, lead, children, className = "" }: SectionProps) {
  return (
    <section id={id} className={`border-t border-line ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:py-24">
        {(eyebrow || title || lead) && (
          <header className="mb-12 max-w-2xl">
            {eyebrow && <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">{eyebrow}</p>}
            {title && <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">{title}</h2>}
            {lead && <p className="mt-4 text-lg text-muted">{lead}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
