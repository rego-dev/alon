import type { FaqItem, PricingPlan } from "@/types";

export const ANNUAL_DISCOUNT = 0.3;

export const plans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    blurb: "For a single till, clinic room or back office. Everything you need to run one place properly.",
    monthly: 29,
    annual: Math.round(29 * 12 * (1 - ANNUAL_DISCOUNT)),
    seats: "1 device, 2 users",
    cta: "Start free trial",
    features: [
      "Single device activation",
      "Two named users",
      "All core product features",
      "Automatic updates",
      "Email support, next business day",
      "Local encrypted database",
      "CSV and XLSX import/export",
      "Standard reports and printing",
    ],
    limits: {
      Devices: "1",
      Users: "2",
      Branches: "1",
      "Cloud backup": "Manual export",
      "Offline tolerance": "14 days",
      "API access": "Not included",
      Support: "Email, next business day",
      "Licence transfers": "2 per year",
    },
  },
  {
    id: "business",
    name: "Business",
    blurb: "For growing operations running several branches, with head office needing one consolidated view.",
    monthly: 89,
    annual: Math.round(89 * 12 * (1 - ANNUAL_DISCOUNT)),
    seats: "Up to 20 users",
    featured: true,
    cta: "Start free trial",
    features: [
      "Up to 20 named users",
      "Up to 10 device activations",
      "Multi-branch consolidation",
      "Nightly encrypted cloud backup",
      "Priority support, 1-hour response",
      "Phone and remote assistance",
      "Role-based permissions",
      "Scheduled report delivery",
      "Guided data migration",
    ],
    limits: {
      Devices: "10",
      Users: "20",
      Branches: "Unlimited",
      "Cloud backup": "Nightly, 90-day history",
      "Offline tolerance": "30 days",
      "API access": "Read-only REST",
      Support: "Priority, 1-hour response",
      "Licence transfers": "Unlimited",
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    blurb: "For organisations that need unlimited scale, their own integrations and a named engineer to call.",
    monthly: 249,
    annual: Math.round(249 * 12 * (1 - ANNUAL_DISCOUNT)),
    seats: "Unlimited users",
    cta: "Talk to sales",
    features: [
      "Unlimited users and devices",
      "Full REST and GraphQL API access",
      "White-label branding",
      "Dedicated success engineer",
      "Custom integrations and SSO",
      "Self-hosted or private cloud option",
      "Configurable trial and grace policy",
      "99.9% uptime SLA",
      "Quarterly business review",
    ],
    limits: {
      Devices: "Unlimited",
      Users: "Unlimited",
      Branches: "Unlimited",
      "Cloud backup": "Continuous, custom retention",
      "Offline tolerance": "Configurable",
      "API access": "REST + GraphQL, write access",
      Support: "Dedicated engineer, 15-minute SLA",
      "Licence transfers": "Unlimited + bulk tooling",
    },
  },
];

export const comparisonGroups: Array<{ group: string; rows: Array<{ label: string; starter: string | boolean; business: string | boolean; enterprise: string | boolean }> }> = [
  {
    group: "Access & scale",
    rows: [
      { label: "Named users", starter: "2", business: "20", enterprise: "Unlimited" },
      { label: "Device activations", starter: "1", business: "10", enterprise: "Unlimited" },
      { label: "Branches / locations", starter: "1", business: "Unlimited", enterprise: "Unlimited" },
      { label: "Multi-company consolidation", starter: false, business: true, enterprise: true },
      { label: "Single sign-on (SAML/OIDC)", starter: false, business: false, enterprise: true },
    ],
  },
  {
    group: "Data & continuity",
    rows: [
      { label: "Encrypted local database", starter: true, business: true, enterprise: true },
      { label: "Offline tolerance", starter: "14 days", business: "30 days", enterprise: "Configurable" },
      { label: "Cloud backup", starter: "Manual export", business: "Nightly", enterprise: "Continuous" },
      { label: "Backup retention", starter: "—", business: "90 days", enterprise: "Custom" },
      { label: "Point-in-time restore", starter: false, business: true, enterprise: true },
    ],
  },
  {
    group: "Licensing controls",
    rows: [
      { label: "30-day full trial", starter: true, business: true, enterprise: true },
      { label: "Grace period", starter: "7 days", business: "14 days", enterprise: "7–30 days, configurable" },
      { label: "Licence transfer between devices", starter: "2 per year", business: "Unlimited", enterprise: "Unlimited + bulk" },
      { label: "Admin-configurable trial policy", starter: false, business: false, enterprise: true },
      { label: "Emergency trial extension", starter: false, business: true, enterprise: true },
    ],
  },
  {
    group: "Integration & support",
    rows: [
      { label: "REST API", starter: false, business: "Read-only", enterprise: "Full read/write" },
      { label: "GraphQL API", starter: false, business: false, enterprise: true },
      { label: "Webhooks", starter: false, business: true, enterprise: true },
      { label: "White-label branding", starter: false, business: false, enterprise: true },
      { label: "Support channel", starter: "Email", business: "Priority + phone", enterprise: "Dedicated engineer" },
      { label: "Response time target", starter: "1 business day", business: "1 hour", enterprise: "15 minutes" },
      { label: "Uptime SLA", starter: false, business: "99.5%", enterprise: "99.9%" },
    ],
  },
];

export const pricingFaqs: FaqItem[] = [
  {
    question: "Do I need a credit card to start the trial?",
    answer:
      "No. Create an account, download the installer, and the 30-day trial activates itself on first launch. We ask for payment details only when you decide to subscribe.",
  },
  {
    question: "Is the price per product or for everything?",
    answer:
      "Pricing is per product, per organisation — not per seat within the plan limits. Running Grocery POS and Accounting on Business is two Business subscriptions, and bundle discounts apply automatically from the second product onward.",
  },
  {
    question: "What exactly does annual billing save?",
    answer:
      "Annual billing is 30 percent cheaper than paying monthly, charged once for twelve months. You can switch to annual mid-term and we credit the unused monthly portion.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "Yes, in either direction, from the customer portal. Upgrades take effect immediately and are prorated. Downgrades take effect at the next renewal so you keep what you paid for.",
  },
  {
    question: "What happens if I stop paying?",
    answer:
      "The licence enters a grace period of 7 to 30 days depending on your plan. During that window the app is read-only: you can open, view and export everything but not create or edit. Data is only removed after the grace period, and only after four separate warnings and a final export prompt.",
  },
  {
    question: "Do you offer discounts for non-profits or education?",
    answer:
      "Yes — registered non-profits, schools and public clinics receive 40 percent off any plan. Contact sales with your registration details and we apply it to the subscription permanently.",
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      "Card and direct debit through Stripe, PayPal, and local wallets including GCash and Maya. Enterprise customers can pay by bank transfer against an invoice with net-30 terms.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "Because the trial is unrestricted for 30 days, subscriptions are generally non-refundable. That said, if something is materially broken in your first billing period we refund it — ask support and we will not argue.",
  },
];

export function planPrice(plan: PricingPlan, cycle: "monthly" | "annual") {
  return cycle === "monthly" ? plan.monthly : Math.round(plan.annual / 12);
}

export function annualSaving(plan: PricingPlan) {
  return plan.monthly * 12 - plan.annual;
}
