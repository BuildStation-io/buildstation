export type EventStatus = "confirmed" | "possible" | "past";

export type NetworkEvent = {
  id?: string;
  title: string;
  place: string;
  summary: string;
  startsAt?: number;
  whenLabel?: string;
  status: EventStatus;
  url?: string;
  createdAt: number;
};

export const SEED_EVENTS: NetworkEvent[] = [];

type RemoteEvent = {
  _id?: string;
  title?: string;
  place?: string;
  summary?: string;
  startsAt?: number;
  whenLabel?: string;
  status?: EventStatus;
  url?: string;
  createdAt?: number;
  hidden?: boolean;
};

export function eventMatchKey(event: {
  title: string;
  startsAt?: number;
  whenLabel?: string;
}) {
  const title = event.title.trim().toLowerCase();
  const when =
    event.startsAt !== undefined
      ? new Date(event.startsAt).toISOString().slice(0, 10)
      : (event.whenLabel ?? "").trim().toLowerCase();
  return `${title}\n${when}`;
}

export function sortEvents<T extends Pick<NetworkEvent, "status" | "startsAt" | "createdAt">>(
  events: T[],
): T[] {
  return [...events].sort((a, b) => {
    const rank = (status: EventStatus) => (status === "past" ? 1 : 0);
    const rankDiff = rank(a.status) - rank(b.status);
    if (rankDiff !== 0) {
      return rankDiff;
    }
    const past = a.status === "past";
    const aTime = a.startsAt ?? (past ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY);
    const bTime = b.startsAt ?? (past ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY);
    if (aTime !== bTime) {
      return past ? bTime - aTime : aTime - bTime;
    }
    return b.createdAt - a.createdAt;
  });
}

export function catalogEvents(remote: RemoteEvent[] | undefined): NetworkEvent[] {
  const seedKeys = new Set(SEED_EVENTS.map((event) => eventMatchKey(event)));
  const extras = (remote ?? []).flatMap((event): NetworkEvent[] => {
    if (event.hidden) {
      return [];
    }
    if (!event.title || !event.place || !event.summary || !event.status || !event.createdAt) {
      return [];
    }
    const item: NetworkEvent = {
      id: event._id,
      title: event.title,
      place: event.place,
      summary: event.summary,
      startsAt: event.startsAt,
      whenLabel: event.whenLabel,
      status: event.status,
      url: event.url,
      createdAt: event.createdAt,
    };
    if (seedKeys.has(eventMatchKey(item))) {
      return [];
    }
    return [item];
  });
  return sortEvents([...SEED_EVENTS, ...extras]);
}
