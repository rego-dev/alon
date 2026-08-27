import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleCheck, Clock, TriangleAlert } from "lucide-react";
import { company, supportChannels, systemStatus } from "@/data/company";
import { getIcon } from "@/lib/icons";
import { Badge, Card, Section, SectionHeading } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { Accordion } from "@/components/ui/interactive";
import { TicketForm } from "@/components/forms/ticket-form";
import { PageHeader } from "@/components/marketing/page-header";
import { JsonLd, breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Support — Live Chat, Tickets, Phone and Remote Assistance",
  description:
    "Get help from the engineers who build the software. Live chat, ticket system, email, phone support, remote assistance and a community forum. One-hour response on paid plans.",
  path: "/support",
  keywords: ["software support", "help desk", "technical support", "remote assistance", "support ticket"],
});

const SLA = [
  { plan: "Trial & Starter", first: "1 business day", resolution: "3 business days", channels: "Email, community" },
  { plan: "Business", first: "1 hour", resolution: "1 business day", channels: "Email, chat, phone, remote" },
  { plan: "Enterprise", first: "15 minutes", resolution: "4 hours", channels: "All, plus named engineer" },
];

const SUPPORT_FAQS = [
  {
    question: "Do I get support during the free trial?",
    answer:
      "Yes. Trial users get the same email and community support as Starter customers, because the trial is where you most need help. Chat and phone are reserved for paid plans.",
  },
  {
    question: "How do I give support access to my system?",
    answer:
      "Remote assistance is initiated from inside the application under Help → Remote assistance. It generates a one-time code valid for fifteen minutes and requires you to accept each session. We never have standing access.",
  },
  {
    question: "What information should I include in a ticket?",
    answer:
      "The product and version, what you expected, what happened, and a diagnostics bundle if the application produced one. Run the app with --diagnostics --redact to generate a bundle with customer data removed.",
  },
  {
    question: "Is support available in other languages?",
    answer:
      "Support is delivered in English, Filipino and Spanish during their respective business hours. Tickets in other languages are answered in English within the usual SLA.",
  },
  {
    question: "What counts as a production-down issue?",
    answer:
      "Anything that stops you trading or paying people: a till that will not open, a pay run that will not compute, a licence that will not activate. These bypass the queue on Business and Enterprise plans.",
  },
];

const STATUS_TONE = {
  operational: { tone: "success" as const, label: "Operational" },
  degraded: { tone: "warning" as const, label: "Degraded performance" },
  outage: { tone: "danger" as const, label: "Outage" },
};

export default function SupportPage() {
  const anyDegraded = systemStatus.some((s) => s.status !== "operational");

  return (
    <>
      <PageHeader
        eyebrow="Support"
        title="Answered by the engineers who build it"
        description="No tiered script, no macro reply. Tickets go to the team that owns the code, with a one-hour response target on paid plans."
        bullets={["1-hour response on Business", "15-minute SLA on Enterprise", "Free support during trials"]}
        bulletIcon={CircleCheck}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Support" }]}
      />

      {/* Channels */}
      <Section id="chat" className="py-14 md:py-16">
        <div className="container-page">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {supportChannels.map((channel) => {
              const Icon = getIcon(channel.icon);
              return (
                <Card key={channel.title} interactive className="group relative flex h-full flex-col p-6">
                  <span className="mb-4 grid size-11 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h2 className="font-semibold">
                    <Link href={channel.action.href} className="after:absolute after:inset-0">
                      {channel.title}
                    </Link>
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">{channel.body}</p>
                  <p className="mt-4 flex items-center gap-2 border-t border-[var(--border)] pt-4 text-xs text-[var(--muted-foreground)]">
                    <Clock className="size-3.5" aria-hidden />
                    {channel.detail}
                    <ArrowRight className="ml-auto size-4 text-[var(--primary)] transition-transform group-hover:translate-x-1" aria-hidden />
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Ticket form */}
      <Section muted id="ticket" className="py-16 md:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Open a ticket"
              title="Tell us what broke"
              description="Every ticket gets a human reply. Include the version and a diagnostics bundle and you will usually get a fix rather than a question."
            />

            <div className="mt-8 overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]">
              <table className="w-full">
                <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Plan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      First response
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Target resolution
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {SLA.map((row) => (
                    <tr key={row.plan}>
                      <td className="px-4 py-3.5 text-sm font-medium">{row.plan}</td>
                      <td className="px-4 py-3.5 text-sm text-[var(--muted-foreground)]">{row.first}</td>
                      <td className="px-4 py-3.5 text-sm text-[var(--muted-foreground)]">{row.resolution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div id="remote" className="mt-8 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6">
              <h3 className="font-semibold">Remote assistance</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                Start a session from inside the application under Help → Remote assistance. A one-time code is generated,
                valid for fifteen minutes, and you approve each session explicitly. We never hold standing access to a
                customer machine.
              </p>
            </div>
          </div>

          <TicketForm />
        </div>
      </Section>

      {/* Status */}
      <Section id="status" className="py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              align="left"
              eyebrow="System status"
              title={anyDegraded ? "One service is degraded" : "All systems operational"}
              description="Live status of the services the desktop and mobile clients depend on."
            />
            <Badge tone={anyDegraded ? "warning" : "success"} className="px-3 py-1.5">
              {anyDegraded ? <TriangleAlert className="size-3.5" aria-hidden /> : <CircleCheck className="size-3.5" aria-hidden />}
              {anyDegraded ? "Partial degradation" : "All operational"}
            </Badge>
          </div>

          <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {systemStatus.map((service) => {
              const meta = STATUS_TONE[service.status];
              return (
                <Card key={service.service} className="flex items-center gap-3 p-5">
                  <span
                    className={`size-2.5 shrink-0 rounded-full ${
                      service.status === "operational" ? "bg-[var(--success)]" : "bg-[var(--warning)]"
                    }`}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{service.service}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{meta.label}</p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-[var(--muted-foreground)]">{service.uptime}</span>
                </Card>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Community */}
      <Section muted id="community" className="py-16 md:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Community forum"
              title="18,400 operators, answering each other"
              description="The forum is where configurations, workarounds and industry-specific setups get shared. Our engineers answer there too — it is not a place we abandoned."
            />
            <ButtonLink href="#" className="mt-8">
              Visit the forum
              <ArrowRight aria-hidden />
            </ButtonLink>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Members", value: "18,400" },
              { label: "Threads answered", value: "94%" },
              { label: "Median first reply", value: "3 hours" },
              { label: "Staff replies weekly", value: "120+" },
            ].map((stat) => (
              <Card key={stat.label} className="p-6 text-center">
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="py-16 md:py-20">
        <div className="container-page max-w-3xl">
          <SectionHeading eyebrow="Support FAQ" title="Before you open a ticket" />
          <Accordion className="mt-10" items={SUPPORT_FAQS} defaultOpen={0} />
          <p className="mt-8 text-center text-sm text-[var(--muted-foreground)]">
            Prefer to talk?{" "}
            <a href={`tel:${company.supportPhone.replace(/\s/g, "")}`} className="font-medium text-[var(--primary)] hover:underline">
              {company.supportPhone}
            </a>{" "}
            or{" "}
            <a href={`mailto:${company.supportEmail}`} className="font-medium text-[var(--primary)] hover:underline">
              {company.supportEmail}
            </a>
          </p>
        </div>
      </Section>

      <JsonLd
        data={[
          faqSchema(SUPPORT_FAQS),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Support", path: "/support" },
          ]),
        ]}
      />
    </>
  );
}
