import { z } from "zod";
import { clientKey, fail, ok, rateLimit, rateLimitResponse, readJson } from "@/lib/api";
import { evaluateLicense } from "@/lib/licensing/state-machine";
import { detectClockTampering } from "@/lib/licensing/anti-abuse";
import { resolvePolicy } from "@/lib/licensing/policy";
import { getDeviceHighWater, getLicense, recordHeartbeat } from "@/lib/repositories/licensing";

const validateSchema = z.object({
  licenseId: z.string().min(1),
  fingerprintStrict: z.string().min(16),
  clientClock: z.iso.datetime(),
  appVersion: z.string().optional(),
  /** The client echoes what it believes so the server can correct it. */
  cachedState: z.string().optional(),
});

/**
 * POST /api/licenses/validate
 *
 * The heartbeat every installed client makes. It returns the authoritative
 * licence phase and capability map — the client never decides its own state,
 * it only caches the last signed answer for the offline tolerance window.
 *
 * Both the licence snapshot and the clock high-water mark are read from
 * storage rather than from the request body. A client that could supply its
 * own trial start date or plan would be able to grant itself an indefinite
 * trial on the highest tier.
 */
export async function POST(request: Request) {
  // Validation is deliberately generous: locking a shop out because their
  // heartbeat was rate limited would be worse than the abuse it prevents.
  const limit = rateLimit(clientKey(request, "validate"), 120, 60_000);
  if (!limit.allowed) return rateLimitResponse(limit.resetAt);

  const parsed = await readJson(request, validateSchema);
  if (parsed.response) return parsed.response;
  const input = parsed.data;

  const license = await getLicense(input.licenseId);
  if (!license) {
    return fail("not_found", `No licence matching "${input.licenseId}".`, 404);
  }

  const now = new Date();
  const clientClock = new Date(input.clientClock);
  const highWater = await getDeviceHighWater(input.fingerprintStrict);
  const tamper = detectClockTampering(clientClock, highWater);

  const policy = resolvePolicy(license.plan);

  // A device caught moving its clock backwards is treated as suspended for
  // this evaluation, without waiting for an operator to intervene.
  const snapshot = tamper.tampered
    ? { ...license.snapshot, suspendedAt: license.snapshot.suspendedAt ?? now }
    : license.snapshot;

  const evaluation = evaluateLicense(snapshot, policy, now);

  // Advances the device's high-water mark, so a rollback after this point is
  // detectable on the next heartbeat.
  if (!tamper.tampered) {
    await recordHeartbeat({
      licenseId: license.id,
      fingerprintStrict: input.fingerprintStrict,
      clientClock,
      appVersion: input.appVersion,
      now,
    });
  }

  return ok({
    data: {
      licenseId: license.id,
      state: evaluation.state,
      daysRemaining: evaluation.daysRemaining,
      capabilities: evaluation.capabilities,
      trialEndsAt: evaluation.trialEndsAt.toISOString(),
      graceEndsAt: evaluation.graceEndsAt.toISOString(),
      purgeAt: evaluation.purgeAt?.toISOString() ?? null,
      offlineLockout: evaluation.offlineLockout,
      message: evaluation.message,
      severity: evaluation.severity,
      serverClock: now.toISOString(),
      clockTampering: tamper.tampered ? { detected: true, driftMs: tamper.driftMs } : { detected: false },
      // The client caches this and re-checks after `revalidateAfter` seconds.
      revalidateAfter: evaluation.state === "trial" || evaluation.state === "grace" ? 3_600 : 21_600,
      offlineToleranceDays: policy.offlineToleranceDays,
    },
  });
}
