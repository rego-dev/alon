import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { blogCategories, sortedPosts } from "@/data/blog";
import { getIcon } from "@/lib/icons";
import { Badge, Card, DataTable, Td, Th } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/app-shell";
import { StatTile } from "@/components/charts/stat-tile";
import { formatDate } from "@/lib/utils";

export default function AdminBlogPage() {
  const words = sortedPosts.reduce(
    (sum, post) =>
      sum +
      post.body.reduce((inner, block) => {
        if (block.type === "p") return inner + block.text.split(/\s+/).length;
        if (block.type === "ul" || block.type === "ol") return inner + block.items.join(" ").split(/\s+/).length;
        return inner;
      }, 0),
    0,
  );

  return (
    <>
      <PageTitle
        title="Blog"
        description="Published posts, categories and authors."
        action={
          <Button size="sm">
            <Plus aria-hidden />
            New post
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Published posts" value={String(sortedPosts.length)} icon={FileText} />
        <StatTile label="Categories" value={String(blogCategories.length)} icon={FileText} />
        <StatTile label="Words published" value={words.toLocaleString("en-US")} icon={FileText} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {blogCategories.map((category) => {
          const Icon = getIcon(category.icon);
          const count = sortedPosts.filter((p) => p.category === category.id).length;
          return (
            <Card key={category.id} className="p-4">
              <Icon className="size-4 text-[var(--primary)]" aria-hidden />
              <p className="mt-2 text-xl font-semibold">{count}</p>
              <p className="text-xs text-[var(--muted-foreground)]">{category.label}</p>
            </Card>
          );
        })}
      </div>

      <DataTable className="mt-6">
        <table className="w-full min-w-[52rem]">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
            <tr>
              <Th>Title</Th>
              <Th>Category</Th>
              <Th>Author</Th>
              <Th>Published</Th>
              <Th className="text-right">Read time</Th>
              <Th>Tags</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {sortedPosts.map((post) => (
              <tr key={post.slug} className="transition-colors hover:bg-[var(--surface-muted)]">
                <Td className="max-w-sm whitespace-normal">
                  <Link href={`/blog/${post.slug}`} className="font-medium hover:text-[var(--primary)]">
                    {post.title}
                  </Link>
                </Td>
                <Td className="text-[var(--muted-foreground)]">
                  {blogCategories.find((c) => c.id === post.category)?.label}
                </Td>
                <Td className="text-[var(--muted-foreground)]">{post.author}</Td>
                <Td className="text-[var(--muted-foreground)]">{formatDate(post.publishedAt)}</Td>
                <Td className="text-right tabular-nums">{post.readTime} min</Td>
                <Td className="text-[var(--muted-foreground)]">{post.tags.slice(0, 2).join(", ")}</Td>
                <Td>
                  <Badge tone={post.featured ? "primary" : "success"}>{post.featured ? "Featured" : "Published"}</Badge>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </>
  );
}
