import Link from "next/link";
import { ArrowRight, Boxes, Download, KeyRound, LifeBuoy, Monitor, TriangleAlert, Users } from "lucide-react";
import { demoDevices, demoInvoices, demoLicenses, demoOrganisation, demoTickets } from "@/data/demo-account";
import { Badge, Card } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/app-shell";
import { LicenseCard } from "@/components/portal/license-card";
import { StatTile } from "@/components/charts/stat-tile";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function PortalDashboard() {
  const active = demoLicenses.filter((l) => l.state === "active").length;
  const attention = demoLicenses.filter((l) => l.state === "grace" || l.state === "expired");
  const devicesActive = demoDevices.filter((d) => d.status === "active").length;
  const annualSpend = demoLicenses.reduce((sum, l) => sum + l.amount, 0);

  return (
    <>
      <PageTitle
        title={`Welcome back, ${demoOrganisation.owner.name.split(" ")[0]}`}
        description={`${demoOrganisation.name} · ${demoOrganisation.plan} plan · ${demoOrganisation.branches} branches`}
        action={
          <ButtonLink href="/download">
            <Download aria-hidden />
            Download software
          </ButtonLink>
        }
      />

      {/* Attention banner */}
      {attention.length ? (
        <div className="mb-6 flex flex-wrap items-center gap-4 rounded-[var(--radius-card)] border border-[var(--viz-warning)]/40 bg-[var(--warning-soft)] p-5">
          <TriangleAlert className="size-5 shrink-0 text-[var(--viz-warning)]" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="font-medium">
              {attention.length} {attention.length === 1 ? "licence needs" : "licences need"} attention
            </p>
            <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
              {attention.map((l) => l.productName).join(" and ")} —{" "}
              {attention[0].state === "grace"
                ? "read-only until you subscribe. Your data is intact and export still works."
                : "locked, with data retained for now."}
            </p>
          </div>
          <ButtonLink href="/pricing" size="sm">
            Subscribe now
            <ArrowRight aria-hidden />
          </ButtonLink>
        </div>
      ) : null}

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Active licences" value={String(active)} icon={KeyRound} />
        <StatTile label="Registered devices" value={`${devicesActive} / ${demoDevices.length}`} icon={Monitor} />
        <StatTile
          label="Users"
          value={`${demoOrganisation.seatsUsed} / ${demoOrganisation.seats}`}
          icon={Users}
        />
        <StatTile label="Annual spend" value={formatCurrency(annualSpend)} icon={Boxes} />
      </div>

      {/* Licences */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Your licences</h2>
          <Link href="/portal/licenses" className="text-sm font-medium text-[var(--primary)] hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {demoLicenses.map((license) => (
            <LicenseCard key={license.id} license={license} />
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-semibold">Recent invoices</h2>
            <Link href="/portal/invoices" className="text-sm font-medium text-[var(--primary)] hover:underline">
              All invoices
            </Link>
          </div>
          <ul className="divide-y divide-[var(--border)]">
            {demoInvoices.slice(0, 4).map((invoice) => (
              <li key={invoice.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{invoice.number}</p>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">{invoice.description}</p>
                </div>
                <span className="shrink-0 text-sm font-medium tabular-nums">{formatCurrency(invoice.total)}</span>
                <Badge tone={invoice.status === "paid" ? "success" : "warning"}>{invoice.status}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-semibold">Support tickets</h2>
            <Link href="/portal/support" className="text-sm font-medium text-[var(--primary)] hover:underline">
              All tickets
            </Link>
          </div>
          <ul className="divide-y divide-[var(--border)]">
            {demoTickets.map((ticket) => (
              <li key={ticket.reference} className="flex items-start gap-3 py-3">
                <LifeBuoy className="mt-0.5 size-4 shrink-0 text-[var(--muted-foreground)]" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{ticket.subject}</p>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">
                    {ticket.reference} · {ticket.product} · updated {formatDate(ticket.updated)}
                  </p>
                </div>
                <Badge
                  tone={
                    ticket.status === "resolved" ? "success" : ticket.status === "in_progress" ? "primary" : "warning"
                  }
                >
                  {ticket.status.replace("_", " ")}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
