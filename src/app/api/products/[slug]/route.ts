import { NextResponse } from "next/server";
import { getProduct } from "@/data/products";
import { fail } from "@/lib/api";

/** GET /api/products/[slug] — full product record. */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return fail("not_found", `No product with slug "${slug}".`, 404);
  }

  return NextResponse.json(
    { data: product },
    { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" } },
  );
}
