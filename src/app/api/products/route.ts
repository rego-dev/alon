import { NextResponse } from "next/server";
import { listProducts } from "@/lib/repositories/products";
import type { CategorySlug } from "@/types";

/** GET /api/products — public catalogue listing with optional filters. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") as CategorySlug | null;
  const platform = url.searchParams.get("platform");
  const query = url.searchParams.get("q")?.toLowerCase();
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 50), 100);

  const results = (await listProducts({ category, platform, query, limit }))
    .map((product) => ({
      slug: product.slug,
      name: product.name,
      category: product.category,
      tagline: product.tagline,
      version: product.version,
      releaseDate: product.releaseDate,
      platforms: product.platforms,
      priceFrom: product.priceFrom,
      rating: product.rating,
      reviewCount: product.reviewCount,
      trialDays: 30,
    }));

  return NextResponse.json(
    { data: results, meta: { total: results.length, trialDays: 30 } },
    { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" } },
  );
}
