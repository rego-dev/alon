import type { Metadata } from "next";
import { AppShell, type ShellNavGroup } from "@/components/layout/app-shell";
import { demoOrganisation } from "@/data/demo-account";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Customer Portal",
  description: "Manage licences, devices, downloads, billing and support in one place.",
  path: "/portal",
  noIndex: true,
});

const groups: ShellNavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/portal", icon: "LayoutDashboard" },
      { label: "Licences", href: "/portal/licenses", icon: "KeyRound" },
      { label: "Devices", href: "/portal/devices", icon: "Monitor" },
    ],
  },
  {
    label: "Software",
    items: [
      { label: "Downloads", href: "/portal/downloads", icon: "Download" },
      { label: "Updates", href: "/portal/updates", icon: "RefreshCw", badge: "3" },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Billing", href: "/portal/billing", icon: "CreditCard" },
      { label: "Invoices", href: "/portal/invoices", icon: "Receipt" },
      { label: "Support", href: "/portal/support", icon: "LifeBuoy" },
      { label: "Settings", href: "/portal/settings", icon: "Settings" },
    ],
  },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      groups={groups}
      contextLabel="Customer portal"
      account={{
        name: demoOrganisation.owner.name,
        secondary: demoOrganisation.name,
        initials: demoOrganisation.owner.name
          .split(" ")
          .map((n) => n[0])
          .join(""),
      }}
    >
      {children}
    </AppShell>
  );
}
