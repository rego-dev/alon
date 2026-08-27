import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";
import { docSections, docs } from "@/data/docs";
import { getIcon } from "@/lib/icons";
import { Badge, Card, DataTable, Td, Th } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/app-shell";
import { StatTile } from "@/components/charts/stat-tile";
import { formatDate } from "@/lib/utils";

export default function AdminDocsPage() {
  const stale = docs.filter((doc) => doc.updated < "2026-06-01");

  return (
    <>
      <PageTitle
        title="Documentation"
        description="Articles, sections and how current each one is against the latest release."
        action={
          <Button size="sm">
            <Plus aria-hidden />
            New article
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Published articles" value={String(docs.length)} icon={BookOpen} />
        <StatTile label="Sections" value={String(docSections.length)} icon={BookOpen} />
        <StatTile label="Older than 90 days" value={String(stale.length)} icon={BookOpen} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {docSections.map((section) => {
          const Icon = getIcon(section.icon);
          const count = docs.filter((d) => d.section === section.id).length;
          return (
            <Card key={section.id} className="p-4">
              <Icon className="size-4 text-[var(--primary)]" aria-hidden />
              <p className="mt-2 text-xl font-semibold">{count}</p>
              <p className="text-xs text-[var(--muted-foreground)]">{section.title}</p>
            </Card>
          );
        })}
      </div>

      <DataTable className="mt-6">
        <table className="w-full min-w-[50rem]">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
            <tr>
              <Th>Article</Th>
              <Th>Section</Th>
              <Th>Updated</Th>
              <Th className="text-right">Read time</Th>
              <Th className="text-right">Blocks</Th>
              <Th>Freshness</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {docs.map((doc) => {
              const isStale = doc.updated < "2026-06-01";
              return (
                <tr key={doc.slug} className="transition-colors hover:bg-[var(--surface-muted)]">
                  <Td className="max-w-sm whitespace-normal">
                    <Link href={`/docs/${doc.slug}`} className="font-medium hover:text-[var(--primary)]">
                      {doc.title}
                    </Link>
                  </Td>
                  <Td className="text-[var(--muted-foreground)]">
                    {docSections.find((s) => s.id === doc.section)?.title}
                  </Td>
                  <Td className="text-[var(--muted-foreground)]">{formatDate(doc.updated)}</Td>
                  <Td className="text-right tabular-nums">{doc.readTime} min</Td>
                  <Td className="text-right tabular-nums">{doc.body.length}</Td>
                  <Td>
                    <Badge tone={isStale ? "warning" : "success"}>{isStale ? "Review due" : "Current"}</Badge>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </DataTable>

      <Card className="mt-8 p-6">
        <h2 className="font-semibold">Documentation policy</h2>
        <ul className="mt-4 space-y-2">
          {[
            "Every release that changes a workflow updates the affected article in the same pull request.",
            "Support tickets that reveal a documentation gap create an article task automatically.",
            "Articles older than 90 days are flagged for review, not silently trusted.",
            "Screenshots are avoided in favour of described steps, so articles do not rot on a UI change.",
          ].map((rule) => (
            <li key={rule} className="flex gap-2.5 text-sm text-[var(--muted-foreground)]">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
              {rule}
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
