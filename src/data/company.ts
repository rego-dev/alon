export const company = {
  name: "Alon Software",
  legalName: "Alon Software Systems, Inc.",
  domain: "alonsoftware.com",
  url: "https://alonsoftware.com",
  tagline: "Business software that grows with your company",
  email: "hello@alonsoftware.com",
  salesEmail: "sales@alonsoftware.com",
  supportEmail: "support@alonsoftware.com",
  billingEmail: "billing@alonsoftware.com",
  phone: "+1 415 555 0142",
  supportPhone: "+1 415 555 0180",
  address: "2100 Market Street, Suite 400, San Francisco, CA 94114",
  foundedYear: 2014,
  employees: "480+",
  countries: 38,
} as const;

export const heroStats = [
  { label: "Businesses running daily", value: 42_800, suffix: "+" },
  { label: "Installs across platforms", value: 1_240_000, suffix: "+", compact: true },
  { label: "Average trial-to-paid rate", value: 38, suffix: "%" },
  { label: "Support satisfaction", value: 4.8, suffix: "/5", decimals: 1 },
];

export const trustLogos = [
  "Northgate Group",
  "Meridian Retail",
  "Solera Clinics",
  "Harbor Supply Co.",
  "Crestpoint Trading",
  "Lumina Services",
  "Bayview Holdings",
  "Ridgeway Stores",
];

export const testimonials = [
  {
    quote:
      "We trialled four vendors. Alon was the only one where the 30-day trial was genuinely the whole product — no locked reports, no seat limit. We knew exactly what we were buying before we paid a cent.",
    author: "Maria Santos",
    role: "Operations Director",
    company: "Northgate Group",
    metric: "11 branches migrated in 3 weeks",
  },
  {
    quote:
      "Our clinics lose connectivity most afternoons. Everything keeps working offline and reconciles by evening. That single behaviour is why we standardised on it.",
    author: "Dr. Tomas Alvarez",
    role: "Medical Director",
    company: "Solera Clinics",
    metric: "Zero lost records in 18 months",
  },
  {
    quote:
      "Payroll used to take three days and a spreadsheet nobody else understood. It now takes an afternoon, and the statutory returns come out of the system already formatted.",
    author: "Grace Okonkwo",
    role: "Head of People",
    company: "Lumina Services",
    metric: "620 employees, one pay run",
  },
  {
    quote:
      "The grace period policy sold it to our board. If we ever stopped paying, we would still have a full read-only window to export everything. That is not how most vendors treat you.",
    author: "Daniel Cruz",
    role: "Managing Director",
    company: "Bayview Holdings",
    metric: "Renewed 4 years running",
  },
];

export const leadership = [
  {
    name: "Elena Vasquez",
    role: "Chief Executive Officer",
    bio: "Founded Alon after fifteen years building retail systems for distributors across three continents. Still reviews every major release.",
    initials: "EV",
  },
  {
    name: "Rajiv Menon",
    role: "Chief Technology Officer",
    bio: "Led the move to an offline-first architecture. Previously built distributed sync engines for field-service platforms.",
    initials: "RM",
  },
  {
    name: "Sofia Lindqvist",
    role: "Chief Product Officer",
    bio: "Runs the research programme that puts every product team on a customer site once a quarter.",
    initials: "SL",
  },
  {
    name: "Marcus Bell",
    role: "Chief Financial Officer",
    bio: "Built the transparent, no-surprise pricing model that replaced our old quote-per-deal approach.",
    initials: "MB",
  },
  {
    name: "Aisha Rahman",
    role: "VP of Customer Success",
    bio: "Owns the promise that a support ticket gets a human answer, not a macro, within one business hour.",
    initials: "AR",
  },
  {
    name: "Kenji Watanabe",
    role: "VP of Engineering",
    bio: "Responsible for the release train that ships every product on a predictable six-week cadence.",
    initials: "KW",
  },
];

export const milestones = [
  { year: "2014", title: "Founded in San Francisco", body: "Started with a single grocery point of sale built for one customer who could not find anything that worked offline." },
  { year: "2016", title: "Accounting suite launched", body: "The general ledger shipped, and the POS products began posting straight into it." },
  { year: "2018", title: "Mobile and tablet apps", body: "Android and iOS companions arrived, sharing the same offline sync engine as the desktop builds." },
  { year: "2020", title: "10,000 businesses", body: "Crossed ten thousand active organisations across retail, clinics and schools." },
  { year: "2022", title: "Healthcare and education", body: "Two new verticals launched after two years of design partnerships with clinics and colleges." },
  { year: "2024", title: "Open trial policy", body: "Removed every trial restriction and published the data retention policy in plain language." },
  { year: "2026", title: "31 products, 38 countries", body: "The catalogue now spans six categories with a shared platform underneath." },
];

export const values = [
  {
    title: "Offline is not an edge case",
    body: "Connectivity fails. Our software is designed so a lost line is an inconvenience, never a stoppage.",
    icon: "WifiOff",
  },
  {
    title: "Your data is yours",
    body: "We publish exactly what happens to your data at every stage, including if you stop paying. No surprises.",
    icon: "Lock",
  },
  {
    title: "Trials without tricks",
    body: "Thirty days, every feature, no card. If the product does not earn the subscription, we would rather you knew early.",
    icon: "Handshake",
  },
  {
    title: "Answered by a person",
    body: "Support tickets are answered by engineers who work on the product, within one business hour on paid plans.",
    icon: "Headphones",
  },
];

export const careers = [
  { title: "Senior Platform Engineer", team: "Engineering", location: "San Francisco / Remote", type: "Full-time" },
  { title: "Offline Sync Engineer", team: "Engineering", location: "Remote (EU timezones)", type: "Full-time" },
  { title: "Product Designer, Healthcare", team: "Design", location: "Manila / Remote", type: "Full-time" },
  { title: "Implementation Consultant", team: "Customer Success", location: "Singapore", type: "Full-time" },
  { title: "Technical Writer", team: "Documentation", location: "Remote", type: "Contract" },
  { title: "Payroll Compliance Analyst", team: "Product", location: "Remote (APAC)", type: "Full-time" },
];

export const partners = [
  { name: "Northwind Systems", type: "Implementation partner", region: "North America" },
  { name: "Pacifica Retail Tech", type: "Reseller", region: "Asia Pacific" },
  { name: "Meridian Consulting", type: "Implementation partner", region: "Europe" },
  { name: "Stripe", type: "Payments technology", region: "Global" },
  { name: "Cloudflare", type: "Delivery and security", region: "Global" },
  { name: "Sahara Business Group", type: "Reseller", region: "Middle East & Africa" },
];

export const offices = [
  { city: "San Francisco", role: "Headquarters", address: "2100 Market Street, Suite 400", hours: "Mon–Fri, 8:00–18:00 PT" },
  { city: "Manila", role: "Support & engineering", address: "One Bonifacio High Street, Taguig", hours: "Mon–Sat, 8:00–20:00 PHT" },
  { city: "Lisbon", role: "EMEA operations", address: "Avenida da Liberdade 110", hours: "Mon–Fri, 9:00–18:00 WET" },
];

export const supportChannels = [
  {
    title: "Live chat",
    body: "Available in-app and on this site during business hours. Median first response is under four minutes.",
    detail: "Mon–Fri, 07:00–21:00 UTC",
    icon: "MessageCircle",
    action: { label: "Start a chat", href: "/support#chat" },
  },
  {
    title: "Ticket system",
    body: "Full history, attachments and screen recordings. Business and Enterprise tickets are prioritised automatically.",
    detail: "24/7 intake, 1-hour response on paid plans",
    icon: "Ticket",
    action: { label: "Open a ticket", href: "/support#ticket" },
  },
  {
    title: "Email support",
    body: "Prefer email? Write to us directly and the thread becomes a tracked ticket automatically.",
    detail: company.supportEmail,
    icon: "Mail",
    action: { label: "Email support", href: `mailto:${company.supportEmail}` },
  },
  {
    title: "Phone support",
    body: "Talk to an engineer for production-down issues. Included on Business and Enterprise plans.",
    detail: company.supportPhone,
    icon: "Phone",
    action: { label: "Call support", href: `tel:${company.supportPhone.replace(/\s/g, "")}` },
  },
  {
    title: "Remote assistance",
    body: "One-click screen sharing from inside the application, with your explicit consent for each session.",
    detail: "Session codes expire after 15 minutes",
    icon: "Monitor",
    action: { label: "Get a session code", href: "/support#remote" },
  },
  {
    title: "Community forum",
    body: "Ask other operators how they configured something. Staff answer in the forum too.",
    detail: "18,400 members",
    icon: "Users",
    action: { label: "Visit the forum", href: "/support#community" },
  },
];

export const systemStatus = [
  { service: "Licensing API", status: "operational", uptime: "99.99%" },
  { service: "Download CDN", status: "operational", uptime: "100%" },
  { service: "Cloud backup", status: "operational", uptime: "99.98%" },
  { service: "Customer portal", status: "operational", uptime: "99.97%" },
  { service: "Billing & payments", status: "degraded", uptime: "99.82%" },
  { service: "Sync gateway", status: "operational", uptime: "99.96%" },
] as const;
