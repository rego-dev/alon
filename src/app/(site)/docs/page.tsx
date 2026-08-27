import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LifeBuoy, MessageCircle, Play } from "lucide-react";
import { docSections, docs } from "@/data/docs";
import { Card, Section, SectionHeading } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { DocsSearch, type DocIndexEntry } from "@/components/content/docs-search";
import { PageHeader } from "@/components/marketing/page-header";
import { JsonLd, breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Documentation Center — Guides, API Reference and Troubleshooting",
  description:
    "Installation guides for every platform, the complete licensing and trial reference, API documentation, troubleshooting and a searchable knowledge base.",
  path: "/docs",
  keywords: ["documentation", "installation guide", "API reference", "troubleshooting", "knowledge base"],
});

const HELP_LINKS = [
  { title: "Open a support ticket", body: "Engineers answer within one business hour on paid plans.", href: "/support#ticket", icon: LifeBuoy },
  { title: "Ask the community", body: "18,400 operators sharing configurations and workarounds.", href: "/support#community", icon: MessageCircle },
  { title: "Watch a tutorial", body: "Guided walkthroughs recorded on the current release.", href: "/docs/video-tutorials", icon: Play },
];

export default function DocsPage() {
  const entries: DocIndexEntry[] = docs.map((doc) => ({
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    section: doc.section,
    sectionTitle: docSections.find((s) => s.id === doc.section)?.title ?? doc.section,
    readTime: doc.readTime,
    keywords: doc.keywords,
    searchText: [
      doc.title,
      doc.description,
      ...doc.keywords,
      ...doc.body.flatMap((block) => {
        switch (block.type) {
          case "p":
          case "h2":
          case "h3":
            return [block.text];
          case "ul":
          case "ol":
            return block.items;
          case "callout":
            return [block.title, block.text];
          case "steps":
            return block.items.flatMap((s) => [s.title, s.text]);
          case "table":
            return [...block.head, ...block.rows.flat()];
          default:
            return [];
        }
      }),
    ]
      .join(" ")
      .toLowerCase(),
  }));

  return (
    <>
      <PageHeader
        eyebrow="Documentation"
        title="Everything you need to install, configure and run it"
        description="Written by the engineers who build the products, kept current with every release, and searchable in one place."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Documentation" }]}
      />

      <Section className="py-14 md:py-16">
        <div className="container-page">
          <DocsSearch entries={entries} sections={docSections} />
        </div>
      </Section>

      <Section muted className="py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Still stuck?" title="Three faster routes to an answer" />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {HELP_LINKS.map(({ title, body, href, icon: Icon }) => (
              <Card key={title} interactive className="group relative p-6">
                <span className="mb-4 grid size-11 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="font-semibold">
                  <Link href={href} className="after:absolute after:inset-0">
                    {title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{body}</p>
                <ArrowRight className="mt-4 size-4 text-[var(--primary)] transition-transform group-hover:translate-x-1" aria-hidden />
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/support" variant="secondary">
              Visit the support centre
              <ArrowRight aria-hidden />
            </ButtonLink>
          </div>
        </div>
      </Section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Documentation", path: "/docs" },
        ])}
      />
    </>
  );
}
