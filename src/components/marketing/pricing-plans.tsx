"use client";

import * as React from "react";
import { ArrowRight, CircleCheck, Sparkles } from "lucide-react";
import { ANNUAL_DISCOUNT, annualSaving, planPrice, plans } from "@/data/pricing";
import { Badge, Card } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";

export type BillingCycle = "monthly" | "annual";

export function BillingToggle({
  cycle,
  onChange,
  className,
}: {
  cycle: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        role="radiogroup"
        aria-label="Billing cycle"
        className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface-muted)] p-1"
      >
        {(["monthly", "annual"] as const).map((value) => (
          <button
            key={value}
            role="radio"
            aria-checked={cycle === value}
            onClick={() => onChange(value)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium capitalize transition-all",
              cycle === value
                ? "bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--shadow-soft)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
            )}
          >
            {value}
          </button>
        ))}
      </div>
      <p className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
        <Sparkles className="size-4 text-[var(--accent)]" aria-hidden />
        Annual billing saves {Math.round(ANNUAL_DISCOUNT * 100)}% — up to{" "}
        <span className="font-semibold text-[var(--foreground)]">
          {formatCurrency(Math.max(...plans.map(annualSaving)))}
        </span>{" "}
        a year
      </p>
    </div>
  );
}

export function PlanCards({
  cycle,
  featureLimit,
}: {
  cycle: BillingCycle;
  featureLimit?: number;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {plans.map((plan) => {
        const price = planPrice(plan, cycle);
        const saving = annualSaving(plan);
        const features = featureLimit ? plan.features.slice(0, featureLimit) : plan.features;

        return (
          <Card
            key={plan.id}
            className={cn(
              "relative flex h-full flex-col p-7",
              plan.featured &&
                "border-[var(--primary)] shadow-[var(--shadow-float)] lg:-my-4 lg:scale-[1.02] lg:p-8",
            )}
          >
            {plan.featured ? (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-semibold text-[var(--primary-foreground)]">
                Most popular
              </span>
            ) : null}

            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <Badge tone={plan.featured ? "primary" : "neutral"}>{plan.seats}</Badge>
            </div>

            <p className="mt-3 min-h-[3.5rem] text-sm leading-relaxed text-[var(--muted-foreground)]">{plan.blurb}</p>

            <div className="mt-6 flex items-end gap-1.5">
              <span className="text-4xl font-semibold tracking-tight">{formatCurrency(price)}</span>
              <span className="pb-1.5 text-sm text-[var(--muted-foreground)]">/product /month</span>
            </div>
            <p className="mt-1.5 h-5 text-xs text-[var(--muted-foreground)]">
              {cycle === "annual" ? (
                <>
                  {formatCurrency(plan.annual)} billed yearly ·{" "}
                  <span className="font-medium text-[var(--success)]">save {formatCurrency(saving)}</span>
                </>
              ) : (
                <>Billed monthly, cancel anytime</>
              )}
            </p>

            <ButtonLink
              href={plan.id === "enterprise" ? "/contact?topic=sales" : "/download"}
              variant={plan.featured ? "primary" : "secondary"}
              size="lg"
              className="mt-6 w-full"
            >
              {plan.cta}
              <ArrowRight aria-hidden />
            </ButtonLink>

            <p className="mt-3 text-center text-xs text-[var(--muted-foreground)]">
              {plan.id === "enterprise" ? "Custom terms and volume pricing" : "30-day trial · no credit card"}
            </p>

            <ul className="mt-7 space-y-2.5 border-t border-[var(--border)] pt-6">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm">
                  <CircleCheck className="mt-0.5 size-4 shrink-0 text-[var(--success)]" aria-hidden />
                  <span className="text-[var(--muted-foreground)]">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>
        );
      })}
    </div>
  );
}

export function PricingPlansSection({ featureLimit }: { featureLimit?: number }) {
  const [cycle, setCycle] = React.useState<BillingCycle>("annual");
  return (
    <div className="space-y-12">
      <BillingToggle cycle={cycle} onChange={setCycle} />
      <PlanCards cycle={cycle} featureLimit={featureLimit} />
    </div>
  );
}
