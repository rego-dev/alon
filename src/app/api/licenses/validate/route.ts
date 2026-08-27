import { z } from "zod";
import { clientKey, ok, rateLimit, rateLimitResponse, readJson } from "@/lib/api";
import { evaluateLicense, type LicenseSnapshot } from "@/lib/licensing/state-machine";
import { detectClockTampering } from "@/lib/licensing/anti-abuse";
import { resolvePolicy } from "@/lib/licensing/policy";

const validateSchema = z.object({
  licenseId: z.string().min(1),
  fingerprintStrict: z.string().min(16),
  clientClock: z.iso.datetime(),
  appVersion: z.string().optional(),
  /** The client echoes what it believes so the server can correct it. */
  cachedState: z.string().optional(),
  /** Present only in this demo build — production reads these from the DB. */
  snapshot: z
    .object({
      trialStartedAt: z.iso.datetime(),
      subscriptionEndsAt: z.iso.datetime().nullable().default(null),
      extensionDays: z.number().int().min(0).default(0),
      lastValidatedAt: z.iso.datetime().nullable().default(null),
      highWaterClock: z.iso.datetime().nullable().default(null),
    })
    .optional(),
  plan: z.enum(["starter", "business", "enterprise"]).nullable().default(null),
});

/**
 * POST /api/licenses/validate
 *
 * The heartbeat every installed client makes. It returns the authoritative
 * licence phase and capability map — the client never decides its own state,
 * it only caches the last signed answer for the offline tolerance window.
 */
export async function POST(request: Request) {
  // Validation is deliberately generous: locking a shop out because their
  // heartbeat was rate limited would be worse than the abuse it prevents.
  const limit = rateLimit(clientKey(request, "validate"), 120, 60_000);
  if (!limit.allowed) return rateLimitResponse(limit.resetAt);

  const parsed = await readJson(request, validateSchema);
  if (parsed.response) return parsed.response;
  const input = parsed.data;

  const now = new Date();
  const clientClock = new Date(input.clientClock);
  const highWater = input.snapshot?.highWaterClock ? new Date(input.snapshot.highWaterClock) : null;
  const tamper = detectClockTampering(clientClock, highWater);

  const policy = resolvePolicy(input.plan);

  const snapshot: LicenseSnapshot = input.snapshot
    ? {
        trialStartedAt: new Date(input.snapshot.trialStartedAt),
        subscriptionEndsAt: input.snapshot.subscriptionEndsAt ? new Date(input.snapshot.subscriptionEndsAt) : null,
        extensionDays: input.snapshot.extensionDays,
        lastValidatedAt: input.snapshot.lastValidatedAt ? new Date(input.snapshot.lastValidatedAt) : now,
        suspendedAt: tamper.tampered ? now : null,
      }
    : { trialStartedAt: now, subscriptionEndsAt: null, lastValidatedAt: now };

  const evaluation = evaluateLicense(snapshot, policy, now);

  return ok({
    data: {
      licenseId: input.licenseId,
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
