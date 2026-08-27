import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CircleCheck } from "lucide-react";
import { legalBySlug, legalDocuments } from "@/data/legal";
import { Card, Section } from "@/components/ui/primitives";
import { BlockRenderer, tableOfContents } from "@/components/content/blocks";
import { Breadcrumbs } from "@/components/marketing/page-header";
import { JsonLd, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return legalDocuments.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = legalBySlug[slug];
  if (!doc) return pageMetadata({ title: "Not found", description: "", path: `/legal/${slug}`, noIndex: true });

  return pageMetadata({
    title: doc.title,
    description: doc.description,
    path: `/legal/${doc.slug}`,
  });
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = legalBySlug[slug];
  if (!doc) notFound();

  const toc = tableOfContents(doc.body);

  return (
    <>
      <Section className="py-10 md:py-14">
        <div className="container-page">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Legal", href: "/legal/terms" }, { label: doc.title }]}
          />

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_17rem]">
            <article className="min-w-0 max-w-3xl">
              <header className="border-b border-[var(--border)] pb-8">
                <h1 className="text-3xl font-semibold leading-tight md:text-4xl">{doc.title}</h1>
                <p className="mt-4 text-lg text-[var(--muted-foreground)]">{doc.description}</p>
                <p className="mt-5 text-sm text-[var(--muted-foreground)]">Last updated {formatDate(doc.updated)}</p>
              </header>

              <div className="mt-8 rounded-[var(--radius-card)] border border-[var(--primary)]/30 bg-[var(--primary-soft)] p-6">
                <p className="text-sm font-semibold">In short</p>
                <ul className="mt-3 space-y-2">
                  {doc.summary.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm">
                      <CircleCheck className="mt-0.5 size-4 shrink-0 text-[var(--primary)]" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-[var(--muted-foreground)]">
                  This summary is for orientation. The full text below is what applies.
                </p>
              </div>

              <div className="mt-10">
                <BlockRenderer blocks={doc.body} />
              </div>
            </article>

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Legal documents
                  </p>
                  <ul className="space-y-0.5 border-l border-[var(--border)]">
                    {legalDocuments.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/legal/${item.slug}`}
                          aria-current={item.slug === doc.slug ? "page" : undefined}
                          className={`-ml-px block border-l-2 py-1.5 pl-3 text-sm transition-colors ${
                            item.slug === doc.slug
                              ? "border-[var(--primary)] font-medium text-[var(--primary)]"
                              : "border-transparent text-[var(--muted-foreground)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                          }`}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {toc.length ? (
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      On this page
                    </p>
                    <ul className="space-y-1.5 border-l border-[var(--border)]">
                      {toc.map((item) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            className={`-ml-px block border-l-2 border-transparent py-1 text-sm text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] ${
                              item.level === 3 ? "pl-6" : "pl-3"
                            }`}
                          >
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <Card className="p-5">
                  <p className="text-sm font-medium">Questions about these terms?</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted-foreground)]">
                    Our legal team answers plainly, without redirecting you to a clause number.
                  </p>
                  <Link href="/contact?topic=other" className="mt-3 inline-block text-sm font-medium text-[var(--primary)] hover:underline">
                    Get in touch
                  </Link>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </Section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: doc.title, path: `/legal/${doc.slug}` },
        ])}
      />
    </>
  );
}
