import { dbMode } from "@/lib/db";

/**
 * Picks between the demo store and the Prisma implementation of a repository.
 *
 * Both backends are imported by every repository module, but only the selected
 * one is ever called — and src/lib/prisma.ts creates its client lazily, so the
 * demo path never opens a connection pool.
 *
 * The choice is made per call rather than once at module load. Repositories are
 * imported during the build, when DATABASE_URL may differ from the runtime
 * environment, and a module-level constant would freeze the build-time answer.
 */
export function pick<T>(demo: T, prisma: T): T {
  return dbMode() === "prisma" ? prisma : demo;
}
