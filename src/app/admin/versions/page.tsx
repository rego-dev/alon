import Link from "next/link";
import { Layers, Rocket } from "lucide-react";
import { releaseFeed } from "@/data/downloads";
import { products } from "@/data/products";
import { getIcon } from "@/lib/icons";
import { Badge, Card, DataTable, Td, Th } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/app-shell";
import { StatTile } from "@/components/charts/stat-tile";
import { formatDate } from "@/lib/utils";

export default function AdminVersionsPage() {
  const totalReleases = products.reduce((sum, p) => sum + p.releases.length, 0);

  return (
    <>
      <PageTitle
        title="Software versions"
        description="Every release across the catalogue. The train ships every six weeks; security fixes ship the day they are ready."
        action={
          <Button size="sm">
            <Rocket aria-hidden />
            Cut a release
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Tracked releases" value={String(totalReleases)} icon={Layers} />
        <StatTile label="Products on stable" value={String(products.length)} icon={Rocket} />
        <StatTile label="Next train" value="6 Oct 2026" icon={Layers} />
      </div>

      <DataTable className="mt-8">
        <table className="w-full min-w-[52rem]">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
            <tr>
              <Th>Product</Th>
              <Th>Version</Th>
              <Th>Channel</Th>
              <Th>Released</Th>
              <Th>Highlights</Th>
              <Th className="text-right">Changes</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {releaseFeed.map((release) => {
              const Icon = getIcon(release.icon);
              return (
                <tr key={`${release.slug}-${release.version}`} className="transition-colors hover:bg-[var(--surface-muted)]">
                  <Td>
                    <span className="flex items-center gap-2.5">
                      <Icon className="size-4 shrink-0 text-[var(--primary)]" aria-hidden />
                      <Link href={`/products/${release.slug}#releases`} className="font-medium hover:text-[var(--primary)]">
                        {release.product}
                      </Link>
                    </span>
                  </Td>
                  <Td className="font-mono text-xs">{release.version}</Td>
                  <Td>
                    <Badge tone={release.channel === "stable" ? "success" : "warning"}>{release.channel}</Badge>
                  </Td>
                  <Td className="text-[var(--muted-foreground)]">{formatDate(release.date)}</Td>
                  <Td className="max-w-md whitespace-normal text-[var(--muted-foreground)]">{release.highlights[0]}</Td>
                  <Td className="text-right tabular-nums">{release.highlights.length + release.fixes.length}</Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </DataTable>

      <Card className="mt-8 p-6">
        <h2 className="font-semibold">Release train</h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            { phase: "Weeks 1–4", title: "Development", body: "Feature work merges behind flags. Main stays releasable." },
            { phase: "Week 5", title: "Stabilisation", body: "No new features. Bug burn-down, performance runs, accessibility audit." },
            { phase: "Week 6", title: "Staged rollout", body: "5% → 25% → 100%, with automatic rollback on a crash-rate regression." },
          ].map((step, i) => (
            <li key={step.title} className="rounded-lg border border-[var(--border)] p-4">
              <span className="grid size-7 place-items-center rounded-full bg-[var(--primary)] text-xs font-semibold text-[var(--primary-foreground)]">
                {i + 1}
              </span>
              <p className="mt-3 text-xs font-medium text-[var(--primary)]">{step.phase}</p>
              <p className="mt-0.5 font-medium">{step.title}</p>
              <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">{step.body}</p>
            </li>
          ))}
        </ol>
      </Card>
    </>
  );
}
