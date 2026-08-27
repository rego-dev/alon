import type { Metadata } from "next";
import { company } from "@/data/company";
import type { Product } from "@/types";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? company.url;

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

/**
 * Builds a page's Metadata with canonical URL, Open Graph and Twitter cards.
 * OG images are rendered by the /opengraph-image route from the same title.
 */
export function pageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  type = "website",
  publishedTime,
  authors,
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: company.name,
      type,
      locale: "en_US",
      ...(publishedTime ? { publishedTime } : {}),
      ...(authors ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@alonsoftware",
      creator: "@alonsoftware",
    },
  };
}

/* --------------------------- Structured data ------------------------------ */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.legalName,
    alternateName: company.name,
    url: siteUrl,
    logo: absoluteUrl("/icon.svg"),
    email: company.email,
    telephone: company.phone,
    foundingDate: String(company.foundedYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: "2100 Market Street, Suite 400",
      addressLocality: "San Francisco",
      addressRegion: "CA",
      postalCode: "94114",
      addressCountry: "US",
    },
    sameAs: ["https://x.com", "https://linkedin.com", "https://github.com", "https://youtube.com"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: company.phone,
        contactType: "sales",
        email: company.salesEmail,
        availableLanguage: ["English"],
      },
      {
        "@type": "ContactPoint",
        telephone: company.supportPhone,
        contactType: "technical support",
        email: company.supportEmail,
        availableLanguage: ["English"],
      },
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: company.name,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/products?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

const OS_LABEL: Record<string, string> = {
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
  android: "Android",
  ios: "iOS",
};

export function softwareApplicationSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: product.platforms.map((p) => OS_LABEL[p]).join(", "),
    softwareVersion: product.version,
    datePublished: product.releaseDate,
    description: product.overview,
    url: absoluteUrl(`/products/${product.slug}`),
    downloadUrl: absoluteUrl(`/download?product=${product.slug}`),
    publisher: { "@type": "Organization", name: company.legalName, url: siteUrl },
    offers: {
      "@type": "Offer",
      price: product.priceFrom,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2027-12-31",
      description: "30-day free trial, no credit card required",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    review: product.reviews.slice(0, 3).map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.author },
      datePublished: review.date,
      name: review.title,
      reviewBody: review.body,
      reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 5, worstRating: 1 },
    })),
  };
}

export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleSchema(post: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  author: string;
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: company.legalName, logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") } },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/blog/${post.slug}`) },
    articleSection: post.category,
  };
}

/** Renders a JSON-LD script tag. */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is generated from our own trusted content.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
