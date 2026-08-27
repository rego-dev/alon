import { CircleCheck, ShieldCheck, TriangleAlert } from "lucide-react";
import { adminAbuseSignals } from "@/data/demo-account";
import { Badge, Card, DataTable, Td, Th } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/app-shell";
import { StatTile } from "@/components/charts/stat-tile";
import { formatDate } from "@/lib/utils";

const SIGNAL_REFERENCE = [
  {
    signal: "known_device_trial_replay",
    meaning: "A strict fingerprint that has already consumed a trial requested another.",
    action: "Hard block",
    tone: "danger" as const,
  },
  {
    signal: "organisation_trial_exhausted",
    meaning: "The organisation has already used its one trial for this product.",
    action: "Hard block",
    tone: "danger" as const,
  },
  {
    signal: "clock_rollback",
    meaning: "Client time is behind the monotonic high-water mark, or skewed beyond 24 hours.",
    action: "Hard block, licence suspended",
    tone: "danger" as const,
  },
  {
    signal: "activation_velocity",
    meaning: "More than five activations from one fingerprint within an hour.",
    action: "Hard block",
    tone: "danger" as const,
  },
  {
    signal: "disposable_email_domain",
    meaning: "Registration used a known throwaway email provider.",
    action: "Hard block",
    tone: "danger" as const,
  },
  {
    signal: "fingerprint_collision",
    meaning: "Tolerant hash matches but strict does not — usually a replaced disk or NIC.",
    action: "Allow, flag for review",
    tone: "warning" as const,
  },
  {
    signal: "vm_without_verification",
    meaning: "A trial on a virtual machine from an unverified email address.",
    action: "Allow with limited features until verified",
    tone: "warning" as const,
  },
];

export default function AdminAbusePage() {
  const blocked = adminAbuseSignals.filter((s) => s.blocked).length;
  const review = adminAbuseSignals.length - blocked;

  return (
    <>
      <PageTitle
        title="Anti-abuse"
        description="Signals raised by the trial evaluator, and what each one does."
        action={
          <Button variant="secondary" size="sm">
            <ShieldCheck aria-hidden />
            Tune thresholds
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Blocked (7 days)" value={String(blocked)} icon={ShieldCheck} />
        <StatTile label="Awaiting review" value={String(review)} icon={TriangleAlert} />
        <StatTile label="False positive rate" value="0.4%" icon={CircleCheck} />
      </div>

      <Card className="mt-6 flex items-start gap-3 p-5">
        <CircleCheck className="mt-0.5 size-5 shrink-0 text-[var(--viz-good)]" aria-hidden />
        <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
          The goal is not to make trial resetting impossible — that is not achievable on hardware we do not control.
          It is to make reinstalling never the easy path, while never blocking a customer who simply replaced a laptop.
          That is why a tolerant-hash match is a review signal rather than a block.
        </p>
      </Card>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Recent signals</h2>
        <DataTable className="mt-5">
          <table className="w-full min-w-[48rem]">
            <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
              <tr>
                <Th>Signal</Th>
                <Th>Organisation</Th>
                <Th>Detail</Th>
                <Th>Raised</Th>
                <Th>Outcome</Th>
                <Th className="text-right">Action</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {adminAbuseSignals.map((signal) => (
                <tr key={`${signal.signal}-${signal.at}`} className="transition-colors hover:bg-[var(--surface-muted)]">
                  <Td className="font-mono text-xs font-medium">{signal.signal}</Td>
                  <Td className="text-[var(--muted-foreground)]">{signal.organisation}</Td>
                  <Td className="max-w-sm whitespace-normal text-[var(--muted-foreground)]">{signal.detail}</Td>
                  <Td className="text-[var(--muted-foreground)]">{formatDate(signal.at)}</Td>
                  <Td>
                    <Badge tone={signal.blocked ? "danger" : "warning"}>{signal.blocked ? "Blocked" : "Allowed, flagged"}</Badge>
                  </Td>
                  <Td className="text-right">
                    <Button variant="ghost" size="sm">
                      {signal.blocked ? "Override" : "Approve"}
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataTable>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Signal reference</h2>
        <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">
          What each signal means and what the evaluator does with it.
        </p>
        <DataTable className="mt-5">
          <table className="w-full min-w-[46rem]">
            <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
              <tr>
                <Th>Signal</Th>
                <Th>Meaning</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {SIGNAL_REFERENCE.map((row) => (
                <tr key={row.signal}>
                  <Td className="font-mono text-xs font-medium">{row.signal}</Td>
                  <Td className="max-w-lg whitespace-normal text-[var(--muted-foreground)]">{row.meaning}</Td>
                  <Td>
                    <Badge tone={row.tone}>{row.action}</Badge>
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
