import Image from "next/image";
import Link from "next/link";
import { communityWhatsApp, team } from "@/lib/team";
import Icon from "./Icon";

export default function AboutSection() {
  return (
    <section id="nosotros" className="about-section section-space" aria-labelledby="about-title">
      <div className="site-container about-layout">
        <div className="about-copy section-copy">
          <p className="eyebrow"><span className="section-index">01 /</span> QUIÉNES SOMOS</p>
          <h2 id="about-title">La tecnología empieza<br />con <span className="text-accent">las personas.</span></h2>
          <p>Somos BuildStation. Una comunidad que conecta personas, código abierto e inteligencia artificial para trabajar en los retos de la infraestructura.</p>
          <p>Partimos de problemas reales. Compartimos lo que aprendemos y construimos proyectos en los que puedes aportar desde el código, los datos, el diseño o tu experiencia en campo.</p>
          <ul className="about-sectors" aria-label="Sectores de la comunidad">
            <li>Construcción</li><li>Minería</li><li>Energía</li><li>Real estate</li>
          </ul>
          <a href={communityWhatsApp} target="_blank" rel="noopener noreferrer" className="button button-primary">Encuentra tu lugar <Icon name="arrow" /></a>
        </div>
        <div className="about-people">
          <div className="about-people-heading"><span className="eyebrow">PERSONAS + TECNOLOGÍA</span><Icon name="people" /></div>
          <div className="about-portraits">
            {team.map((member) => (
              <figure key={member.name} className="about-portrait">
                <Image src={member.image} alt={`Retrato de ${member.name}`} fill sizes="(max-width: 640px) 42vw, (max-width: 900px) 170px, 180px" />
                <figcaption>{member.name.split(" ")[0]}<span>{member.role}</span></figcaption>
              </figure>
            ))}
          </div>
          <div className="about-people-footer"><span><Icon name="pin" /> Desde Lima, para LatAm.</span><Link href="/team" className="text-link">El equipo <Icon name="arrow" /></Link></div>
        </div>
      </div>
    </section>
  );
}
