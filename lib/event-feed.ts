import type { EventRow } from "./data";
import { eventMatchKey, type NetworkEvent } from "./events";

export function toEventRow(event: NetworkEvent): EventRow {
  return {
    id: event.id ?? `catalog:${eventMatchKey(event)}`,
    title: event.title,
    description: event.summary,
    date: event.startsAt === undefined ? null : new Date(event.startsAt),
    location: event.place,
    url: event.url ?? null,
    timezone: "UTC",
    dateOnly: true,
    whenLabel: event.whenLabel,
    status: event.status,
    source: event.id ? "convex" : "catalog",
  };
}

// Convex dates are calendar days, not appointments at midnight UTC.
export function isPastEvent(event: EventRow, now = Date.now()) {
  if (event.status === "past") return true;
  if (!event.date) return false;
  const end = event.endDate?.getTime() ?? event.date.getTime() + (event.dateOnly ? 86_400_000 : 0);
  return end <= now;
}

export function mergeEventRows(local: EventRow[], external: EventRow[]) {
  const urlKey = (url: string | null) => {
    try {
      const parsed = new URL(url ?? "");
      const host = parsed.hostname.replace(/^www\./, "").replace(/^lu\.ma$/, "luma.com");
      return `${host}${parsed.pathname.replace(/\/$/, "")}`;
    } catch { return null; }
  };
  const urls = new Set(local.map((event) => urlKey(event.url)).filter(Boolean));
  return [...local, ...external.filter((event) => !urls.has(urlKey(event.url)))].sort((a, b) =>
    (a.date?.getTime() ?? Infinity) - (b.date?.getTime() ?? Infinity));
}
