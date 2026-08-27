import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme";
import { JsonLd, organizationSchema, siteUrl, websiteSchema } from "@/lib/seo";
import { company } from "@/data/company";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${company.name} — Business Software That Grows With Your Company`,
    template: `%s | ${company.name}`,
  },
  description:
    "Download professional business software for retail, accounting, HR, healthcare, operations and education. Free 30-day trial of every feature. No credit card required.",
  applicationName: company.name,
  keywords: [
    "business software",
    "POS software",
    "accounting software",
    "payroll software",
    "inventory management",
    "clinic management software",
    "school management system",
    "free 30-day trial",
  ],
  authors: [{ name: company.legalName, url: siteUrl }],
  creator: company.legalName,
  publisher: company.legalName,
  formatDetection: { telephone: false, address: false, email: false },
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    siteName: company.name,
    locale: "en_US",
    url: siteUrl,
    title: `${company.name} — Business Software That Grows With Your Company`,
    description:
      "Professional business software for Windows, macOS, Linux, Android and iOS. Try every feature free for 30 days.",
  },
  twitter: { card: "summary_large_image", site: "@alonsoftware", creator: "@alonsoftware" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#12131a" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-dvh antialiased">
        <ThemeProvider>{children}</ThemeProvider>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
