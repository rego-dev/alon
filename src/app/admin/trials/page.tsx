import { Hourglass, TrendingUp } from "lucide-react";
import { adminCustomers, adminKpis, offsetDays, trialFunnel } from "@/data/demo-account";
import { listProducts } from "@/lib/repositories/products";
import type { Product } from "@/types";
import { seededInt } from "@/lib/hash";
import { Badge, Card, DataTable, Select, Td, Th } from "@/components/ui/primitives";
import { PageTitle } from "@/components/layout/app-shell";
import { StatTile } from "@/components/charts/stat-tile";
import { FunnelChart } from "@/components/charts/funnel-chart";
import { PLATFORM_META } from "@/components/marketing/platform-icons";
import { formatCompact, formatDate } from "@/lib/utils";

const PLATFORMS = ["windows", "macos", "linux", "android", "ios"] as const;

const buildActivations = (products: Product[]) =>
  Array.from({ length: 14 }, (_, i) => {
  const product = products[seededInt(`trial:${i}:p`, 0, products.length - 1)];
  const customer = adminCustomers[i % adminCustomers.length];
  const dayOfTrial = seededInt(`trial:${i}:d`, 1, 30);
  const platform = PLATFORMS[seededInt(`trial:${i}:pl`, 0, PLATFORMS.length - 1)];
  const flagged = seededInt(`trial:${i}:f`, 0, 9) === 0;
  return {
    id: `trl_${seededInt(`trial:${i}:id`, 10000, 99999)}`,
    product: product.name,
    organisation: customer.name,
    platform,
    startedAt: offsetDays(-dayOfTrial).toISOString(),
    dayOfTrial,
    daysRemaining: 30 - dayOfTrial,
    verified: !flagged,
    flagged,
  };
});

export default async function AdminTrialsPage() {
  const activations = buildActivations(await listProducts());
  const flagged = activations.filter((a) => a.flagged).length;

  return (
    <>
      <PageTitle
        title="Trial activations"
        description="Every trial issued in the last 30 days, with anti-abuse status."
        action={
          <Select aria-label="Date range" className="w-44" defaultValue="30d">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </Select>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Trials running" value={formatCompact(adminKpis.trialsRunning)} change={adminKpis.trialChange} icon={Hourglass} />
        <StatTile label="Conversion rate" value={`${adminKpis.trialConversion}%`} change={adminKpis.conversionChange} icon={TrendingUp} />
        <StatTile label="Ending in 7 days" value="486" icon={Hourglass} />
        <StatTile label="Flagged for review" value={String(flagged)} icon={Hourglass} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_1.4fr]">
        <FunnelChart title="Trial funnel" subtitle="Last 30 days" stages={trialFunnel} />

        <Card className="p-5">
          <h2 className="text-sm font-semibold">Where trials are lost</h2>
          <ul className="mt-4 space-y-4">
            {[
              { stage: "Download → activation", loss: "57.3%", note: "Largest single drop. Most never launch the installer." },
              { stage: "Day 1 → day 7", loss: "34.6%", note: "Correlates strongly with whether data was imported in the first session." },
              { stage: "Day 7 → day 25", loss: "28.3%", note: "Usually a workflow the product does not yet cover." },
              { stage: "Day 25 → subscription", loss: "18.5%", note: "Price and approval, not product fit." },
            ].map((row) => (
              <li key={row.stage} className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-medium">{row.stage}</p>
                  <p className="text-sm font-semibold tabular-nums text-[var(--viz-critical)]">−{row.loss}</p>
                </div>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">{row.note}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <DataTable className="mt-8">
        <table className="w-full min-w-[52rem]">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
            <tr>
              <Th>Trial</Th>
              <Th>Product</Th>
              <Th>Organisation</Th>
              <Th>Platform</Th>
              <Th>Started</Th>
              <Th className="text-right">Day</Th>
              <Th className="text-right">Remaining</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {activations.map((row) => {
              const { Icon, label } = PLATFORM_META[row.platform];
              return (
                <tr key={row.id} className="transition-colors hover:bg-[var(--surface-muted)]">
                  <Td className="font-mono text-xs font-medium">{row.id}</Td>
                  <Td>{row.product}</Td>
                  <Td className="text-[var(--muted-foreground)]">{row.organisation}</Td>
                  <Td>
                    <span className="flex items-center gap-2 text-[var(--muted-foreground)]">
                      <Icon width={15} height={15} aria-hidden />
                      {label}
                    </span>
                  </Td>
                  <Td className="text-[var(--muted-foreground)]">{formatDate(row.startedAt)}</Td>
                  <Td className="text-right tabular-nums">{row.dayOfTrial} / 30</Td>
                  <Td className="text-right tabular-nums">{row.daysRemaining}d</Td>
                  <Td>
                    <Badge tone={row.flagged ? "warning" : "success"}>{row.flagged ? "Review" : "Verified"}</Badge>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </DataTable>
    </>
  );
}
