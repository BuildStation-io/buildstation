"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import BrandLogo from "./BrandLogo";
import JoinButton from "./JoinButton";

const links = [
  { href: "/team", label: "Equipo" },
  { href: "/projects", label: "Open source" },
  { href: "/events", label: "Encuentros" },
  { href: "/members", label: "Builders" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const open = menuPath === pathname;
  const toggleRef = useRef<HTMLButtonElement>(null);

  function close() { setMenuPath(null); }

  return (
    <header className="site-header" onKeyDown={(event) => {
      if (event.key === "Escape" && open) { close(); toggleRef.current?.focus(); }
    }}>
      <div className="site-container nav-bar">
        <Link href="/" className="brand" onClick={close} aria-label="BuildStation — Inicio">
          <BrandLogo />
        </Link>
        <nav className="desktop-nav" aria-label="Navegación principal">
          {links.map(({ href, label }) => <Link key={href} href={href} aria-current={pathname.startsWith(href) ? "page" : undefined}>{label}</Link>)}
        </nav>
        <div className="desktop-account">
          <JoinButton className="button button-small button-outline" />
          {isSignedIn && <button className="signout" onClick={() => signOut({ redirectUrl: "/" })}>Salir</button>}
        </div>
        <button ref={toggleRef} className="menu-toggle" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Cerrar menú" : "Abrir menú"} onClick={() => setMenuPath(open ? null : pathname)}>
          <span className={open ? "menu-lines is-open" : "menu-lines"}><span /><span /></span>
        </button>
      </div>
      <nav id="mobile-nav" className="mobile-nav" hidden={!open} aria-label="Navegación móvil">
        {links.map(({ href, label }) => <Link key={href} href={href} onClick={close} aria-current={pathname.startsWith(href) ? "page" : undefined}>{label}<span aria-hidden="true">↗</span></Link>)}
        <Link href="/ideas" onClick={close}>Ideas <span aria-hidden="true">↗</span></Link>
        <Link href="/blog" onClick={close}>Blog <span aria-hidden="true">↗</span></Link>
        <Link href="/build-lab" onClick={close}>Build Lab <span aria-hidden="true">↗</span></Link>
        <div onClick={close}><JoinButton />{isSignedIn && <button className="signout" onClick={() => signOut({ redirectUrl: "/" })}>Cerrar sesión</button>}</div>
      </nav>
    </header>
  );
}
