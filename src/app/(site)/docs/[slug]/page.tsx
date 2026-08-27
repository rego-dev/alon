import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, LifeBuoy } from "lucide-react";
import { docBySlug, docSections, docs, docsInSection } from "@/data/docs";
import { getIcon } from "@/lib/icons";
import { Icon as RegistryIcon } from "@/components/ui/icon";
import { Badge, Card, Section } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { BlockRenderer, tableOfContents } from "@/components/content/blocks";
import { Breadcrumbs } from "@/components/marketing/page-header";
import { JsonLd, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return docs.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = docBySlug[slug];
  if (!doc) return pageMetadata({ title: "Article not found", description: "", path: `/docs/${slug}`, noIndex: true });

  return pageMetadata({
    title: doc.title,
    description: doc.description,
    path: `/docs/${doc.slug}`,
    keywords: doc.keywords,
    type: "article",
    publishedTime: doc.updated,
  });
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = docBySlug[slug];
  if (!doc) notFound();

  const section = docSections.find((s) => s.id === doc.section)!;
  const siblings = docsInSection(doc.section);
  const index = siblings.findIndex((d) => d.slug === doc.slug);
  const prev = siblings[index - 1];
  const next = siblings[index + 1];
  const toc = tableOfContents(doc.body);

  return (
    <>
      <Section className="py-10 md:py-14">
        <div className="container-page">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Docs", href: "/docs" },
              { label: section.title, href: `/docs#${section.id}` },
              { label: doc.title },
            ]}
          />

          <div className="grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)_15rem]">
            {/* Section navigation */}
            <nav aria-label="Documentation sections" className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {docSections.map((s) => {
                  const items = docsInSection(s.id);
                  if (!items.length) return null;
                  const Icon = getIcon(s.icon);
                  return (
                    <div key={s.id}>
                      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                        <Icon className="size-3.5" aria-hidden />
                        {s.title}
                      </p>
                      <ul className="space-y-0.5 border-l border-[var(--border)]">
                        {items.map((item) => (
                          <li key={item.slug}>
                            <Link
                              href={`/docs/${item.slug}`}
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
                  );
                })}
              </div>
            </nav>

            {/* Article */}
            <article className="min-w-0">
              <header className="mb-10 border-b border-[var(--border)] pb-8">
                <Badge tone="primary" className="mb-4">
                  <RegistryIcon name={section.icon} className="size-3.5" aria-hidden />
                  {section.title}
                </Badge>
                <h1 className="text-3xl font-semibold leading-tight md:text-4xl">{doc.title}</h1>
                <p className="mt-4 text-lg text-[var(--muted-foreground)]">{doc.description}</p>
                <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--muted-foreground)]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-4" aria-hidden />
                    {doc.readTime} min read
                  </span>
                  <span>Updated {formatDate(doc.updated)}</span>
                </p>
              </header>

              <BlockRenderer blocks={doc.body} />

              {/* Prev / next */}
              <nav className="mt-14 grid gap-4 border-t border-[var(--border)] pt-8 sm:grid-cols-2" aria-label="Article navigation">
                {prev ? (
                  <Link
                    href={`/docs/${prev.slug}`}
                    className="group rounded-[var(--radius-card)] border border-[var(--border)] p-4 transition-colors hover:border-[var(--primary)]/40"
                  >
                    <span className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                      <ArrowLeft className="size-3.5" aria-hidden />
                      Previous
                    </span>
                    <span className="mt-1 block font-medium group-hover:text-[var(--primary)]">{prev.title}</span>
                  </Link>
                ) : (
                  <span />
                )}
                {next ? (
                  <Link
                    href={`/docs/${next.slug}`}
                    className="group rounded-[var(--radius-card)] border border-[var(--border)] p-4 text-right transition-colors hover:border-[var(--primary)]/40"
                  >
                    <span className="flex items-center justify-end gap-1.5 text-xs text-[var(--muted-foreground)]">
                      Next
                      <ArrowRight className="size-3.5" aria-hidden />
                    </span>
                    <span className="mt-1 block font-medium group-hover:text-[var(--primary)]">{next.title}</span>
                  </Link>
                ) : null}
              </nav>
            </article>

            {/* On this page */}
            <aside className="hidden xl:block">
              <div className="sticky top-24">
                {toc.length ? (
                  <>
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
                  </>
                ) : null}

                <Card className="mt-8 p-5">
                  <LifeBuoy className="size-5 text-[var(--primary)]" aria-hidden />
                  <p className="mt-3 text-sm font-medium">Did this answer your question?</p>
                  <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
                    If not, open a ticket. We answer, then fix the article.
                  </p>
                  <ButtonLink href="/support#ticket" variant="secondary" size="sm" className="mt-4 w-full">
                    Contact support
                  </ButtonLink>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </Section>

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Documentation", path: "/docs" },
            { name: doc.title, path: `/docs/${doc.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: doc.title,
            description: doc.description,
            dateModified: doc.updated,
            articleSection: section.title,
            keywords: doc.keywords.join(", "),
          },
        ]}
      />
    </>
  );
}
