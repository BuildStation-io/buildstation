import Link from "next/link";
import Icon from "./Icon";
import TeamGrid from "./TeamGrid";
import { team } from "@/lib/team";

export default function TeamSection() {
  const names = new Intl.ListFormat("es", { type: "conjunction" }).format(team.map((member) => member.name.split(" ")[0]));
  return (
    <section className="founders-section section-space" aria-labelledby="founders-title">
      <div className="site-container">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span className="section-index">05 /</span> EL EQUIPO FUNDADOR</p>
            <h2 id="founders-title">La comunidad tiene caras.<br /><span className="text-muted">Y muchas ganas de construir.</span></h2>
          </div>
          <Link href="/team" className="text-link">Conoce al equipo <Icon name="arrow" /></Link>
        </div>
        <p className="section-description">
          {names}. Conectamos personas y tecnología para
          llevar la inteligencia artificial a los proyectos de infraestructura.
        </p>
        <TeamGrid />
        <div className="team-section-footnote">
          <span className="eyebrow"><Icon name="globe" /> DESDE LIMA, CONSTRUYENDO PARA LATAM</span>
          <span>Construcción · Minería · Energía · Real estate</span>
        </div>
      </div>
    </section>
  );
}
