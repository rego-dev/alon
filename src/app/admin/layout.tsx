import type { Metadata } from "next";
import { AppShell, type ShellNavGroup } from "@/components/layout/app-shell";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Admin Console",
  description: "Platform administration: products, licences, customers, payments, content and analytics.",
  path: "/admin",
  noIndex: true,
});

const groups: ShellNavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
      { label: "Analytics", href: "/admin/analytics", icon: "ChartColumn" },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { label: "Products", href: "/admin/products", icon: "Package" },
      { label: "Versions", href: "/admin/versions", icon: "Layers" },
      { label: "Downloads", href: "/admin/downloads", icon: "Download" },
    ],
  },
  {
    label: "Licensing",
    items: [
      { label: "Licences", href: "/admin/licenses", icon: "KeyRound" },
      { label: "Trial activations", href: "/admin/trials", icon: "Hourglass" },
      { label: "Devices", href: "/admin/devices", icon: "Monitor" },
      { label: "Anti-abuse", href: "/admin/abuse", icon: "ShieldCheck", badge: "3" },
      { label: "Policy", href: "/admin/policy", icon: "Settings" },
    ],
  },
  {
    label: "Commerce",
    items: [
      { label: "Customers", href: "/admin/customers", icon: "Users" },
      { label: "Payments", href: "/admin/payments", icon: "CreditCard" },
      { label: "Coupons", href: "/admin/coupons", icon: "Ticket" },
    ],
  },
  {
    label: "Content & support",
    items: [
      { label: "Support tickets", href: "/admin/tickets", icon: "LifeBuoy", badge: "12" },
      { label: "Blog", href: "/admin/blog", icon: "FileText" },
      { label: "Documentation", href: "/admin/docs", icon: "BookOpen" },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      groups={groups}
      contextLabel="Admin console"
      account={{ name: "Sofia Lindqvist", secondary: "Platform administrator", initials: "SL" }}
      exitLabel="Sign out"
    >
      {children}
    </AppShell>
  );
}
