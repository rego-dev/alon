import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { HeaderClient, type ProductMenu } from "./header-client";

/**
 * Server component: builds a compact menu payload so the full product catalogue
 * never ships to the client bundle.
 */
export function SiteHeader() {
  const menu: ProductMenu = categories.map((category) => ({
    slug: category.slug,
    name: category.name,
    tagline: category.tagline,
    icon: category.icon,
    products: products
      .filter((p) => p.category === category.slug)
      .slice(0, 4)
      .map((p) => ({ slug: p.slug, name: p.name, icon: p.icon, tagline: p.tagline })),
  }));

  return <HeaderClient menu={menu} />;
}
