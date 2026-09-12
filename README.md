# BuildStation

A network of builders shipping in public. Open-source portfolio inspired by [Crafter Station](https://crafter.run/en/oss) — not a copy.

**Stack:** Next.js 16 · Clerk (GitHub login) · Convex · Vercel

## Local

```bash
npm install
npx convex dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Routes: `/`, `/oss`, `/sign-in`.

Seed curated repos + live GitHub stats:

```bash
npm run convex:seed
```

## Auth

Clerk is initialized with development keys in `.env.local`. Claim the app later:

```bash
npx clerk@latest auth login
```

Then enable **GitHub** as a social provider in the Clerk dashboard. A Convex JWT template named `convex` is already created (`aud: convex`).

## Deploy

1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. Set env vars: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CONVEX_URL`, `CLERK_JWT_ISSUER_DOMAIN`.
4. Production Convex: `npx convex deploy` (production only).
