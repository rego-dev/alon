export interface NavLink {
  label: string;
  href: string;
  description?: string;
  icon?: string;
}

export interface NavGroup {
  label: string;
  href?: string;
  links: NavLink[];
}

export const primaryNav: NavGroup[] = [
  {
    label: "Products",
    href: "/products",
    links: [],
  },
  {
    label: "Solutions",
    links: [
      { label: "Retail & Point of Sale", href: "/products?category=retail", description: "Grocery, pharmacy, restaurant and specialty retail", icon: "Store" },
      { label: "Finance & Accounting", href: "/products?category=accounting", description: "Ledger, payables, receivables and reporting", icon: "Calculator" },
      { label: "People & Payroll", href: "/products?category=human-resources", description: "Payroll, HRIS, timekeeping and leave", icon: "Users" },
      { label: "Clinics & Labs", href: "/products?category=healthcare", description: "Records, prescribing, queueing and diagnostics", icon: "Stethoscope" },
      { label: "Operations", href: "/products?category=business-operations", description: "Inventory, warehouse, CRM and procurement", icon: "Boxes" },
      { label: "Schools & Colleges", href: "/products?category=education", description: "Enrollment, student records and tuition billing", icon: "GraduationCap" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "Download Center", href: "/download", description: "Installers for every platform and architecture", icon: "Download" },
      { label: "Documentation", href: "/docs", description: "Guides, API reference and troubleshooting", icon: "BookOpen" },
      { label: "Blog", href: "/blog", description: "Product news, releases and practical guides", icon: "FileText" },
      { label: "Support", href: "/support", description: "Tickets, live chat and remote assistance", icon: "LifeBuoy" },
      { label: "Release notes", href: "/download#releases", description: "Version history across the whole catalogue", icon: "Activity" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "About us", href: "/about", description: "Mission, history and leadership", icon: "Building2" },
      { label: "Careers", href: "/about#careers", description: "Open roles across engineering and support", icon: "Briefcase" },
      { label: "Partners", href: "/about#partners", description: "Resellers, implementers and technology partners", icon: "Handshake" },
      { label: "Contact", href: "/contact", description: "Sales, billing and technical enquiries", icon: "Mail" },
    ],
  },
  { label: "Pricing", href: "/pricing", links: [] },
];

export const footerNav: NavGroup[] = [
  {
    label: "Products",
    links: [
      { label: "Retail POS", href: "/products?category=retail" },
      { label: "Accounting", href: "/products?category=accounting" },
      { label: "Human Resources", href: "/products?category=human-resources" },
      { label: "Healthcare", href: "/products?category=healthcare" },
      { label: "Operations", href: "/products?category=business-operations" },
      { label: "Education", href: "/products?category=education" },
    ],
  },
  {
    label: "Platform",
    links: [
      { label: "Download Center", href: "/download" },
      { label: "Pricing", href: "/pricing" },
      { label: "Customer portal", href: "/portal" },
      { label: "Admin console", href: "/admin" },
      { label: "System status", href: "/support#status" },
      { label: "Security", href: "/legal/security" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "API reference", href: "/docs/api-reference" },
      { label: "Knowledge base", href: "/docs?section=knowledge-base" },
      { label: "Blog", href: "/blog" },
      { label: "Video tutorials", href: "/docs?section=tutorials" },
      { label: "Community forum", href: "/support#community" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/about#careers" },
      { label: "Partners", href: "/about#partners" },
      { label: "Contact", href: "/contact" },
      { label: "Support", href: "/support" },
      { label: "Trust centre", href: "/legal/security" },
    ],
  },
];

export const legalNav: NavLink[] = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Licence Agreement", href: "/legal/licence" },
  { label: "Data Retention", href: "/legal/data-retention" },
];
