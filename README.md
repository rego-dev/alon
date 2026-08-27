# Alon Software

A SaaS marketplace and licensing platform for a catalogue of 31 desktop business
applications — retail POS, accounting, HR and payroll, healthcare, operations
and education.

The site is three applications sharing one data layer:

| Area | Route | What it does |
| --- | --- | --- |
| Marketing site | `/` | Catalogue, pricing, downloads, docs, blog, legal |
| Customer portal | `/portal` | Licences, devices, downloads, invoices, support |
| Operations console | `/admin` | Customers, licences, trials, abuse, catalogue |

Alongside them is a licensing API (`/api/licenses/*`) that the installed desktop
clients call to activate and to heartbeat.

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000. **No database is required** — see
[Data layer](#data-layer) below.

## Data layer

The application runs in one of two modes, decided by whether `DATABASE_URL`
points at a real database:

- **demo** — reads from the in-memory store in `src/data/`. This is the default,
  and it needs no infrastructure at all.
- **prisma** — reads and writes PostgreSQL through Prisma.

Nothing outside `src/lib/repositories/` knows which mode is active. Each
repository holds both implementations behind one async signature and picks
between them per call:

```
route / page  →  src/lib/repositories/*  →  ┬→ src/data/*        (demo)
                                            └→ Prisma → Postgres (prisma)
```

`GET /api/health` reports which mode is live under `dataSource`.

The mode is decided in [`src/lib/db.ts`](src/lib/db.ts). The placeholder URL
shipped in `.env.example` is deliberately treated as unset, so copying the
template does not silently switch the app into a mode it cannot serve.

### Going live

```bash
# 1. Point DATABASE_URL at a real PostgreSQL instance in .env and .env.local
# 2. Create the schema and load the catalogue
npm run db:migrate     # prisma migrate deploy
npm run db:seed        # loads src/data/products.ts into the database
```

No route or component changes are needed; the repositories switch on their own.

Not every domain is database-backed. The marketing content — docs, blog posts,
legal policies, pricing tiers and navigation — is version-controlled copy in
`src/data/` and is imported directly by the pages that render it. Only the
domains the schema actually owns go through a repository.

The long-form product content (features, screenshots, requirements, FAQs) is
generated per product by `src/data/product-builder.ts` and is not stored either.
In prisma mode the database supplies the columns an operator edits — name,
tagline, pricing, publication state, current version — and those are merged over
the generated presentation record.

## Licensing model

The state machine in [`src/lib/licensing/state-machine.ts`](src/lib/licensing/state-machine.ts)
is the heart of the product:

```
TRIAL ──(30d)──▶ GRACE ──(7–30d)──▶ EXPIRED ──(retention)──▶ PURGED
```

A subscription taken at any point before `PURGED` restores full function with
data intact. Grace is read-only with one deliberate exception: `export` stays
enabled, so a lapsed customer can always take their data out before anything is
erased.

Policy — trial length, grace window, device limits, offline tolerance, reminder
schedule — is per-organisation and resolved in `src/lib/licensing/policy.ts`.
`src/lib/licensing/anti-abuse.ts` handles device fingerprinting, clock-rollback
detection and trial-reset detection.

Two rules the API depends on:

- **The client never decides its own state.** `/api/licenses/validate` reads the
  licence snapshot, the plan and the clock high-water mark from storage, never
  from the request body.
- **Rate limiting is generous on validate.** Locking a shop out of its till
  because a heartbeat was throttled is worse than the abuse it would prevent.

## Layout

```
prisma/
  schema.prisma        28 models, 19 enums
  migrations/          baseline migration generated from the schema
  seed.ts              loads the catalogue into a fresh database
src/
  app/
    (site)/            public marketing site
    portal/            customer self-service
    admin/             internal operations console
    api/               licensing, catalogue, webhooks
  components/          UI primitives, layout, charts, marketing sections
  data/                catalogue, docs, blog, legal, demo account
  lib/
    repositories/      the data-access boundary — see above
    licensing/         state machine, policy, anti-abuse
  types/
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (105 routes) |
| `npm run start` | Serve the build |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Apply migrations (`prisma migrate deploy`) |
| `npm run db:migrate:dev` | Create and apply a migration in development |
| `npm run db:seed` | Load the catalogue into the database |
| `npm run db:studio` | Prisma Studio |

## Environment

Copy `.env.example` to `.env` (for the Prisma CLI) and `.env.local` (for
Next.js). Every value is optional: `NEXT_PUBLIC_SITE_URL` falls back to the
canonical URL in `src/data/company.ts`, and unset integrations simply report
`not_configured` on `/api/health`.

| Group | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL. Unset or placeholder ⇒ demo mode |
| `JWT_*`, `OAUTH_*` | Session and single sign-on |
| `LICENSE_SIGNING_*` | Ed25519 keypair for signing licence payloads |
| `STRIPE_*`, `PAYPAL_*` | Payments and webhook verification |
| `S3_*` | Installer artifacts and cloud backup |
| `RESEND_*`, `TWILIO_*` | Email and SMS reminders |

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 ·
Prisma 7 on PostgreSQL · Zod · Motion · Lucide.

> **Note on Next.js 16:** the App Router APIs in this version differ from
> earlier releases. `AGENTS.md` explains where the bundled documentation lives —
> read it before changing routing, caching or data-fetching code. Cache
> Components (`use cache`) is **not** enabled, so the previous caching model
> applies.
