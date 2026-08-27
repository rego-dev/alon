import { createHash } from "node:crypto";

/**
 * Anti-abuse layer. The goal is not to make trial resetting impossible — that
 * is not achievable on hardware we do not control — but to make it expensive
 * enough that reinstalling is never the easy path, while never blocking a
 * legitimate customer who simply replaced a laptop.
 */

export interface DeviceFingerprintInput {
  /** Stable machine identifier: Windows MachineGuid, macOS IOPlatformUUID, Linux machine-id. */
  machineId: string;
  /** Primary disk serial, where the OS exposes it. */
  diskSerial?: string;
  /** First non-virtual NIC MAC address. */
  macAddress?: string;
  cpuSignature?: string;
  osName: string;
  osVersion: string;
  hostname?: string;
}

export interface Fingerprint {
  /** Strict hash — changes if any hardware component changes. */
  strict: string;
  /** Tolerant hash — survives a NIC or disk swap, used for fuzzy matching. */
  tolerant: string;
  components: number;
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function computeFingerprint(input: DeviceFingerprintInput): Fingerprint {
  const strictParts = [
    input.machineId,
    input.diskSerial ?? "",
    input.macAddress ?? "",
    input.cpuSignature ?? "",
    input.osName,
  ];
  // The tolerant hash deliberately omits swappable components.
  const tolerantParts = [input.machineId, input.cpuSignature ?? "", input.osName];

  return {
    strict: sha256(strictParts.join("|")),
    tolerant: sha256(tolerantParts.join("|")),
    components: strictParts.filter(Boolean).length,
  };
}

export type AbuseSignal =
  | "known_device_trial_replay"
  | "organisation_trial_exhausted"
  | "clock_rollback"
  | "fingerprint_collision"
  | "disposable_email_domain"
  | "activation_velocity"
  | "vm_without_verification";

export interface TrialRequest {
  organisationId: string;
  emailDomain: string;
  fingerprint: Fingerprint;
  clientClock: Date;
  serverClock: Date;
  isVirtualMachine: boolean;
  emailVerified: boolean;
}

export interface TrialHistory {
  /** Strict fingerprints that have already consumed a trial. */
  seenStrictHashes: Set<string>;
  /** Tolerant hashes seen, used for reinstall-with-new-disk detection. */
  seenTolerantHashes: Set<string>;
  /** Trials already granted to this organisation. */
  organisationTrials: number;
  /** Activation attempts from this fingerprint in the last hour. */
  recentActivations: number;
  /** Highest clock value the server has ever seen from this device. */
  highWaterClock: Date | null;
}

export interface TrialDecision {
  allowed: boolean;
  signals: AbuseSignal[];
  /** What the client is told; deliberately non-specific about detection. */
  reason: string;
  /** Requires a human to approve — a real customer with a replaced machine. */
  requiresReview: boolean;
}

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "throwawaymail.com",
  "yopmail.com",
]);

const CLOCK_SKEW_TOLERANCE_MS = 24 * 3_600_000;
const MAX_ACTIVATIONS_PER_HOUR = 5;

export function evaluateTrialRequest(
  request: TrialRequest,
  history: TrialHistory,
  options: { oneTrialPerOrganisation: boolean } = { oneTrialPerOrganisation: true },
): TrialDecision {
  const signals: AbuseSignal[] = [];

  if (history.seenStrictHashes.has(request.fingerprint.strict)) {
    signals.push("known_device_trial_replay");
  } else if (history.seenTolerantHashes.has(request.fingerprint.tolerant)) {
    // Same machine, swapped a component. Not proof of abuse on its own.
    signals.push("fingerprint_collision");
  }

  if (options.oneTrialPerOrganisation && history.organisationTrials >= 1) {
    signals.push("organisation_trial_exhausted");
  }

  const skew = request.serverClock.getTime() - request.clientClock.getTime();
  const rolledBackBelowHighWater =
    history.highWaterClock !== null && request.clientClock < history.highWaterClock;
  if (Math.abs(skew) > CLOCK_SKEW_TOLERANCE_MS || rolledBackBelowHighWater) {
    signals.push("clock_rollback");
  }

  if (DISPOSABLE_DOMAINS.has(request.emailDomain.toLowerCase())) {
    signals.push("disposable_email_domain");
  }

  if (history.recentActivations > MAX_ACTIVATIONS_PER_HOUR) {
    signals.push("activation_velocity");
  }

  if (request.isVirtualMachine && !request.emailVerified) {
    signals.push("vm_without_verification");
  }

  const hardBlocks: AbuseSignal[] = [
    "known_device_trial_replay",
    "organisation_trial_exhausted",
    "disposable_email_domain",
    "activation_velocity",
  ];
  const blocked = signals.some((s) => hardBlocks.includes(s));
  const reviewOnly = !blocked && signals.length > 0;

  return {
    allowed: !blocked,
    signals,
    requiresReview: reviewOnly,
    reason: blocked
      ? "A trial has already been issued for this device or organisation. Sign in to your existing account, or contact sales for an extension."
      : reviewOnly
        ? "Trial issued pending verification. Some features unlock once your email is confirmed."
        : "Trial granted.",
  };
}

/**
 * Clock-tamper detection for a running client. The server stores a monotonic
 * high-water mark; the client can never legitimately report a time before it.
 */
export function detectClockTampering(
  clientClock: Date,
  highWaterClock: Date | null,
  toleranceMs = 3_600_000,
): { tampered: boolean; driftMs: number } {
  if (!highWaterClock) return { tampered: false, driftMs: 0 };
  const driftMs = highWaterClock.getTime() - clientClock.getTime();
  return { tampered: driftMs > toleranceMs, driftMs };
}

/**
 * Local licence file protection. The real client seals this with a per-device
 * key from the OS keystore (DPAPI / Keychain / libsecret); the HMAC below is
 * the integrity half that detects hand-editing of the file.
 */
export function sealLicensePayload(payload: object, deviceKey: string): { body: string; mac: string } {
  const body = JSON.stringify(payload);
  const mac = createHash("sha256").update(`${deviceKey}:${body}`).digest("hex");
  return { body, mac };
}

export function verifyLicensePayload(body: string, mac: string, deviceKey: string): boolean {
  const expected = createHash("sha256").update(`${deviceKey}:${body}`).digest("hex");
  // Constant-time comparison over equal-length hex strings.
  if (expected.length !== mac.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) diff |= expected.charCodeAt(i) ^ mac.charCodeAt(i);
  return diff === 0;
}
