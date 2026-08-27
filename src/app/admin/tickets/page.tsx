import { Clock, LifeBuoy, TriangleAlert } from "lucide-react";
import { adminCustomers, offsetDays } from "@/data/demo-account";
import { products } from "@/data/products";
import { seededInt } from "@/lib/hash";
import { Badge, Card, DataTable, Select, Td, Th } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/app-shell";
import { StatTile } from "@/components/charts/stat-tile";
import { formatDate } from "@/lib/utils";

const SUBJECTS = [
  "Receipt printer stops after shift change",
  "Import mapping not remembered between sessions",
  "Sync conflict on price list after branch reconnect",
  "Activation fails with LIC-409 on replacement till",
  "Statutory contribution table appears out of date",
  "Scheduled report not delivered on the 1st",
  "Barcode scanner reads but does not add the line",
  "Cannot restore from last night's backup",
  "Multi-branch consolidation shows stale figures",
  "Offline queue not draining after reconnect",
  "PDF export renders blank on Linux",
  "Question about seat limits on Business",
];

const SEVERITIES = ["production-down", "high", "normal", "normal", "low", "question"] as const;
const STATUSES = ["open", "in_progress", "pending_customer", "resolved"] as const;
const AGENTS = ["Alex R.", "Nina P.", "Marco D.", "Grace L.", "Unassigned"];

const tickets = SUBJECTS.map((subject, i) => {
  const severity = SEVERITIES[seededInt(`tk:${i}:sev`, 0, SEVERITIES.length - 1)];
  const status = STATUSES[seededInt(`tk:${i}:st`, 0, STATUSES.length - 1)];
  return {
    reference: `ALN-${47_800 + i * seededInt(`tk:${i}:r`, 3, 29)}`,
    subject,
    organisation: adminCustomers[i % adminCustomers.length].name,
    product: products[seededInt(`tk:${i}:p`, 0, products.length - 1)].name,
    severity,
    status,
    agent: AGENTS[seededInt(`tk:${i}:a`, 0, AGENTS.length - 1)],
    opened: offsetDays(-seededInt(`tk:${i}:o`, 0, 14)).toISOString(),
    firstResponseMins: seededInt(`tk:${i}:f`, 3, 240),
  };
});

const SEVERITY_TONE = {
  "production-down": "danger",
  high: "warning",
  normal: "primary",
  low: "neutral",
  question: "neutral",
} as const;

const STATUS_TONE = {
  open: "warning",
  in_progress: "primary",
  pending_customer: "neutral",
  resolved: "success",
} as const;

export default function AdminTicketsPage() {
  const open = tickets.filter((t) => t.status !== "resolved").length;
  const urgent = tickets.filter((t) => t.severity === "production-down").length;
  const breaching = tickets.filter((t) => t.firstResponseMins > 60 && t.severity !== "question").length;
  const median = [...tickets].sort((a, b) => a.firstResponseMins - b.firstResponseMins)[Math.floor(tickets.length / 2)];

  return (
    <>
      <PageTitle
        title="Support tickets"
        description="The queue. Production-down tickets bypass it and page the on-call engineer."
        action={
          <Select aria-label="Filter queue" className="w-44" defaultValue="open">
            <option value="open">Open tickets</option>
            <option value="all">All tickets</option>
            <option value="mine">Assigned to me</option>
            <option value="unassigned">Unassigned</option>
          </Select>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Open tickets" value={String(open)} icon={LifeBuoy} />
        <StatTile label="Production down" value={String(urgent)} icon={TriangleAlert} />
        <StatTile label="Median first response" value={`${median.firstResponseMins} min`} icon={Clock} />
        <StatTile label="Past SLA" value={String(breaching)} icon={TriangleAlert} />
      </div>

      {urgent ? (
        <Card className="mt-6 flex flex-wrap items-center gap-4 border-[var(--viz-critical)]/40 bg-[var(--danger-soft)] p-5">
          <TriangleAlert className="size-5 shrink-0 text-[var(--viz-critical)]" aria-hidden />
          <p className="min-w-0 flex-1 text-sm">
            <span className="font-medium">
              {urgent} production-down {urgent === 1 ? "ticket" : "tickets"} in the queue.
            </span>{" "}
            <span className="text-[var(--muted-foreground)]">
              These page the on-call engineer directly and carry a 15-minute response target.
            </span>
          </p>
          <Button size="sm" variant="danger">
            View escalations
          </Button>
        </Card>
      ) : null}

      <DataTable className="mt-6">
        <table className="w-full min-w-[62rem]">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
            <tr>
              <Th>Reference</Th>
              <Th>Subject</Th>
              <Th>Organisation</Th>
              <Th>Product</Th>
              <Th>Severity</Th>
              <Th>Status</Th>
              <Th>Assignee</Th>
              <Th>Opened</Th>
              <Th className="text-right">First response</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {tickets.map((ticket) => (
              <tr key={ticket.reference} className="transition-colors hover:bg-[var(--surface-muted)]">
                <Td className="font-mono text-xs font-medium">{ticket.reference}</Td>
                <Td className="max-w-sm whitespace-normal">{ticket.subject}</Td>
                <Td className="text-[var(--muted-foreground)]">{ticket.organisation}</Td>
                <Td className="text-[var(--muted-foreground)]">{ticket.product}</Td>
                <Td>
                  <Badge tone={SEVERITY_TONE[ticket.severity]}>{ticket.severity.replace("-", " ")}</Badge>
                </Td>
                <Td>
                  <Badge tone={STATUS_TONE[ticket.status]}>{ticket.status.replace("_", " ")}</Badge>
                </Td>
                <Td className="text-[var(--muted-foreground)]">{ticket.agent}</Td>
                <Td className="text-[var(--muted-foreground)]">{formatDate(ticket.opened)}</Td>
                <Td
                  className={`text-right tabular-nums ${ticket.firstResponseMins > 60 ? "text-[var(--viz-critical)]" : "text-[var(--muted-foreground)]"}`}
                >
                  {ticket.firstResponseMins} min
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </>
  );
}
