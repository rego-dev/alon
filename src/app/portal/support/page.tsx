import { Clock, LifeBuoy, MessageCircle, Phone } from "lucide-react";
import { company } from "@/data/company";
import { demoTickets as tickets } from "@/data/demo-account";
import { Badge, Card, DataTable, Td, Th } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/app-shell";
import { TicketForm } from "@/components/forms/ticket-form";
import { formatDate } from "@/lib/utils";

export default function PortalSupportPage() {
  return (
    <>
      <PageTitle
        title="Support"
        description="Your organisation is on Business: 1-hour first response, phone and remote assistance included."
        action={
          <ButtonLink href={`tel:${company.supportPhone.replace(/\s/g, "")}`} variant="secondary" size="sm">
            <Phone aria-hidden />
            {company.supportPhone}
          </ButtonLink>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="font-semibold">Your tickets</h2>
            <DataTable className="mt-4 border-0">
              <table className="w-full min-w-[30rem]">
                <thead className="border-b border-[var(--border)]">
                  <tr>
                    <Th>Reference</Th>
                    <Th>Subject</Th>
                    <Th>Updated</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {tickets.map((ticket) => (
                    <tr key={ticket.reference} className="transition-colors hover:bg-[var(--surface-muted)]">
                      <Td className="font-mono text-xs font-medium">{ticket.reference}</Td>
                      <Td>
                        <span className="block">{ticket.subject}</span>
                        <span className="block text-xs text-[var(--muted-foreground)]">
                          {ticket.product} · {ticket.assignee}
                        </span>
                      </Td>
                      <Td className="text-[var(--muted-foreground)]">{formatDate(ticket.updated)}</Td>
                      <Td>
                        <Badge
                          tone={
                            ticket.status === "resolved"
                              ? "success"
                              : ticket.status === "in_progress"
                                ? "primary"
                                : "warning"
                          }
                        >
                          {ticket.status.replace("_", " ")}
                        </Badge>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DataTable>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <MessageCircle className="size-5 text-[var(--primary)]" aria-hidden />
              <h3 className="mt-3 font-semibold">Live chat</h3>
              <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">
                Median first response under four minutes during business hours.
              </p>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                <Clock className="size-3.5" aria-hidden />
                Mon–Fri, 07:00–21:00 UTC
              </p>
            </Card>

            <Card className="p-5">
              <LifeBuoy className="size-5 text-[var(--primary)]" aria-hidden />
              <h3 className="mt-3 font-semibold">Remote assistance</h3>
              <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">
                Start from inside the app under Help → Remote assistance. Codes expire in 15 minutes.
              </p>
              <p className="mt-3 text-xs text-[var(--muted-foreground)]">We never hold standing access.</p>
            </Card>
          </div>
        </div>

        <TicketForm
          products={[
            { slug: "grocery-pos", name: "Grocery POS" },
            { slug: "inventory-management", name: "Inventory Management" },
            { slug: "accounting-software", name: "Accounting Software" },
            { slug: "payroll", name: "Payroll" },
            { slug: "crm", name: "CRM" },
            { slug: "other", name: "Something else" },
          ]}
        />
      </div>
    </>
  );
}
