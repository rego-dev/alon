import { Suspense } from "react";
import type { Metadata } from "next";
import { CircleCheck } from "lucide-react";
import { categories } from "@/data/categories";
import { productSummaries } from "@/data/product-summary";
import { ProductCatalog } from "@/components/marketing/product-catalog";
import { Section } from "@/components/ui/primitives";
import { ClosingCta } from "@/components/marketing/sections";
import { JsonLd, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/marketing/page-header";

export const metadata: Metadata = pageMetadata({
  title: "All Products — 31 Business Applications",
  description:
    "Browse 31 business applications across retail POS, accounting, HR and payroll, healthcare, operations and education. Every product includes a free 30-day trial with all features unlocked.",
  path: "/products",
  keywords: ["business software catalogue", "POS software", "accounting software", "HR software", "clinic software"],
});

function CatalogFallback() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-72 animate-pulse rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-muted)]"
        />
      ))}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Product catalogue"
        title="Every product, every feature, free for 30 days"
        description="Thirty-one applications built on one platform. Filter by industry or platform, compare what you need, and download without giving us a card."
        bullets={["No credit card required", "Windows, macOS, Linux, Android, iOS", "Runs offline by design"]}
        bulletIcon={CircleCheck}
      />

      <Section className="pt-0">
        <div className="container-page">
          <Suspense fallback={<CatalogFallback />}>
            <ProductCatalog products={productSummaries} categories={categories} />
          </Suspense>
        </div>
      </Section>

      <ClosingCta />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
        ])}
      />
    </>
  );
}
