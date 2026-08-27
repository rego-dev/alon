import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { blogCategories, sortedPosts } from "@/data/blog";
import { getIcon } from "@/lib/icons";
import { Badge, Card, Section, SectionHeading } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/marketing/page-header";
import { JsonLd, absoluteUrl, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Blog — Accounting, Retail, Payroll and Software Updates",
  description:
    "Practical writing on accounting close, retail operations, payroll compliance and the technology behind offline-first business software. Written by the people who build the products.",
  path: "/blog",
  keywords: ["business software blog", "accounting tips", "retail operations", "payroll compliance", "release notes"],
});

const CATEGORY_TONE: Record<string, "primary" | "accent" | "success" | "warning" | "neutral"> = {
  accounting: "success",
  retail: "primary",
  payroll: "accent",
  "business-tips": "warning",
  "software-updates": "neutral",
  technology: "primary",
};

export default function BlogIndexPage() {
  const [lead, ...rest] = sortedPosts;
  const featured = rest.filter((p) => p.featured).slice(0, 2);
  const featuredSlugs = new Set([lead.slug, ...featured.map((p) => p.slug)]);
  const remaining = sortedPosts.filter((p) => !featuredSlugs.has(p.slug));

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Practical writing about running a business on software"
        description="No thought leadership. Operational detail from the people who build these products and sit with the customers who run them."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />

      {/* Category strip */}
      <Section className="py-10">
        <div className="container-page">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {blogCategories.map((category) => {
              const Icon = getIcon(category.icon);
              const count = sortedPosts.filter((p) => p.category === category.id).length;
              return (
                <Link
                  key={category.id}
                  href={`/blog?category=${category.id}`}
                  className="group flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 transition-all hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:shadow-[var(--shadow-soft)]"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{category.label}</span>
                    <span className="block text-xs text-[var(--muted-foreground)]">{count} posts</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Lead + featured */}
      <Section className="py-10">
        <div className="container-page grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Card interactive className="group relative flex flex-col overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]" />
            <div className="flex flex-1 flex-col p-7 md:p-9">
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone={CATEGORY_TONE[lead.category]}>
                  {blogCategories.find((c) => c.id === lead.category)?.label}
                </Badge>
                <span className="text-sm text-[var(--muted-foreground)]">{formatDate(lead.publishedAt)}</span>
                <span className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
                  <Clock className="size-3.5" aria-hidden />
                  {lead.readTime} min
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold leading-tight md:text-3xl">
                <Link href={`/blog/${lead.slug}`} className="after:absolute after:inset-0">
                  {lead.title}
                </Link>
              </h2>
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-[var(--muted-foreground)]">
                {lead.description}
              </p>
              <p className="mt-6 flex items-center gap-3 border-t border-[var(--border)] pt-5 text-sm">
                <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-xs font-semibold text-white">
                  {lead.author.split(" ").map((n) => n[0]).join("")}
                </span>
                <span>
                  <span className="block font-medium">{lead.author}</span>
                  <span className="block text-xs text-[var(--muted-foreground)]">{lead.authorRole}</span>
                </span>
                <ArrowRight className="ml-auto size-5 text-[var(--primary)] transition-transform group-hover:translate-x-1" aria-hidden />
              </p>
            </div>
          </Card>

          <div className="grid gap-6">
            {featured.map((post) => (
              <Card key={post.slug} interactive className="group relative flex flex-col p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone={CATEGORY_TONE[post.category]}>
                    {blogCategories.find((c) => c.id === post.category)?.label}
                  </Badge>
                  <span className="text-xs text-[var(--muted-foreground)]">{formatDate(post.publishedAt)}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-snug">
                  <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 line-clamp-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {post.description}
                </p>
                <p className="mt-4 text-xs text-[var(--muted-foreground)]">
                  {post.author} · {post.readTime} min read
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* All posts */}
      <Section muted className="py-16 md:py-20">
        <div className="container-page">
          <SectionHeading align="left" eyebrow="All posts" title="Everything we have published" />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {remaining.map((post) => (
              <Card key={post.slug} interactive className="group relative flex h-full flex-col p-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge tone={CATEGORY_TONE[post.category]}>
                    {blogCategories.find((c) => c.id === post.category)?.label}
                  </Badge>
                  <span className="text-xs text-[var(--muted-foreground)]">{formatDate(post.publishedAt)}</span>
                </div>
                <h3 className="mt-3 font-semibold leading-snug">
                  <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 line-clamp-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {post.description}
                </p>
                <p className="mt-5 flex items-center gap-2 border-t border-[var(--border)] pt-4 text-xs text-[var(--muted-foreground)]">
                  {post.author}
                  <span className="ml-auto flex items-center gap-1.5">
                    <Clock className="size-3.5" aria-hidden />
                    {post.readTime} min
                  </span>
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Subscribe */}
      <Section className="pb-24 pt-16">
        <div className="container-page">
          <div className="rounded-[calc(var(--radius-card)*1.4)] border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-raised)]">
            <h2 className="text-2xl font-semibold">One email a month, no marketing</h2>
            <p className="mx-auto mt-3 max-w-lg text-[var(--muted-foreground)]">
              New posts, release notes and security advisories. Nothing else, and one click to leave.
            </p>
            <form className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row">
              <label htmlFor="blog-email" className="sr-only">
                Email address
              </label>
              <input
                id="blog-email"
                type="email"
                required
                placeholder="you@company.com"
                autoComplete="email"
                className="h-12 flex-1 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-4 focus:ring-[var(--ring)]/20"
              />
              <ButtonLink href="#" size="lg" className="shrink-0">
                Subscribe
              </ButtonLink>
            </form>
          </div>
        </div>
      </Section>

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Alon Software Blog",
            url: absoluteUrl("/blog"),
            blogPost: sortedPosts.slice(0, 10).map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              description: post.description,
              datePublished: post.publishedAt,
              author: { "@type": "Person", name: post.author },
              url: absoluteUrl(`/blog/${post.slug}`),
            })),
          },
        ]}
      />
    </>
  );
}
