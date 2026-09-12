# BuildStation

A network of builders shipping in public. Inspired by [Crafter Station](https://crafter.run/en/oss) — not a copy.

**Live:** [buildstation-ten.vercel.app](https://buildstation-ten.vercel.app)

**Stack:** Next.js 16 · Clerk · Convex · Vercel

## Local

```bash
npm install
npx convex dev
npm run convex:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Routes: `/`, `/members`, `/projects`, `/blog`, `/sign-in`.

Seed replaces the project catalog with the community’s live work (InmoNExo):

```bash
npm run convex:seed
```

## Blog

Posts are MDX files in `content/blog/`. Add a file, open a PR. See `content/blog/README.md`.

## Auth

Clerk is initialized with development keys in `.env.local`. Enable **GitHub** as a social provider in the Clerk dashboard. A Convex JWT template named `convex` already exists (`aud: convex`).

## Deploy

1. Vercel is linked to the private `BuildStation-io/buildstation` repo.
2. Env vars: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CONVEX_URL`, `CLERK_JWT_ISSUER_DOMAIN`.
3. Production Convex: `npx convex deploy` (production only).
