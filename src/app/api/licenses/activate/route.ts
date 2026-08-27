import { clientKey, created, fail, rateLimit, rateLimitResponse, readJson } from "@/lib/api";
import { trialActivationSchema } from "@/lib/validation";
import { getProduct } from "@/data/products";
import { computeFingerprint, evaluateTrialRequest, type TrialHistory } from "@/lib/licensing/anti-abuse";
import { evaluateLicense, reminderSchedule } from "@/lib/licensing/state-machine";
import { resolvePolicy } from "@/lib/licensing/policy";

/**
 * POST /api/licenses/activate
 *
 * Registers a device against an organisation and issues (or resumes) a licence.
 * The response is the same shape the desktop client consumes, including the
 * capability map it uses to gate features and the phase boundaries it counts
 * down against.
 */
export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "activate"), 20, 60_000);
  if (!limit.allowed) return rateLimitResponse(limit.resetAt);

  const parsed = await readJson(request, trialActivationSchema);
  if (parsed.response) return parsed.response;
  const input = parsed.data;

  const product = getProduct(input.productSlug);
  if (!product) return fail("not_found", `No product with slug "${input.productSlug}".`, 404);

  const fingerprint = computeFingerprint({
    machineId: input.device.machineId,
    diskSerial: input.device.diskSerial,
    macAddress: input.device.macAddress,
    cpuSignature: input.device.cpuSignature,
    osName: input.device.osName,
    osVersion: input.device.osVersion,
    hostname: input.device.hostname,
  });

  // In production these come from the database. The empty history here means a
  // first-time activation, which is the path worth showing.
  const history: TrialHistory = {
    seenStrictHashes: new Set(),
    seenTolerantHashes: new Set(),
    organisationTrials: 0,
    recentActivations: 0,
    highWaterClock: null,
  };

  const serverClock = new Date();
  const decision = evaluateTrialRequest(
    {
      organisationId: input.organisationId,
      emailDomain: input.emailDomain,
      fingerprint,
      clientClock: new Date(input.clientClock),
      serverClock,
      isVirtualMachine: input.isVirtualMachine,
      emailVerified: input.emailVerified,
    },
    history,
    { oneTrialPerOrganisation: true },
  );

  if (!decision.allowed) {
    return fail("trial_unavailable", decision.reason, 409, {
      signals: decision.signals.join(","),
    });
  }

  const policy = resolvePolicy(null);
  const snapshot = {
    trialStartedAt: serverClock,
    subscriptionEndsAt: null,
    lastValidatedAt: serverClock,
  };
  const evaluation = evaluateLicense(snapshot, policy, serverClock);
  const reminders = reminderSchedule(evaluation.trialEndsAt, policy);

  return created({
    data: {
      licenseId: `lic_${fingerprint.strict.slice(0, 8)}`,
      organisationId: input.organisationId,
      productSlug: product.slug,
      state: evaluation.state,
      daysRemaining: evaluation.daysRemaining,
      trialEndsAt: evaluation.trialEndsAt.toISOString(),
      graceEndsAt: evaluation.graceEndsAt.toISOString(),
      purgeAt: evaluation.purgeAt?.toISOString() ?? null,
      capabilities: evaluation.capabilities,
      message: evaluation.message,
      severity: evaluation.severity,
      policy: {
        trialDays: policy.trialDays,
        graceDays: policy.graceDays,
        dataRetentionDays: policy.dataRetentionDays,
        offlineToleranceDays: policy.offlineToleranceDays,
        deviceLimit: policy.deviceLimit,
      },
      device: {
        fingerprintStrict: fingerprint.strict,
        fingerprintTolerant: fingerprint.tolerant,
        components: fingerprint.components,
      },
      reminders: reminders.map((r) => ({ label: r.label, sendAt: r.sendAt.toISOString(), subject: r.subject })),
      review: decision.requiresReview ? { required: true, reason: decision.reason } : { required: false },
    },
  });
}
