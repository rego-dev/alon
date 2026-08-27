import Link from "next/link";
import { Plus } from "lucide-react";
import { listProducts } from "@/lib/repositories/products";
import { categories, categoryBySlug } from "@/data/categories";
import { getIcon } from "@/lib/icons";
import { Badge, Card, DataTable, Td, Th } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/app-shell";
import { formatCompact, formatDate } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await listProducts();
  return (
    <>
      <PageTitle
        title="Products"
        description={`${products.length} products across ${categories.length} categories.`}
        action={
          <Button size="sm">
            <Plus aria-hidden />
            New product
          </Button>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {categories.map((category) => {
          const Icon = getIcon(category.icon);
          const count = products.filter((p) => p.category === category.slug).length;
          return (
            <Card key={category.slug} className="p-4">
              <Icon className="size-4 text-[var(--primary)]" aria-hidden />
              <p className="mt-2 text-xl font-semibold">{count}</p>
              <p className="text-xs text-[var(--muted-foreground)]">{category.name}</p>
            </Card>
          );
        })}
      </div>

      <DataTable>
        <table className="w-full min-w-[56rem]">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
            <tr>
              <Th>Product</Th>
              <Th>Category</Th>
              <Th>Version</Th>
              <Th>Released</Th>
              <Th>Platforms</Th>
              <Th className="text-right">From</Th>
              <Th className="text-right">Downloads</Th>
              <Th className="text-right">Rating</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {products.map((product) => {
              const Icon = getIcon(product.icon);
              return (
                <tr key={product.slug} className="transition-colors hover:bg-[var(--surface-muted)]">
                  <Td>
                    <span className="flex items-center gap-2.5">
                      <Icon className="size-4 shrink-0 text-[var(--primary)]" aria-hidden />
                      <Link href={`/products/${product.slug}`} className="font-medium hover:text-[var(--primary)]">
                        {product.name}
                      </Link>
                    </span>
                  </Td>
                  <Td className="text-[var(--muted-foreground)]">{categoryBySlug[product.category].name}</Td>
                  <Td className="font-mono text-xs">{product.version}</Td>
                  <Td className="text-[var(--muted-foreground)]">{formatDate(product.releaseDate)}</Td>
                  <Td className="text-[var(--muted-foreground)]">{product.platforms.length}</Td>
                  <Td className="text-right tabular-nums">${product.priceFrom}</Td>
                  <Td className="text-right tabular-nums">{formatCompact(product.downloads)}</Td>
                  <Td className="text-right tabular-nums">{product.rating.toFixed(1)}</Td>
                  <Td>
                    <Badge tone="success">Published</Badge>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </DataTable>
    </>
  );
}
