import Image from "next/image";
import { team } from "@/lib/team";
import Icon from "./Icon";

export default function TeamGrid() {
  return (
    <div className="team-grid">
      {team.map((member, index) => (
        <article className="team-card" key={member.name}>
          <div className="team-portrait">
            <span className="team-card-index" aria-hidden="true">0{index + 1} / BS</span>
            <div className="team-portrait-frame">
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="(max-width: 640px) 220px, (max-width: 900px) 300px, (max-width: 1100px) 260px, 200px"
              />
            </div>
            {member.github && (
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="team-profile-link"
                aria-label={`Ver el GitHub de ${member.name}`}
              >
                <Icon name="github" />
              </a>
            )}
          </div>
          <div className="team-card-body">
            <p className="eyebrow team-role"><span className="status-dot" />{member.role}</p>
            <h3>{member.name}</h3>
            <a href={member.github} target="_blank" rel="noopener noreferrer" className="team-handle" aria-label={`Perfil de GitHub de ${member.name}`}>@{member.github.split("/").pop()}</a>
            {member.location && <p className="team-location"><Icon name="pin" />{member.location}</p>}
            {member.company && <div className={`team-company${member.company.theme === "dark" ? " team-company-dark" : ""}`}>
              {member.company.logo ? <Image
                src={member.company.logo}
                alt={member.company.name}
                width={member.company.width}
                height={member.company.height}
                sizes="140px"
              /> : <span className="team-company-name">{member.company.name}</span>}
            </div>}
          </div>
        </article>
      ))}
    </div>
  );
}
