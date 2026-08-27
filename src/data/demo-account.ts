import type { LicenseState } from "@/lib/licensing/state-machine";
import { seededInt } from "@/lib/hash";

/**
 * A representative customer account, used to render the customer portal and to
 * seed the admin console. Dates are expressed as offsets from a fixed reference
 * so the portal always shows a licence mid-trial, one in grace and one expired,
 * without depending on the wall clock at render time.
 */
export const REFERENCE_DATE = new Date("2026-08-25T00:00:00Z");

const DAY = 86_400_000;
export const offsetDays = (days: number) => new Date(REFERENCE_DATE.getTime() + days * DAY);

export interface DemoLicense {
  id: string;
  key: string;
  productSlug: string;
  productName: string;
  icon: string;
  state: LicenseState;
  plan: "starter" | "business" | "enterprise" | null;
  cycle: "monthly" | "annual" | null;
  trialStartedAt: string;
  subscriptionEndsAt: string | null;
  daysRemaining: number;
  deviceLimit: number;
  devicesUsed: number;
  seats: number;
  seatsUsed: number;
  amount: number;
}

export interface DemoDevice {
  id: string;
  hostname: string;
  platform: "windows" | "macos" | "linux" | "android" | "ios";
  osVersion: string;
  licenseKey: string;
  productName: string;
  lastSeen: string;
  location: string;
  status: "active" | "offline" | "released";
  fingerprint: string;
}

export interface DemoInvoice {
  id: string;
  number: string;
  issuedAt: string;
  dueAt: string;
  total: number;
  status: "paid" | "open" | "past_due";
  description: string;
  method: string;
}

export const demoOrganisation = {
  id: "org_northgate",
  name: "Northgate Group",
  slug: "northgate-group",
  plan: "Business",
  country: "Philippines",
  since: "2023-11-04",
  owner: { name: "Maria Santos", email: "maria.santos@northgate.example", role: "Owner" },
  billingEmail: "finance@northgate.example",
  address: "12 Ayala Avenue, Makati, Metro Manila",
  seats: 20,
  seatsUsed: 14,
  branches: 6,
};

export const demoLicenses: DemoLicense[] = [
  {
    id: "lic_7Kd2",
    key: "GPOS-4H8K-92MR-7TQX",
    productSlug: "grocery-pos",
    productName: "Grocery POS",
    icon: "ShoppingCart",
    state: "active",
    plan: "business",
    cycle: "annual",
    trialStartedAt: "2023-11-04",
    subscriptionEndsAt: offsetDays(112).toISOString(),
    daysRemaining: 112,
    deviceLimit: 10,
    devicesUsed: 7,
    seats: 20,
    seatsUsed: 14,
    amount: 747,
  },
  {
    id: "lic_9Xf4",
    key: "INVM-2P7B-51KD-3WZC",
    productSlug: "inventory-management",
    productName: "Inventory Management",
    icon: "Boxes",
    state: "active",
    plan: "business",
    cycle: "annual",
    trialStartedAt: "2024-02-18",
    subscriptionEndsAt: offsetDays(21).toISOString(),
    daysRemaining: 21,
    deviceLimit: 10,
    devicesUsed: 4,
    seats: 20,
    seatsUsed: 9,
    amount: 747,
  },
  {
    id: "lic_3Bq8",
    key: "ACCT-8N4V-63HL-2RJM",
    productSlug: "accounting-software",
    productName: "Accounting Software",
    icon: "Calculator",
    state: "trial",
    plan: null,
    cycle: null,
    trialStartedAt: offsetDays(-19).toISOString(),
    subscriptionEndsAt: null,
    daysRemaining: 11,
    deviceLimit: 1,
    devicesUsed: 1,
    seats: 2,
    seatsUsed: 2,
    amount: 0,
  },
  {
    id: "lic_5Lm1",
    key: "PYRL-6C2X-84QT-9FDN",
    productSlug: "payroll",
    productName: "Payroll",
    icon: "Banknote",
    state: "grace",
    plan: null,
    cycle: null,
    trialStartedAt: offsetDays(-38).toISOString(),
    subscriptionEndsAt: null,
    daysRemaining: 6,
    deviceLimit: 1,
    devicesUsed: 1,
    seats: 2,
    seatsUsed: 1,
    amount: 0,
  },
  {
    id: "lic_1Zt6",
    key: "CRMX-7J5D-19PS-4KHB",
    productSlug: "crm",
    productName: "CRM",
    icon: "Handshake",
    state: "expired",
    plan: null,
    cycle: null,
    trialStartedAt: offsetDays(-96).toISOString(),
    subscriptionEndsAt: null,
    daysRemaining: 18,
    deviceLimit: 1,
    devicesUsed: 0,
    seats: 2,
    seatsUsed: 0,
    amount: 0,
  },
];

const PLATFORMS = ["windows", "macos", "linux", "android", "ios"] as const;
const BRANCHES = ["Makati", "Cebu", "Davao", "Quezon City", "Iloilo", "Baguio"];

export const demoDevices: DemoDevice[] = Array.from({ length: 12 }, (_, i) => {
  const license = demoLicenses[i % 2 === 0 ? 0 : 1];
  const platform = PLATFORMS[seededInt(`device:${i}:p`, 0, 2)];
  const daysAgo = seededInt(`device:${i}:d`, 0, 30);
  return {
    id: `dev_${(i + 1).toString().padStart(3, "0")}`,
    hostname: `${BRANCHES[i % BRANCHES.length].toUpperCase().slice(0, 3)}-TILL-${(i % 4) + 1}`,
    platform,
    osVersion: platform === "windows" ? "Windows 11 23H2" : platform === "macos" ? "macOS 14.5" : "Ubuntu 24.04",
    licenseKey: license.key,
    productName: license.productName,
    lastSeen: offsetDays(-daysAgo).toISOString(),
    location: `${BRANCHES[i % BRANCHES.length]}, PH`,
    status: daysAgo > 21 ? "offline" : "active",
    fingerprint: `${seededInt(`device:${i}:f`, 100000, 999999)}a${seededInt(`device:${i}:g`, 100000, 999999)}`,
  };
});

export const demoInvoices: DemoInvoice[] = [
  { id: "in_014", number: "INV-2026-0142", issuedAt: "2026-08-01", dueAt: "2026-08-15", total: 747, status: "paid", description: "Grocery POS — Business, annual", method: "Visa •••• 4242" },
  { id: "in_013", number: "INV-2026-0118", issuedAt: "2026-07-01", dueAt: "2026-07-15", total: 747, status: "paid", description: "Inventory Management — Business, annual", method: "Visa •••• 4242" },
  { id: "in_012", number: "INV-2026-0090", issuedAt: "2026-06-01", dueAt: "2026-06-15", total: 89, status: "paid", description: "Grocery POS — additional branch", method: "GCash" },
  { id: "in_011", number: "INV-2026-0071", issuedAt: "2026-05-01", dueAt: "2026-05-15", total: 89, status: "paid", description: "Grocery POS — additional branch", method: "GCash" },
  { id: "in_010", number: "INV-2026-0044", issuedAt: "2026-04-01", dueAt: "2026-04-15", total: 747, status: "paid", description: "Grocery POS — Business, annual renewal", method: "Visa •••• 4242" },
  { id: "in_009", number: "INV-2026-0021", issuedAt: "2026-03-01", dueAt: "2026-03-15", total: 178, status: "paid", description: "Support add-on — 2 months", method: "Bank transfer" },
];

export const demoTickets = [
  { reference: "ALN-48211", subject: "Receipt printer stops after shift change", product: "Grocery POS", severity: "high", status: "in_progress", updated: offsetDays(-1).toISOString(), assignee: "Support · Alex" },
  { reference: "ALN-48072", subject: "Import mapping not remembered between sessions", product: "Inventory Management", severity: "normal", status: "pending_customer", updated: offsetDays(-4).toISOString(), assignee: "Support · Nina" },
  { reference: "ALN-47903", subject: "Question about multi-branch consolidation", product: "Accounting Software", severity: "question", status: "resolved", updated: offsetDays(-12).toISOString(), assignee: "Support · Alex" },
];

/* -------------------------------------------------------------------------- */
/*  Platform-wide figures for the admin console                               */
/* -------------------------------------------------------------------------- */

export const adminKpis = {
  mrr: 412_800,
  mrrChange: 8.4,
  activeCustomers: 42_812,
  customerChange: 3.1,
  trialsRunning: 3_184,
  trialChange: 12.6,
  trialConversion: 38.2,
  conversionChange: 1.4,
  downloads30d: 96_420,
  downloadChange: 6.9,
  expiring30d: 214,
  expiringChange: -4.2,
};

export const revenueSeries = [
  { month: "Sep", revenue: 318_000, newMrr: 21_400, churn: 6_900 },
  { month: "Oct", revenue: 331_500, newMrr: 22_800, churn: 7_400 },
  { month: "Nov", revenue: 344_200, newMrr: 24_100, churn: 6_100 },
  { month: "Dec", revenue: 352_800, newMrr: 19_600, churn: 8_800 },
  { month: "Jan", revenue: 367_400, newMrr: 26_200, churn: 7_100 },
  { month: "Feb", revenue: 374_900, newMrr: 21_300, churn: 9_200 },
  { month: "Mar", revenue: 386_100, newMrr: 25_700, churn: 8_400 },
  { month: "Apr", revenue: 392_600, newMrr: 22_900, churn: 9_800 },
  { month: "May", revenue: 399_200, newMrr: 24_400, churn: 8_100 },
  { month: "Jun", revenue: 404_100, newMrr: 23_600, churn: 9_400 },
  { month: "Jul", revenue: 408_500, newMrr: 25_100, churn: 10_200 },
  { month: "Aug", revenue: 412_800, newMrr: 27_300, churn: 9_600 },
];

export const downloadSeries = [
  { day: "Mon", windows: 3120, macos: 1180, linux: 420, mobile: 1640 },
  { day: "Tue", windows: 3480, macos: 1290, linux: 470, mobile: 1820 },
  { day: "Wed", windows: 3610, macos: 1340, linux: 510, mobile: 1930 },
  { day: "Thu", windows: 3390, macos: 1220, linux: 480, mobile: 1760 },
  { day: "Fri", windows: 3040, macos: 1110, linux: 440, mobile: 1580 },
  { day: "Sat", windows: 1780, macos: 690, linux: 260, mobile: 1120 },
  { day: "Sun", windows: 1520, macos: 610, linux: 230, mobile: 980 },
];

export const trialFunnel = [
  { stage: "Downloads", value: 96_420 },
  { stage: "Trials started", value: 41_180 },
  { stage: "Active at day 7", value: 26_940 },
  { stage: "Active at day 25", value: 19_310 },
  { stage: "Subscribed", value: 15_730 },
];

export const licenseStateBreakdown = [
  { state: "Active", count: 42_812, tone: "success" as const },
  { state: "Trial", count: 3_184, tone: "primary" as const },
  { state: "Grace", count: 612, tone: "warning" as const },
  { state: "Expired", count: 1_940, tone: "danger" as const },
  { state: "Suspended", count: 38, tone: "neutral" as const },
];

export const adminCustomers = [
  { name: "Northgate Group", plan: "Business", products: 4, seats: "14 / 20", mrr: 356, since: "2023-11-04", status: "active", country: "PH" },
  { name: "Meridian Retail", plan: "Enterprise", products: 9, seats: "312", mrr: 2_241, since: "2022-06-19", status: "active", country: "SG" },
  { name: "Solera Clinics", plan: "Business", products: 3, seats: "18 / 20", mrr: 267, since: "2024-01-22", status: "active", country: "ES" },
  { name: "Harbor Supply Co.", plan: "Starter", products: 1, seats: "2 / 2", mrr: 29, since: "2025-09-30", status: "grace", country: "US" },
  { name: "Lumina Services", plan: "Business", products: 5, seats: "20 / 20", mrr: 445, since: "2023-03-14", status: "active", country: "NG" },
  { name: "Crestpoint Trading", plan: "Enterprise", products: 7, seats: "184", mrr: 1_743, since: "2021-11-08", status: "active", country: "AE" },
  { name: "Ridgeway Stores", plan: "Starter", products: 2, seats: "2 / 2", mrr: 58, since: "2026-02-11", status: "trial", country: "IE" },
  { name: "Bayview Holdings", plan: "Business", products: 6, seats: "17 / 20", mrr: 534, since: "2022-08-25", status: "past_due", country: "PH" },
];

export const adminAbuseSignals = [
  { signal: "known_device_trial_replay", organisation: "—", detail: "Fingerprint 8f31…c2a1 requested a fourth trial", blocked: true, at: offsetDays(-0.2).toISOString() },
  { signal: "clock_rollback", organisation: "Vector Trading", detail: "Client clock 9 days behind server high-water mark", blocked: true, at: offsetDays(-0.6).toISOString() },
  { signal: "activation_velocity", organisation: "—", detail: "11 activations from one fingerprint in 40 minutes", blocked: true, at: offsetDays(-1.4).toISOString() },
  { signal: "fingerprint_collision", organisation: "Delta Foods", detail: "Tolerant match, strict mismatch — likely disk replacement", blocked: false, at: offsetDays(-2.1).toISOString() },
  { signal: "vm_without_verification", organisation: "Pinnacle Labs", detail: "Trial on a VM with an unverified email address", blocked: false, at: offsetDays(-3.5).toISOString() },
];
