import Link from "next/link";
import { ArrowRight, CircleCheck, Download, Quote, ShieldCheck, TriangleAlert, Trash2, RefreshCw } from "lucide-react";
import { categories } from "@/data/categories";
import { company, heroStats, testimonials, trustLogos } from "@/data/company";
import { listProducts } from "@/lib/repositories/products";
import { toSummary } from "@/data/product-summary";
import { getIcon } from "@/lib/icons";
import { Badge, Card, Section, SectionHeading } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { AnimatedCounter, Reveal } from "@/components/ui/interactive";
import { PLATFORM_META } from "./platform-icons";
import { ProductCard } from "./product-card";
import { formatCompact } from "@/lib/utils";
import type { PlatformId } from "@/types";

/* ------------------------------- Trust bar -------------------------------- */

export function TrustBar() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--surface-muted)] py-8">
      <div className="container-page">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
          Trusted by {formatCompact(42_800)}+ businesses in {company.countries} countries
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
          <ul className="animate-marquee flex w-max items-center gap-12 md:gap-16">
            {[...trustLogos, ...trustLogos].map((logo, i) => (
              <li
                key={`${logo}-${i}`}
                className="whitespace-nowrap text-lg font-semibold tracking-tight text-[var(--muted-foreground)]/70"
                aria-hidden={i >= trustLogos.length}
              >
                {logo}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Stats ---------------------------------- */

export function StatsBand() {
  return (
    <Section className="py-16 md:py-20">
      <div className="container-page">
        <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {heroStats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-[var(--shadow-soft)]">
                <dd className="text-3xl font-semibold tracking-tight md:text-4xl">
                  <AnimatedCounter
                    value={stat.compact ? stat.value / 1_000_000 : stat.value}
                    decimals={stat.compact ? 2 : (stat.decimals ?? 0)}
                    suffix={stat.compact ? `M${stat.suffix}` : stat.suffix}
                  />
                </dd>
                <dt className="mt-2 text-sm text-[var(--muted-foreground)]">{stat.label}</dt>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </Section>
  );
}

/* ------------------------------- Categories -------------------------------- */

export async function CategoryGrid() {
  const products = await listProducts();
  return (
    <Section muted id="categories">
      <div className="container-page">
        <SectionHeading
          eyebrow="Software catalogue"
          title="Six categories. Thirty-one products. One platform underneath."
          description="Every product shares the same offline-first engine, the same licensing model and the same data layer — so they work together instead of merely alongside each other."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, i) => {
            const Icon = getIcon(category.icon);
            const count = products.filter((p) => p.category === category.slug).length;
            return (
              <Reveal key={category.slug} delay={i * 60}>
                <Card interactive className="group relative h-full overflow-hidden p-6">
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${category.accent}`}
                  />
                  <div className="relative">
                    <span className="mb-4 grid size-12 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <h3 className="text-lg font-semibold">
                      <Link href={`/products?category=${category.slug}`} className="after:absolute after:inset-0">
                        {category.name}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                      {category.description}
                    </p>
                    <p className="mt-5 flex items-center gap-1.5 text-sm font-medium text-[var(--primary)]">
                      {count} products
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                    </p>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ---------------------------- Featured products ---------------------------- */

export async function FeaturedProducts() {
  const products = await listProducts();
  const featured = products.filter((p) => p.badge).slice(0, 6);
  return (
    <Section>
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow="Featured"
            title="The products businesses start with"
            description="Most customers begin with one product, then add others as they grow. Each one runs standalone and shares data with the rest."
          />
          <ButtonLink href="/products" variant="secondary" className="w-fit shrink-0">
            Browse all products
            <ArrowRight aria-hidden />
          </ButtonLink>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, i) => (
            <Reveal key={product.slug} delay={i * 60} className="h-full">
              <ProductCard product={toSummary(product)} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------- Platforms --------------------------------- */

const PLATFORM_ORDER: PlatformId[] = ["windows", "macos", "linux", "android", "ios"];

export function PlatformBand() {
  return (
    <Section muted>
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Every platform"
              title="Desktop, mobile and tablet — one licence covers them all"
              description="Install on the counter PC, the manager's laptop and the supervisor's tablet. Activations count against your plan, not against each platform separately."
            />
            <ul className="mt-8 space-y-3">
              {[
                "Native builds for x64 and ARM on every desktop OS",
                "Online and offline installers, both SHA-256 signed",
                "Tablet layouts, not stretched phone screens",
                "Delta updates applied in the background",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <CircleCheck className="mt-0.5 size-5 shrink-0 text-[var(--success)]" aria-hidden />
                  <span className="text-[var(--muted-foreground)]">{item}</span>
                </li>
              ))}
            </ul>
            <ButtonLink href="/download" className="mt-8">
              <Download aria-hidden />
              Open the download center
            </ButtonLink>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {PLATFORM_ORDER.map((platform, i) => {
              const { label, Icon } = PLATFORM_META[platform];
              return (
                <Reveal key={platform} delay={i * 60}>
                  <Link
                    href={`/download?os=${platform}`}
                    className="flex h-full flex-col items-center gap-3 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:border-[var(--primary)]/40 hover:shadow-[var(--shadow-float)]"
                  >
                    <Icon width={30} height={30} className="text-[var(--foreground)]" />
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-xs text-[var(--muted-foreground)]">x64 · ARM</span>
                  </Link>
                </Reveal>
              );
            })}
            <div className="flex flex-col items-center justify-center gap-1 rounded-[var(--radius-card)] border border-dashed border-[var(--border-strong)] p-6 text-center">
              <p className="text-sm font-medium">Self-hosted</p>
              <p className="text-xs text-[var(--muted-foreground)]">Enterprise plan</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------ Trial policy ------------------------------- */

/** Static class map — Tailwind cannot see classes built from template literals. */
const TONE_CHIP: Record<"success" | "warning" | "danger" | "primary", string> = {
  success: "bg-[var(--success-soft)] text-[var(--success)]",
  warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
  danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
  primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
};

const TRIAL_PHASES = [
  {
    phase: "Days 1–30",
    title: "Full trial",
    tone: "success" as const,
    Icon: ShieldCheck,
    body: "Every feature unlocked, every platform, no credit card. The licence activates itself on first launch and the countdown is always visible inside the app.",
    points: ["All features enabled", "Automatic activation", "Countdown shown in-app", "Licence bound to your account and devices"],
  },
  {
    phase: "Days 31–37+",
    title: "Grace period",
    tone: "warning" as const,
    Icon: TriangleAlert,
    body: "The app becomes read-only for 7 to 30 days. You can still log in, open everything and export. Creating, editing, importing, printing, syncing and backup pause until you subscribe.",
    points: ["Log in and view data", "Export still enabled", "Reminders on day 1, 3, 7 and 24h before", "Subscribe Now screen on each launch"],
  },
  {
    phase: "After grace",
    title: "Locked, data retained",
    tone: "danger" as const,
    Icon: Trash2,
    body: "Access closes but your data stays for the retention window your administrator sets. You get a final export opportunity and a clear warning before anything is removed.",
    points: ["Final export opportunity", "Retention configurable to 365 days", "Warnings before any deletion", "Deletion is irreversible without your own backup"],
  },
  {
    phase: "Anytime",
    title: "Instant recovery",
    tone: "primary" as const,
    Icon: RefreshCw,
    body: "Subscribe at any point before deletion and the licence activates immediately with every record intact — no reinstall, no migration, no support ticket.",
    points: ["Licence activates immediately", "Data intact", "No reinstall required", "Clean database if you subscribe after deletion"],
  },
];

export function TrialPolicySection() {
  return (
    <Section id="trial-policy">
      <div className="container-page">
        <SectionHeading
          eyebrow="Trial & subscription policy"
          title="What actually happens after day 30"
          description="Most vendors bury this. Here it is in full: the trial is unrestricted, the grace period keeps your data readable, and nothing is deleted without repeated warnings and a final chance to export."
        />

        <ol className="mt-14 grid gap-5 lg:grid-cols-4">
          {TRIAL_PHASES.map((phase, i) => (
            <Reveal key={phase.title} delay={i * 80} className="h-full">
              <Card className="relative flex h-full flex-col p-6">
                <span className="absolute right-5 top-5 text-4xl font-semibold text-[var(--border)]">{i + 1}</span>
                <span className={`mb-4 grid size-11 place-items-center rounded-xl ${TONE_CHIP[phase.tone]}`}>
                  <phase.Icon className="size-5" aria-hidden />
                </span>
                <Badge tone={phase.tone} className="mb-3 w-fit">
                  {phase.phase}
                </Badge>
                <h3 className="text-lg font-semibold">{phase.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{phase.body}</p>
                <ul className="mt-4 space-y-1.5 border-t border-[var(--border)] pt-4">
                  {phase.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-xs text-[var(--muted-foreground)]">
                      <CircleCheck className="mt-px size-3.5 shrink-0 text-[var(--success)]" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </ol>

        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-[var(--muted-foreground)]">
          Trial length, grace period, reminder schedule, retention window and auto-deletion are all configurable by your
          administrator on the Enterprise plan.{" "}
          <Link href="/legal/data-retention" className="font-medium text-[var(--primary)] hover:underline">
            Read the full data retention policy
          </Link>
          .
        </p>
      </div>
    </Section>
  );
}

/* ------------------------------ Testimonials ------------------------------- */

export function Testimonials() {
  return (
    <Section muted>
      <div className="container-page">
        <SectionHeading
          eyebrow="Customer stories"
          title="Why they stayed after the trial"
          description="Four thousand reviews across the catalogue average 4.7 out of 5. These are the reasons that come up most."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.author} delay={i * 70} className="h-full">
              <Card className="flex h-full flex-col p-7">
                <Quote className="size-8 text-[var(--primary)]/25" aria-hidden />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed">{t.quote}</blockquote>
                <footer className="mt-6 flex items-center gap-3 border-t border-[var(--border)] pt-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-sm font-semibold text-white">
                    {t.author
                      .split(" ")
                      .filter((part) => !part.endsWith("."))
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{t.author}</p>
                    <p className="truncate text-xs text-[var(--muted-foreground)]">
                      {t.role}, {t.company}
                    </p>
                  </div>
                  <Badge tone="success" className="ml-auto hidden shrink-0 sm:inline-flex">
                    {t.metric}
                  </Badge>
                </footer>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------------------------------- CTA ------------------------------------ */

export function ClosingCta() {
  return (
    <Section className="pb-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[calc(var(--radius-card)*1.6)] border border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center shadow-[var(--shadow-float)] md:px-16">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-24 size-80 rounded-full bg-[var(--primary)] opacity-[0.16] blur-[90px]" />
            <div className="absolute -bottom-24 -right-16 size-80 rounded-full bg-[var(--accent)] opacity-[0.16] blur-[90px]" />
          </div>

          <div className="relative mx-auto max-w-2xl">
            <Badge tone="primary" className="mb-6">
              30 days · every feature · no card
            </Badge>
            <h2 className="text-3xl font-semibold leading-tight md:text-[2.6rem]">
              Try it on your real data before you decide
            </h2>
            <p className="mt-5 text-lg text-[var(--muted-foreground)]">
              Download today, import your records, run a full month of operations. If it does not earn the subscription,
              export everything and walk away — that is the deal.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/download" size="lg">
                <Download aria-hidden />
                Download now
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary" size="lg">
                Talk to sales
                <ArrowRight aria-hidden />
              </ButtonLink>
            </div>
            <p className="mt-6 text-sm text-[var(--muted-foreground)]">
              Questions first? Read the{" "}
              <Link href="/pricing" className="font-medium text-[var(--primary)] hover:underline">
                pricing details
              </Link>{" "}
              or the{" "}
              <Link href="/docs" className="font-medium text-[var(--primary)] hover:underline">
                installation guide
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
