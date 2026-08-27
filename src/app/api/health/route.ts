import { NextResponse } from "next/server";
import { dbMode } from "@/lib/db";
import { products } from "@/data/products";

/** GET /api/health — liveness and configuration probe. */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      time: new Date().toISOString(),
      version: process.env.npm_package_version ?? "0.1.0",
      dataSource: dbMode(),
      catalogue: { products: products.length },
      services: {
        licensing: "ok",
        payments: process.env.STRIPE_SECRET_KEY ? "configured" : "not_configured",
        storage: process.env.S3_BUCKET_ARTIFACTS ? "configured" : "not_configured",
        email: process.env.RESEND_API_KEY ? "configured" : "not_configured",
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
