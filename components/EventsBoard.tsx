"use client";

import { useMutation, useQuery } from "convex/react";
import { Component, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { catalogEvents, type EventStatus, type NetworkEvent } from "@/lib/events";

const STATUS_LABEL: Record<EventStatus, string> = {
  confirmed: "Confirmed",
  possible: "Possible",
  past: "Past",
};

const STATUS_ACCENT: Record<EventStatus, string> = {
  confirmed: "#67e8f9",
  possible: "#f5e6a8",
  past: "#737373",
};

const field =
  "w-full rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-muted focus:outline-none disabled:opacity-60";

function readableError(reason: unknown) {
  const raw = reason instanceof Error ? reason.message : "Could not save that.";
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("[CONVEX") && !line.startsWith("[Request ID"));
  const server = lines.find((line) => line !== "Server Error");
  return (server ?? raw).replace(/^Uncaught Error:\s*/, "");
}

function formatWhen(event: NetworkEvent) {
  if (event.startsAt !== undefined) {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(event.startsAt);
  }
  return event.whenLabel?.trim() || "Date TBA";
}

function EventCard({
  event,
  canEdit,
}: {
  event: NetworkEvent;
  canEdit: boolean;
}) {
  const setStatus = useMutation(api.events.setStatus);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const accent = STATUS_ACCENT[event.status];

  return (
    <article
      data-goo-target
      data-goo-color={accent}
      className="relative flex min-h-[280px] flex-col border-b border-r border-line p-6 sm:p-8"
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-px" style={{ background: accent }} />
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {formatWhen(event)}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {STATUS_LABEL[event.status]}
        </p>
      </div>
      <h2 className="mt-5 text-2xl font-medium tracking-tight">{event.title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-6 text-muted">
        <p>{event.place}</p>
        <p>{event.summary}</p>
      </div>
      <div className="mt-auto flex flex-col gap-4 pt-8">
        {event.url ? (
          <a
            href={event.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between text-sm hover:text-foreground"
          >
            Open details
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line">
              ↗
            </span>
          </a>
        ) : null}
        {canEdit && event.id ? (
          <label className="grid gap-1.5 text-sm">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Status</span>
            <select
              className={field}
              value={event.status}
              disabled={pending}
              onChange={(change) => {
                const status = change.target.value as EventStatus;
                if (status === event.status || !event.id) {
                  return;
                }
                setPending(true);
                setError(null);
                void setStatus({ eventId: event.id as Id<"events">, status })
                  .catch((reason: unknown) => setError(readableError(reason)))
                  .finally(() => setPending(false));
              }}
            >
              {(Object.keys(STATUS_LABEL) as EventStatus[]).map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABEL[status]}
                </option>
              ))}
            </select>
            {error ? <p className="text-sm text-muted">{error}</p> : null}
          </label>
        ) : null}
      </div>
    </article>
  );
}

function EventForm({
  pending,
  error,
  onSubmit,
}: {
  pending: boolean;
  error: string | null;
  onSubmit: (form: {
    title: string;
    place: string;
    summary: string;
    status: EventStatus;
    startsAt?: number;
    whenLabel?: string;
    url?: string;
  }) => void;
}) {
  const [title, setTitle] = useState("");
  const [place, setPlace] = useState("");
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState<EventStatus>("possible");
  const [day, setDay] = useState("");
  const [whenLabel, setWhenLabel] = useState("");
  const [url, setUrl] = useState("");

  const update =
    (setter: (value: string) => void) =>
    (change: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setter(change.target.value);

  function submit(change: FormEvent) {
    change.preventDefault();
    const startsAt = day ? Date.parse(`${day}T00:00:00.000Z`) : undefined;
    onSubmit({
      title,
      place,
      summary,
      status,
      ...(startsAt !== undefined && !Number.isNaN(startsAt) ? { startsAt } : {}),
      ...(whenLabel.trim() ? { whenLabel: whenLabel.trim() } : {}),
      ...(url.trim() ? { url: url.trim() } : {}),
    });
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <label className="grid gap-1.5 text-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">Title</span>
        <input
          required
          className={field}
          value={title}
          maxLength={120}
          placeholder="What the network is gathering for"
          onChange={update(setTitle)}
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">Place</span>
        <input
          required
          className={field}
          value={place}
          maxLength={160}
          placeholder="City, room, or link location"
          onChange={update(setPlace)}
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">Summary</span>
        <textarea
          required
          rows={4}
          className={field}
          value={summary}
          maxLength={2000}
          placeholder="Who it is for and what happens"
          onChange={update(setSummary)}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm">
          <span className="font-mono text-xs uppercase tracking-widest text-muted">Status</span>
          <select className={field} value={status} onChange={(change) => setStatus(change.target.value as EventStatus)}>
            <option value="possible">Possible</option>
            <option value="confirmed">Confirmed</option>
            <option value="past">Past</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-mono text-xs uppercase tracking-widest text-muted">Day</span>
          <input className={field} type="date" value={day} onChange={update(setDay)} />
        </label>
      </div>
      <label className="grid gap-1.5 text-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">Date label</span>
        <input
          className={field}
          value={whenLabel}
          maxLength={80}
          placeholder="Date TBA"
          onChange={update(setWhenLabel)}
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">Details link</span>
        <input
          className={field}
          value={url}
          maxLength={500}
          placeholder="https://"
          onChange={update(setUrl)}
        />
      </label>
      {error ? <p className="text-sm text-muted">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-fit items-center rounded-full bg-foreground px-5 text-sm font-medium text-background disabled:opacity-60"
      >
        {pending ? "Posting…" : "Post the date"}
      </button>
    </form>
  );
}

function Board({
  events,
  canEdit,
}: {
  events: NetworkEvent[] | undefined;
  canEdit: boolean;
}) {
  if (events === undefined) {
    return <p className="px-5 py-16 text-sm text-muted">Loading dates…</p>;
  }
  if (events.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="text-2xl font-medium tracking-tight">No dates yet.</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted">
          Confirmed and possible gatherings will show up here.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      {events.map((event) => (
        <EventCard key={event.id ?? eventMatchKeySafe(event)} event={event} canEdit={canEdit} />
      ))}
    </div>
  );
}

function eventMatchKeySafe(event: NetworkEvent) {
  return `${event.title}-${event.startsAt ?? event.whenLabel ?? "tba"}-${event.createdAt}`;
}

class EventListBoundary extends Component<{ children: ReactNode }, { failed: boolean; message: string | null }> {
  state = { failed: false, message: null as string | null };

  static getDerivedStateFromError(error: Error) {
    return { failed: true, message: readableError(error) };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="px-6 py-16">
          <p className="text-2xl font-medium tracking-tight">The board could not load.</p>
          {this.state.message ? (
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">{this.state.message}</p>
          ) : null}
        </div>
      );
    }
    return this.props.children;
  }
}

function LiveBoard() {
  const remote = useQuery(api.events.list, {});
  const viewer = useQuery(api.events.viewer, {});
  const submitEvent = useMutation(api.events.submit);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posted, setPosted] = useState(false);
  const isFounder = viewer?.isFounder === true;
  const events = remote === undefined ? undefined : catalogEvents(remote);

  return (
    <EventsLayout
      showForm={isFounder}
      form={
        posted ? (
          <p className="text-lg font-medium tracking-tight">The date is on the board.</p>
        ) : (
          <EventForm
            pending={pending}
            error={error}
            onSubmit={(form) => {
              if (form.status === "confirmed" && form.startsAt === undefined) {
                setError("A confirmed date needs a day.");
                return;
              }
              setPending(true);
              setError(null);
              void submitEvent(form)
                .then(() => setPosted(true))
                .catch((reason: unknown) => setError(readableError(reason)))
                .finally(() => setPending(false));
            }}
          />
        )
      }
      dates={
        <EventListBoundary>
          <Board events={events} canEdit={isFounder} />
        </EventListBoundary>
      }
    />
  );
}

function EventsLayout({
  dates,
  form,
  showForm,
}: {
  dates: ReactNode;
  form: ReactNode;
  showForm: boolean;
}) {
  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-5 pb-16 pt-24 sm:pt-32">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Events</p>
        <h1 className="mt-6 max-w-4xl text-5xl font-medium leading-[0.95] tracking-tight sm:text-7xl">
          Dates for the network.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-muted">
          Confirmed and possible gatherings. There is no signup list. If a date has a link, it only
          opens the details.
        </p>
        {showForm ? (
          <div className="mt-12 max-w-2xl border border-line p-6 sm:p-8">
            <p className="mb-4 text-sm leading-6 text-muted">Only the team can add a date.</p>
            {form}
          </div>
        ) : null}
      </section>
      <section className="border-t border-line">
        <div className="mx-auto w-full max-w-6xl px-5 py-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">The board</p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight">Upcoming and possible.</h2>
        </div>
        <div className="mx-auto w-full max-w-6xl border-t border-line">{dates}</div>
      </section>
    </>
  );
}

export function EventsBoard() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return (
      <EventsLayout
        showForm={false}
        form={null}
        dates={<Board events={catalogEvents(undefined)} canEdit={false} />}
      />
    );
  }
  return <LiveBoard />;
}
