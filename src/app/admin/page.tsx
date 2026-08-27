import Link from "next/link";
import { ChartColumn, Download, Hourglass, KeyRound, ShieldCheck, TrendingUp, Users } from "lucide-react";
import {
  adminAbuseSignals,
  adminKpis,
  downloadSeries,
  licenseStateBreakdown,
  revenueSeries,
  trialFunnel,
} from "@/data/demo-account";
import { Badge, Card } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/app-shell";
import { StatTile, StatusBreakdown } from "@/components/charts/stat-tile";
import { TrendChart } from "@/components/charts/trend-chart";
import { StackedBarChart } from "@/components/charts/stacked-bar-chart";
import { FunnelChart } from "@/components/charts/funnel-chart";
import { formatCompact, formatCurrency, formatDate } from "@/lib/utils";

const STATUS_MAP = { success: "good", primary: "good", warning: "warning", danger: "critical", neutral: "neutral" } as const;

export default function AdminDashboard() {
  return (
    <>
      <PageTitle
        title="Platform dashboard"
        description="Revenue, downloads, trials and licence health across the whole catalogue."
        action={
          <ButtonLink href="/admin/analytics" variant="secondary" size="sm">
            <ChartColumn aria-hidden />
            Full analytics
          </ButtonLink>
        }
      />

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatTile label="Monthly recurring revenue" value={formatCurrency(adminKpis.mrr)} change={adminKpis.mrrChange} icon={TrendingUp} />
        <StatTile label="Active customers" value={formatCompact(adminKpis.activeCustomers)} change={adminKpis.customerChange} icon={Users} />
        <StatTile label="Trials running" value={formatCompact(adminKpis.trialsRunning)} change={adminKpis.trialChange} icon={Hourglass} />
        <StatTile label="Trial conversion" value={`${adminKpis.trialConversion}%`} change={adminKpis.conversionChange} icon={KeyRound} />
        <StatTile label="Downloads (30d)" value={formatCompact(adminKpis.downloads30d)} change={adminKpis.downloadChange} icon={Download} />
        <StatTile
          label="Expiring in 30 days"
          value={String(adminKpis.expiring30d)}
          change={adminKpis.expiringChange}
          invertChange
          icon={ShieldCheck}
        />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <TrendChart
          title="Monthly recurring revenue"
          subtitle="Rolling 12 months, all products"
          points={revenueSeries.map((r) => ({ label: r.month, value: r.revenue }))}
        />
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

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <FunnelChart
          title="Trial conversion funnel"
          subtitle="Last 30 days, all products"
          stages={trialFunnel}
        />

        <StatusBreakdown
          title="Licences by state"
          items={licenseStateBreakdown.map((row) => ({
            label: row.state,
            count: row.count,
            status: STATUS_MAP[row.tone],
          }))}
        />

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">Anti-abuse signals</h2>
            <Link href="/admin/abuse" className="text-xs font-medium text-[var(--primary)] hover:underline">
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {adminAbuseSignals.slice(0, 5).map((signal) => (
              <li key={`${signal.signal}-${signal.at}`} className="flex items-start gap-2.5">
                <span
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${signal.blocked ? "bg-[var(--viz-critical)]" : "bg-[var(--viz-warning)]"}`}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{signal.signal.replace(/_/g, " ")}</p>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">{signal.detail}</p>
                </div>
                <Badge tone={signal.blocked ? "danger" : "warning"}>{signal.blocked ? "Blocked" : "Review"}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* New vs churned */}
      <Card className="mt-4 p-5">
        <h2 className="text-sm font-semibold">New MRR against churn</h2>
        <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
          Net new revenue each month. Churn is shown as a positive number for readability.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[46rem] text-sm">
            <thead className="border-b border-[var(--border)]">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Month
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  New MRR
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Churn
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Net
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Total MRR
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {revenueSeries.slice(-6).map((row) => {
                const net = row.newMrr - row.churn;
                return (
                  <tr key={row.month}>
                    <td className="px-3 py-2.5 font-medium">{row.month}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{formatCurrency(row.newMrr)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-[var(--muted-foreground)]">
                      {formatCurrency(row.churn)}
                    </td>
                    <td
                      className={`px-3 py-2.5 text-right font-medium tabular-nums ${net >= 0 ? "text-[var(--viz-good)]" : "text-[var(--viz-critical)]"}`}
                    >
                      {net >= 0 ? "+" : ""}
                      {formatCurrency(net)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{formatCurrency(row.revenue)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-[var(--muted-foreground)]">
          Data as of {formatDate("2026-08-25")} · figures in USD
        </p>
      </Card>
    </>
  );
}
