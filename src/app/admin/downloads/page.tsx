import Link from "next/link";
import { Download, HardDrive } from "lucide-react";
import { adminKpis, downloadSeries } from "@/data/demo-account";
import { downloadIndex } from "@/data/downloads";
import { listProducts } from "@/lib/repositories/products";
import { getIcon } from "@/lib/icons";
import { DataTable, Select, Td, Th } from "@/components/ui/primitives";
import { PageTitle } from "@/components/layout/app-shell";
import { StatTile } from "@/components/charts/stat-tile";
import { StackedBarChart } from "@/components/charts/stacked-bar-chart";
import { PLATFORM_META } from "@/components/marketing/platform-icons";
import { formatCompact, formatDate } from "@/lib/utils";

export default async function AdminDownloadsPage() {
  const products = await listProducts();
  const artifacts = downloadIndex.reduce((sum, entry) => sum + entry.builds.length, 0);
  const topProducts = [...products].sort((a, b) => b.downloads - a.downloads).slice(0, 10);

  return (
    <>
      <PageTitle
        title="Downloads"
        description="Download volume, published artefacts and checksums."
        action={
          <Select aria-label="Date range" className="w-44" defaultValue="30d">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </Select>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Downloads (30d)" value={formatCompact(adminKpis.downloads30d)} change={adminKpis.downloadChange} icon={Download} />
        <StatTile label="Published artefacts" value={String(artifacts)} icon={HardDrive} />
        <StatTile label="Products in catalogue" value={String(products.length)} icon={HardDrive} />
      </div>

      <div className="mt-6">
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

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Most downloaded products</h2>
        <DataTable className="mt-5">
          <table className="w-full min-w-[46rem]">
            <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
              <tr>
                <Th>Product</Th>
                <Th>Current version</Th>
                <Th>Released</Th>
                <Th>Platforms</Th>
                <Th className="text-right">Artefacts</Th>
                <Th className="text-right">Total downloads</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {topProducts.map((product) => {
                const Icon = getIcon(product.icon);
                return (
                  <tr key={product.slug} className="transition-colors hover:bg-[var(--surface-muted)]">
                    <Td>
                      <span className="flex items-center gap-2.5">
                        <Icon className="size-4 shrink-0 text-[var(--primary)]" aria-hidden />
                        <Link href={`/products/${product.slug}`} className="font-medium hover:text-[var(--primary)]">
                          {product.name}
                        </Link>
                      </span>
                    </Td>
                    <Td className="font-mono text-xs">{product.version}</Td>
                    <Td className="text-[var(--muted-foreground)]">{formatDate(product.releaseDate)}</Td>
                    <Td>
                      <span className="flex items-center gap-1.5">
                        {product.platforms.map((platform) => {
                          const { Icon: PlatformIcon, label } = PLATFORM_META[platform];
                          return (
                            <span key={platform} title={label}>
                              <PlatformIcon width={14} height={14} aria-hidden />
                              <span className="sr-only">{label}</span>
                            </span>
                          );
                        })}
                      </span>
                    </Td>
                    <Td className="text-right tabular-nums">{product.builds.length}</Td>
                    <Td className="text-right font-medium tabular-nums">{formatCompact(product.downloads)}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </DataTable>
      </section>
    </>
  );
}
