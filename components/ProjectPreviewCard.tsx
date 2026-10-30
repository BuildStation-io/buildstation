import Image from "next/image";
import type { ProjectRow } from "@/lib/data";
import Icon from "./Icon";

export default function ProjectCard({ project }: { project: ProjectRow }) {
  return (
    <article className="project-card">
      {project.preview && <figure className="project-preview">
        <div className="project-preview-bar" aria-hidden="true"><span className="preview-dots"><i /><i /><i /></span><span>{project.name}</span><Icon name="code" /></div>
        <div className="project-preview-image"><Image src={project.preview.src} alt={project.preview.alt} width={1200} height={780} sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1100px) 46vw, 600px" /></div>
        <figcaption>{project.preview.caption}</figcaption>
      </figure>}
      <div className="project-card-top"><span className="project-icon"><Icon name="code" /></span><span className="tag">{project.category || "OPEN SOURCE"}</span></div>
      <p className="project-repo">{project.githubRepo}</p>
      <h3>{project.name}</h3>
      <p className="project-description">{project.description}</p>
      {(project.stars !== null || project.openIssues !== null) && <div className="project-stats">{project.stars !== null && <span><Icon name="star" />{Intl.NumberFormat("es", { notation: "compact", maximumFractionDigits: 1 }).format(project.stars)}</span>}{project.openIssues !== null && <span><Icon name="branch" />{project.openIssues} issues + PRs</span>}</div>}
      {project.needs.length > 0 && <details className="project-needs"><summary>Dónde aportar · {project.needs.filter((need) => need.status === "open").length} pendientes</summary><ul>{project.needs.map((need) => <li key={need.title}><span>{need.status === "done" ? "✓" : "↗"}</span> {need.title}</li>)}</ul></details>}
      <div className="project-bottom"><span className="project-language"><i />{project.language || "Open source"}</span>{project.githubRepo && <a href={`https://github.com/${project.githubRepo}`} target="_blank" rel="noopener noreferrer" aria-label={`Ver código de ${project.name}`}>Ver código <Icon name="arrow" /></a>}</div>
      {project.website && <a className="project-website text-link" href={project.website} target="_blank" rel="noopener noreferrer" aria-label={`Abrir dashboard de ${project.name}`}>Abrir dashboard <Icon name="arrow" /></a>}
    </article>
  );
}
