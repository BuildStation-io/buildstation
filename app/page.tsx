import Link from "next/link";
import AboutSection from "@/components/AboutSection";
import BuildPass from "@/components/BuildPass";
import EventCard from "@/components/EventCard";
import Icon from "@/components/Icon";
import JoinButton from "@/components/JoinButton";
import ProjectCard from "@/components/ProjectPreviewCard";
import StationVisual from "@/components/StationVisual";
import TeamSection from "@/components/TeamSection";
import { getProjects, getEventTimeline } from "@/lib/data";
import { getLumaConfig } from "@/lib/luma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, feed] = await Promise.all([getProjects(), getEventTimeline()]);
  const { upcoming } = feed;
  const selected = projects.filter((project) => project.featured);
  const featured = (selected.length ? selected : projects).slice(0, 3);
  const { calendarUrl } = getLumaConfig();

  return (
    <>
      <section className="home-hero">
        <div className="site-container hero-layout">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow"><span className="status-dot" /> EL PUNTO DE ENCUENTRO DE LOS BUILDERS</p>
            <h1>Las ideas se<br />construyen<br /><span>en comunidad.</span></h1>
            <p className="hero-description">IA aplicada a construcción, minería, energía y real estate.<br className="desktop-break" /> Personas, código abierto y proyectos que transforman la infraestructura.</p>
            <div className="hero-actions"><Link href="/projects" className="button button-primary">Encuentra tu próximo proyecto <Icon name="arrow" /></Link><Link href="/events" className="button button-ghost">Nos vemos en un evento <Icon name="right" /></Link></div>
            <div className="hero-footnote"><span className="mini-symbol" aria-hidden="true">[↗]</span><span>Desde tu primer commit.<br /><strong>Hasta tu próxima gran idea.</strong></span></div>
          </div>
          <StationVisual />
        </div>
        <div className="hero-strip"><div className="site-container"><span><Icon name="code" /> CÓDIGO ABIERTO</span><span className="strip-plus" aria-hidden="true">+</span><span><Icon name="people" /> CONEXIONES REALES</span><span className="strip-plus" aria-hidden="true">+</span><span><Icon name="globe" /> SIN FRONTERAS</span><span className="strip-end">BUILD. SHARE. REPEAT. ↗</span></div></div>
      </section>

      <AboutSection />

      <section className="site-container section-space next-meeting" aria-labelledby="next-meeting-title">
        <div className="section-copy">
          <p className="eyebrow"><span className="section-index">02 /</span> FUERA DEL CHAT. JUNTOS.</p>
          <h2 id="next-meeting-title">El próximo commit<br />puede empezar<br /><span className="text-accent">con un hola.</span></h2>
          <p>Workshops para aprender haciendo, meetups para compartir y hackathons para llevar una idea más lejos.</p>
          <Link href="/events" className="text-link">Encuentra tu próximo encuentro <Icon name="right" /></Link>
          <div className="meeting-detail"><span className="crosshair" aria-hidden="true">+</span><span>Trae tu curiosidad.<br />Las conexiones las hacemos aquí.</span></div>
        </div>
        <div className="featured-pass"><p className="eyebrow pass-caption"><span className="status-dot" /> EN LA AGENDA</p><BuildPass event={upcoming[0]} calendarUrl={calendarUrl} unavailable={feed.unavailable} /></div>
      </section>

      <section className="projects-section section-space" aria-labelledby="projects-title">
        <div className="site-container">
          <div className="section-heading"><div><p className="eyebrow"><span className="section-index">03 /</span> HECHO PARA COMPARTIR</p><h2 id="projects-title">Código abierto.<br /><span className="text-muted">Posibilidades infinitas.</span></h2></div><Link href="/projects" className="text-link">Explorar proyectos <Icon name="arrow" /></Link></div>
          <p className="section-description">InmoNExo y AIConstructor: del mercado inmobiliario a la preconstrucción. Explora lo que construye la comunidad y encuentra dónde aportar.</p>
          <div className={`cards-grid${featured.length === 2 ? " projects-grid-pair" : ""}`}>{featured.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
          {!featured.length && <div className="empty-state"><Icon name="code" /><h3>El siguiente proyecto puede ser el tuyo.</h3><p>Estamos preparando el directorio de la comunidad.</p></div>}
        </div>
      </section>

      <section className="site-container section-space community-section" aria-labelledby="community-title">
        <div className="section-heading"><div><p className="eyebrow"><span className="section-index">04 /</span> TU GENTE ESTÁ AQUÍ</p><h2 id="community-title">Diferentes talentos.<br /><span className="text-muted">Las mismas ganas de crear.</span></h2></div><p className="heading-aside">No importa dónde empiezas.<br />Importa lo que podemos hacer juntos.</p></div>
        <div className="community-grid">
          <Link href="/projects" className="community-card"><span className="community-number">01</span><Icon name="code" /><h3>Construye algo real.</h3><p>Explora proyectos, aprende del código y encuentra dónde aportar.</p><span className="text-link">Explorar open source <Icon name="arrow" /></span></Link>
          <Link href="/events" className="community-card"><span className="community-number">02</span><Icon name="calendar" /><h3>Sal del modo solo.</h3><p>Comparte una mesa, una idea o un reto con personas que también construyen.</p><span className="text-link">Encontrar un encuentro <Icon name="arrow" /></span></Link>
          <Link href="/members" className="community-card"><span className="community-number">03</span><Icon name="people" /><h3>Encuentra tu equipo.</h3><p>Conoce a los builders detrás de las ideas y conecta a través de sus perfiles.</p><span className="text-link">Conocer a la comunidad <Icon name="arrow" /></span></Link>
        </div>
      </section>

      <TeamSection />

      {upcoming.length > 1 && <section className="site-container section-space agenda-preview" aria-labelledby="agenda-preview-title"><div className="section-heading"><div><p className="eyebrow">RESERVA UN ESPACIO PARA CREAR</p><h2 id="agenda-preview-title">Lo que viene.</h2></div><Link href="/events" className="text-link">Toda la agenda <Icon name="arrow" /></Link></div><div className="cards-grid">{upcoming.slice(0, 3).map((event) => <EventCard key={event.id} event={event} />)}</div></section>}

       <section className="join-section"><div className="site-container join-layout"><div><p className="eyebrow">EL SIGUIENTE PASO ES TUYO</p><h2>Menos «algún día».<br /><span>Más «lo construimos».</span></h2><p>Un lugar para aprender, compartir y hacer que las ideas pasen.</p></div><div className="join-actions"><JoinButton />{calendarUrl ? <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="text-link">Seguir encuentros en Luma <Icon name="arrow" /></a> : <Link href="/events" className="text-link">Primero, un encuentro <Icon name="arrow" /></Link>}<span className="join-caption">CURIOSIDAD ES TODO LO QUE NECESITAS.</span></div></div></section>
    </>
  );
}
