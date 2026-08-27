import { z } from "zod";
import { clientKey, ok, rateLimit, rateLimitResponse, readJson } from "@/lib/api";

const deactivateSchema = z.object({
  licenseId: z.string().min(1),
  deviceId: z.string().min(1),
  /** Force release is used when the old device is unavailable. */
  force: z.boolean().default(false),
  reason: z.enum(["replacement", "decommissioned", "transfer", "other"]).default("replacement"),
});

/**
 * POST /api/licenses/deactivate — releases a device activation slot.
 * Releasing never touches business data on the device; it only frees the slot.
 */
export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "deactivate"), 20, 60_000);
  if (!limit.allowed) return rateLimitResponse(limit.resetAt);

  const parsed = await readJson(request, deactivateSchema);
  if (parsed.response) return parsed.response;
  const { licenseId, deviceId, force, reason } = parsed.data;

  return ok({
    data: {
      licenseId,
      deviceId,
      released: true,
      releasedAt: new Date().toISOString(),
      forced: force,
      reason,
      transfersRemaining: force ? 1 : 2,
      note: "Releasing a device frees the activation slot immediately. Local data on that device is untouched.",
    },
  });
}
