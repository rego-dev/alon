export type CategorySlug =
  | "retail"
  | "accounting"
  | "human-resources"
  | "healthcare"
  | "business-operations"
  | "education";

export type PlatformId = "windows" | "macos" | "linux" | "android" | "ios";
export type Architecture = "x64" | "arm64";
export type InstallerType = "online" | "offline";

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  accent: string;
}

export interface ProductFeature {
  title: string;
  description: string;
  icon: string;
}

export interface ProductScreenshot {
  title: string;
  caption: string;
  /** Visual seed for the generated screenshot mock (no binary assets required). */
  variant: "dashboard" | "table" | "form" | "report" | "mobile";
}

export interface SystemRequirement {
  platform: string;
  os: string;
  cpu: string;
  memory: string;
  storage: string;
  extra: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ReleaseNote {
  version: string;
  date: string;
  channel: "stable" | "beta";
  highlights: string[];
  fixes: string[];
}

export interface CustomerReview {
  author: string;
  role: string;
  company: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
}

export interface DownloadBuild {
  platform: PlatformId;
  architectures: Architecture[];
  installers: InstallerType[];
  size: Record<InstallerType, string>;
  checksum: string;
  minOs: string;
}

export interface Product {
  slug: string;
  name: string;
  category: CategorySlug;
  tagline: string;
  overview: string;
  icon: string;
  badge?: "popular" | "new" | "top-rated";
  rating: number;
  reviewCount: number;
  downloads: number;
  version: string;
  releaseDate: string;
  platforms: PlatformId[];
  priceFrom: number;
  highlights: string[];
  features: ProductFeature[];
  screenshots: ProductScreenshot[];
  requirements: SystemRequirement[];
  faqs: FaqItem[];
  releases: ReleaseNote[];
  reviews: CustomerReview[];
  builds: DownloadBuild[];
  videoDuration: string;
}

export interface PricingPlan {
  id: "starter" | "business" | "enterprise";
  name: string;
  blurb: string;
  monthly: number;
  annual: number;
  seats: string;
  featured?: boolean;
  features: string[];
  limits: Record<string, string>;
  cta: string;
}
