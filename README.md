# BuildStation

AI to improve infrastructure projects. Inspired by [Crafter Station](https://crafter.run/en/oss).

**Live:** [buildstation-ten.vercel.app](https://buildstation-ten.vercel.app)

**Stack:** Next.js 16 · Clerk · Convex · Vercel

## Local

```bash
npm install
npx convex dev
npm run convex:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Routes: `/`, `/team`, `/members`, `/projects`, `/blog`, `/build-lab`, `/sign-in`, `/cli`.

Login counts as **people in the network**. A **Builder** card (photo, GitHub, bio) is created after `curl -sL https://buildstation-ten.vercel.app/cli | sh` and GitHub sign-in. Founders on `/team` are static.

```bash
npm run convex:backfill-builders
```

That one-shot marks existing members who already have a GitHub username.

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
