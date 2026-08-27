import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Activity,
  ArrowRight,
  CircleCheck,
  Download,
  FileText,
  Monitor,
  ShieldCheck,
  Star,
} from "lucide-react";
import { getProduct, products, relatedProducts } from "@/data/products";
import { categoryBySlug } from "@/data/categories";
import { toSummary } from "@/data/product-summary";
import { getIcon } from "@/lib/icons";
import { Icon as RegistryIcon } from "@/components/ui/icon";
import { Badge, Card, DataTable, Section, SectionHeading, Td, Th } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { Accordion, Rating } from "@/components/ui/interactive";
import { ScreenshotGallery, VideoDemo } from "@/components/marketing/screenshot-gallery";
import { ProductCard } from "@/components/marketing/product-card";
import { PlatformIcons, PLATFORM_META } from "@/components/marketing/platform-icons";
import { PricingPlansSection } from "@/components/marketing/pricing-plans";
import { Breadcrumbs } from "@/components/marketing/page-header";
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema,
  pageMetadata,
  softwareApplicationSchema,
} from "@/lib/seo";
import { formatCompact, formatDate, formatNumber } from "@/lib/utils";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return pageMetadata({ title: "Product not found", description: "", path: `/products/${slug}`, noIndex: true });

  return pageMetadata({
    title: `${product.name} — ${product.tagline}`,
    description: `${product.overview.slice(0, 155).trim()}… Free 30-day trial, no credit card. Version ${product.version} for ${product.platforms.map((p) => PLATFORM_META[p].label).join(", ")}.`,
    path: `/products/${product.slug}`,
    keywords: [
      product.name.toLowerCase(),
      `${product.name.toLowerCase()} download`,
      `${product.name.toLowerCase()} free trial`,
      `${categoryBySlug[product.category].name.toLowerCase()} software`,
      ...product.features.map((f) => f.title.toLowerCase()),
    ],
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = categoryBySlug[product.category];
  const related = relatedProducts(product);
  const latest = product.releases[0];

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)] py-12 md:py-16">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 grid-backdrop opacity-60" />
          <div className={`absolute -top-24 right-1/4 size-[32rem] rounded-full bg-gradient-to-br ${category.accent} opacity-60 blur-[110px]`} />
        </div>

        <div className="container-page">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              { label: category.name, href: `/products?category=${category.slug}` },
              { label: product.name },
            ]}
          />

          <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
            <div>
              <div className="flex items-center gap-4">
                <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] shadow-[var(--shadow-soft)]">
                  <RegistryIcon name={product.icon} className="size-8" aria-hidden />
                </span>
                <div>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]"
                  >
                    {category.name}
                  </Link>
                  <h1 className="text-3xl font-semibold leading-tight md:text-4xl">{product.name}</h1>
                </div>
              </div>

              <p className="mt-5 text-lg text-[var(--muted-foreground)]">{product.tagline}.</p>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                <Rating value={product.rating} count={product.reviewCount} />
                <span className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
                  <Download className="size-4" aria-hidden />
                  {formatCompact(product.downloads)} downloads
                </span>
                <span className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
                  <Monitor className="size-4" aria-hidden />
                  <PlatformIcons platforms={product.platforms} size={15} />
                </span>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={`/download?product=${product.slug}`} size="lg">
                  <Download aria-hidden />
                  Download free trial
                </ButtonLink>
                <ButtonLink href="#pricing" variant="secondary" size="lg">
                  See pricing
                  <ArrowRight aria-hidden />
                </ButtonLink>
              </div>

              <p className="mt-4 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <ShieldCheck className="size-4 text-[var(--success)]" aria-hidden />
                30 days, all features, no credit card · v{product.version} released {formatDate(product.releaseDate)}
              </p>
            </div>

            <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-gradient-to-br from-[var(--primary-soft)] to-[var(--accent-soft)] p-4 shadow-[var(--shadow-float)] sm:p-8">
              <ScreenshotGallery shots={product.screenshots.slice(0, 1)} seed={product.slug} productName={product.name} />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Overview */}
      <Section className="py-16 md:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <SectionHeading align="left" eyebrow="Overview" title={`What ${product.name} does`} />
            <p className="mt-6 text-lg leading-relaxed text-[var(--muted-foreground)]">{product.overview}</p>
            <ul className="mt-8 space-y-3">
              {product.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-3">
                  <CircleCheck className="mt-0.5 size-5 shrink-0 text-[var(--success)]" aria-hidden />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <Card className="h-fit p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              At a glance
            </h3>
            <dl className="mt-4 space-y-3.5 text-sm">
              {[
                ["Latest version", product.version],
                ["Released", formatDate(product.releaseDate)],
                ["Category", category.name],
                ["Platforms", product.platforms.map((p) => PLATFORM_META[p].label).join(", ")],
                ["Starting price", `$${product.priceFrom}/month`],
                ["Trial", "30 days, full features"],
                ["Downloads", formatNumber(product.downloads)],
                ["Rating", `${product.rating.toFixed(1)} / 5 from ${formatNumber(product.reviewCount)} reviews`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-[var(--border)] pb-3.5 last:border-0 last:pb-0">
                  <dt className="text-[var(--muted-foreground)]">{label}</dt>
                  <dd className="text-right font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </Section>

      {/* ------------------------------------------------------------ Features */}
      <Section muted id="features" className="py-16 md:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Key features"
            title={`Built around how ${category.name.toLowerCase()} teams actually work`}
            description={`Every capability below is available during the free trial and on every paid plan.`}
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {product.features.map((feature) => {
              const FeatureIcon = getIcon(feature.icon);
              return (
                <Card key={feature.title} className="p-6">
                  <span className="mb-4 grid size-11 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                    <FeatureIcon className="size-5" aria-hidden />
                  </span>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </Section>

      {/* --------------------------------------------------------- Screenshots */}
      <Section id="screenshots" className="py-16 md:py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Screenshots" title="See it before you install it" />
          <div className="mt-12 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-start">
            <ScreenshotGallery shots={product.screenshots} seed={product.slug} productName={product.name} />
            <div>
              <h3 className="text-lg font-semibold">Video demo</h3>
              <p className="mb-5 mt-2 text-sm text-[var(--muted-foreground)]">
                A guided walkthrough of a real working day in {product.name}, recorded on the current release.
              </p>
              <VideoDemo productName={product.name} duration={product.videoDuration} />
            </div>
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------------- Requirements */}
      <Section muted id="requirements" className="py-16 md:py-20">
        <div className="container-page">
          <SectionHeading
            align="left"
            eyebrow="System requirements"
            title="What you need to run it"
            description="Requirements are deliberately modest — most of our customers run this on hardware they already own."
          />
          <DataTable className="mt-10">
            <table className="w-full">
              <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
                <tr>
                  <Th>Platform</Th>
                  <Th>Minimum OS</Th>
                  <Th>Processor</Th>
                  <Th>Memory</Th>
                  <Th>Storage</Th>
                  <Th>Notes</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {product.requirements.map((req) => (
                  <tr key={req.platform} className="transition-colors hover:bg-[var(--surface-muted)]">
                    <Td className="font-medium">{req.platform}</Td>
                    <Td className="text-[var(--muted-foreground)]">{req.os}</Td>
                    <Td className="text-[var(--muted-foreground)]">{req.cpu}</Td>
                    <Td className="text-[var(--muted-foreground)]">{req.memory}</Td>
                    <Td className="text-[var(--muted-foreground)]">{req.storage}</Td>
                    <Td className="text-[var(--muted-foreground)]">{req.extra}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataTable>
        </div>
      </Section>

      {/* ------------------------------------------------------------- Pricing */}
      <Section id="pricing" className="py-16 md:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Pricing"
            title={`${product.name} plans`}
            description="Priced per product, per organisation. Start on the trial, subscribe when it earns its place."
          />
          <div className="mt-12">
            <PricingPlansSection featureLimit={6} />
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------ Release notes */}
      <Section muted id="releases" className="py-16 md:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <SectionHeading align="left" eyebrow="Release notes" title={`What changed in v${latest.version}`} />
            <div className="mt-8 space-y-6">
              {product.releases.map((release, i) => (
                <Card key={release.version} className="p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold">v{release.version}</h3>
                    <Badge tone={i === 0 ? "success" : "neutral"}>{i === 0 ? "Current" : release.channel}</Badge>
                    <span className="text-sm text-[var(--muted-foreground)]">{formatDate(release.date)}</span>
                  </div>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Highlights
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {release.highlights.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm text-[var(--muted-foreground)]">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Fixes
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {release.fixes.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm text-[var(--muted-foreground)]">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--border-strong)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:h-fit">
            <Card className="p-6">
              <h3 className="flex items-center gap-2 font-semibold">
                <Activity className="size-4 text-[var(--primary)]" aria-hidden />
                Version history
              </h3>
              <ol className="mt-5 space-y-4">
                {product.releases.map((release, i) => (
                  <li key={release.version} className="relative pl-6">
                    <span
                      className={`absolute left-0 top-1.5 size-2.5 rounded-full ${i === 0 ? "bg-[var(--primary)] ring-4 ring-[var(--primary-soft)]" : "bg-[var(--border-strong)]"}`}
                    />
                    {i < product.releases.length - 1 ? (
                      <span className="absolute left-[4.5px] top-5 h-[calc(100%+0.5rem)] w-px bg-[var(--border)]" />
                    ) : null}
                    <p className="text-sm font-medium">v{release.version}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {formatDate(release.date)} · {release.highlights.length + release.fixes.length} changes
                    </p>
                  </li>
                ))}
              </ol>
              <ButtonLink href={`/download?product=${product.slug}`} variant="secondary" size="sm" className="mt-6 w-full">
                <FileText aria-hidden />
                All downloads & checksums
              </ButtonLink>
            </Card>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------- Reviews */}
      <Section id="reviews" className="py-16 md:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Customer reviews"
            title={`${product.rating.toFixed(1)} out of 5 from ${formatNumber(product.reviewCount)} customers`}
            description="Reviews are collected in-app from verified subscribers after their first 90 days."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {product.reviews.map((review) => (
              <Card key={`${review.author}-${review.date}`} className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex" aria-label={`${review.rating} out of 5`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`size-4 ${n <= review.rating ? "fill-amber-400 text-amber-400" : "text-[var(--border-strong)]"}`}
                        aria-hidden
                      />
                    ))}
                  </div>
                  {review.verified ? <Badge tone="success">Verified</Badge> : null}
                </div>
                <h3 className="mt-4 font-semibold">{review.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">{review.body}</p>
                <footer className="mt-5 border-t border-[var(--border)] pt-4 text-xs text-[var(--muted-foreground)]">
                  <span className="font-medium text-[var(--foreground)]">{review.author}</span> · {review.role},{" "}
                  {review.company} · {formatDate(review.date)}
                </footer>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* ----------------------------------------------------------------- FAQ */}
      <Section muted id="faq" className="py-16 md:py-20">
        <div className="container-page max-w-3xl">
          <SectionHeading eyebrow="FAQ" title={`Questions about ${product.name}`} />
          <Accordion className="mt-10" items={product.faqs.map((f) => ({ question: f.question, answer: f.answer }))} defaultOpen={0} />
          <p className="mt-8 text-center text-sm text-[var(--muted-foreground)]">
            Still unsure?{" "}
            <Link href="/support" className="font-medium text-[var(--primary)] hover:underline">
              Ask support
            </Link>{" "}
            or{" "}
            <Link href="/contact?topic=sales" className="font-medium text-[var(--primary)] hover:underline">
              book a walkthrough
            </Link>
            .
          </p>
        </div>
      </Section>

      {/* --------------------------------------------------------------- Related */}
      {related.length ? (
        <Section className="py-16 md:py-20">
          <div className="container-page">
            <SectionHeading align="left" eyebrow="Related" title={`More ${category.name.toLowerCase()} products`} />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.slug} product={toSummary(item)} />
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      {/* ----------------------------------------------------------- Final CTA */}
      <Section className="pb-24 pt-0">
        <div className="container-page">
          <div className="rounded-[calc(var(--radius-card)*1.4)] border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-raised)] md:p-14">
            <h2 className="text-2xl font-semibold md:text-3xl">Start your {product.name} trial today</h2>
            <p className="mx-auto mt-4 max-w-xl text-[var(--muted-foreground)]">
              Install it, import your data, run a full month. Nothing is locked, nothing expires early, and nothing is
              deleted without warning.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href={`/download?product=${product.slug}`} size="lg">
                <Download aria-hidden />
                Download {product.name}
              </ButtonLink>
              <ButtonLink href="/contact?topic=sales" variant="secondary" size="lg">
                Book a walkthrough
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      <JsonLd
        data={[
          softwareApplicationSchema(product),
          faqSchema(product.faqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
            { name: product.name, path: `/products/${product.slug}` },
          ]),
        ]}
      />
    </>
  );
}
