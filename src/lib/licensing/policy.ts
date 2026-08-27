/**
 * Licensing policy — every value here is administrator-configurable per
 * organisation. The defaults match the published public trial policy.
 */

export interface LicensePolicy {
  /** Length of the free trial in days. Allowed: 7, 14, 30, 60. */
  trialDays: number;
  /** Read-only grace window after trial or subscription lapse. Allowed: 7–30. */
  graceDays: number;
  /** Days after grace expiry before local business data is erased. */
  dataRetentionDays: number;
  /** Whether local data is erased automatically once retention elapses. */
  autoDeleteEnabled: boolean;
  /** Maximum simultaneous device activations for the licence. */
  deviceLimit: number;
  /** How long the client may run without reaching the licensing server. */
  offlineToleranceDays: number;
  /** Self-service device transfers permitted per 12 months. -1 = unlimited. */
  transfersPerYear: number;
  /** Days an administrator may add to an expiring trial, once. */
  emergencyExtensionDays: number;
  /** One trial per organisation; blocks reinstall-based trial resets. */
  oneTrialPerOrganisation: boolean;
  /** Days on which reminders are sent, counted from the start of grace. */
  reminderDays: number[];
  /** Extra reminder this many hours before grace ends. */
  finalReminderHours: number;
  /** Notification channels enabled for reminders. */
  channels: { email: boolean; inApp: boolean; sms: boolean; push: boolean };
}

export const DEFAULT_POLICY: LicensePolicy = {
  trialDays: 30,
  graceDays: 7,
  dataRetentionDays: 30,
  autoDeleteEnabled: true,
  deviceLimit: 1,
  offlineToleranceDays: 14,
  transfersPerYear: 2,
  emergencyExtensionDays: 7,
  oneTrialPerOrganisation: true,
  reminderDays: [1, 3, 7],
  finalReminderHours: 24,
  channels: { email: true, inApp: true, sms: false, push: false },
};

export const PLAN_POLICY_OVERRIDES: Record<"starter" | "business" | "enterprise", Partial<LicensePolicy>> = {
  starter: { deviceLimit: 1, graceDays: 7, offlineToleranceDays: 14, transfersPerYear: 2 },
  business: { deviceLimit: 10, graceDays: 14, offlineToleranceDays: 30, transfersPerYear: -1, channels: { email: true, inApp: true, sms: true, push: true } },
  enterprise: { deviceLimit: -1, graceDays: 30, offlineToleranceDays: 90, transfersPerYear: -1, autoDeleteEnabled: false, channels: { email: true, inApp: true, sms: true, push: true } },
};

export const POLICY_BOUNDS = {
  trialDays: [7, 60] as const,
  graceDays: [7, 30] as const,
  dataRetentionDays: [0, 365] as const,
  offlineToleranceDays: [1, 90] as const,
  emergencyExtensionDays: [0, 30] as const,
};

export function resolvePolicy(
  plan: keyof typeof PLAN_POLICY_OVERRIDES | null,
  overrides: Partial<LicensePolicy> = {},
): LicensePolicy {
  return { ...DEFAULT_POLICY, ...(plan ? PLAN_POLICY_OVERRIDES[plan] : {}), ...overrides };
}

/** Clamp an administrator-supplied policy into the supported bounds. */
export function validatePolicy(policy: LicensePolicy): { policy: LicensePolicy; warnings: string[] } {
  const warnings: string[] = [];
  const clamp = (key: keyof typeof POLICY_BOUNDS, value: number) => {
    const [min, max] = POLICY_BOUNDS[key];
    if (value < min || value > max) {
      warnings.push(`${key} must be between ${min} and ${max}; clamped from ${value}.`);
      return Math.min(Math.max(value, min), max);
    }
    return value;
  };

  const next: LicensePolicy = {
    ...policy,
    trialDays: clamp("trialDays", policy.trialDays),
    graceDays: clamp("graceDays", policy.graceDays),
    dataRetentionDays: clamp("dataRetentionDays", policy.dataRetentionDays),
    offlineToleranceDays: clamp("offlineToleranceDays", policy.offlineToleranceDays),
    emergencyExtensionDays: clamp("emergencyExtensionDays", policy.emergencyExtensionDays),
  };

  if (next.autoDeleteEnabled && next.dataRetentionDays === 0) {
    warnings.push("Auto-delete with zero retention erases data the moment grace ends; a warning window is recommended.");
  }
  if (next.reminderDays.some((d) => d > next.graceDays)) {
    warnings.push("One or more reminders fall after the grace period ends and will never be sent.");
  }
  return { policy: next, warnings };
}
