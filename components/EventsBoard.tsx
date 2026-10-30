"use client";

import { useMutation, useQuery } from "convex/react";
import { Component, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { catalogEvents, type EventStatus } from "@/lib/events";
import type { EventRow } from "@/lib/data";
import { isPastEvent, mergeEventRows, toEventRow } from "@/lib/event-feed";
import EventCard from "./EventCard";
import BuildPass from "./BuildPass";
import EventsExplorer from "./EventsExplorer";
import Icon from "./Icon";
import Link from "next/link";

const STATUS_LABEL: Record<EventStatus, string> = {
  confirmed: "Confirmado",
  possible: "Por confirmar",
  past: "Pasado",
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

function EditableEventCard({
  event,
  past,
}: {
  event: EventRow;
  past: boolean;
}) {
  const setStatus = useMutation(api.events.setStatus);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="editable-event">
      <EventCard event={event} past={past} />
      <div className="event-editor">
          <label className="grid gap-1.5 text-sm">
            <span className="eyebrow">Estado · {event.title}</span>
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
             {error ? <p role="alert" className="text-sm text-muted">{error}</p> : null}
          </label>
      </div>
    </div>
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
        <span className="font-mono text-xs uppercase tracking-widest text-muted">Título</span>
        <input
          required
          className={field}
          value={title}
          maxLength={120}
          placeholder="¿Para qué nos encontramos?"
          onChange={update(setTitle)}
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">Lugar</span>
        <input
          required
          className={field}
          value={place}
          maxLength={160}
          placeholder="Ciudad, espacio o encuentro online"
          onChange={update(setPlace)}
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">Descripción</span>
        <textarea
          required
          rows={4}
          className={field}
          value={summary}
          maxLength={2000}
          placeholder="Para quién es y qué haremos"
          onChange={update(setSummary)}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm">
          <span className="font-mono text-xs uppercase tracking-widest text-muted">Estado</span>
          <select className={field} value={status} onChange={(change) => setStatus(change.target.value as EventStatus)}>
            <option value="possible">Por confirmar</option>
            <option value="confirmed">Confirmado</option>
            <option value="past">Pasado</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-mono text-xs uppercase tracking-widest text-muted">Día</span>
          <input className={field} type="date" value={day} onChange={update(setDay)} />
        </label>
      </div>
      <label className="grid gap-1.5 text-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">Fecha aproximada (opcional)</span>
        <input
          className={field}
          value={whenLabel}
          maxLength={80}
          placeholder="Fecha por confirmar"
          onChange={update(setWhenLabel)}
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">Enlace de detalles o Luma</span>
        <input
          className={field}
          value={url}
          maxLength={500}
          placeholder="https://"
          onChange={update(setUrl)}
        />
      </label>
      {error ? <p role="alert" className="text-sm text-muted">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="button button-primary w-fit"
      >
        {pending ? "Publicando…" : "Publicar encuentro"}
      </button>
    </form>
  );
}

function Board({
  events,
  canEdit,
  now,
}: {
  events: EventRow[] | undefined;
  canEdit: boolean;
  now: number;
}) {
  if (events === undefined) {
    return <p role="status" className="px-5 py-16 text-sm text-muted">Actualizando la agenda…</p>;
  }
  if (events.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="text-2xl font-medium tracking-tight">Lo próximo lo construimos juntos.</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted">
          Aquí aparecerán los próximos encuentros de la comunidad.
        </p>
      </div>
    );
  }
  return (
    <EventsExplorer items={events.map((event) => ({
      id: event.id,
      title: event.title,
      location: event.location ?? "",
      past: isPastEvent(event, now),
      card: canEdit && event.source === "convex"
        ? <EditableEventCard event={event} past={isPastEvent(event, now)} />
        : <EventCard event={event} past={isPastEvent(event, now)} />,
    }))} />
  );
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
          <p role="status" className="text-2xl font-medium tracking-tight">No pudimos actualizar la agenda.</p>
          <p className="mt-4 text-muted">Vuelve a cargar la página en unos minutos.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

type BoardProps = { external: EventRow[]; calendarUrl: string | null; unavailable: boolean; now: number };

function LiveBoard({ external, calendarUrl, unavailable, now }: BoardProps) {
  const remote = useQuery(api.events.list, {});
  const viewer = useQuery(api.events.viewer, {});
  const submitEvent = useMutation(api.events.submit);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posted, setPosted] = useState(false);
  const isFounder = viewer?.isFounder === true;
  const events = mergeEventRows(catalogEvents(remote).map(toEventRow), external);

  return (
    <EventsLayout
      featured={events.find((event) => !isPastEvent(event, now))}
      calendarUrl={calendarUrl}
      unavailable={unavailable}
      showForm={isFounder}
      form={
        posted ? (
          <div role="status"><p className="text-lg font-medium tracking-tight">El encuentro ya está en la agenda.</p><button className="text-link" onClick={() => setPosted(false)}>Publicar otro encuentro ↗</button></div>
        ) : (
          <EventForm
            pending={pending}
            error={error}
            onSubmit={(form) => {
              if (form.status === "confirmed" && form.startsAt === undefined) {
                setError("Un encuentro confirmado necesita un día.");
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
          <Board events={remote === undefined && !events.length ? undefined : events} canEdit={isFounder} now={now} />
        </EventListBoundary>
      }
    />
  );
}

function EventsLayout({
  dates,
  form,
  showForm,
  featured,
  calendarUrl,
  unavailable,
}: {
  dates: ReactNode;
  form: ReactNode;
  showForm: boolean;
  featured?: EventRow;
  calendarUrl?: string | null;
  unavailable?: boolean;
}) {
  return (
    <div className="site-container events-page">
      <header className="events-hero"><div><p className="eyebrow"><span className="status-dot" /> BUILDSTATION / ENCUENTROS</p><h1>Buen código.<br />Mejor <span className="text-accent">compañía.</span></h1><p>Hay cosas que empiezan con un café y terminan en un proyecto. Encuentra tu próximo punto de encuentro.</p><a href="#agenda" className="button button-primary">Explorar la agenda <Icon name="right" /></a><div className="event-types"><span>MEETUPS</span><span>WORKSHOPS</span><span>HACKATHONS</span></div></div><BuildPass event={featured} calendarUrl={calendarUrl} unavailable={unavailable} /></header>
      <section aria-label="Publicar encuentros">
        {showForm ? (
          <details className="founder-event-form" open>
            <summary>Publicar un encuentro · Founders</summary>
            <p className="mb-6 mt-4 text-sm leading-6 text-muted">Publica directamente en la agenda. Puedes añadir un enlace de Luma para las inscripciones.</p>
            {form}
          </details>
        ) : <p className="event-publish-hint">¿Eres founder? <Link href="/sign-in">Inicia sesión con GitHub</Link> para publicar un encuentro.</p>}
      </section>
      <section className="agenda-section" id="agenda" aria-labelledby="agenda-title">
        <div className="section-heading"><div><p className="eyebrow">UN ESPACIO PARA APRENDER Y CONSTRUIR</p><h2 id="agenda-title">Encuentra tu encuentro.</h2></div><span className="eyebrow">LA AGENDA DE LA COMUNIDAD</span></div>
        {unavailable && <p role="status" className="demo-notice">No pudimos actualizar los eventos de Luma. {calendarUrl && <a href={calendarUrl} target="_blank" rel="noopener noreferrer">Consultar calendario ↗</a>}</p>}
        {dates}
      </section>
      <div className="agenda-outro"><span className="crosshair" aria-hidden="true">+</span><p>Una conversación. Una idea. Un nuevo comienzo.<br /><strong>Nos vemos en el próximo encuentro.</strong></p></div>
    </div>
  );
}

export function EventsBoard(props: BoardProps) {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    const events = mergeEventRows(catalogEvents(undefined).map(toEventRow), props.external);
    return (
      <EventsLayout
        featured={events.find((event) => !isPastEvent(event, props.now))}
        calendarUrl={props.calendarUrl}
        unavailable={props.unavailable}
        showForm={false}
        form={null}
        dates={<Board events={events} canEdit={false} now={props.now} />}
      />
    );
  }
  return <EventListBoundary><LiveBoard {...props} /></EventListBoundary>;
}
