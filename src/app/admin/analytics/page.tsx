import { adminKpis, downloadSeries, licenseStateBreakdown, revenueSeries, trialFunnel } from "@/data/demo-account";
import { listProducts } from "@/lib/repositories/products";
import type { Product } from "@/types";
import { categories } from "@/data/categories";
import { seededInt } from "@/lib/hash";
import { Card, DataTable, Select, Td, Th } from "@/components/ui/primitives";
import { PageTitle } from "@/components/layout/app-shell";
import { StatTile, StatusBreakdown } from "@/components/charts/stat-tile";
import { TrendChart } from "@/components/charts/trend-chart";
import { StackedBarChart } from "@/components/charts/stacked-bar-chart";
import { FunnelChart } from "@/components/charts/funnel-chart";
import { formatCompact, formatCurrency, formatNumber } from "@/lib/utils";

const STATUS_MAP = { success: "good", primary: "good", warning: "warning", danger: "critical", neutral: "neutral" } as const;

// Category performance derived from the catalogue itself.
const buildByCategory = (products: Product[]) =>
  categories.map((category) => {
  const items = products.filter((p) => p.category === category.slug);
  const downloads = items.reduce((sum, p) => sum + p.downloads, 0);
  const trials = Math.round(downloads * 0.42);
  const conversions = Math.round(trials * (seededInt(`conv:${category.slug}`, 30, 46) / 100));
  return {
    name: category.name,
    products: items.length,
    downloads,
    trials,
    conversions,
    rate: (conversions / trials) * 100,
    mrr: conversions * seededInt(`mrr:${category.slug}`, 28, 62),
  };
});

export default async function AdminAnalyticsPage() {
  const byCategory = buildByCategory(await listProducts());
  return (
    <>
      <PageTitle
        title="Analytics"
        description="Revenue, downloads, trial conversion and renewals across the platform."
        action={
          <Select aria-label="Date range" className="w-44" defaultValue="12m">
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
            <option value="ytd">Year to date</option>
          </Select>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="MRR" value={formatCurrency(adminKpis.mrr)} change={adminKpis.mrrChange} />
        <StatTile label="Annual run rate" value={formatCurrency(adminKpis.mrr * 12)} change={adminKpis.mrrChange} />
        <StatTile label="Trial conversion" value={`${adminKpis.trialConversion}%`} change={adminKpis.conversionChange} />
        <StatTile label="Expiring in 30 days" value={String(adminKpis.expiring30d)} change={adminKpis.expiringChange} invertChange />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <TrendChart
          title="Monthly recurring revenue"
          subtitle="Rolling 12 months"
          points={revenueSeries.map((r) => ({ label: r.month, value: r.revenue }))}
        />
        <TrendChart
          title="New MRR added"
          subtitle="Rolling 12 months, before churn"
          points={revenueSeries.map((r) => ({ label: r.month, value: r.newMrr }))}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <StackedBarChart
            title="Downloads by platform"
            subtitle="Last seven days"
            series={[
              { key: "windows", label: "Windows", color: "var(--viz-series-1)" },
              { key: "macos", label: "macOS", color: "var(--viz-series-2)" },
              { key: "linux", label: "Linux", color: "var(--viz-series-3)" },
              { key: "mobile", label: "Mobile", color: "var(--viz-series-4)" },
            ]}
            rows={downloadSeries.map((d) => ({
              label: d.day,
              values: { windows: d.windows, macos: d.macos, linux: d.linux, mobile: d.mobile },
            }))}
          />
        </div>
        <StatusBreakdown
          title="Licences by state"
          items={licenseStateBreakdown.map((row) => ({
            label: row.state,
            count: row.count,
            status: STATUS_MAP[row.tone],
          }))}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <FunnelChart title="Trial conversion funnel" subtitle="Last 30 days, all products" stages={trialFunnel} />

        <Card className="p-5">
          <h2 className="text-sm font-semibold">Renewals and expiries</h2>
          <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">Next 90 days, by month.</p>
          <table className="mt-4 w-full text-sm">
            <thead className="border-b border-[var(--border)]">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Month
                </th>
                <th className="px-2 py-2 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Renewing
                </th>
                <th className="px-2 py-2 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  At risk
                </th>
                <th className="px-2 py-2 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {[
                { month: "September", renewing: 1_284, risk: 96, value: 118_400 },
                { month: "October", renewing: 1_412, risk: 118, value: 131_900 },
                { month: "November", renewing: 1_106, risk: 74, value: 102_300 },
              ].map((row) => (
                <tr key={row.month}>
                  <td className="px-2 py-2.5 font-medium">{row.month}</td>
                  <td className="px-2 py-2.5 text-right tabular-nums">{formatNumber(row.renewing)}</td>
                  <td className="px-2 py-2.5 text-right tabular-nums text-[var(--viz-warning)]">{row.risk}</td>
                  <td className="px-2 py-2.5 text-right tabular-nums">{formatCurrency(row.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-[var(--muted-foreground)]">
            &ldquo;At risk&rdquo; means a failed payment, an unreleased device over the plan limit, or no heartbeat in 21 days.
          </p>
        </Card>
      </div>

      {/* Category performance */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold">Performance by category</h2>
        <DataTable className="mt-5">
          <table className="w-full min-w-[46rem]">
            <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
              <tr>
                <Th>Category</Th>
                <Th className="text-right">Products</Th>
                <Th className="text-right">Downloads</Th>
                <Th className="text-right">Trials</Th>
                <Th className="text-right">Conversions</Th>
                <Th className="text-right">Rate</Th>
                <Th className="text-right">MRR</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {byCategory.map((row) => (
                <tr key={row.name} className="transition-colors hover:bg-[var(--surface-muted)]">
                  <Td className="font-medium">{row.name}</Td>
                  <Td className="text-right tabular-nums">{row.products}</Td>
                  <Td className="text-right tabular-nums">{formatCompact(row.downloads)}</Td>
                  <Td className="text-right tabular-nums">{formatCompact(row.trials)}</Td>
                  <Td className="text-right tabular-nums">{formatCompact(row.conversions)}</Td>
                  <Td className="text-right tabular-nums">{row.rate.toFixed(1)}%</Td>
                  <Td className="text-right font-medium tabular-nums">{formatCurrency(row.mrr)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataTable>
      </section>
    </>
  );
}
