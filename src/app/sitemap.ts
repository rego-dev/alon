import type { MetadataRoute } from "next";
import { listProducts } from "@/lib/repositories/products";
import { docs } from "@/data/docs";
import { posts } from "@/data/blog";
import { legalDocuments } from "@/data/legal";
import { categories } from "@/data/categories";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/products"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/pricing"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/download"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/docs"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/support"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/portal"), lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: absoluteUrl(`/products?category=${category.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = (await listProducts()).map((product) => ({
    url: absoluteUrl(`/products/${product.slug}`),
    lastModified: new Date(product.releaseDate),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const docRoutes: MetadataRoute.Sitemap = docs.map((doc) => ({
    url: absoluteUrl(`/docs/${doc.slug}`),
    lastModified: new Date(doc.updated),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.publishedAt),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const legalRoutes: MetadataRoute.Sitemap = legalDocuments.map((doc) => ({
    url: absoluteUrl(`/legal/${doc.slug}`),
    lastModified: new Date(doc.updated),
    changeFrequency: "yearly",
    priority: 0.4,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...docRoutes, ...postRoutes, ...legalRoutes];
}
