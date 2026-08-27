import { Plus, Ticket } from "lucide-react";
import { Badge, Card, DataTable, Td, Th } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/app-shell";
import { StatTile } from "@/components/charts/stat-tile";
import { formatCurrency, formatDate } from "@/lib/utils";

const coupons = [
  { code: "NONPROFIT40", description: "Registered non-profits, schools and public clinics", percentOff: 40, plans: "All", redeemed: 412, max: null, validUntil: null, active: true },
  { code: "MIGRATE25", description: "Switching from a competitor, first year", percentOff: 25, plans: "Business, Enterprise", redeemed: 186, max: 500, validUntil: "2026-12-31", active: true },
  { code: "APAC-LAUNCH", description: "Regional launch promotion", percentOff: 20, plans: "All", redeemed: 934, max: 1000, validUntil: "2026-09-30", active: true },
  { code: "PARTNER15", description: "Referred by an implementation partner", percentOff: 15, plans: "All", redeemed: 268, max: null, validUntil: null, active: true },
  { code: "CONF2026", description: "Trade show attendees, three months free", percentOff: 100, plans: "Starter", redeemed: 74, max: 200, validUntil: "2026-06-30", active: false },
  { code: "WINBACK30", description: "Lapsed customers returning within 12 months", percentOff: 30, plans: "All", redeemed: 51, max: null, validUntil: "2027-03-31", active: true },
];

export default function AdminCouponsPage() {
  const active = coupons.filter((c) => c.active).length;
  const redemptions = coupons.reduce((sum, c) => sum + c.redeemed, 0);
  // Rough discount exposure at an assumed average of $89/month.
  const exposure = coupons.reduce((sum, c) => sum + c.redeemed * 89 * (c.percentOff / 100), 0);

  return (
    <>
      <PageTitle
        title="Coupons"
        description="Discount codes, their limits and how much they have been used."
        action={
          <Button size="sm">
            <Plus aria-hidden />
            New coupon
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Active coupons" value={String(active)} icon={Ticket} />
        <StatTile label="Total redemptions" value={String(redemptions)} icon={Ticket} />
        <StatTile label="Monthly discount exposure" value={formatCurrency(Math.round(exposure))} icon={Ticket} />
      </div>

      <DataTable className="mt-8">
        <table className="w-full min-w-[52rem]">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
            <tr>
              <Th>Code</Th>
              <Th>Description</Th>
              <Th className="text-right">Discount</Th>
              <Th>Applies to</Th>
              <Th className="text-right">Redeemed</Th>
              <Th>Expires</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {coupons.map((coupon) => (
              <tr key={coupon.code} className="transition-colors hover:bg-[var(--surface-muted)]">
                <Td className="font-mono text-xs font-semibold">{coupon.code}</Td>
                <Td className="max-w-sm whitespace-normal text-[var(--muted-foreground)]">{coupon.description}</Td>
                <Td className="text-right font-medium tabular-nums">{coupon.percentOff}%</Td>
                <Td className="text-[var(--muted-foreground)]">{coupon.plans}</Td>
                <Td className="text-right tabular-nums">
                  {coupon.redeemed}
                  {coupon.max ? <span className="text-[var(--muted-foreground)]"> / {coupon.max}</span> : null}
                </Td>
                <Td className="text-[var(--muted-foreground)]">
                  {coupon.validUntil ? formatDate(coupon.validUntil) : "No expiry"}
                </Td>
                <Td>
                  <Badge tone={coupon.active ? "success" : "neutral"}>{coupon.active ? "Active" : "Ended"}</Badge>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>

      <Card className="mt-8 p-6">
        <h2 className="font-semibold">Automatic discounts</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)]">
          These are applied at checkout without a code, and stack with at most one coupon. The customer always pays the
          better of the two rather than both.
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Second product", value: "15% off" },
            { label: "Third product", value: "20% off" },
            { label: "Four or more", value: "25% off" },
          ].map((rule) => (
            <li key={rule.label} className="rounded-lg border border-[var(--border)] p-4">
              <p className="text-sm text-[var(--muted-foreground)]">{rule.label}</p>
              <p className="mt-1 text-lg font-semibold">{rule.value}</p>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
