# BuildStation

IA aplicada a construcción, minería, energía y real estate. Desde Lima, construyendo para LatAm.

**Live:** [buildstation-ten.vercel.app](https://buildstation-ten.vercel.app)

**Stack:** Next.js 16 · Clerk · Convex · Vercel

## Local

```bash
npm ci
cp .env.example .env.local
npx convex dev
npm run dev
```

Configura las claves de desarrollo de Clerk y la URL de Convex en `.env.local`. En PowerShell usa `Copy-Item .env.example .env.local`.

Open [http://localhost:3000](http://localhost:3000). Routes: `/`, `/team`, `/members`, `/projects`, `/events`, `/ideas`, `/blog`, `/build-lab`, `/sign-in`, `/cli`.

Login counts as **people in the network**. A **Builder** card (photo, GitHub, bio) is created after `curl -sL https://buildstation-ten.vercel.app/cli | sh` and GitHub sign-in. Founders on `/team` are static.

```bash
npm run convex:backfill-builders
```

That one-shot marks existing members who already have a GitHub username.

El catálogo editorial de `lib/projects.ts` incluye InmoNExo y AIConstructor con capturas reales. Se combina con los proyectos adicionales de Convex. El seed es una operación opcional que reemplaza el catálogo de la base de datos; no hace falta ejecutarlo para desplegar el rediseño:

```bash
npm run convex:seed
```

## Blog

Posts are MDX files in `content/blog/`. Add a file, open a PR. See `content/blog/README.md`.

## Publicar eventos

1. Inicia sesión con GitHub en `/sign-in` y abre `/events`.
2. Los founders verán **Publicar un encuentro · Founders**.
3. Completa título, lugar, descripción y estado. Los confirmados requieren día; puedes añadir un enlace de detalles o inscripción en Luma.
4. Pulsa **Publicar encuentro**. Convex actualiza la agenda sin PR ni redeploy. También puedes cambiar el estado desde la tarjeta.

La autorización se verifica en `convex/events.ts`; `convex/founders.ts` incluye los cinco founders, incluido `gabgabogabito`. Ese cambio necesita despliegue de Convex. Las fechas del formulario son días de calendario, sin hora; la web no las presenta como citas a medianoche.

También puedes añadir eventos mediante PR a `SEED_EVENTS` en `lib/events.ts`, con los campos del tipo `NetworkEvent`. Esos eventos se editan por PR. El catálogo se combina con Convex y se mantiene disponible sin conexión a la base de datos.

La agenda permite buscar por nombre/lugar y filtrar próximos o archivo. Las inscripciones se gestionan en el enlace externo del evento; no hay una lista local de RSVP.

### Luma opcional

Configura `LUMA_CALENDAR_URL` y, para el embed, `LUMA_CALENDAR_ID` (`cal-…`). Con `LUMA_API_KEY` del calendario, los eventos públicos se incorporan al feed con caché de cinco minutos. Los enlaces repetidos entre Convex y Luma aparecen una vez, priorizando el registro editable de Convex. Las direcciones privadas y enlaces de reunión no se publican. Sin configuración, se muestra el estado «Próximamente».

## Diseño y equipo

Portada grafito/azul, marca oficial, animación CSS, sección Quiénes somos y capturas de proyectos. Cinco founders en `lib/team.ts`; fotos locales de GitHub actualizadas el 30/10/2026 (no sincronización automática). Coralie: Ausenco; Franklin: GRAPCO S.A.C.; GabMun: Draftel+ (nombre textual hasta disponer del logo).

Clerk, Convex, Ideas, Blog, Build Lab y el registro CLI se conservan. Ver `docs/DESIGN_INTEGRATION.md` para alcance, validación y despliegue.

## Auth

Enable **GitHub** as a social provider in the Clerk dashboard. Configure a Convex JWT template named `convex` (`aud: convex`), including the GitHub username claims used by `convex/lib/githubIdentity.ts` for founder access. Credentials are environment-specific and are not included in the repository.

## Deploy

1. Vercel is linked to the public `BuildStation-io/buildstation` repo, branch `master`.
2. Env vars: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CONVEX_URL`, `CLERK_JWT_ISSUER_DOMAIN`.
3. Production Convex: `npx convex deploy` (production only).
