import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock } from "lucide-react";
import { blogCategories, postBySlug, posts, relatedPosts } from "@/data/blog";
import { Badge, Card, Section } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { BlockRenderer, tableOfContents } from "@/components/content/blocks";
import { Breadcrumbs } from "@/components/marketing/page-header";
import { JsonLd, articleSchema, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug[slug];
  if (!post) return pageMetadata({ title: "Post not found", description: "", path: `/blog/${slug}`, noIndex: true });

  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.tags,
    type: "article",
    publishedTime: post.publishedAt,
    authors: [post.author],
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = postBySlug[slug];
  if (!post) notFound();

  const category = blogCategories.find((c) => c.id === post.category)!;
  const related = relatedPosts(post);
  const toc = tableOfContents(post.body);

  return (
    <>
      <Section className="py-10 md:py-14">
        <div className="container-page">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: category.label, href: `/blog?category=${category.id}` },
              { label: post.title },
            ]}
          />

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
            <article className="min-w-0 max-w-3xl">
              <header className="border-b border-[var(--border)] pb-8">
                <Badge tone="primary" className="mb-4">
                  {category.label}
                </Badge>
                <h1 className="text-3xl font-semibold leading-[1.15] md:text-[2.6rem]">{post.title}</h1>
                <p className="mt-5 text-lg leading-relaxed text-[var(--muted-foreground)]">{post.description}</p>

                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-sm font-semibold text-white">
                    {post.author.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{post.author}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{post.authorRole}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-4" aria-hidden />
                      {post.readTime} min read
                    </span>
                  </div>
                </div>
              </header>

              <div className="mt-10">
                <BlockRenderer blocks={post.body} />
              </div>

              <footer className="mt-12 border-t border-[var(--border)] pt-8">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} tone="neutral">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </footer>
            </article>

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
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
                  <p className="text-sm font-medium">Try any product free for 30 days</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted-foreground)]">
                    Full features, every platform, no credit card.
                  </p>
                  <ButtonLink href="/download" size="sm" className="mt-4 w-full">
                    Download now
                  </ButtonLink>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </Section>

      {/* Related */}
      <Section muted className="py-16">
        <div className="container-page">
          <h2 className="text-2xl font-semibold">Keep reading</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <Card key={item.slug} interactive className="group relative flex h-full flex-col p-6">
                <Badge tone="neutral" className="w-fit">
                  {blogCategories.find((c) => c.id === item.category)?.label}
                </Badge>
                <h3 className="mt-3 font-semibold leading-snug">
                  <Link href={`/blog/${item.slug}`} className="after:absolute after:inset-0">
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 line-clamp-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {item.description}
                </p>
                <p className="mt-4 flex items-center text-xs text-[var(--muted-foreground)]">
                  {formatDate(item.publishedAt)}
                  <ArrowRight className="ml-auto size-4 text-[var(--primary)] transition-transform group-hover:translate-x-1" aria-hidden />
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.description,
            slug: post.slug,
            publishedAt: post.publishedAt,
            author: post.author,
            category: category.label,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
    </>
  );
}
