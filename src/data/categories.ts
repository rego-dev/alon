import type { Category } from "@/types";

export const categories: Category[] = [
  {
    slug: "retail",
    name: "Retail",
    tagline: "Point of sale built for the counter",
    description:
      "Offline-first point of sale for grocery, pharmacy, restaurant, hardware and boutique floors. Scan, sell and settle even when the internet drops.",
    icon: "Store",
    accent: "from-violet-500/20 to-fuchsia-500/10",
  },
  {
    slug: "accounting",
    name: "Accounting",
    tagline: "Books that close themselves",
    description:
      "Double-entry ledgers, statutory reports, payables and receivables that reconcile against your bank feed automatically.",
    icon: "Calculator",
    accent: "from-emerald-500/20 to-teal-500/10",
  },
  {
    slug: "human-resources",
    name: "Human Resources",
    tagline: "From clock-in to payslip",
    description:
      "Biometric timekeeping, statutory payroll, leave balances and a complete employee record in one connected system.",
    icon: "Users",
    accent: "from-sky-500/20 to-indigo-500/10",
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    tagline: "Clinical software clinicians trust",
    description:
      "Patient records, e-prescriptions, queueing and laboratory workflows with audit trails designed for regulated practice.",
    icon: "Stethoscope",
    accent: "from-rose-500/20 to-orange-500/10",
  },
  {
    slug: "business-operations",
    name: "Business Operations",
    tagline: "Stock, pipeline and purchasing",
    description:
      "Real-time inventory, multi-warehouse control, CRM and procurement that keep every branch working from the same numbers.",
    icon: "Boxes",
    accent: "from-amber-500/20 to-yellow-500/10",
  },
  {
    slug: "education",
    name: "Education",
    tagline: "Run the whole campus",
    description:
      "Enrollment, student records, assessment and tuition billing for schools, colleges and training centres.",
    icon: "GraduationCap",
    accent: "from-cyan-500/20 to-blue-500/10",
  },
];

export const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c])) as Record<
  Category["slug"],
  Category
>;
