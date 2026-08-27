import Link from "next/link";
import { ArrowRight, CreditCard, Receipt, Sparkles } from "lucide-react";
import { demoInvoices, demoLicenses, demoOrganisation } from "@/data/demo-account";
import { annualSaving, plans } from "@/data/pricing";
import { Badge, Card, DataTable, Td, Th } from "@/components/ui/primitives";
import { Button, ButtonLink } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/app-shell";
import { StatTile } from "@/components/charts/stat-tile";
import { formatCurrency, formatDate } from "@/lib/utils";

const PAYMENT_METHODS = [
  { label: "Visa ending 4242", detail: "Expires 08/2029 · default", primary: true, icon: CreditCard },
  { label: "GCash · 0917 ••• 4410", detail: "Backup method", primary: false, icon: CreditCard },
];

export default function PortalBillingPage() {
  const paying = demoLicenses.filter((l) => l.amount > 0);
  const annual = paying.reduce((sum, l) => sum + l.amount, 0);
  const businessPlan = plans.find((p) => p.id === "business")!;
  const nextRenewal = paying.reduce(
    (soonest, l) => (l.subscriptionEndsAt && (!soonest || l.subscriptionEndsAt < soonest) ? l.subscriptionEndsAt : soonest),
    null as string | null,
  );

  return (
    <>
      <PageTitle
        title="Billing"
        description={`${demoOrganisation.name} · ${demoOrganisation.plan} plan · billed annually`}
        action={
          <ButtonLink href="/pricing" variant="secondary" size="sm">
            Compare plans
          </ButtonLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Annual commitment" value={formatCurrency(annual)} icon={Receipt} />
        <StatTile label="Paid subscriptions" value={String(paying.length)} icon={CreditCard} />
        <StatTile
          label="Next renewal"
          value={nextRenewal ? formatDate(nextRenewal) : "—"}
          icon={Sparkles}
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* Subscriptions */}
        <Card className="p-5">
          <h2 className="font-semibold">Active subscriptions</h2>
          <DataTable className="mt-4 border-0">
            <table className="w-full min-w-[32rem]">
              <thead className="border-b border-[var(--border)]">
                <tr>
                  <Th>Product</Th>
                  <Th>Plan</Th>
                  <Th>Renews</Th>
                  <Th className="text-right">Amount</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {paying.map((license) => (
                  <tr key={license.id}>
                    <Td className="font-medium">{license.productName}</Td>
                    <Td className="capitalize text-[var(--muted-foreground)]">
                      {license.plan} · {license.cycle}
                    </Td>
                    <Td className="text-[var(--muted-foreground)]">
                      {license.subscriptionEndsAt ? formatDate(license.subscriptionEndsAt) : "—"}
                    </Td>
                    <Td className="text-right tabular-nums">{formatCurrency(license.amount)}/yr</Td>
                    <Td className="text-right">
                      <Button variant="ghost" size="sm">
                        Change
                      </Button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataTable>

          <div className="mt-5 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary-soft)] p-4">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="size-4 text-[var(--primary)]" aria-hidden />
              Bundle discount applied
            </p>
            <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">
              You run {paying.length} products, so a 15% multi-product discount is already reflected above. It rises to
              20% at three products and 25% at four.
            </p>
          </div>
        </Card>

        {/* Payment methods */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">Payment methods</h2>
              <Button variant="ghost" size="sm">
                Add
              </Button>
            </div>
            <ul className="mt-4 space-y-3">
              {PAYMENT_METHODS.map(({ label, detail, primary, icon: Icon }) => (
                <li key={label} className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-3">
                  <Icon className="size-5 shrink-0 text-[var(--muted-foreground)]" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{label}</p>
                    <p className="truncate text-xs text-[var(--muted-foreground)]">{detail}</p>
                  </div>
                  {primary ? <Badge tone="primary">Default</Badge> : null}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-[var(--muted-foreground)]">
              Card and direct debit are processed by Stripe. PayPal, GCash, Maya and bank transfer are also accepted.
            </p>
          </Card>

          <Card className="p-5">
            <h2 className="font-semibold">Billing details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ["Organisation", demoOrganisation.name],
                ["Billing email", demoOrganisation.billingEmail],
                ["Address", demoOrganisation.address],
                ["Country", demoOrganisation.country],
                ["Customer since", formatDate(demoOrganisation.since)],
              ].map(([label, value]) => (
                <div key={label} className="border-b border-[var(--border)] pb-3 last:border-0 last:pb-0">
                  <dt className="text-xs text-[var(--muted-foreground)]">{label}</dt>
                  <dd className="mt-0.5 font-medium">{value}</dd>
                </div>
              ))}
            </dl>
            <Button variant="secondary" size="sm" className="mt-4 w-full">
              Edit billing details
            </Button>
          </Card>
        </div>
      </div>

      {/* Upgrade prompt */}
      <Card className="mt-8 p-6">
        <div className="flex flex-wrap items-center gap-6">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold">Thinking about Enterprise?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)]">
              Unlimited users and devices, full API write access, SSO, and the ability to set your own trial, grace and
              retention policy. Switching from {businessPlan.name} is prorated and takes effect immediately.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2">
            <ButtonLink href="/contact?topic=sales" size="sm">
              Talk to sales
              <ArrowRight aria-hidden />
            </ButtonLink>
            <p className="text-center text-xs text-[var(--muted-foreground)]">
              Annual saves {formatCurrency(annualSaving(businessPlan))}
            </p>
          </div>
        </div>
      </Card>

      <p className="mt-6 text-sm text-[var(--muted-foreground)]">
        Looking for a specific document?{" "}
        <Link href="/portal/invoices" className="font-medium text-[var(--primary)] hover:underline">
          All {demoInvoices.length} invoices
        </Link>
      </p>
    </>
  );
}
