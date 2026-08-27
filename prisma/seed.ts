// Loads .env the same way prisma.config.ts does, so the script behaves the
// same whether it is run through `prisma db seed` or directly with tsx.
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { products } from "../src/data/products";
import type { CategorySlug } from "../src/types";

/**
 * Loads the catalogue into a fresh database.
 *
 * src/data/products.ts stays the source of truth for the catalogue: it holds
 * the long-form marketing content the schema deliberately does not model
 * (features, screenshots, requirements, FAQs). This script writes the columns
 * an operator later edits — name, tagline, pricing, publication state — and
 * the release history, which is what the download and updates pages read.
 *
 * Safe to re-run: every write is an upsert keyed on the product slug.
 */

const CATEGORY_TO_DB: Record<CategorySlug, string> = {
  retail: "RETAIL",
  accounting: "ACCOUNTING",
  "human-resources": "HUMAN_RESOURCES",
  healthcare: "HEALTHCARE",
  "business-operations": "BUSINESS_OPERATIONS",
  education: "EDUCATION",
};

function connect(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set — nothing to seed. Set it in .env first.");
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

async function main() {
  const prisma = connect();
  let productCount = 0;
  let versionCount = 0;

  try {
    for (const product of products) {
      const fields = {
        name: product.name,
        category: CATEGORY_TO_DB[product.category] as never,
        tagline: product.tagline,
        overview: product.overview,
        icon: product.icon,
        priceFrom: product.priceFrom,
        published: true,
      };

      const row = await prisma.product.upsert({
        where: { slug: product.slug },
        create: { slug: product.slug, ...fields },
        update: fields,
        select: { id: true },
      });
      productCount += 1;

      // The first release note is the current version; the rest are history.
      for (const [index, release] of product.releases.entries()) {
        const version = {
          channel: (release.channel === "beta" ? "BETA" : "STABLE") as never,
          releasedAt: new Date(release.date),
          highlights: release.highlights,
          fixes: release.fixes,
          isCurrent: index === 0,
        };

        await prisma.productVersion.upsert({
          where: { productId_version: { productId: row.id, version: release.version } },
          create: { productId: row.id, version: release.version, ...version },
          update: version,
        });
        versionCount += 1;
      }
    }

    console.log(`Seeded ${productCount} products and ${versionCount} versions.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
