import { CircleCheck, Settings, TriangleAlert } from "lucide-react";
import { DEFAULT_POLICY, POLICY_BOUNDS, PLAN_POLICY_OVERRIDES, validatePolicy } from "@/lib/licensing/policy";
import { reminderSchedule } from "@/lib/licensing/state-machine";
import { Badge, Card, DataTable, Field, Input, Select, Td, Th } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/app-shell";
import { formatDate } from "@/lib/utils";

export default function AdminPolicyPage() {
  const { warnings } = validatePolicy(DEFAULT_POLICY);
  // Preview what the worker would materialise if a grace period started today.
  const preview = reminderSchedule(new Date("2026-08-25T00:00:00Z"), DEFAULT_POLICY);

  return (
    <>
      <PageTitle
        title="Licensing policy"
        description="Platform defaults. Enterprise organisations can override every value below per tenant."
        action={
          <Button size="sm">
            <Settings aria-hidden />
            Save policy
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-semibold">Trial and grace</h2>
          <form className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Trial duration" htmlFor="p-trial" hint={`Allowed: ${POLICY_BOUNDS.trialDays[0]}–${POLICY_BOUNDS.trialDays[1]} days`}>
              <Select id="p-trial" defaultValue={String(DEFAULT_POLICY.trialDays)}>
                {[7, 14, 30, 60].map((d) => (
                  <option key={d} value={d}>
                    {d} days
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Grace period" htmlFor="p-grace" hint={`Allowed: ${POLICY_BOUNDS.graceDays[0]}–${POLICY_BOUNDS.graceDays[1]} days`}>
              <Input id="p-grace" type="number" min={7} max={30} defaultValue={DEFAULT_POLICY.graceDays} />
            </Field>
            <Field label="Data retention after grace" htmlFor="p-retention" hint="0–365 days">
              <Input id="p-retention" type="number" min={0} max={365} defaultValue={DEFAULT_POLICY.dataRetentionDays} />
            </Field>
            <Field label="Automatic deletion" htmlFor="p-autodelete" hint="Off retains data indefinitely">
              <Select id="p-autodelete" defaultValue={DEFAULT_POLICY.autoDeleteEnabled ? "on" : "off"}>
                <option value="on">Enabled</option>
                <option value="off">Disabled</option>
              </Select>
            </Field>
            <Field label="Offline tolerance" htmlFor="p-offline" hint="1–90 days without reaching the server">
              <Input id="p-offline" type="number" min={1} max={90} defaultValue={DEFAULT_POLICY.offlineToleranceDays} />
            </Field>
            <Field label="Emergency extension" htmlFor="p-extension" hint="One-off, granted by an administrator">
              <Input id="p-extension" type="number" min={0} max={30} defaultValue={DEFAULT_POLICY.emergencyExtensionDays} />
            </Field>
          </form>

          <div className="mt-5 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4">
            <p className="flex items-center gap-2 text-sm font-medium">
              {warnings.length ? (
                <TriangleAlert className="size-4 text-[var(--viz-warning)]" aria-hidden />
              ) : (
                <CircleCheck className="size-4 text-[var(--viz-good)]" aria-hidden />
              )}
              Validation
            </p>
            {warnings.length ? (
              <ul className="mt-2 space-y-1">
                {warnings.map((warning) => (
                  <li key={warning} className="text-xs text-[var(--muted-foreground)]">
                    {warning}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
                All values are within supported bounds. Out-of-range values are clamped on save and the adjustment is
                reported rather than applied silently.
              </p>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="font-semibold">Anti-abuse</h2>
            <ul className="mt-4 space-y-3">
              {[
                { label: "One trial per organisation", detail: "Blocks reinstall-based trial resets", on: DEFAULT_POLICY.oneTrialPerOrganisation },
                { label: "Device fingerprinting", detail: "Strict and tolerant hashes, computed on device", on: true },
                { label: "Clock tamper detection", detail: "Monotonic high-water mark per device", on: true },
                { label: "Encrypted local licence storage", detail: "Sealed with an OS keystore key", on: true },
                { label: "Online licence validation", detail: "Heartbeat with signed offline cache", on: true },
                { label: "Disposable email blocking", detail: "Known throwaway domains rejected", on: true },
              ].map((control) => (
                <li key={control.label} className="flex items-start gap-3">
                  <CircleCheck className="mt-0.5 size-4 shrink-0 text-[var(--viz-good)]" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{control.label}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{control.detail}</p>
                  </div>
                  <Badge tone={control.on ? "success" : "neutral"}>{control.on ? "On" : "Off"}</Badge>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold">Reminder schedule preview</h2>
            <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
              What the notification worker would queue for a grace period starting today.
            </p>
            <ol className="mt-4 space-y-3">
              {preview.map((reminder) => (
                <li key={reminder.label} className="flex items-start gap-3 rounded-lg border border-[var(--border)] p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{reminder.label}</p>
                    <p className="truncate text-xs text-[var(--muted-foreground)]">{reminder.subject}</p>
                  </div>
                  <span className="shrink-0 text-xs text-[var(--muted-foreground)]">{formatDate(reminder.sendAt)}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>

      {/* Plan overrides */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold">Per-plan overrides</h2>
        <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">
          Applied on top of the defaults above whenever a licence resolves its policy.
        </p>
        <DataTable className="mt-5">
          <table className="w-full min-w-[40rem]">
            <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
              <tr>
                <Th>Setting</Th>
                <Th className="text-center">Starter</Th>
                <Th className="text-center">Business</Th>
                <Th className="text-center">Enterprise</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {(
                [
                  ["Device limit", "deviceLimit"],
                  ["Grace days", "graceDays"],
                  ["Offline tolerance (days)", "offlineToleranceDays"],
                  ["Transfers per year", "transfersPerYear"],
                  ["Auto-delete", "autoDeleteEnabled"],
                ] as const
              ).map(([label, key]) => (
                <tr key={key}>
                  <Td className="font-medium">{label}</Td>
                  {(["starter", "business", "enterprise"] as const).map((plan) => {
                    const value = PLAN_POLICY_OVERRIDES[plan][key] ?? DEFAULT_POLICY[key];
                    const display =
                      typeof value === "boolean" ? (value ? "Enabled" : "Disabled") : value === -1 ? "Unlimited" : String(value);
                    return (
                      <Td key={plan} className="text-center text-[var(--muted-foreground)]">
                        {display}
                      </Td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </DataTable>
      </section>
    </>
  );
}
