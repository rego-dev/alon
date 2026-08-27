import { KeyRound, Search } from "lucide-react";
import { adminCustomers, licenseStateBreakdown, offsetDays } from "@/data/demo-account";
import { products } from "@/data/products";
import { seededInt } from "@/lib/hash";
import { Badge, Card, DataTable, Input, Select, Td, Th } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/app-shell";
import { StatusBreakdown } from "@/components/charts/stat-tile";
import { formatDate } from "@/lib/utils";

const STATES = ["active", "trial", "grace", "expired", "suspended"] as const;
const STATE_TONE = {
  active: "success",
  trial: "primary",
  grace: "warning",
  expired: "danger",
  suspended: "neutral",
} as const;

const STATUS_MAP = { success: "good", primary: "good", warning: "warning", danger: "critical", neutral: "neutral" } as const;

// A representative page of the licence register.
const rows = Array.from({ length: 16 }, (_, i) => {
  const product = products[seededInt(`lic:${i}:p`, 0, products.length - 1)];
  const customer = adminCustomers[i % adminCustomers.length];
  const state = STATES[seededInt(`lic:${i}:s`, 0, STATES.length - 1)];
  return {
    key: `${product.name.slice(0, 4).toUpperCase()}-${seededInt(`lic:${i}:a`, 1000, 9999)}-${seededInt(`lic:${i}:b`, 1000, 9999)}`,
    product: product.name,
    organisation: customer.name,
    plan: customer.plan,
    state,
    devices: `${seededInt(`lic:${i}:d`, 1, 8)} / ${seededInt(`lic:${i}:l`, 8, 10)}`,
    issued: offsetDays(-seededInt(`lic:${i}:i`, 60, 900)).toISOString(),
    renews: offsetDays(seededInt(`lic:${i}:r`, -30, 340)).toISOString(),
  };
});

export default function AdminLicensesPage() {
  return (
    <>
      <PageTitle
        title="Licences"
        description="The licence register. Every row evaluates through the same state machine the client uses."
        action={
          <Button variant="secondary" size="sm">
            <KeyRound aria-hidden />
            Issue a licence
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <StatusBreakdown
          title="Licences by state"
          items={licenseStateBreakdown.map((row) => ({
            label: row.state,
            count: row.count,
            status: STATUS_MAP[row.tone],
          }))}
        />

        <Card className="p-5">
          <h2 className="text-sm font-semibold">Phase boundaries in force</h2>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Platform defaults. Enterprise organisations override these per tenant.
          </p>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              ["Trial", "30 days, all features"],
              ["Grace", "7–30 days, read-only with export"],
              ["Retention after grace", "30 days by default, up to 365"],
              ["Offline tolerance", "14 days (90 on Enterprise)"],
              ["Reminders", "Day 1, 3, 7 and 24h before lock"],
              ["Trial per organisation", "One, unless extended"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-[var(--border)] p-3">
                <dt className="text-xs text-[var(--muted-foreground)]">{label}</dt>
                <dd className="mt-0.5 text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      <Card className="mt-6 flex flex-col gap-3 p-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" aria-hidden />
          <Input
            type="search"
            placeholder="Search by licence key, organisation or product"
            aria-label="Search licences"
            className="border-transparent bg-[var(--surface-muted)] pl-10"
          />
        </div>
        <Select aria-label="Filter by state" className="w-44 border-transparent bg-[var(--surface-muted)]" defaultValue="all">
          <option value="all">Any state</option>
          {STATES.map((state) => (
            <option key={state} value={state} className="capitalize">
              {state}
            </option>
          ))}
        </Select>
      </Card>

      <DataTable className="mt-4">
        <table className="w-full min-w-[54rem]">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
            <tr>
              <Th>Licence key</Th>
              <Th>Product</Th>
              <Th>Organisation</Th>
              <Th>Plan</Th>
              <Th>State</Th>
              <Th>Devices</Th>
              <Th>Issued</Th>
              <Th>Renews / ends</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {rows.map((row) => (
              <tr key={row.key} className="transition-colors hover:bg-[var(--surface-muted)]">
                <Td className="font-mono text-xs font-medium">{row.key}</Td>
                <Td>{row.product}</Td>
                <Td className="text-[var(--muted-foreground)]">{row.organisation}</Td>
                <Td className="text-[var(--muted-foreground)]">{row.plan}</Td>
                <Td>
                  <Badge tone={STATE_TONE[row.state]}>{row.state}</Badge>
                </Td>
                <Td className="tabular-nums text-[var(--muted-foreground)]">{row.devices}</Td>
                <Td className="text-[var(--muted-foreground)]">{formatDate(row.issued)}</Td>
                <Td className="text-[var(--muted-foreground)]">{formatDate(row.renews)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </>
  );
}
