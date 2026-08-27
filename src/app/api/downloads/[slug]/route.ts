import { NextResponse } from "next/server";
import { getProduct } from "@/data/products";
import { installerFileName } from "@/data/downloads";
import { clientKey, fail, rateLimit, rateLimitResponse } from "@/lib/api";
import type { Architecture, InstallerType, PlatformId } from "@/types";

/**
 * GET /api/downloads/[slug]?platform=&arch=&installer=
 *
 * In production this records the download event, issues a short-lived signed
 * CDN URL for the artifact, and returns a 302 to it. Here it returns the same
 * metadata as JSON — including the checksum — so the contract is visible
 * without shipping gigabytes of binaries.
 */
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const limit = rateLimit(clientKey(request, "download"), 30, 60_000);
  if (!limit.allowed) return rateLimitResponse(limit.resetAt);

  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return fail("not_found", `No product with slug "${slug}".`, 404);

  const url = new URL(request.url);
  const platform = (url.searchParams.get("platform") ?? "windows") as PlatformId;
  const arch = (url.searchParams.get("arch") ?? "x64") as Architecture;
  const installer = (url.searchParams.get("installer") ?? "online") as InstallerType;

  const build = product.builds.find((b) => b.platform === platform);
  if (!build) {
    return fail("unsupported_platform", `${product.name} is not published for ${platform}.`, 404);
  }
  if (!build.architectures.includes(arch)) {
    return fail("unsupported_architecture", `${product.name} on ${platform} is not published for ${arch}.`, 404);
  }
  if (!build.installers.includes(installer)) {
    return fail("unsupported_installer", `The ${installer} installer is not available for ${platform}.`, 404);
  }

  const fileName = installerFileName(product.slug, product.version, platform, arch, installer);

  return NextResponse.json(
    {
      data: {
        product: { slug: product.slug, name: product.name, version: product.version },
        fileName,
        // A real deployment returns a signed, expiring CDN URL here.
        downloadUrl: `https://cdn.alonsoftware.com/releases/${product.slug}/${product.version}/${fileName}`,
        expiresIn: 900,
        sizeLabel: build.size[installer],
        sha256: build.checksum,
        minOs: build.minOs,
        platform,
        architecture: arch,
        installerType: installer,
        trial: {
          days: 30,
          creditCardRequired: false,
          activatesOnFirstLaunch: true,
          note: "The trial is recorded against your organisation on the licensing server. Reinstalling does not reset it.",
        },
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
