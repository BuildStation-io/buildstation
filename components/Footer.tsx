import Link from "next/link";
import BrandLogo from "./BrandLogo";
import Icon from "./Icon";
import { getLumaConfig } from "@/lib/luma";

export default function Footer() {
  const { calendarUrl } = getLumaConfig();
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-main">
          <div>
            <Link href="/" className="brand"><BrandLogo /></Link>
            <p>IA para transformar la infraestructura.<br />Desde Lima, construyendo para LatAm.</p>
          </div>
          <div className="footer-links">
            <div><p className="eyebrow">EXPLORA</p><Link href="/#nosotros">Quiénes somos</Link><Link href="/team">Equipo</Link><Link href="/projects">Open source</Link><Link href="/events">Encuentros</Link><Link href="/members">Builders</Link><Link href="/ideas">Ideas</Link><Link href="/blog">Blog</Link><Link href="/build-lab">Build Lab</Link></div>
            <div><p className="eyebrow">NOS ENCONTRAMOS</p>{calendarUrl ? <a href={calendarUrl} target="_blank" rel="noopener noreferrer">Luma <Icon name="arrow" /></a> : <Link href="/events">Nuestra agenda <Icon name="arrow" /></Link>}<Link href="/projects">Encuentra dónde contribuir <Icon name="arrow" /></Link></div>
          </div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} BuildStation</span><span className="eyebrow">CONSTRUIDO EN PÚBLICO <span className="status-dot" /></span><a href="#site-content">Volver arriba ↑</a></div>
      </div>
    </footer>
  );
}
