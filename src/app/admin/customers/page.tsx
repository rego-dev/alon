import { Download, Search, Users } from "lucide-react";
import { adminCustomers, adminKpis } from "@/data/demo-account";
import { Badge, Card, DataTable, Input, Select, Td, Th } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/app-shell";
import { StatTile } from "@/components/charts/stat-tile";
import { formatCompact, formatCurrency, formatDate } from "@/lib/utils";

const STATUS_TONE = {
  active: "success",
  trial: "primary",
  grace: "warning",
  past_due: "danger",
} as const;

export default function AdminCustomersPage() {
  const mrr = adminCustomers.reduce((sum, c) => sum + c.mrr, 0);

  return (
    <>
      <PageTitle
        title="Customers"
        description="Organisations, their plans, seat usage and revenue contribution."
        action={
          <Button variant="secondary" size="sm">
            <Download aria-hidden />
            Export CSV
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Active customers" value={formatCompact(adminKpis.activeCustomers)} change={adminKpis.customerChange} icon={Users} />
        <StatTile label="MRR from top accounts" value={formatCurrency(mrr)} icon={Users} />
        <StatTile label="Average revenue per account" value={formatCurrency(Math.round(mrr / adminCustomers.length))} icon={Users} />
      </div>

      <Card className="mt-6 flex flex-col gap-3 p-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" aria-hidden />
          <Input
            type="search"
            placeholder="Search organisations, domains or licence keys"
            aria-label="Search customers"
            className="border-transparent bg-[var(--surface-muted)] pl-10"
          />
        </div>
        <Select aria-label="Filter by plan" className="w-40 border-transparent bg-[var(--surface-muted)]" defaultValue="all">
          <option value="all">All plans</option>
          <option value="starter">Starter</option>
          <option value="business">Business</option>
          <option value="enterprise">Enterprise</option>
        </Select>
        <Select aria-label="Filter by status" className="w-40 border-transparent bg-[var(--surface-muted)]" defaultValue="all">
          <option value="all">Any status</option>
          <option value="active">Active</option>
          <option value="trial">Trial</option>
          <option value="grace">Grace</option>
          <option value="past_due">Past due</option>
        </Select>
      </Card>

      <DataTable className="mt-4">
        <table className="w-full min-w-[52rem]">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
            <tr>
              <Th>Organisation</Th>
              <Th>Plan</Th>
              <Th className="text-right">Products</Th>
              <Th>Seats</Th>
              <Th className="text-right">MRR</Th>
              <Th>Customer since</Th>
              <Th>Country</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {adminCustomers.map((customer) => (
              <tr key={customer.name} className="transition-colors hover:bg-[var(--surface-muted)]">
                <Td className="font-medium">{customer.name}</Td>
                <Td className="text-[var(--muted-foreground)]">{customer.plan}</Td>
                <Td className="text-right tabular-nums">{customer.products}</Td>
                <Td className="text-[var(--muted-foreground)]">{customer.seats}</Td>
                <Td className="text-right font-medium tabular-nums">{formatCurrency(customer.mrr)}</Td>
                <Td className="text-[var(--muted-foreground)]">{formatDate(customer.since)}</Td>
                <Td className="text-[var(--muted-foreground)]">{customer.country}</Td>
                <Td>
                  <Badge tone={STATUS_TONE[customer.status as keyof typeof STATUS_TONE]}>
                    {customer.status.replace("_", " ")}
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
