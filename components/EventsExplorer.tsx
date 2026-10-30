"use client";

import { useState, type ReactNode } from "react";
import Icon from "./Icon";

type Item = { id: string; title: string; location: string; past: boolean; card: ReactNode };
type Scope = "upcoming" | "past" | "all";
const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function EventsExplorer({ items }: { items: Item[] }) {
  const [scope, setScope] = useState<Scope>("upcoming");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(6);
  const filtered = items.filter((item) => (scope === "all" || (scope === "past" ? item.past : !item.past)) && normalize(`${item.title} ${item.location}`).includes(normalize(query.trim())));
  const tabs: { value: Scope; label: string; count: number }[] = [
    { value: "upcoming", label: "Próximos", count: items.filter((item) => !item.past).length },
    { value: "past", label: "Archivo", count: items.filter((item) => item.past).length },
    { value: "all", label: "Todos", count: items.length },
  ];
  return (
    <div className="events-explorer">
      <div className="agenda-toolbar"><div className="agenda-tabs" role="group" aria-label="Filtrar eventos">{tabs.map((tab) => <button key={tab.value} aria-pressed={scope === tab.value} onClick={() => { setScope(tab.value); setLimit(6); }}>{tab.label}<span>{tab.count}</span></button>)}</div><label className="agenda-search"><Icon name="search" /><input type="search" aria-label="Buscar por evento o lugar" placeholder="Busca un evento o lugar…" value={query} onChange={(event) => { setQuery(event.target.value); setLimit(6); }} /></label></div>
      <div className="agenda-results"><span role="status">{filtered.length} {filtered.length === 1 ? "encuentro" : "encuentros"}{query.trim() && ` para “${query.trim()}”`}</span><span>Horarios en la zona de cada evento</span></div>
      <div className="cards-grid">{filtered.slice(0, limit).map((item) => <div key={item.id} className="event-slot">{item.card}</div>)}</div>
      {!filtered.length && <div className="empty-state"><Icon name="calendar" /><h3>{query ? "Ese encuentro todavía no aparece." : scope === "past" ? "Nuestra historia está por escribirse." : "Lo próximo se está construyendo."}</h3><p>{query ? "Prueba otro nombre, lugar o consulta toda la agenda." : "Aquí encontrarás las fechas y los detalles de nuestros encuentros."}</p>{(query || scope !== "all") && <button className="button button-outline" onClick={() => { setQuery(""); setScope("all"); setLimit(6); }}>Ver toda la agenda <Icon name="right" /></button>}</div>}
      {filtered.length > limit && <button className="button button-outline load-more" onClick={() => setLimit((value) => value + 6)}>Mostrar más encuentros <span>{Math.min(limit, filtered.length)} / {filtered.length}</span></button>}
    </div>
  );
}
