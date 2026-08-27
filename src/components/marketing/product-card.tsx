import Link from "next/link";
import { ArrowRight, Download, Star } from "lucide-react";
import type { Product } from "@/types";
import type { ProductSummary } from "@/data/product-summary";
import { Icon as RegistryIcon } from "@/components/ui/icon";
import { categoryBySlug } from "@/data/categories";
import { Badge, Card } from "@/components/ui/primitives";
import { cn, formatCompact } from "@/lib/utils";
import { PlatformIcons } from "./platform-icons";

const BADGE_LABEL: Record<NonNullable<Product["badge"]>, { label: string; tone: "primary" | "accent" | "success" }> = {
  popular: { label: "Most popular", tone: "primary" },
  new: { label: "New", tone: "accent" },
  "top-rated": { label: "Top rated", tone: "success" },
};

export function ProductCard({ product, className }: { product: ProductSummary; className?: string }) {
  const category = categoryBySlug[product.category];
  const badge = product.badge ? BADGE_LABEL[product.badge] : null;

  return (
    <Card interactive className={cn("group flex h-full flex-col overflow-hidden", className)}>
      <div className={cn("relative h-1.5 w-full bg-gradient-to-r", category.accent)} />

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className="grid size-12 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] transition-transform duration-300 group-hover:scale-105">
            <RegistryIcon name={product.icon} className="size-6" aria-hidden />
          </span>
          {badge ? <Badge tone={badge.tone}>{badge.label}</Badge> : null}
        </div>

        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
          {category.name}
        </p>

        <h3 className="text-lg font-semibold">
          <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
          {product.tagline}. {product.highlights[0]}.
        </p>

        <div className="mt-5 flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
          <span className="flex items-center gap-1">
            <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden />
            <span className="font-medium text-[var(--foreground)]">{product.rating.toFixed(1)}</span>
            <span className="sr-only">out of 5,</span>
            <span>({formatCompact(product.reviewCount)})</span>
          </span>
          <span className="flex items-center gap-1">
            <Download className="size-3.5" aria-hidden />
            {formatCompact(product.downloads)}
          </span>
          <PlatformIcons platforms={product.platforms} className="ml-auto" />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border)] px-6 py-4">
        <p className="text-sm">
          <span className="text-[var(--muted-foreground)]">from </span>
          <span className="font-semibold">${product.priceFrom}</span>
          <span className="text-[var(--muted-foreground)]">/mo</span>
        </p>
        <span className="relative z-10 flex items-center gap-1 text-sm font-medium text-[var(--primary)]">
          Free 30-day trial
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </Card>
  );
}
