import { demoLicenses, demoDevices } from "@/data/demo-account";
import type { Fingerprint, TrialHistory } from "@/lib/licensing/anti-abuse";
import type { LicenseSnapshot, LicenseState } from "@/lib/licensing/state-machine";
import { getPrisma } from "@/lib/prisma";
import { pick } from "./backend";

/** A licence as the licensing endpoints need it, independent of either backend. */
export interface LicenseRecord {
  id: string;
  key: string;
  organisationId: string;
  productSlug: string;
  state: LicenseState;
  plan: "starter" | "business" | "enterprise" | null;
  deviceLimit: number;
  snapshot: LicenseSnapshot;
}

const DB_TO_STATE: Record<string, LicenseState> = {
  TRIAL: "trial",
  ACTIVE: "active",
  GRACE: "grace",
  EXPIRED: "expired",
  PURGED: "purged",
  SUSPENDED: "suspended",
};

const DB_TO_PLAN: Record<string, "starter" | "business" | "enterprise"> = {
  STARTER: "starter",
  BUSINESS: "business",
  ENTERPRISE: "enterprise",
};

const HOUR_MS = 3_600_000;

/* --------------------------------------------------------------------------
   Demo backend

   The demo licences carry only what the portal renders, so the fields the
   state machine needs are reconstructed from them. This is the reason the
   endpoints previously accepted a client-supplied snapshot; going through the
   repository means they no longer have to.
   -------------------------------------------------------------------------- */

function demoRecord(license: (typeof demoLicenses)[number]): LicenseRecord {
  return {
    id: license.id,
    key: license.key,
    organisationId: "org_demo",
    productSlug: license.productSlug,
    state: license.state,
    plan: license.plan,
    deviceLimit: license.deviceLimit,
    snapshot: {
      trialStartedAt: new Date(license.trialStartedAt),
      subscriptionEndsAt: license.subscriptionEndsAt ? new Date(license.subscriptionEndsAt) : null,
      extensionDays: 0,
      suspendedAt: null,
      lastValidatedAt: null,
    },
  };
}

/* --------------------------------------------------------------------------
   Public repository API
   -------------------------------------------------------------------------- */

/**
 * Loads the authoritative licence state by id or key.
 *
 * The licensing endpoints must read the snapshot from here rather than from
 * the request body — a client that supplies its own trial start date can grant
 * itself an unlimited trial.
 */
export async function getLicense(idOrKey: string): Promise<LicenseRecord | null> {
  return pick(
    async () => {
      const found = demoLicenses.find((l) => l.id === idOrKey || l.key === idOrKey);
      return found ? demoRecord(found) : null;
    },
    async () => {
      const row = await getPrisma().license.findFirst({
        where: { OR: [{ id: idOrKey }, { key: idOrKey }] },
        select: {
          id: true,
          key: true,
          organisationId: true,
          state: true,
          plan: true,
          deviceLimit: true,
          trialStartedAt: true,
          subscriptionEndsAt: true,
          extensionDays: true,
          suspendedAt: true,
          lastValidatedAt: true,
          purgedAt: true,
          product: { select: { slug: true } },
        },
      });
      if (!row) return null;
      return {
        id: row.id,
        key: row.key,
        organisationId: row.organisationId,
        productSlug: row.product.slug,
        state: DB_TO_STATE[row.state] ?? "trial",
        plan: row.plan ? (DB_TO_PLAN[row.plan] ?? null) : null,
        deviceLimit: row.deviceLimit,
        snapshot: {
          trialStartedAt: row.trialStartedAt,
          subscriptionEndsAt: row.subscriptionEndsAt,
          extensionDays: row.extensionDays,
          suspendedAt: row.suspendedAt,
          lastValidatedAt: row.lastValidatedAt,
          purgedAt: row.purgedAt,
        },
      } satisfies LicenseRecord;
    },
  )();
}

/**
 * Assembles the abuse history for an activation request.
 *
 * In demo mode the history is empty, which is the first-time activation path.
 * Under Prisma it is the four counts the abuse rules actually depend on.
 */
export async function getTrialHistory(
  organisationId: string,
  fingerprint: Fingerprint,
  now: Date = new Date(),
): Promise<TrialHistory> {
  return pick(
    async (): Promise<TrialHistory> => ({
      seenStrictHashes: new Set<string>(),
      seenTolerantHashes: new Set<string>(),
      organisationTrials: 0,
      recentActivations: 0,
      highWaterClock: null,
    }),
    async (): Promise<TrialHistory> => {
      const db = getPrisma();
      const [strictDevice, tolerantDevices, organisationTrials, recentActivations] = await Promise.all([
        db.device.findFirst({
          where: { fingerprintStrict: fingerprint.strict },
          select: { id: true, clockHighWater: true },
        }),
        db.device.findMany({
          where: { fingerprintTolerant: fingerprint.tolerant },
          select: { fingerprintTolerant: true },
        }),
        db.license.count({ where: { organisationId } }),
        db.activation.count({
          where: {
            activatedAt: { gte: new Date(now.getTime() - HOUR_MS) },
            device: { fingerprintStrict: fingerprint.strict },
          },
        }),
      ]);

      return {
        seenStrictHashes: new Set(strictDevice ? [fingerprint.strict] : []),
        seenTolerantHashes: new Set(tolerantDevices.map((d) => d.fingerprintTolerant)),
        organisationTrials,
        recentActivations,
        highWaterClock: strictDevice?.clockHighWater ?? null,
      };
    },
  )();
}

/**
 * The highest client clock the server has ever accepted from a device.
 *
 * Clock-rollback detection is only meaningful against a value the client
 * cannot choose, so this must come from storage rather than the request.
 */
export async function getDeviceHighWater(fingerprintStrict: string): Promise<Date | null> {
  return pick(
    async () => null,
    async () => {
      const device = await getPrisma().device.findFirst({
        where: { fingerprintStrict },
        select: { clockHighWater: true },
      });
      return device?.clockHighWater ?? null;
    },
  )();
}

/** Devices currently holding an activation against a licence. */
export async function countActiveDevices(licenseId: string): Promise<number> {
  return pick(
    async () => demoDevices.filter((d) => d.licenseKey === licenseId).length,
    async () => getPrisma().activation.count({ where: { licenseId, deactivatedAt: null } }),
  )();
}

/**
 * Records a successful heartbeat and advances the device's monotonic clock
 * high-water mark, which is what makes rollback detectable at all.
 */
export async function recordHeartbeat(input: {
  licenseId: string;
  fingerprintStrict: string;
  clientClock: Date;
  appVersion?: string;
  now?: Date;
}): Promise<void> {
  const now = input.now ?? new Date();
  await pick(
    async () => {
      /* The demo store is immutable; heartbeats are not persisted. */
    },
    async () => {
      const db = getPrisma();
      const device = await db.device.findFirst({
        where: { fingerprintStrict: input.fingerprintStrict },
        select: { id: true, clockHighWater: true },
      });
      if (!device) return;

      await db.$transaction([
        db.device.update({
          where: { id: device.id },
          data: {
            lastSeenAt: now,
            // Never move the high-water mark backwards.
            ...(device.clockHighWater && device.clockHighWater >= input.clientClock
              ? {}
              : { clockHighWater: input.clientClock }),
          },
        }),
        db.activation.updateMany({
          where: { licenseId: input.licenseId, deviceId: device.id, deactivatedAt: null },
          data: { lastHeartbeat: now, ...(input.appVersion ? { appVersion: input.appVersion } : {}) },
        }),
        db.license.update({ where: { id: input.licenseId }, data: { lastValidatedAt: now } }),
      ]);
    },
  )();
}

/** Releases a device's activation so the seat can be reused. */
export async function releaseActivation(licenseId: string, fingerprintStrict: string): Promise<boolean> {
  return pick(
    async () => true,
    async () => {
      const db = getPrisma();
      const device = await db.device.findFirst({
        where: { fingerprintStrict },
        select: { id: true },
      });
      if (!device) return false;
      const result = await db.activation.updateMany({
        where: { licenseId, deviceId: device.id, deactivatedAt: null },
        data: { deactivatedAt: new Date() },
      });
      return result.count > 0;
    },
  )();
}
