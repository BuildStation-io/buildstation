import ProjectCard from "@/components/ProjectPreviewCard";
import Icon from "@/components/Icon";
import { getProjects } from "@/lib/data";
import { communityWhatsApp } from "@/lib/team";

export const metadata = {
  title: "Proyectos",
  description: "Explora InmoNExo y AIConstructor: proyectos de la comunidad BuildStation para el mercado inmobiliario y la preconstrucción en Lima.",
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <div className="site-container projects-page">
      <header className="projects-hero">
        <p className="eyebrow"><span className="status-dot" /> DEL PROBLEMA REAL AL PRIMER COMMIT</p>
        <h1>Ideas que ya<br /><span className="text-accent">tienen código.</span></h1>
        <p className="projects-intro">Así construimos en comunidad: inteligencia inmobiliaria con InmoNExo y orientación para construir con AIConstructor. Desde Lima, abiertos a tu próxima contribución.</p>
        <div className="hero-actions"><a href="#projects" className="button button-primary">Explorar los proyectos <Icon name="right" /></a><a href={communityWhatsApp} target="_blank" rel="noopener noreferrer" className="text-link">Conversar con la comunidad <Icon name="arrow" /></a></div>
        <div className="projects-hero-note"><Icon name="code" /><span>CÓDIGO PÚBLICO</span><span className="text-accent">/</span><span>CONTEXTO LOCAL</span><span className="text-accent">/</span><span>CONSTRUCCIÓN EN COMUNIDAD</span></div>
      </header>

      <section id="projects" className="projects-directory" aria-labelledby="directory-title">
        <div className="section-heading"><div><p className="eyebrow">LO QUE ESTAMOS CONSTRUYENDO</p><h2 id="directory-title">Hechos para abrirlos.<br /><span className="text-muted">Y llevarlos más lejos.</span></h2></div><p className="eyebrow">{projects.length} PROYECTOS EN EL DIRECTORIO</p></div>
        <div className="cards-grid projects-grid-pair">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
      </section>

      <section className="section-space" aria-labelledby="contribute-title">
        <div className="section-heading"><div><p className="eyebrow">TU PRIMER APORTE EMPIEZA AQUÍ</p><h2 id="contribute-title">Lee. Conversa. Construye.</h2></div><p className="heading-aside">Una mejora pequeña también<br />hace avanzar un proyecto.</p></div>
        <div className="community-grid">
          <div className="community-card"><span className="community-number">01</span><Icon name="code" /><h3>Explora el código.</h3><p>Abre un repositorio, revisa su README y conoce el problema que busca resolver. Las issues son un buen punto de partida.</p></div>
          <div className="community-card"><span className="community-number">02</span><Icon name="people" /><h3>Trae tu perspectiva.</h3><p>Cuéntanos qué te interesa: datos, diseño, desarrollo o experiencia en campo. Coordina tu idea con la comunidad antes de empezar.</p><a href={communityWhatsApp} target="_blank" rel="noopener noreferrer" className="text-link">Entrar a WhatsApp <Icon name="arrow" /></a></div>
          <div className="community-card"><span className="community-number">03</span><Icon name="branch" /><h3>Comparte tu aporte.</h3><p>Propón una mejora, documenta un hallazgo o abre un pull request. Construimos con lo que cada persona puede aportar.</p></div>
        </div>
      </section>
    </div>
  );
}
