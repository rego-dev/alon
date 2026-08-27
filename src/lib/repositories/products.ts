import {
  featuredProducts as demoFeatured,
  getProduct as demoGetProduct,
  products as demoProducts,
  productsByCategory as demoByCategory,
  relatedProducts as demoRelated,
} from "@/data/products";
import { toSummary, type ProductSummary } from "@/data/product-summary";
import { getPrisma } from "@/lib/prisma";
import type { CategorySlug, PlatformId, Product } from "@/types";
import { pick } from "./backend";

export interface ProductFilter {
  category?: CategorySlug | null;
  platform?: PlatformId | string | null;
  query?: string | null;
  limit?: number;
}

/** Applies the public catalogue filters. Shared by both backends. */
function applyFilter(list: Product[], filter: ProductFilter): Product[] {
  const query = filter.query?.toLowerCase().trim();
  const filtered = list.filter((product) => {
    if (filter.category && product.category !== filter.category) return false;
    if (filter.platform && !product.platforms.includes(filter.platform as PlatformId)) return false;
    if (query && !`${product.name} ${product.tagline} ${product.overview}`.toLowerCase().includes(query)) return false;
    return true;
  });
  return typeof filter.limit === "number" ? filtered.slice(0, filter.limit) : filtered;
}

/* --------------------------------------------------------------------------
   Prisma backend

   The Product table holds the fields an operator edits — name, tagline,
   pricing, publication state — while the long-form marketing content
   (features, screenshots, requirements, FAQs) is generated per product by
   src/data/product-builder.ts and is not stored. So a Prisma read merges the
   database's canonical columns over the generated presentation record, and a
   product absent from the table is treated as absent from the catalogue.
   -------------------------------------------------------------------------- */

const CATEGORY_TO_DB: Record<CategorySlug, string> = {
  retail: "RETAIL",
  accounting: "ACCOUNTING",
  "human-resources": "HUMAN_RESOURCES",
  healthcare: "HEALTHCARE",
  "business-operations": "BUSINESS_OPERATIONS",
  education: "EDUCATION",
};

const DB_TO_CATEGORY = Object.fromEntries(
  Object.entries(CATEGORY_TO_DB).map(([slug, db]) => [db, slug as CategorySlug]),
) as Record<string, CategorySlug>;

type ProductRow = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  overview: string;
  icon: string;
  priceFrom: number;
  versions: Array<{ version: string; releasedAt: Date }>;
};

/** Merges a database row over the generated presentation record for that slug. */
function mergeRow(row: ProductRow): Product | null {
  const generated = demoGetProduct(row.slug);
  if (!generated) return null;
  const current = row.versions[0];
  return {
    ...generated,
    slug: row.slug,
    name: row.name,
    category: DB_TO_CATEGORY[row.category] ?? generated.category,
    tagline: row.tagline,
    overview: row.overview,
    icon: row.icon,
    priceFrom: row.priceFrom,
    version: current?.version ?? generated.version,
    releaseDate: current ? current.releasedAt.toISOString().slice(0, 10) : generated.releaseDate,
  };
}

const PRODUCT_SELECT = {
  slug: true,
  name: true,
  category: true,
  tagline: true,
  overview: true,
  icon: true,
  priceFrom: true,
  versions: {
    where: { isCurrent: true },
    select: { version: true, releasedAt: true },
    take: 1,
  },
} as const;

async function prismaAll(): Promise<Product[]> {
  const rows = await getPrisma().product.findMany({
    where: { published: true },
    select: PRODUCT_SELECT,
    orderBy: { name: "asc" },
  });
  return rows.map(mergeRow).filter((p): p is Product => p !== null);
}

/* --------------------------------------------------------------------------
   Public repository API
   -------------------------------------------------------------------------- */

export async function listProducts(filter: ProductFilter = {}): Promise<Product[]> {
  const all = await pick(async () => demoProducts, prismaAll)();
  return applyFilter(all, filter);
}

export async function getProduct(slug: string): Promise<Product | null> {
  return pick(
    async () => demoGetProduct(slug) ?? null,
    async () => {
      const row = await getPrisma().product.findFirst({
        where: { slug, published: true },
        select: PRODUCT_SELECT,
      });
      return row ? mergeRow(row) : null;
    },
  )();
}

export async function listProductSlugs(): Promise<string[]> {
  return pick(
    async () => demoProducts.map((p) => p.slug),
    async () => {
      const rows = await getPrisma().product.findMany({
        where: { published: true },
        select: { slug: true },
      });
      return rows.map((r) => r.slug);
    },
  )();
}

export async function listProductsByCategory(category: CategorySlug): Promise<Product[]> {
  return pick(
    async () => demoByCategory(category),
    async () => {
      const rows = await getPrisma().product.findMany({
        where: { published: true, category: CATEGORY_TO_DB[category] as never },
        select: PRODUCT_SELECT,
        orderBy: { name: "asc" },
      });
      return rows.map(mergeRow).filter((p): p is Product => p !== null);
    },
  )();
}

export async function listFeaturedProducts(limit = 6): Promise<Product[]> {
  return pick(
    async () => demoFeatured.slice(0, limit),
    async () => (await prismaAll()).filter((p) => p.badge === "popular").slice(0, limit),
  )();
}

/**
 * Card-sized projections of the catalogue.
 *
 * Client components receive these rather than full products, so reviews,
 * release notes and requirements never cross the serialisation boundary.
 */
export async function listProductSummaries(filter: ProductFilter = {}): Promise<ProductSummary[]> {
  return (await listProducts(filter)).map(toSummary);
}

export async function listRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
  return pick(
    async () => demoRelated(product, limit),
    async () =>
      (await listProductsByCategory(product.category)).filter((p) => p.slug !== product.slug).slice(0, limit),
  )();
}
