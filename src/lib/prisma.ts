import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Prisma 7 requires a driver adapter — the connection URL no longer lives in
 * the schema, so it is supplied here rather than by the datasource block.
 *
 * The client is created lazily. Importing this module must stay free of side
 * effects because the repositories import both backends and pick one at call
 * time; in demo mode the Prisma branch is never reached and no pool is opened.
 *
 * Next.js reloads server modules on every edit in development, which would
 * open a new pool each time. Caching on globalThis keeps one across reloads.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set, so the Prisma client cannot be created. The " +
        "repositories fall back to the demo store when it is absent — reaching " +
        "this point means a Prisma-backed path was called directly. See src/lib/db.ts.",
    );
  }

  const client = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  globalForPrisma.prisma = client;
  return client;
}
