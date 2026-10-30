import type { EventRow } from "@/lib/data";
import { lumaUrl, safeExternalUrl } from "@/lib/event-utils";
import Icon from "./Icon";

export default function EventAction({ event, past = false }: { event: EventRow; past?: boolean }) {
  const url = safeExternalUrl(event.url);
  if (url) return <a className="button button-outline" href={url} target="_blank" rel="noopener noreferrer">{!past && event.registrationOpen !== false && lumaUrl(url) ? "Inscribirme en Luma" : "Ver evento"}<Icon name="arrow" /></a>;
  return <span className="event-note">{past ? "Encuentro finalizado" : "Pronto compartiremos más detalles"}</span>;
}
