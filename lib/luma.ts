import "server-only";
import type { EventRow } from "./data";
import { eventTimezone, lumaUrl } from "./event-utils";

export function getLumaConfig() {
  const id = process.env.LUMA_CALENDAR_ID?.trim() ?? "";
  const calendarId = /^cal-[a-zA-Z0-9]+$/.test(id) ? id : null;
  const calendarUrl = lumaUrl(process.env.LUMA_CALENDAR_URL) ?? (calendarId ? `https://luma.com/calendar/${calendarId}` : null);
  return {
    calendarUrl,
    embedUrl: calendarId ? `https://luma.com/embed/calendar/${calendarId}/events` : null,
    apiEnabled: Boolean(process.env.LUMA_API_KEY?.trim()),
  };
}

type LumaEvent = {
  id?: string;
  name?: string;
  start_at?: string;
  end_at?: string;
  timezone?: string;
  url?: string;
  visibility?: string;
  location_type?: string;
  location_visibility?: string;
  registration_open?: boolean;
  geo_address_json?: { city?: string | null; city_state?: string | null; address?: string | null } | null;
};

// Only project public event fields. API responses can contain private addresses,
// meeting URLs and host details; those never belong in the public feed.
export function toPublicLumaEvent(event: LumaEvent): EventRow | null {
  const url = lumaUrl(event.url);
  if (event.visibility !== "public" || !event.id || !event.name || !url || !event.start_at) return null;
  const date = new Date(event.start_at);
  if (!Number.isFinite(date.getTime())) return null;
  const end = event.end_at ? new Date(event.end_at) : null;
  const address = event.geo_address_json;
  const city = address?.city || address?.city_state;
  const location = event.location_visibility === "public"
    ? city || address?.address
    : city;
  return {
    id: `luma:${event.id}`,
    title: event.name,
    description: null,
    date,
    endDate: end && Number.isFinite(end.getTime()) ? end : undefined,
    timezone: eventTimezone(event.timezone),
    location: location || (event.location_type === "offline" ? "Ubicación en Luma" : ["missing", "unknown", undefined].includes(event.location_type) ? "Detalles en Luma" : "Online"),
    url,
    source: "luma",
    registrationOpen: event.registration_open !== false,
  };
}

export async function getLumaEvents(): Promise<EventRow[]> {
  const key = process.env.LUMA_API_KEY?.trim();
  if (!key) return [];
  const events = new Map<string | number, EventRow>();
  let cursor: string | undefined;
  const seen = new Set<string>();
  const signal = AbortSignal.timeout(12_000);
  for (let page = 0; page < 20; page++) {
    const url = new URL("https://public-api.luma.com/v1/calendars/events/list");
    url.searchParams.set("pagination_limit", "100");
    url.searchParams.set("sort_column", "start_at");
    url.searchParams.set("sort_direction", "desc");
    url.searchParams.append("access", "manage");
    url.searchParams.append("access", "view");
    if (cursor) url.searchParams.set("pagination_cursor", cursor);
    const response = await fetch(url, {
      headers: { "x-luma-api-key": key },
      next: { revalidate: 300 },
      signal,
    });
    if (!response.ok) throw new Error(`Luma respondió ${response.status}`);
    const data = await response.json() as { entries?: LumaEvent[]; has_more?: boolean; next_cursor?: string };
    if (!Array.isArray(data.entries) || typeof data.has_more !== "boolean") throw new Error("Respuesta de Luma no válida");
    for (const entry of data.entries) {
      if (!entry || typeof entry !== "object") continue;
      const event = toPublicLumaEvent(entry);
      if (event) events.set(event.id, event);
    }
    if (!data.has_more) return [...events.values()].sort((a, b) => (a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0));
    if (!data.next_cursor || seen.has(data.next_cursor)) throw new Error("Paginación de Luma no válida");
    seen.add(data.next_cursor);
    cursor = data.next_cursor;
  }
  throw new Error("El calendario supera el límite de sincronización");
}
