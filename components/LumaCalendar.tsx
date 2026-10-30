import { getLumaConfig } from "@/lib/luma";
import Icon from "./Icon";

export default function LumaCalendar() {
  const { calendarUrl, embedUrl, apiEnabled } = getLumaConfig();
  return (
    <section className="luma-section" id="luma" aria-labelledby="luma-title">
      <div className="luma-heading"><div className="luma-symbol" aria-hidden="true">✳</div><div><p className="eyebrow">EL PRÓXIMO ENCUENTRO, MÁS CERCA</p><h2 id="luma-title">Nos vemos en Luma.</h2><p>{calendarUrl ? "Sigue nuestro calendario para enterarte de nuevas fechas y gestionar tus inscripciones." : "Nuestro calendario está en preparación. Pronto podrás seguir los encuentros y reservar tu lugar desde Luma."}</p></div>{calendarUrl ? <a className="button button-primary" href={calendarUrl} target="_blank" rel="noopener noreferrer">Seguir calendario <Icon name="arrow" /></a> : <span className="tag">PRÓXIMAMENTE</span>}</div>
      {embedUrl && !apiEnabled && <iframe src={embedUrl} title="Calendario de eventos de BuildStation en Luma" className="luma-embed" loading="lazy" allowFullScreen />}
    </section>
  );
}
