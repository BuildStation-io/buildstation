"use client";

import { useMutation } from "convex/react";
import { useState, type ChangeEvent } from "react";
import { api } from "@/convex/_generated/api";
import { labContact, sectorOptions } from "@/content/build-lab";

type FormState = {
  name: string;
  company: string;
  sector: string;
  challenge: string;
  email: string;
};

const field =
  "w-full rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-muted focus:outline-none";

const emptyForm = (): FormState => ({
  name: "",
  company: "",
  sector: sectorOptions[0] ?? "Construction",
  challenge: "",
  email: "",
});

function mailtoHref(form: FormState) {
  const subject = `Build Lab · ${form.sector} · ${form.company || "new partner"}`;
  const lines = [
    `Name: ${form.name}`,
    `Company: ${form.company}`,
    `Sector: ${form.sector}`,
  ];
  if (form.email.trim()) {
    lines.push(`Email: ${form.email.trim()}`);
  }
  lines.push("", "The problem:", form.challenge);
  return `mailto:${labContact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

function PartnerFields({
  pending,
  onSubmit,
}: {
  pending: boolean;
  onSubmit: (form: FormState) => void;
}) {
  const [form, setForm] = useState<FormState>(emptyForm);

  const update =
    (key: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [key]: event.target.value });

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm">
          <span className="font-mono text-xs uppercase tracking-widest text-muted">Name</span>
          <input required className={field} value={form.name} onChange={update("name")} placeholder="Your name" />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-mono text-xs uppercase tracking-widest text-muted">Company</span>
          <input required className={field} value={form.company} onChange={update("company")} placeholder="Company" />
        </label>
      </div>
      <label className="grid gap-1.5 text-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">Email</span>
        <input
          type="email"
          className={field}
          value={form.email}
          onChange={update("email")}
          placeholder="Optional"
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">Sector</span>
        <select className={field} value={form.sector} onChange={update("sector")}>
          {sectorOptions.map((sector) => (
            <option key={sector}>{sector}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">The problem</span>
        <textarea
          required
          rows={5}
          className={field}
          value={form.challenge}
          onChange={update("challenge")}
          placeholder="What is slow, manual or invisible on your sites today? Who suffers it? What data or access could you share?"
        />
      </label>
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center rounded-md bg-foreground px-5 text-sm font-medium text-background transition hover:bg-white disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send the problem"}
        </button>
        <a
          href={labContact.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center rounded-md border border-line px-5 text-sm font-medium transition hover:border-muted"
        >
          Or talk on WhatsApp ↗
        </a>
      </div>
    </form>
  );
}

function SuccessNote() {
  return (
    <div className="grid gap-3">
      <p className="text-lg font-medium tracking-tight">We have the problem.</p>
      <p className="text-sm leading-6 text-muted">
        A Sprint 0 proposal is next. If you would rather talk now, the WhatsApp group is open.
      </p>
      <a
        href={labContact.whatsapp}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-11 w-fit items-center rounded-md border border-line px-5 text-sm font-medium transition hover:border-muted"
      >
        Talk on WhatsApp ↗
      </a>
    </div>
  );
}

function MailtoForm() {
  return (
    <PartnerFields
      pending={false}
      onSubmit={(form) => {
        window.location.href = mailtoHref(form);
      }}
    />
  );
}

function ConvexForm() {
  const submitLead = useMutation(api.labLeads.submit);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  if (sent) {
    return <SuccessNote />;
  }

  return (
    <PartnerFields
      pending={pending}
      onSubmit={(form) => {
        setPending(true);
        void submitLead({
          name: form.name,
          company: form.company,
          sector: form.sector,
          challenge: form.challenge,
          email: form.email.trim() || undefined,
        })
          .then(() => setSent(true))
          .catch(() => {
            window.location.href = mailtoHref(form);
          })
          .finally(() => setPending(false));
      }}
    />
  );
}

export function PartnerForm() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return <MailtoForm />;
  }
  return <ConvexForm />;
}
