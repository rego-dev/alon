import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Globe, Quote, Target, Users } from "lucide-react";
import { careers, company, leadership, milestones, partners, testimonials, values } from "@/data/company";
import { getIcon } from "@/lib/icons";
import { Badge, Card, Section, SectionHeading } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { AnimatedCounter, Reveal } from "@/components/ui/interactive";
import { PageHeader } from "@/components/marketing/page-header";
import { JsonLd, breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Us — Mission, History, Leadership and Careers",
  description:
    "Alon Software builds offline-first business software for 42,800 organisations across 38 countries. Read our mission, history, leadership team, partners and open roles.",
  path: "/about",
  keywords: ["about alon software", "company history", "leadership team", "careers", "partners"],
});

const FACTS = [
  { label: "Founded", value: 2014, format: "year" as const, Icon: Building2 },
  { label: "Team members", value: 480, suffix: "+", Icon: Users },
  { label: "Countries served", value: 38, Icon: Globe },
  { label: "Products shipped", value: 31, Icon: Target },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="We build software for businesses that cannot afford it to stop"
        description="Founded in 2014 around a single stubborn requirement: a point of sale that keeps trading when the internet does not. Everything we have built since starts from the same place."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Facts */}
      <Section className="py-14">
        <div className="container-page">
          <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FACTS.map(({ label, value, suffix, format, Icon }, i) => (
              <Reveal key={label} delay={i * 70}>
                <Card className="p-6 text-center">
                  <Icon className="mx-auto mb-3 size-5 text-[var(--primary)]" aria-hidden />
                  <dd className="text-3xl font-semibold tracking-tight">
                    {format === "year" ? value : <AnimatedCounter value={value} suffix={suffix ?? ""} />}
                  </dd>
                  <dt className="mt-1.5 text-sm text-[var(--muted-foreground)]">{label}</dt>
                </Card>
              </Reveal>
            ))}
          </dl>
        </div>
      </Section>

      {/* Mission & vision */}
      <Section muted className="py-16 md:py-20">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <Card className="p-8 md:p-10">
            <Badge tone="primary" className="mb-5">
              Mission
            </Badge>
            <h2 className="text-2xl font-semibold md:text-3xl">
              Give every business software that works as reliably as the shop floor it runs on
            </h2>
            <p className="mt-5 leading-relaxed text-[var(--muted-foreground)]">
              Enterprise-grade capability should not require an enterprise budget or an IT department. We build products
              that a shop owner can install on a Tuesday and use on a Wednesday, that keep working through a power cut
              and an outage, and that never hold a customer&rsquo;s own data hostage.
            </p>
          </Card>

          <Card className="p-8 md:p-10">
            <Badge tone="accent" className="mb-5">
              Vision
            </Badge>
            <h2 className="text-2xl font-semibold md:text-3xl">
              One platform underneath every operational system a business runs
            </h2>
            <p className="mt-5 leading-relaxed text-[var(--muted-foreground)]">
              Most businesses run six disconnected systems that disagree with each other. We are building the opposite:
              one platform, one data layer, one licence model, with domain products on top that genuinely share what they
              know — so the till, the ledger and the pay run stop being three versions of the truth.
            </p>
          </Card>
        </div>
      </Section>

      {/* Values */}
      <Section className="py-16 md:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="What we hold to"
            title="Four commitments we have not traded away"
            description="These constrain product decisions in ways that occasionally cost us revenue. That is rather the point of having them."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => {
              const Icon = getIcon(value.icon);
              return (
                <Reveal key={value.title} delay={i * 70} className="h-full">
                  <Card className="h-full p-6">
                    <span className="mb-4 grid size-11 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <h3 className="font-semibold">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{value.body}</p>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Section>

      {/* History */}
      <Section muted id="history" className="py-16 md:py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Company history" title="Twelve years, one idea, thirty-one products" />
          <ol className="mx-auto mt-14 max-w-3xl">
            {milestones.map((milestone, i) => (
              <Reveal key={milestone.year} delay={i * 60} as="li">
                <div className="relative flex gap-6 pb-10 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--primary)] text-sm font-semibold text-[var(--primary-foreground)]">
                      {milestone.year.slice(2)}
                    </span>
                    {i < milestones.length - 1 ? <span className="mt-2 w-px flex-1 bg-[var(--border)]" /> : null}
                  </div>
                  <div className="pt-2">
                    <p className="text-sm font-medium text-[var(--primary)]">{milestone.year}</p>
                    <h3 className="mt-1 text-lg font-semibold">{milestone.title}</h3>
                    <p className="mt-2 leading-relaxed text-[var(--muted-foreground)]">{milestone.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* Leadership */}
      <Section id="leadership" className="py-16 md:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Leadership"
            title="The people accountable for it"
            description="Every one of them still spends time with customers. It is a condition of the job, not a photo opportunity."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {leadership.map((person, i) => (
              <Reveal key={person.name} delay={i * 60} className="h-full">
                <Card className="h-full p-6">
                  <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-lg font-semibold text-white">
                    {person.initials}
                  </span>
                  <h3 className="font-semibold">{person.name}</h3>
                  <p className="text-sm text-[var(--primary)]">{person.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">{person.bio}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section muted className="py-16 md:py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Customers" title="In their words" />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {testimonials.slice(0, 2).map((t) => (
              <Card key={t.author} className="p-8">
                <Quote className="size-8 text-[var(--primary)]/25" aria-hidden />
                <blockquote className="mt-4 text-lg leading-relaxed">{t.quote}</blockquote>
                <footer className="mt-6 border-t border-[var(--border)] pt-5 text-sm">
                  <span className="font-semibold">{t.author}</span>
                  <span className="text-[var(--muted-foreground)]">
                    {" "}
                    · {t.role}, {t.company}
                  </span>
                </footer>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Careers */}
      <Section id="careers" className="py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              align="left"
              eyebrow="Careers"
              title="Open roles"
              description="Remote-friendly across engineering, design, support and product. We hire for judgement, not for a keyword list."
            />
            <Badge tone="success" className="px-3 py-1.5">
              {careers.length} open positions
            </Badge>
          </div>

          <div className="mt-10 divide-y divide-[var(--border)] overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]">
            {careers.map((role) => (
              <div key={role.title} className="flex flex-wrap items-center gap-4 p-5 transition-colors hover:bg-[var(--surface-muted)]">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{role.title}</p>
                  <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
                    {role.team} · {role.location} · {role.type}
                  </p>
                </div>
                <ButtonLink href={`/contact?topic=other`} variant="secondary" size="sm">
                  Apply
                  <ArrowRight aria-hidden />
                </ButtonLink>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Partners */}
      <Section muted id="partners" className="py-16 md:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Partners"
            title="Who we work with"
            description="Implementation partners and resellers who deploy, configure and support our products in their own markets."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner) => (
              <Card key={partner.name} className="p-6">
                <h3 className="font-semibold">{partner.name}</h3>
                <p className="mt-1 text-sm text-[var(--primary)]">{partner.type}</p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">{partner.region}</p>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/contact?topic=partnership" variant="secondary">
              Become a partner
              <ArrowRight aria-hidden />
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="pb-24 pt-16">
        <div className="container-page">
          <div className="rounded-[calc(var(--radius-card)*1.4)] border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-raised)] md:p-14">
            <h2 className="text-2xl font-semibold md:text-3xl">Come and see whether we mean it</h2>
            <p className="mx-auto mt-4 max-w-xl text-[var(--muted-foreground)]">
              The fastest way to judge a software company is to use their product for a month without paying them. That
              option is on the table for all 31 of ours.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/download" size="lg">
                Start a free trial
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary" size="lg">
                Talk to us
              </ButtonLink>
            </div>
            <p className="mt-6 text-sm text-[var(--muted-foreground)]">
              {company.address} ·{" "}
              <Link href="/contact" className="font-medium text-[var(--primary)] hover:underline">
                All offices
              </Link>
            </p>
          </div>
        </div>
      </Section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
    </>
  );
}
