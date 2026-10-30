import Link from "next/link";
import type { EventRow } from "@/lib/data";
import { eventDate } from "@/lib/event-utils";
import BrandMark from "./BrandMark";
import EventAction from "./EventAction";
import Icon from "./Icon";

export default function BuildPass({ event, calendarUrl, unavailable = false }: { event?: EventRow; calendarUrl?: string | null; unavailable?: boolean }) {
  const date = event?.date ? eventDate(event.date, event.timezone) : null;
  return (
    <article className={`build-pass${event ? "" : " pass-empty"}`}>
      <div className="pass-top"><span className="eyebrow">BUILD PASS / {event?.status === "possible" ? "POR CONFIRMAR" : "ENCUENTROS"}</span><BrandMark /></div>
      {event ? <>
        <div className="pass-date"><span>{date?.day ?? "↗"}</span><div><strong>{date?.month ?? "PRONTO"}</strong><span>{date ? event.dateOnly ? date.full : `${date.time} · ${date.timezone.replaceAll("_", " ")}` : event.whenLabel || "Fecha por confirmar"}</span></div><Icon name="arrow" /></div>
        <h3>{event.title}</h3>
        <p className="pass-location"><Icon name="pin" />{event.location || "Ubicación por confirmar"}</p>
        <div className="pass-tear" />
        <div className="pass-bottom"><EventAction event={event} /><span className="pass-barcode" aria-hidden="true" /></div>
      </> : <>
        <div className="pass-empty-symbol" aria-hidden="true">↗</div>
        <h3>{unavailable ? "La agenda vuelve pronto." : calendarUrl ? "Tu próximo encuentro está en Luma." : "Lo próximo lo construimos juntos."}</h3>
        <p>{unavailable ? "No pudimos actualizar los eventos. Vuelve a consultar la agenda en unos minutos." : calendarUrl ? "Explora las fechas y reserva tu lugar en nuestro calendario." : "Estamos preparando los próximos encuentros. Aquí encontrarás todas las fechas."}</p>
        <div className="pass-tear" />
        {calendarUrl ? <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="button button-outline">Abrir calendario <Icon name="arrow" /></a> : <Link href="/events" className="button button-outline">Explorar la agenda <Icon name="right" /></Link>}
      </>}
    </article>
  );
}
