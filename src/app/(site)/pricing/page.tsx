import { Fragment } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck, Minus, ShieldCheck, Sparkles, X } from "lucide-react";
import { comparisonGroups, pricingFaqs } from "@/data/pricing";
import { Badge, Card, DataTable, Section, SectionHeading, Td, Th } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { Accordion } from "@/components/ui/interactive";
import { PricingPlansSection } from "@/components/marketing/pricing-plans";
import { PageHeader } from "@/components/marketing/page-header";
import { JsonLd, breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Pricing — Starter, Business and Enterprise Plans",
  description:
    "Transparent per-product pricing. Starter from $29/month, Business $89/month, Enterprise $249/month. Save 30% on annual billing. Every plan starts with a free 30-day trial, no credit card required.",
  path: "/pricing",
  keywords: ["business software pricing", "SaaS pricing plans", "POS software cost", "annual billing discount"],
});

const GUARANTEES = [
  {
    title: "Nothing is locked during the trial",
    body: "All features, all reports, all integrations for the full 30 days. If a feature exists, you can test it.",
    icon: ShieldCheck,
  },
  {
    title: "Your data survives a lapse",
    body: "A grace period of 7 to 30 days keeps everything readable and exportable after a trial or subscription ends.",
    icon: CircleCheck,
  },
  {
    title: "Bundle discounts apply automatically",
    body: "Second product 15% off, third 20%, four or more 25% — applied at checkout without asking.",
    icon: Sparkles,
  },
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <CircleCheck className="mx-auto size-5 text-[var(--success)]" aria-label="Included" />;
  if (value === false) return <X className="mx-auto size-4 text-[var(--muted-foreground)]/50" aria-label="Not included" />;
  if (value === "—") return <Minus className="mx-auto size-4 text-[var(--muted-foreground)]/50" aria-label="Not applicable" />;
  return <span className="text-sm">{value}</span>;
}

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Published prices. No sales dance."
        description="Pay per product, per organisation — not per seat inside your plan limits. Start on a 30-day trial and subscribe only when the software has earned it."
        bullets={["30% off annual billing", "No credit card to start", "Cancel or downgrade anytime"]}
        bulletIcon={CircleCheck}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
      />

      <Section className="py-16 md:py-20">
        <div className="container-page">
          <PricingPlansSection />
        </div>
      </Section>

      {/* Guarantees */}
      <Section muted className="py-16">
        <div className="container-page grid gap-5 md:grid-cols-3">
          {GUARANTEES.map(({ title, body, icon: Icon }) => (
            <Card key={title} className="p-6">
              <span className="mb-4 grid size-11 place-items-center rounded-xl bg-[var(--success-soft)] text-[var(--success)]">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Comparison table */}
      <Section id="compare" className="py-16 md:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Full comparison"
            title="Every difference between the plans"
            description="Including the licensing controls most vendors leave out of the comparison table."
          />

          <DataTable className="mt-12">
            <table className="w-full min-w-[46rem]">
              <thead className="sticky top-16 z-10 bg-[var(--surface)]">
                <tr className="border-b border-[var(--border)]">
                  <Th className="w-[34%]">Feature</Th>
                  <Th className="text-center">Starter</Th>
                  <Th className="bg-[var(--primary-soft)] text-center text-[var(--primary)]">Business</Th>
                  <Th className="text-center">Enterprise</Th>
                </tr>
              </thead>
              <tbody>
                {comparisonGroups.map((group) => (
                  <Fragment key={group.group}>
                    <tr className="bg-[var(--surface-muted)]">
                      <Td colSpan={4} className="py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                        {group.group}
                      </Td>
                    </tr>
                    {group.rows.map((row) => (
                      <tr key={row.label} className="border-b border-[var(--border)] transition-colors hover:bg-[var(--surface-muted)]">
                        <Td className="whitespace-normal font-medium">{row.label}</Td>
                        <Td className="text-center text-[var(--muted-foreground)]">
                          <Cell value={row.starter} />
                        </Td>
                        <Td className="bg-[var(--primary-soft)]/30 text-center">
                          <Cell value={row.business} />
                        </Td>
                        <Td className="text-center text-[var(--muted-foreground)]">
                          <Cell value={row.enterprise} />
                        </Td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </DataTable>

          <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
            Registered non-profits, schools and public clinics get 40% off any plan.{" "}
            <Link href="/contact?topic=sales" className="font-medium text-[var(--primary)] hover:underline">
              Apply for the discount
            </Link>
            .
          </p>
        </div>
      </Section>

      {/* FAQ */}
      <Section muted className="py-16 md:py-20">
        <div className="container-page max-w-3xl">
          <SectionHeading eyebrow="Pricing FAQ" title="The questions sales gets asked most" />
          <Accordion className="mt-10" items={pricingFaqs.map((f) => ({ question: f.question, answer: f.answer }))} defaultOpen={0} />
        </div>
      </Section>

      {/* Enterprise CTA */}
      <Section className="pb-24 pt-16">
        <div className="container-page">
          <div className="grid gap-8 rounded-[calc(var(--radius-card)*1.4)] border border-[var(--border)] bg-[var(--surface)] p-10 shadow-[var(--shadow-raised)] md:grid-cols-[1.4fr_1fr] md:items-center md:p-14">
            <div>
              <Badge tone="primary" className="mb-5">
                Enterprise
              </Badge>
              <h2 className="text-2xl font-semibold md:text-3xl">Need it configured to your policies?</h2>
              <p className="mt-4 text-[var(--muted-foreground)]">
                Enterprise customers set their own trial length, grace period, retention window, device limits and
                offline tolerance — and can run the licensing server inside their own network.
              </p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {[
                  "Configurable licensing policy",
                  "SSO with SAML or OIDC",
                  "Self-hosted or private cloud",
                  "99.9% uptime SLA",
                  "Named success engineer",
                  "Quarterly business reviews",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                    <CircleCheck className="size-4 shrink-0 text-[var(--success)]" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <ButtonLink href="/contact?topic=sales" size="lg">
                Talk to sales
              </ButtonLink>
              <ButtonLink href="/download" variant="secondary" size="lg">
                Start a trial first
              </ButtonLink>
              <p className="text-center text-xs text-[var(--muted-foreground)]">
                Typical response within one business hour
              </p>
            </div>
          </div>
        </div>
      </Section>

      <JsonLd
        data={[
          faqSchema(pricingFaqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
          ]),
        ]}
      />
    </>
  );
}
