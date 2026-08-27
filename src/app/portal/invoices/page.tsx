import { Download, Receipt } from "lucide-react";
import { demoInvoices } from "@/data/demo-account";
import { Badge, Card, DataTable, Td, Th } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/app-shell";
import { StatTile } from "@/components/charts/stat-tile";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function PortalInvoicesPage() {
  const paidTotal = demoInvoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.total, 0);
  const outstanding = demoInvoices.filter((i) => i.status !== "paid").reduce((sum, i) => sum + i.total, 0);

  return (
    <>
      <PageTitle
        title="Invoices"
        description="Every invoice issued to your organisation, with hosted copies and PDFs."
        action={
          <Button variant="secondary" size="sm">
            <Download aria-hidden />
            Export all as CSV
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Paid to date" value={formatCurrency(paidTotal)} icon={Receipt} />
        <StatTile label="Outstanding" value={formatCurrency(outstanding)} icon={Receipt} />
        <StatTile label="Invoices issued" value={String(demoInvoices.length)} icon={Receipt} />
      </div>

      <DataTable className="mt-8">
        <table className="w-full min-w-[46rem]">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
            <tr>
              <Th>Invoice</Th>
              <Th>Description</Th>
              <Th>Issued</Th>
              <Th>Due</Th>
              <Th>Method</Th>
              <Th className="text-right">Total</Th>
              <Th>Status</Th>
              <Th className="text-right">PDF</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {demoInvoices.map((invoice) => (
              <tr key={invoice.id} className="transition-colors hover:bg-[var(--surface-muted)]">
                <Td className="font-mono text-xs font-medium">{invoice.number}</Td>
                <Td className="text-[var(--muted-foreground)]">{invoice.description}</Td>
                <Td className="text-[var(--muted-foreground)]">{formatDate(invoice.issuedAt)}</Td>
                <Td className="text-[var(--muted-foreground)]">{formatDate(invoice.dueAt)}</Td>
                <Td className="text-[var(--muted-foreground)]">{invoice.method}</Td>
                <Td className="text-right font-medium tabular-nums">{formatCurrency(invoice.total)}</Td>
                <Td>
                  <Badge tone={invoice.status === "paid" ? "success" : invoice.status === "open" ? "warning" : "danger"}>
                    {invoice.status.replace("_", " ")}
                  </Badge>
                </Td>
                <Td className="text-right">
                  <Button variant="ghost" size="sm" aria-label={`Download ${invoice.number} as PDF`}>
                    <Download aria-hidden />
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>

      <Card className="mt-8 p-6">
        <h2 className="font-semibold">Need an invoice changed?</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)]">
          Purchase order numbers, VAT identifiers and billing addresses can be added retroactively and the invoice
          reissued. Contact billing and we will send a corrected copy the same day.
        </p>
      </Card>
    </>
  );
}
