import { Monitor, Search, ShieldCheck } from "lucide-react";
import { adminCustomers, offsetDays } from "@/data/demo-account";
import { listProducts } from "@/lib/repositories/products";
import type { Product } from "@/types";
import { pseudoSha256, seededInt } from "@/lib/hash";
import { Badge, Card, DataTable, Input, Select, Td, Th } from "@/components/ui/primitives";
import { PageTitle } from "@/components/layout/app-shell";
import { StatTile } from "@/components/charts/stat-tile";
import { PLATFORM_META } from "@/components/marketing/platform-icons";
import { formatCompact, formatDate } from "@/lib/utils";

const PLATFORMS = ["windows", "macos", "linux", "android", "ios"] as const;

const buildRegistrations = (products: Product[]) =>
  Array.from({ length: 16 }, (_, i) => {
  const customer = adminCustomers[i % adminCustomers.length];
  const platform = PLATFORMS[seededInt(`dev:${i}:p`, 0, PLATFORMS.length - 1)];
  const daysAgo = seededInt(`dev:${i}:d`, 0, 40);
  const isVm = seededInt(`dev:${i}:v`, 0, 7) === 0;
  return {
    id: `dev_${seededInt(`dev:${i}:id`, 100000, 999999)}`,
    hostname: `${customer.name.split(" ")[0].toUpperCase().slice(0, 4)}-${platform === "windows" ? "TILL" : "WS"}-${(i % 6) + 1}`,
    organisation: customer.name,
    product: products[seededInt(`dev:${i}:pr`, 0, products.length - 1)].name,
    platform,
    fingerprint: pseudoSha256(`dev:${i}`),
    isVm,
    lastSeen: offsetDays(-daysAgo).toISOString(),
    status: daysAgo > 21 ? "stale" : "active",
  };
});

export default async function AdminDevicesPage() {
  const registrations = buildRegistrations(await listProducts());
  const active = registrations.filter((d) => d.status === "active").length;
  const vms = registrations.filter((d) => d.isVm).length;

  return (
    <>
      <PageTitle
        title="Device registrations"
        description="Every activated device across the platform, with fingerprint and heartbeat status."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Devices registered" value={formatCompact(58_412)} icon={Monitor} />
        <StatTile label="Seen in last 21 days" value={String(active)} icon={ShieldCheck} />
        <StatTile label="Virtual machines" value={String(vms)} icon={Monitor} />
      </div>

      <Card className="mt-6 flex flex-col gap-3 p-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" aria-hidden />
          <Input
            type="search"
            placeholder="Search by hostname, fingerprint or organisation"
            aria-label="Search devices"
            className="border-transparent bg-[var(--surface-muted)] pl-10"
          />
        </div>
        <Select aria-label="Filter by platform" className="w-44 border-transparent bg-[var(--surface-muted)]" defaultValue="all">
          <option value="all">Any platform</option>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {PLATFORM_META[p].label}
            </option>
          ))}
        </Select>
      </Card>

      <DataTable className="mt-4">
        <table className="w-full min-w-[56rem]">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
            <tr>
              <Th>Device</Th>
              <Th>Organisation</Th>
              <Th>Product</Th>
              <Th>Platform</Th>
              <Th>Fingerprint (strict)</Th>
              <Th>Last heartbeat</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {registrations.map((device) => {
              const { Icon, label } = PLATFORM_META[device.platform];
              return (
                <tr key={device.id} className="transition-colors hover:bg-[var(--surface-muted)]">
                  <Td>
                    <span className="block font-medium">{device.hostname}</span>
                    <span className="block font-mono text-[11px] text-[var(--muted-foreground)]">{device.id}</span>
                  </Td>
                  <Td className="text-[var(--muted-foreground)]">{device.organisation}</Td>
                  <Td className="text-[var(--muted-foreground)]">{device.product}</Td>
                  <Td>
                    <span className="flex items-center gap-2 text-[var(--muted-foreground)]">
                      <Icon width={15} height={15} aria-hidden />
                      {label}
                      {device.isVm ? <Badge tone="neutral">VM</Badge> : null}
                    </span>
                  </Td>
                  <Td className="font-mono text-[11px] text-[var(--muted-foreground)]">
                    {device.fingerprint.slice(0, 16)}…
                  </Td>
                  <Td className="text-[var(--muted-foreground)]">{formatDate(device.lastSeen)}</Td>
                  <Td>
                    <Badge tone={device.status === "active" ? "success" : "warning"}>{device.status}</Badge>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </DataTable>

      <Card className="mt-8 p-6">
        <h2 className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="size-4 text-[var(--viz-good)]" aria-hidden />
          What is stored
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted-foreground)]">
          Only two hashes per device: a strict hash over every fingerprint component, and a tolerant hash that omits the
          swappable ones. Raw machine identifiers, disk serials and MAC addresses are hashed on the device and never
          transmitted, so a breach of this table yields hashes rather than a hardware inventory of our customers.
        </p>
      </Card>
    </>
  );
}
