"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Funnel, Search, X } from "lucide-react";
import type { Category, CategorySlug, PlatformId } from "@/types";
import type { ProductSummary } from "@/data/product-summary";
import { Badge, Input, Select } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { getIcon } from "@/lib/icons";
import { cn, pluralize } from "@/lib/utils";
import { ProductCard } from "./product-card";
import { PLATFORM_META } from "./platform-icons";

type SortKey = "popular" | "rating" | "name" | "price-asc" | "newest";

const SORTS: Array<{ value: SortKey; label: string }> = [
  { value: "popular", label: "Most downloaded" },
  { value: "rating", label: "Highest rated" },
  { value: "newest", label: "Recently updated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "name", label: "Name: A to Z" },
];

const PLATFORMS: PlatformId[] = ["windows", "macos", "linux", "android", "ios"];

export function ProductCatalog({
  products,
  categories,
}: {
  products: ProductSummary[];
  categories: Category[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  const initialCategory = (params.get("category") as CategorySlug | null) ?? "all";
  const initialQuery = params.get("q") ?? "";

  const [category, setCategory] = React.useState<CategorySlug | "all">(initialCategory);
  const [query, setQuery] = React.useState(initialQuery);
  const [platform, setPlatform] = React.useState<PlatformId | "all">("all");
  const [sort, setSort] = React.useState<SortKey>("popular");

  // Keep the URL shareable without a full navigation.
  React.useEffect(() => {
    const next = new URLSearchParams();
    if (category !== "all") next.set("category", category);
    if (query.trim()) next.set("q", query.trim());
    const qs = next.toString();
    window.history.replaceState(null, "", qs ? `/products?${qs}` : "/products");
  }, [category, query]);

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    const result = products.filter((product) => {
      if (category !== "all" && product.category !== category) return false;
      if (platform !== "all" && !product.platforms.includes(platform)) return false;
      if (needle && !product.searchText.includes(needle)) return false;
      return true;
    });

    const sorted = [...result];
    switch (sort) {
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
        sorted.sort((a, b) => a.priceFrom - b.priceFrom);
        break;
      case "newest":
        sorted.sort((a, b) => (a.releaseDate < b.releaseDate ? 1 : -1));
        break;
      default:
        sorted.sort((a, b) => b.downloads - a.downloads);
    }
    return sorted;
  }, [products, category, platform, query, sort]);

  const hasFilters = category !== "all" || platform !== "all" || query.trim() !== "";

  const reset = () => {
    setCategory("all");
    setPlatform("all");
    setQuery("");
    setSort("popular");
    router.replace("/products");
  };

  return (
    <div>
      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <CategoryPill active={category === "all"} onClick={() => setCategory("all")} label="All products" count={products.length} />
        {categories.map((c) => {
          const Icon = getIcon(c.icon);
          return (
            <CategoryPill
              key={c.slug}
              active={category === c.slug}
              onClick={() => setCategory(c.slug)}
              label={c.name}
              count={products.filter((p) => p.category === c.slug).length}
              icon={<Icon className="size-4" aria-hidden />}
            />
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="mt-6 flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" aria-hidden />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, features, industries…"
            aria-label="Search products"
            className="border-transparent bg-[var(--surface-muted)] pl-10"
          />
        </div>

        <div className="flex gap-3">
          <Select
            aria-label="Filter by platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as PlatformId | "all")}
            className="w-40 border-transparent bg-[var(--surface-muted)]"
          >
            <option value="all">Any platform</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {PLATFORM_META[p].label}
              </option>
            ))}
          </Select>

          <Select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="w-48 border-transparent bg-[var(--surface-muted)]"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Result meta */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <p className="text-sm text-[var(--muted-foreground)]">
          <Funnel className="mr-1.5 inline size-4" aria-hidden />
          {pluralize(filtered.length, "product")}
          {category !== "all" ? ` in ${categories.find((c) => c.slug === category)?.name}` : ""}
        </p>
        {hasFilters ? (
          <Button variant="ghost" size="sm" onClick={reset}>
            <X aria-hidden />
            Clear filters
          </Button>
        ) : null}
      </div>

      {/* Grid */}
      {filtered.length ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[var(--radius-card)] border border-dashed border-[var(--border-strong)] p-16 text-center">
          <p className="text-lg font-medium">No products match those filters</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted-foreground)]">
            Try a broader search, or tell us what you need — we build new products from customer requests every year.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="secondary" onClick={reset}>
              Clear filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryPill({
  active,
  onClick,
  label,
  count,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
        active
          ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-soft)]"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/40 hover:text-[var(--foreground)]",
      )}
    >
      {icon}
      {label}
      <Badge
        tone="neutral"
        className={cn("border-0 px-1.5 py-0", active && "bg-white/20 text-[var(--primary-foreground)]")}
      >
        {count}
      </Badge>
    </button>
  );
}
