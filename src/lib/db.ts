/**
 * Chooses which backend the repositories talk to.
 *
 * The Prisma schema in prisma/schema.prisma is the production data layer. When
 * DATABASE_URL points at a real database the repositories in
 * src/lib/repositories/ issue Prisma queries; otherwise they serve the
 * in-memory demo store behind the same signatures, so the site runs with no
 * infrastructure at all.
 *
 * To go live:
 *   1. Set DATABASE_URL in .env and .env.local
 *   2. npx prisma migrate deploy && npx prisma generate
 *   3. npm run db:seed   (loads the catalogue from src/data/products.ts)
 *
 * No route or component changes: they already call the repositories, which
 * switch backends on their own.
 */

/**
 * The placeholder in .env.example is a real-looking URL, so its mere presence
 * cannot mean "configured" — it is treated as unset.
 */
const PLACEHOLDER_URL = "postgresql://alon:alon@localhost:5432/alon?schema=public";

/**
 * Read as a function rather than captured in a module constant: repositories
 * are imported during the build, where DATABASE_URL can differ from the
 * runtime environment, and a constant would freeze the build-time answer.
 */
export function databaseConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  return Boolean(url && url !== PLACEHOLDER_URL);
}

export type DbMode = "prisma" | "demo";

export function dbMode(): DbMode {
  return databaseConfigured() ? "prisma" : "demo";
}
