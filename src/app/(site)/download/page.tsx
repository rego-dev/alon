import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck, KeyRound, ShieldCheck, TriangleAlert } from "lucide-react";
import { downloadIndex, releaseFeed } from "@/data/downloads";
import { getIcon } from "@/lib/icons";
import { Badge, Card, Section, SectionHeading } from "@/components/ui/primitives";
import { DownloadCenter } from "@/components/marketing/download-center";
import { PageHeader } from "@/components/marketing/page-header";
import { JsonLd, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Download Center — Installers for Every Platform",
  description:
    "Download installers for Windows, macOS, Linux, Android and iOS. Choose x64 or ARM, online or offline installers, verify SHA-256 checksums and read release notes. Every download includes a 30-day trial.",
  path: "/download",
  keywords: ["software download", "offline installer", "SHA256 checksum", "x64 ARM installer", "business software download"],
});

const TRIAL_STEPS = [
  {
    title: "Install and it activates itself",
    body: "The 30-day trial starts on first launch. No key to enter, no card to add, no activation call to make.",
    icon: KeyRound,
  },
  {
    title: "The countdown lives in the app",
    body: "Days remaining are always visible in the title bar, so the end of the trial is never a surprise.",
    icon: ShieldCheck,
  },
  {
    title: "Reinstalling does not reset it",
    body: "Trials are recorded against your organisation and device on our licensing server, not in a local file.",
    icon: TriangleAlert,
  },
];

function DownloadFallback() {
  return (
    <div className="grid gap-8 lg:grid-cols-[20rem_1fr]" aria-hidden>
      <div className="h-96 animate-pulse rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-muted)]" />
      <div className="h-[36rem] animate-pulse rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-muted)]" />
    </div>
  );
}

export default function DownloadPage() {
  return (
    <>
      <PageHeader
        eyebrow="Download center"
        title="Pick your platform and start the 30-day trial"
        description="Signed installers for every supported operating system and architecture, with published checksums so you can verify what you are installing."
        bullets={["No credit card required", "SHA-256 verified builds", "Silent deployment supported"]}
        bulletIcon={CircleCheck}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Download" }]}
      />

      <Section className="py-14 md:py-16">
        <div className="container-page">
          <Suspense fallback={<DownloadFallback />}>
            <DownloadCenter entries={downloadIndex} />
          </Suspense>
        </div>
      </Section>

      {/* How the trial works */}
      <Section muted className="py-16">
        <div className="container-page">
          <SectionHeading
            eyebrow="Trial system"
            title="How the trial actually works"
            description="No hidden meter, no crippled features, and no reset-by-reinstall loophole to worry about on either side."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {TRIAL_STEPS.map(({ title, body, icon: Icon }) => (
              <Card key={title} className="p-6">
                <span className="mb-4 grid size-11 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{body}</p>
              </Card>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-[var(--muted-foreground)]">
            Read what happens after day 30 in the{" "}
            <Link href="/#trial-policy" className="font-medium text-[var(--primary)] hover:underline">
              trial and subscription policy
            </Link>
            , or the full{" "}
            <Link href="/legal/data-retention" className="font-medium text-[var(--primary)] hover:underline">
              data retention terms
            </Link>
            .
          </p>
        </div>
      </Section>

      {/* Release feed */}
      <Section id="releases" className="py-16 md:py-20">
        <div className="container-page">
          <SectionHeading
            align="left"
            eyebrow="Release feed"
            title="Latest releases across the catalogue"
            description="Every product ships on a six-week train. Security fixes ship the day they are ready."
          />
          <div className="mt-10 space-y-3">
            {releaseFeed.map((release) => {
              const Icon = getIcon(release.icon);
              return (
                <Card key={`${release.slug}-${release.version}`} className="p-5">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <Link href={`/products/${release.slug}#releases`} className="font-medium hover:text-[var(--primary)]">
                      {release.product}
                    </Link>
                    <Badge tone="neutral">v{release.version}</Badge>
                    <span className="text-sm text-[var(--muted-foreground)]">{formatDate(release.date)}</span>
                    <span className="ml-auto text-sm text-[var(--muted-foreground)]">
                      {release.highlights.length + release.fixes.length} changes
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[var(--muted-foreground)]">{release.highlights[0]}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </Section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Download", path: "/download" },
        ])}
      />
    </>
  );
}
