import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import {
  CategoryGrid,
  ClosingCta,
  FeaturedProducts,
  PlatformBand,
  StatsBand,
  Testimonials,
  TrialPolicySection,
  TrustBar,
} from "@/components/marketing/sections";
import { PricingPreview } from "@/components/marketing/pricing-preview";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Business Software That Grows With Your Company",
  description:
    "Download professional business software for retail, accounting, HR, healthcare, operations and education. Free 30-day trial of every feature on Windows, macOS, Linux, Android and iOS. No credit card required.",
  path: "/",
  keywords: [
    "business software download",
    "free 30 day trial software",
    "POS software",
    "accounting software",
    "payroll software",
    "inventory management software",
  ],
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <StatsBand />
      <CategoryGrid />
      <FeaturedProducts />
      <PlatformBand />
      <TrialPolicySection />
      <Testimonials />
      <PricingPreview />
      <ClosingCta />
    </>
  );
}
