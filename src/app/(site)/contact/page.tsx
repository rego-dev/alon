import { Suspense } from "react";
import type { Metadata } from "next";
import { Clock, CreditCard, LifeBuoy, Mail, MapPin, Phone, TrendingUp } from "lucide-react";
import { company, offices } from "@/data/company";
import { Card, Section, SectionHeading } from "@/components/ui/primitives";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHeader } from "@/components/marketing/page-header";
import { JsonLd, breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us — Sales, Support and Billing",
  description:
    "Talk to sales about pricing and demos, technical support about a problem, or billing about an invoice. Offices in San Francisco, Manila and Lisbon.",
  path: "/contact",
  keywords: ["contact", "sales enquiry", "technical support", "billing", "software company contact"],
});

const DEPARTMENTS = [
  {
    title: "Sales",
    body: "Pricing, demos, volume quotes, procurement paperwork and non-profit discounts.",
    email: company.salesEmail,
    phone: company.phone,
    hours: "Mon–Fri, 8:00–18:00 PT",
    Icon: TrendingUp,
  },
  {
    title: "Technical support",
    body: "Installation, activation, sync, printing and anything that stops the software working.",
    email: company.supportEmail,
    phone: company.supportPhone,
    hours: "Mon–Sat, 07:00–21:00 UTC",
    Icon: LifeBuoy,
  },
  {
    title: "Billing",
    body: "Invoices, payment methods, plan changes, refunds and purchase orders.",
    email: company.billingEmail,
    phone: company.phone,
    hours: "Mon–Fri, 9:00–17:00 PT",
    Icon: CreditCard,
  },
];

function FormFallback() {
  return <div className="h-[42rem] animate-pulse rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-muted)]" aria-hidden />;
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to a person, usually within the hour"
        description="Pick the team you need. Sales enquiries during business hours are typically answered in minutes; everything else within one business hour on paid plans."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      {/* Departments */}
      <Section className="py-14">
        <div className="container-page grid gap-5 md:grid-cols-3">
          {DEPARTMENTS.map(({ title, body, email, phone, hours, Icon }) => (
            <Card key={title} className="p-6">
              <span className="mb-4 grid size-11 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                <Icon className="size-5" aria-hidden />
              </span>
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{body}</p>
              <dl className="mt-5 space-y-2 border-t border-[var(--border)] pt-4 text-sm">
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Email</dt>
                  <Mail className="size-4 shrink-0 text-[var(--muted-foreground)]" aria-hidden />
                  <dd>
                    <a href={`mailto:${email}`} className="truncate hover:text-[var(--primary)]">
                      {email}
                    </a>
                  </dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Phone</dt>
                  <Phone className="size-4 shrink-0 text-[var(--muted-foreground)]" aria-hidden />
                  <dd>
                    <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-[var(--primary)]">
                      {phone}
                    </a>
                  </dd>
                </div>
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <dt className="sr-only">Hours</dt>
                  <Clock className="size-4 shrink-0" aria-hidden />
                  <dd>{hours}</dd>
                </div>
              </dl>
            </Card>
          ))}
        </div>
      </Section>

      {/* Form + map */}
      <Section muted className="py-16 md:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-start">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Send a message"
              title="Tell us what you need"
              description="The form routes to the right team automatically. If you are mid-outage, call instead — that is faster."
            />
            <Suspense fallback={<FormFallback />}>
              <div className="mt-8">
                <ContactForm />
              </div>
            </Suspense>
          </div>

          <div className="space-y-6 lg:sticky lg:top-24">
            <MapPanel />

            <div className="grid gap-4">
              {offices.map((office) => (
                <Card key={office.city} className="p-5">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-[var(--primary)]" aria-hidden />
                    <div>
                      <p className="font-medium">
                        {office.city}
                        <span className="ml-2 text-xs font-normal text-[var(--muted-foreground)]">{office.role}</span>
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted-foreground)]">{office.address}</p>
                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">{office.hours}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
    </>
  );
}

/**
 * Map panel. A real Google Maps embed needs an API key and loads third-party
 * script; this renders a styled static locator that degrades to a link out.
 */
function MapPanel() {
  const query = encodeURIComponent(company.address);
  return (
    <Card className="overflow-hidden">
      <div className="relative h-64 bg-[var(--surface-muted)]">
        <svg viewBox="0 0 400 260" className="size-full" aria-hidden preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="var(--border)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="400" height="260" fill="url(#map-grid)" />
          <path d="M0 170 L120 150 L200 178 L300 140 L400 165" stroke="var(--accent)" strokeWidth="10" fill="none" opacity="0.35" />
          <path d="M60 0 L90 120 L70 260" stroke="var(--border-strong)" strokeWidth="6" fill="none" />
          <path d="M0 90 L400 70" stroke="var(--border-strong)" strokeWidth="6" fill="none" />
          <path d="M240 0 L260 260" stroke="var(--border-strong)" strokeWidth="6" fill="none" />
          <circle cx="200" cy="120" r="26" fill="var(--primary)" opacity="0.15" />
          <circle cx="200" cy="120" r="9" fill="var(--primary)" />
          <circle cx="200" cy="120" r="3.5" fill="white" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--surface)] to-transparent p-4">
          <p className="text-sm font-medium">{company.legalName}</p>
          <p className="text-xs text-[var(--muted-foreground)]">{company.address}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] p-4">
        <p className="text-sm text-[var(--muted-foreground)]">Headquarters · visitors by appointment</p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${query}`}
          target="_blank"
          rel="noreferrer noopener"
          className="shrink-0 text-sm font-medium text-[var(--primary)] hover:underline"
        >
          Open in Maps
        </a>
      </div>
    </Card>
  );
}
