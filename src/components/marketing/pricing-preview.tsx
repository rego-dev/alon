import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { PricingPlansSection } from "./pricing-plans";

export function PricingPreview() {
  return (
    <Section muted id="pricing">
      <div className="container-page">
        <SectionHeading
          eyebrow="Pricing"
          title="Three plans. Published prices. No sales dance."
          description="Pay per product, per organisation — not per seat inside your plan limits. Add a second product and bundle pricing applies automatically."
        />

        <div className="mt-12">
          <PricingPlansSection featureLimit={5} />
        </div>

        <div className="mt-10 text-center">
          <ButtonLink href="/pricing" variant="secondary">
            Compare every feature
            <ArrowRight aria-hidden />
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
