import type { LicensePolicy } from "./policy";

/**
 * The licence lifecycle every installed client walks through.
 *
 *   TRIAL ──(30d)──▶ GRACE ──(7–30d)──▶ EXPIRED ──(retention)──▶ PURGED
 *     │                 │                   │                       │
 *     └─ subscribe ─────┴─── subscribe ─────┴──── subscribe ────────┘
 *            ▼                  ▼                      ▼             ▼
 *          ACTIVE            ACTIVE                 ACTIVE      ACTIVE (clean DB)
 *
 * A subscription taken at any point before PURGED restores full function with
 * data intact and without reinstalling. After PURGED the install reactivates
 * against an empty database, or the customer restores their own backup.
 */
export type LicenseState = "trial" | "active" | "grace" | "expired" | "purged" | "suspended";

/** Capabilities the client gates on. Grace deliberately keeps read paths open. */
export interface Capabilities {
  login: boolean;
  read: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  import: boolean;
  export: boolean;
  print: boolean;
  sync: boolean;
  backup: boolean;
}

const ALL_ON: Capabilities = {
  login: true, read: true, create: true, edit: true, delete: true,
  import: true, export: true, print: true, sync: true, backup: true,
};

const ALL_OFF: Capabilities = {
  login: false, read: false, create: false, edit: false, delete: false,
  import: false, export: false, print: false, sync: false, backup: false,
};

/**
 * Grace is read-only. Note the deliberate exception: `export` stays enabled so
 * a lapsed customer can always take their data out before anything is erased.
 * The published policy calls this the "final export opportunity".
 */
const GRACE_CAPABILITIES: Capabilities = {
  ...ALL_OFF,
  login: true,
  read: true,
  export: true,
  print: false,
};

export function capabilitiesFor(state: LicenseState): Capabilities {
  switch (state) {
    case "trial":
    case "active":
      return { ...ALL_ON };
    case "grace":
      return { ...GRACE_CAPABILITIES };
    case "expired":
      return { ...ALL_OFF, login: true };
    case "suspended":
      return { ...ALL_OFF, login: true };
    case "purged":
      return { ...ALL_OFF, login: true };
    default:
      return { ...ALL_OFF };
  }
}

export interface LicenseSnapshot {
  /** When the trial began on this organisation's first activation. */
  trialStartedAt: Date;
  /** Set once a subscription is paid for; null while trialling. */
  subscriptionEndsAt: Date | null;
  /** Administrator-granted one-off extension, in days. */
  extensionDays?: number;
  /** Set when a licence is administratively suspended (abuse, chargeback). */
  suspendedAt?: Date | null;
  /** Last successful contact with the licensing server. */
  lastValidatedAt?: Date | null;
  /** Set once local business data has actually been erased. */
  purgedAt?: Date | null;
}

export interface LicenseEvaluation {
  state: LicenseState;
  capabilities: Capabilities;
  /** Days remaining in the current phase; 0 when the phase has ended. */
  daysRemaining: number;
  /** Phase boundaries, useful for countdowns and the in-app banner. */
  trialEndsAt: Date;
  graceEndsAt: Date;
  purgeAt: Date | null;
  /** True when the client is past its allowed offline window. */
  offlineLockout: boolean;
  /** Copy the client shows in the persistent banner. */
  message: string;
  /** Severity for banner styling. */
  severity: "none" | "info" | "warning" | "critical";
}

const DAY = 86_400_000;

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY);
}

function daysUntil(target: Date, now: Date): number {
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / DAY));
}

/**
 * Pure evaluation of a licence at a point in time. The desktop client, the API
 * and the customer portal all call this so they can never disagree.
 */
export function evaluateLicense(
  snapshot: LicenseSnapshot,
  policy: LicensePolicy,
  now: Date = new Date(),
): LicenseEvaluation {
  const extension = snapshot.extensionDays ?? 0;
  const trialEndsAt = addDays(snapshot.trialStartedAt, policy.trialDays + extension);
  const graceStartsAt = snapshot.subscriptionEndsAt ?? trialEndsAt;
  const graceEndsAt = addDays(graceStartsAt, policy.graceDays);
  const purgeAt = policy.autoDeleteEnabled ? addDays(graceEndsAt, policy.dataRetentionDays) : null;

  const offlineLockout = Boolean(
    snapshot.lastValidatedAt &&
      now.getTime() - snapshot.lastValidatedAt.getTime() > policy.offlineToleranceDays * DAY,
  );

  const build = (
    state: LicenseState,
    daysRemaining: number,
    message: string,
    severity: LicenseEvaluation["severity"],
  ): LicenseEvaluation => ({
    state,
    capabilities: capabilitiesFor(state),
    daysRemaining,
    trialEndsAt,
    graceEndsAt,
    purgeAt,
    offlineLockout,
    message,
    severity,
  });

  if (snapshot.purgedAt && snapshot.purgedAt <= now) {
    return build("purged", 0, "Local business data was erased under the retention policy. Subscribe to reactivate with a clean database or restore your own backup.", "critical");
  }

  if (snapshot.suspendedAt && snapshot.suspendedAt <= now) {
    return build("suspended", 0, "This licence has been suspended. Contact support to restore access.", "critical");
  }

  if (offlineLockout) {
    return build("expired", 0, `This device has not reached the licensing server in ${policy.offlineToleranceDays} days. Connect to the internet once to continue.`, "critical");
  }

  // Paid and current.
  if (snapshot.subscriptionEndsAt && snapshot.subscriptionEndsAt > now) {
    const remaining = daysUntil(snapshot.subscriptionEndsAt, now);
    return build(
      "active",
      remaining,
      remaining <= 14 ? `Your subscription renews in ${remaining} ${remaining === 1 ? "day" : "days"}.` : "Subscription active.",
      remaining <= 7 ? "info" : "none",
    );
  }

  // Still inside the trial.
  if (!snapshot.subscriptionEndsAt && now < trialEndsAt) {
    const remaining = daysUntil(trialEndsAt, now);
    return build(
      "trial",
      remaining,
      `${remaining} ${remaining === 1 ? "day" : "days"} left in your free trial. All features stay unlocked until then.`,
      remaining <= 3 ? "warning" : remaining <= 7 ? "info" : "none",
    );
  }

  // Trial or subscription has lapsed — read-only grace.
  if (now < graceEndsAt) {
    const remaining = daysUntil(graceEndsAt, now);
    return build(
      "grace",
      remaining,
      `Read-only grace period: ${remaining} ${remaining === 1 ? "day" : "days"} left. You can still view and export your data. Subscribe to restore full access instantly.`,
      remaining <= 2 ? "critical" : "warning",
    );
  }

  // Grace exhausted — locked, data still present until retention elapses.
  const remainingBeforePurge = purgeAt ? daysUntil(purgeAt, now) : 0;
  return build(
    "expired",
    remainingBeforePurge,
    purgeAt
      ? `Access is locked. Your data is retained for ${remainingBeforePurge} more ${remainingBeforePurge === 1 ? "day" : "days"} — subscribe before then and nothing is lost.`
      : "Access is locked. Subscribe to restore full access; your data is retained indefinitely under your organisation policy.",
    "critical",
  );
}

/**
 * Applying a subscription. Returns the snapshot the server should persist.
 * Data survives unless the licence had already reached `purged`.
 */
export function applySubscription(
  snapshot: LicenseSnapshot,
  termDays: number,
  now: Date = new Date(),
): { snapshot: LicenseSnapshot; dataPreserved: boolean; requiresReinstall: false } {
  const dataPreserved = !snapshot.purgedAt;
  return {
    snapshot: {
      ...snapshot,
      subscriptionEndsAt: addDays(now, termDays),
      suspendedAt: null,
      lastValidatedAt: now,
    },
    dataPreserved,
    requiresReinstall: false,
  };
}

/** The reminder schedule the notification worker materialises when grace starts. */
export interface ScheduledReminder {
  sendAt: Date;
  label: string;
  channels: string[];
  subject: string;
}

export function reminderSchedule(
  graceStartsAt: Date,
  policy: LicensePolicy,
): ScheduledReminder[] {
  const graceEndsAt = addDays(graceStartsAt, policy.graceDays);
  const channels = Object.entries(policy.channels)
    .filter(([, on]) => on)
    .map(([name]) => name);

  const reminders: ScheduledReminder[] = policy.reminderDays
    .filter((day) => day <= policy.graceDays)
    .map((day) => ({
      sendAt: addDays(graceStartsAt, day),
      label: `Day ${day}`,
      channels,
      subject:
        day === 1
          ? "Your trial has ended — your data is safe for now"
          : `${policy.graceDays - day} days left before your access locks`,
    }));

  reminders.push({
    sendAt: new Date(graceEndsAt.getTime() - policy.finalReminderHours * 3_600_000),
    label: `${policy.finalReminderHours}h before lock`,
    channels,
    subject: "Final notice: export your data or subscribe today",
  });

  return reminders.sort((a, b) => a.sendAt.getTime() - b.sendAt.getTime());
}
