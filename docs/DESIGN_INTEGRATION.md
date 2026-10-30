# Integración del diseño local — 30/10/2026

## Base y alcance

Rama `feat/buildstation-design-refresh`, creada desde `BuildStation-io/buildstation:master` (`dc3cbed`). El diseño procede de la copia local mejorada de BuildStation. No requiere un proyecto nuevo de Vercel ni cambiar el proveedor de autenticación/datos.

- Portada, animación CSS de la marca, Quiénes somos, equipo y capturas de proyectos.
- Cinco founders; fotos de GitHub del 30/10/2026. Ausenco para Coralie, GRAPCO S.A.C. para Franklin y Draftel+ textual para GabMun.
- Navegación responsive, footer, enlaces de WhatsApp y accesibilidad del diseño local.
- Agenda con búsqueda, próximos/archivo, pase destacado y publicación/edición de estados en Convex. Los días de calendario no se convierten en horarios ficticios.
- Luma opcional, con eventos públicos y deduplicación de enlaces respecto a Convex.
- Clerk y Convex siguen siendo los proveedores. Ideas/comentarios, Blog MDX, Build Lab, directorio de builders, registro CLI y rutas SEO continúan disponibles.
- Las necesidades de contribución de los proyectos siguen visibles en un desplegable de las nuevas tarjetas.

## Activos

- `public/brand/`: marca oficial facilitada por la comunidad.
- `public/team/github-*-20261030.webp`: snapshots de los perfiles públicos Andy18acaro, Alex10114, coraliefigue11, Franklin-Rosas y gabgabogabito.
- `public/companies/grapco.png`: logo facilitado por el usuario, obtenido de `https://grapcosac.com/images/logo-light.png`.
- `public/companies/ausenco-white.png`: logo blanco de Ausenco verificado en la revisión local.
- `public/projects/inmonexo-dashboard.webp`: dashboard público real, octubre de 2026.
- `public/projects/aiconstructor-app.webp`: demo local del repositorio oficial, identificada como demo en la tarjeta.

## Publicación

1. Revisar el PR y su preview de Vercel. Las variables de Clerk y Convex existentes deben estar disponibles también en Preview.
2. Desplegar `convex/founders.ts` mediante el flujo autorizado de Convex (`npx convex deploy`) para activar los permisos de GabMun. No requiere migración de esquema ni seed.
3. Integrar el PR a `master` para que Vercel publique la nueva web.
4. Verificar con una cuenta founder que el formulario aparece en `/events`; publicar solo cuando se disponga de un evento real. Comprobar también una sesión no founder.
5. Luma sigue opcional: configurar calendario y clave únicamente si se decide conectarlo.

No se han actualizado dependencias. La revisión de seguridad de la copia Auth.js/Neon sigue en `LandingPage BuildStation/SECURITY_REVIEW.md`; sus cifras no equivalen a una auditoría de este stack Clerk/Convex. Las actualizaciones de seguridad se aplazaron por decisión del usuario.

## Validación

- `npm run build`: compilación y tipos de todas las rutas.
- `npm run lint`: sin errores; warnings previos en OpenGraph, HeroWaterMark y archivos generados de Convex.
- `node --test tests/event-integration.test.cjs`: límites de fechas, eventos sin fecha, deduplicación Luma/Convex y reconocimiento de founders.
- El acceso autenticado requiere las credenciales reales de Clerk/Convex; no se han creado usuarios ni eventos de prueba en producción.
