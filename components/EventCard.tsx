import type { EventRow } from "@/lib/data";
import { eventDate } from "@/lib/event-utils";
import EventAction from "./EventAction";
import Icon from "./Icon";

export default function EventCard({ event, past = false }: { event: EventRow; past?: boolean }) {
  const date = event.date ? eventDate(event.date, event.timezone) : null;
  return (
    <article className={`event-card${past ? " event-past" : ""}`}>
      <div className="event-card-top"><div className="date-tile"><span>{date?.month ?? "PRONTO"}</span><strong>{date?.day ?? "↗"}</strong></div><span className="tag">{past ? "ARCHIVO" : event.status === "possible" ? "POR CONFIRMAR" : event.source === "luma" ? "LUMA" : "ENCUENTRO"}</span></div>
      {event.date && date ? <time dateTime={event.date.toISOString()}>{date.full}{!event.dateOnly && <> · {date.time}<span>{date.timezone.replaceAll("_", " ")}</span></>}</time> : <p className="eyebrow">{event.whenLabel || "Fecha por confirmar"}</p>}
      <h3>{event.title}</h3>
      {event.description && <p className="event-description">{event.description}</p>}
      <p className="event-location"><Icon name="pin" />{event.location || "Ubicación por confirmar"}</p>
      <div className="event-card-action"><EventAction event={event} past={past} /></div>
    </article>
  );
}
