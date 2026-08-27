import { CreditCard, Receipt, TrendingUp } from "lucide-react";
import { adminCustomers, adminKpis, offsetDays, revenueSeries } from "@/data/demo-account";
import { seededInt } from "@/lib/hash";
import { Badge, Card, DataTable, Select, Td, Th } from "@/components/ui/primitives";
import { PageTitle } from "@/components/layout/app-shell";
import { StatTile } from "@/components/charts/stat-tile";
import { TrendChart } from "@/components/charts/trend-chart";
import { formatCurrency, formatDate } from "@/lib/utils";

const PROVIDERS = ["Stripe", "PayPal", "GCash", "Maya", "Bank transfer"] as const;
const STATUSES = ["succeeded", "succeeded", "succeeded", "succeeded", "pending", "failed"] as const;

const payments = Array.from({ length: 14 }, (_, i) => {
  const customer = adminCustomers[i % adminCustomers.length];
  const status = STATUSES[seededInt(`pay:${i}:s`, 0, STATUSES.length - 1)];
  return {
    id: `pay_${seededInt(`pay:${i}:id`, 100000, 999999)}`,
    invoice: `INV-2026-0${seededInt(`pay:${i}:inv`, 100, 199)}`,
    organisation: customer.name,
    provider: PROVIDERS[seededInt(`pay:${i}:p`, 0, PROVIDERS.length - 1)],
    amount: seededInt(`pay:${i}:a`, 29, 2500),
    status,
    processedAt: offsetDays(-seededInt(`pay:${i}:d`, 0, 20)).toISOString(),
    failureReason: status === "failed" ? "card_declined" : null,
  };
});

const PROVIDER_TOTALS = PROVIDERS.map((provider) => ({
  provider,
  volume: payments.filter((p) => p.provider === provider).reduce((sum, p) => sum + p.amount, 0),
  count: payments.filter((p) => p.provider === provider).length,
}));

export default function AdminPaymentsPage() {
  const succeeded = payments.filter((p) => p.status === "succeeded");
  const failed = payments.filter((p) => p.status === "failed");

  return (
    <>
      <PageTitle
        title="Payments"
        description="Charges across every provider, with failures and retries."
        action={
          <Select aria-label="Date range" className="w-44" defaultValue="30d">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </Select>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="MRR" value={formatCurrency(adminKpis.mrr)} change={adminKpis.mrrChange} icon={TrendingUp} />
        <StatTile label="Captured (30d)" value={formatCurrency(succeeded.reduce((s, p) => s + p.amount, 0))} icon={CreditCard} />
        <StatTile label="Failed charges" value={String(failed.length)} icon={Receipt} />
        <StatTile label="Recovery rate" value="71%" icon={Receipt} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <TrendChart
          title="Revenue"
          subtitle="Rolling 12 months, all providers"
          points={revenueSeries.map((r) => ({ label: r.month, value: r.revenue }))}
        />

        <Card className="p-5">
          <h2 className="text-sm font-semibold">Volume by provider</h2>
          <ul className="mt-4 space-y-3">
            {PROVIDER_TOTALS.map((row) => {
              const max = Math.max(...PROVIDER_TOTALS.map((p) => p.volume), 1);
              return (
                <li key={row.provider}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3 text-xs">
                    <span className="font-medium">{row.provider}</span>
                    <span className="tabular-nums text-[var(--muted-foreground)]">
                      {formatCurrency(row.volume)} · {row.count}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                    <div
                      className="h-full rounded-full bg-[var(--viz-series-1)]"
                      style={{ width: `${(row.volume / max) * 100}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-xs text-[var(--muted-foreground)]">
            Local wallets (GCash, Maya) matter disproportionately in APAC — worth keeping despite lower volume.
          </p>
        </Card>
      </div>

      <DataTable className="mt-8">
        <table className="w-full min-w-[52rem]">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
            <tr>
              <Th>Payment</Th>
              <Th>Invoice</Th>
              <Th>Organisation</Th>
              <Th>Provider</Th>
              <Th>Processed</Th>
              <Th className="text-right">Amount</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {payments.map((payment) => (
              <tr key={payment.id} className="transition-colors hover:bg-[var(--surface-muted)]">
                <Td className="font-mono text-xs font-medium">{payment.id}</Td>
                <Td className="font-mono text-xs text-[var(--muted-foreground)]">{payment.invoice}</Td>
                <Td className="text-[var(--muted-foreground)]">{payment.organisation}</Td>
                <Td className="text-[var(--muted-foreground)]">{payment.provider}</Td>
                <Td className="text-[var(--muted-foreground)]">{formatDate(payment.processedAt)}</Td>
                <Td className="text-right font-medium tabular-nums">{formatCurrency(payment.amount)}</Td>
                <Td>
                  <Badge
                    tone={payment.status === "succeeded" ? "success" : payment.status === "pending" ? "warning" : "danger"}
                  >
                    {payment.failureReason ?? payment.status}
                  </Badge>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </>
  );
}
