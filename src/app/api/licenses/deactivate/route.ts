import { z } from "zod";
import { clientKey, fail, ok, rateLimit, rateLimitResponse, readJson } from "@/lib/api";
import { getLicense, releaseActivation } from "@/lib/repositories/licensing";

const deactivateSchema = z.object({
  licenseId: z.string().min(1),
  /** The device's strict fingerprint, as returned by activation. */
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

  const license = await getLicense(licenseId);
  if (!license) return fail("not_found", `No licence matching "${licenseId}".`, 404);

  // A forced release is for a device that can no longer answer for itself, so
  // it is allowed to succeed even with no activation on record.
  const released = await releaseActivation(license.id, deviceId);
  if (!released && !force) {
    return fail("not_activated", "That device does not hold an activation on this licence.", 409);
  }

  return ok({
    data: {
      licenseId: license.id,
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
