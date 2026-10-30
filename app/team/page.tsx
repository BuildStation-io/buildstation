import Link from "next/link";
import StationCore from "@/components/StationCore";
import Icon from "@/components/Icon";
import TeamGrid from "@/components/TeamGrid";
import { communityWhatsApp, team } from "@/lib/team";

export const metadata = {
  title: "Equipo",
  description: `Conoce a ${new Intl.ListFormat("es", { type: "conjunction" }).format(team.map((member) => member.name))}: el equipo fundador de BuildStation, impulsando la IA aplicada a infraestructura.`,
};

export default function TeamPage() {
  return (
    <div className="site-container team-page">
      <header className="team-hero">
        <div>
          <p className="eyebrow"><span className="status-dot" /> BUILDSTATION / EL EQUIPO</p>
          <h1>Conectamos personas.<br /><span className="text-accent">Construimos futuro.</span></h1>
          <p className="team-intro">
            Somos el equipo que impulsa una cultura de inteligencia artificial
            aplicada a la infraestructura: construcción, minería, energía y real estate.
            Desde Lima, construyendo para LatAm.
          </p>
          <a href="#founders" className="text-link">Conoce al equipo fundador <Icon name="right" /></a>
        </div>
        <div className="team-brand-panel">
          <span className="eyebrow">PERSONAS + TECNOLOGÍA</span>
          <StationCore variant="emblem" />
          <span className="eyebrow">BUILD THE FUTURE.</span>
        </div>
      </header>

      <section className="team-roster" id="founders" aria-labelledby="team-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{team.length} FOUNDERS. UNA VISIÓN COMPARTIDA.</p>
            <h2 id="team-title">El equipo fundador.</h2>
          </div>
          <Link href="/members" className="text-link">Conoce también a los builders <Icon name="arrow" /></Link>
        </div>
        <TeamGrid />
      </section>

      <section className="team-invitation" aria-labelledby="team-invitation-title">
        <div>
          <p className="eyebrow">UNA CONVERSACIÓN PUEDE SER EL COMIENZO</p>
          <h2 id="team-invitation-title">Trae un problema real.<br />Construyamos una solución.</h2>
          <p>Comparte tu experiencia, conecta con la comunidad y encuentra a tu próximo equipo.</p>
        </div>
        <a href={communityWhatsApp} target="_blank" rel="noopener noreferrer" className="button button-primary">
          Conversar en WhatsApp <Icon name="arrow" />
        </a>
      </section>
    </div>
  );
}
