import { CircleCheck, TriangleAlert } from "lucide-react";
import { demoLicenses } from "@/data/demo-account";
import { DEFAULT_POLICY } from "@/lib/licensing/policy";
import { capabilitiesFor } from "@/lib/licensing/state-machine";
import { Badge, Card, DataTable, Td, Th } from "@/components/ui/primitives";
import { PageTitle } from "@/components/layout/app-shell";
import { LicenseCard } from "@/components/portal/license-card";
import { formatDate } from "@/lib/utils";

const CAPABILITY_LABELS: Array<[keyof ReturnType<typeof capabilitiesFor>, string]> = [
  ["login", "Sign in"],
  ["read", "View data"],
  ["create", "Create records"],
  ["edit", "Edit records"],
  ["delete", "Delete records"],
  ["import", "Import"],
  ["export", "Export"],
  ["print", "Print"],
  ["sync", "Sync"],
  ["backup", "Backup"],
];

export default function PortalLicensesPage() {
  const states = ["trial", "active", "grace", "expired"] as const;

  return (
    <>
      <PageTitle
        title="Licences"
        description="Every licence your organisation holds, what phase it is in, and exactly what each phase permits."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {demoLicenses.map((license) => (
          <LicenseCard key={license.id} license={license} />
        ))}
      </div>

      {/* Capability matrix — the same map the desktop client gates on */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">What each phase permits</h2>
        <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">
          This is the exact capability map the desktop client enforces — the portal, the API and the application all read
          it from the same evaluator, so they cannot disagree.
        </p>

        <DataTable className="mt-5">
          <table className="w-full min-w-[36rem]">
            <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
              <tr>
                <Th>Capability</Th>
                {states.map((state) => (
                  <Th key={state} className="text-center capitalize">
                    {state}
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {CAPABILITY_LABELS.map(([key, label]) => (
                <tr key={key}>
                  <Td className="font-medium">{label}</Td>
                  {states.map((state) => {
                    const allowed = capabilitiesFor(state)[key];
                    return (
                      <Td key={state} className="text-center">
                        {allowed ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-[var(--viz-good)]">
                            <CircleCheck className="size-4" aria-hidden />
                            <span className="sr-only">Allowed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                            <span aria-hidden>—</span>
                            <span className="sr-only">Blocked</span>
                          </span>
                        )}
                      </Td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </DataTable>

        <p className="mt-3 flex items-start gap-2 text-xs text-[var(--muted-foreground)]">
          <CircleCheck className="mt-px size-3.5 shrink-0 text-[var(--viz-good)]" aria-hidden />
          Export stays enabled through the entire grace period on purpose — taking your data out never requires paying
          us first.
        </p>
      </section>

      {/* Policy */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">Your organisation policy</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <h3 className="text-sm font-semibold">Licensing</h3>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ["Trial duration", `${DEFAULT_POLICY.trialDays} days`],
                ["Grace period", `${DEFAULT_POLICY.graceDays} days (read-only)`],
                ["Data retention after grace", `${DEFAULT_POLICY.dataRetentionDays} days`],
                ["Automatic deletion", DEFAULT_POLICY.autoDeleteEnabled ? "Enabled" : "Disabled"],
                ["Offline tolerance", `${DEFAULT_POLICY.offlineToleranceDays} days`],
                ["Transfers per year", DEFAULT_POLICY.transfersPerYear === -1 ? "Unlimited" : String(DEFAULT_POLICY.transfersPerYear)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-[var(--border)] pb-3 last:border-0 last:pb-0">
                  <dt className="text-[var(--muted-foreground)]">{label}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 flex items-start gap-2 text-xs text-[var(--muted-foreground)]">
              <TriangleAlert className="mt-px size-3.5 shrink-0" aria-hidden />
              These values are administrator-configurable on the Enterprise plan.
            </p>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold">Reminder schedule</h3>
            <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
              Materialised the moment a grace period starts. Reminders scheduled beyond the grace window are never sent.
            </p>
            <ol className="mt-4 space-y-3">
              {[
                ...DEFAULT_POLICY.reminderDays.map((day) => ({
                  label: `Day ${day} of grace`,
                  detail: day === 1 ? "Your trial has ended — your data is safe for now" : `${DEFAULT_POLICY.graceDays - day} days left before access locks`,
                })),
                {
                  label: `${DEFAULT_POLICY.finalReminderHours}h before lock`,
                  detail: "Final notice: export your data or subscribe today",
                },
              ].map((reminder, i) => (
                <li key={reminder.label} className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--primary-soft)] text-xs font-semibold text-[var(--primary)]">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{reminder.label}</span>
                    <span className="block text-xs text-[var(--muted-foreground)]">{reminder.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--border)] pt-4">
              {Object.entries(DEFAULT_POLICY.channels).map(([channel, on]) => (
                <Badge key={channel} tone={on ? "success" : "neutral"} className="capitalize">
                  {channel === "inApp" ? "In-app" : channel}
                  {on ? " · on" : " · off"}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* History */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">Licence history</h2>
        <DataTable className="mt-5">
          <table className="w-full min-w-[42rem]">
            <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
              <tr>
                <Th>Product</Th>
                <Th>Key</Th>
                <Th>State</Th>
                <Th>Started</Th>
                <Th>Renews / ends</Th>
                <Th className="text-right">Devices</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {demoLicenses.map((license) => (
                <tr key={license.id} className="transition-colors hover:bg-[var(--surface-muted)]">
                  <Td className="font-medium">{license.productName}</Td>
                  <Td className="font-mono text-xs text-[var(--muted-foreground)]">{license.key}</Td>
                  <Td>
                    <Badge
                      tone={
                        license.state === "active"
                          ? "success"
                          : license.state === "trial"
                            ? "primary"
                            : license.state === "grace"
                              ? "warning"
                              : "danger"
                      }
                    >
                      {license.state}
                    </Badge>
                  </Td>
                  <Td className="text-[var(--muted-foreground)]">{formatDate(license.trialStartedAt)}</Td>
                  <Td className="text-[var(--muted-foreground)]">
                    {license.subscriptionEndsAt ? formatDate(license.subscriptionEndsAt) : `${license.daysRemaining} days`}
                  </Td>
                  <Td className="text-right tabular-nums">
                    {license.devicesUsed} / {license.deviceLimit}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataTable>
      </section>
    </>
  );
}
