import type { CategorySlug, PlatformId, Product } from "@/types";
import { products } from "./products";

/**
 * The subset of a product a card needs. Server components hand this to client
 * components so the full catalogue (reviews, release notes, requirements)
 * never crosses the serialisation boundary.
 */
export interface ProductSummary {
  slug: string;
  name: string;
  category: CategorySlug;
  tagline: string;
  icon: string;
  badge?: Product["badge"];
  rating: number;
  reviewCount: number;
  downloads: number;
  priceFrom: number;
  platforms: PlatformId[];
  highlights: string[];
  version: string;
  releaseDate: string;
  /** Flattened searchable text so filtering never touches the full record. */
  searchText: string;
}

export function toSummary(product: Product): ProductSummary {
  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    tagline: product.tagline,
    icon: product.icon,
    badge: product.badge,
    rating: product.rating,
    reviewCount: product.reviewCount,
    downloads: product.downloads,
    priceFrom: product.priceFrom,
    platforms: product.platforms,
    highlights: product.highlights,
    version: product.version,
    releaseDate: product.releaseDate,
    searchText: [
      product.name,
      product.tagline,
      product.overview,
      ...product.highlights,
      ...product.features.map((f) => `${f.title} ${f.description}`),
    ]
      .join(" ")
      .toLowerCase(),
  };
}

export const productSummaries: ProductSummary[] = products.map(toSummary);
