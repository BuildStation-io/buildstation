export function safeExternalUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

export function lumaUrl(value: string | null | undefined): string | null {
  const safe = safeExternalUrl(value);
  if (!safe) return null;
  return ["luma.com", "lu.ma", "www.luma.com", "www.lu.ma"].includes(new URL(safe).hostname) ? safe : null;
}

export function eventTimezone(value?: string): string {
  try {
    new Intl.DateTimeFormat("es", { timeZone: value || "UTC" }).format();
    return value || "UTC";
  } catch {
    return "UTC";
  }
}

export function eventDate(date: Date | string, timezone?: string) {
  const timeZone = eventTimezone(timezone);
  const value = new Date(date);
  return {
    day: value.toLocaleDateString("es", { day: "2-digit", timeZone }),
    month: value.toLocaleDateString("es", { month: "short", timeZone }).replace(".", ""),
    full: value.toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric", timeZone }),
    time: value.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone }),
    timezone: timeZone,
  };
}
