/**
 * The data-access boundary.
 *
 * Routes, pages and components import from here and never from `@/data/*` or
 * from Prisma directly. Each repository holds two implementations behind one
 * signature — the in-memory demo store and a Prisma query — and picks between
 * them per call based on whether DATABASE_URL points at a real database.
 *
 * That is what makes going live a configuration change rather than a rewrite:
 * see src/lib/db.ts for how the mode is decided.
 *
 * Not every domain is database-backed. The marketing content (docs, blog,
 * legal, pricing, navigation) is version-controlled copy in `@/data` and is
 * imported directly by the pages that render it; only the domains the Prisma
 * schema actually owns go through a repository.
 */
export * as licensing from "./licensing";
export * as products from "./products";
export * as support from "./support";
