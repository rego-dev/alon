/**
 * Database access point.
 *
 * The Prisma schema in prisma/schema.prisma is the production data layer. It is
 * not wired up in this build because there is no PostgreSQL instance to connect
 * to — every route below reads from the in-memory demo store instead, behind the
 * same function signatures the Prisma implementation would expose.
 *
 * To go live:
 *   1. Set DATABASE_URL in .env
 *   2. npx prisma migrate deploy && npx prisma generate
 *   3. Replace the demo-store calls in src/lib/repositories.ts with Prisma calls
 *
 * Keeping the swap behind repositories.ts means routes and UI never change.
 */

export const databaseConfigured = Boolean(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost:5432/alon"));

export type DbMode = "prisma" | "demo";

export function dbMode(): DbMode {
  return databaseConfigured ? "prisma" : "demo";
}
