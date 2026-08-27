import type {
  CategorySlug,
  CustomerReview,
  DownloadBuild,
  FaqItem,
  PlatformId,
  Product,
  ProductScreenshot,
  ReleaseNote,
  SystemRequirement,
} from "@/types";
import { pseudoSha256, seededFloat, seededInt } from "@/lib/hash";

export type FeatureTuple = [title: string, description: string, icon: string];

export interface Seed {
  slug: string;
  name: string;
  tagline: string;
  overview: string;
  icon: string;
  badge?: Product["badge"];
  priceFrom: number;
  platforms: PlatformId[];
  version: string;
  releaseDate: string;
  highlights: string[];
  features: FeatureTuple[];
}

export const DESKTOP: PlatformId[] = ["windows", "macos", "linux"];
export const ALL: PlatformId[] = ["windows", "macos", "linux", "android", "ios"];
export const DESKTOP_MOBILE: PlatformId[] = ["windows", "macos", "linux", "android"];

/* -------------------------------------------------------------------------- */
/*  Generated detail — same shape for every product, seeded per slug so the    */
/*  values stay identical between server render and client hydration.          */
/* -------------------------------------------------------------------------- */

function buildScreenshots(seed: Seed): ProductScreenshot[] {
  const shots: ProductScreenshot[] = [
    {
      title: "Overview dashboard",
      caption: `Live ${seed.name.toLowerCase()} metrics the moment you sign in.`,
      variant: "dashboard",
    },
    {
      title: "Working list",
      caption: "Dense, keyboard-driven tables with saved filters and bulk actions.",
      variant: "table",
    },
    {
      title: "Record editor",
      caption: "Validated forms that catch mistakes before they reach your data.",
      variant: "form",
    },
    {
      title: "Reports",
      caption: "Every report exports to PDF, XLSX and CSV in one click.",
      variant: "report",
    },
  ];
  if (seed.platforms.includes("android") || seed.platforms.includes("ios")) {
    shots.push({
      title: "Companion app",
      caption: "Phone and tablet apps that keep working offline.",
      variant: "mobile",
    });
  }
  return shots;
}

function buildRequirements(seed: Seed): SystemRequirement[] {
  const rows: SystemRequirement[] = [
    {
      platform: "Windows",
      os: "Windows 10 22H2 or later (x64, ARM64)",
      cpu: "Dual-core 2.0 GHz",
      memory: "4 GB (8 GB recommended)",
      storage: "1.5 GB free",
      extra: "Runtime bundled with the installer",
    },
    {
      platform: "macOS",
      os: "macOS 13 Ventura or later",
      cpu: "Apple Silicon or Intel Core i5",
      memory: "4 GB (8 GB recommended)",
      storage: "1.2 GB free",
      extra: "Signed and notarised by Developer ID",
    },
    {
      platform: "Linux",
      os: "Ubuntu 22.04+, Fedora 39+, Debian 12+",
      cpu: "Dual-core 2.0 GHz",
      memory: "4 GB",
      storage: "1.2 GB free",
      extra: "AppImage, .deb and .rpm packages",
    },
  ];
  if (seed.platforms.includes("android")) {
    rows.push({
      platform: "Android",
      os: "Android 10 or later",
      cpu: "ARM64",
      memory: "3 GB",
      storage: "260 MB",
      extra: "Tablet layouts tuned for 8-inch and larger",
    });
  }
  if (seed.platforms.includes("ios")) {
    rows.push({
      platform: "iOS / iPadOS",
      os: "iOS 16 or later",
      cpu: "A12 Bionic or newer",
      memory: "3 GB",
      storage: "240 MB",
      extra: "Universal build for iPhone and iPad",
    });
  }
  return rows;
}

function buildFaqs(seed: Seed): FaqItem[] {
  return [
    {
      question: `Is the ${seed.name} trial really full-featured?`,
      answer:
        "Yes. Every feature on every plan is unlocked for the full 30 days, including multi-user access, exports and integrations. We never ask for a credit card to start.",
    },
    {
      question: "What happens to my data when the trial ends?",
      answer:
        "Nothing is deleted at day 30. The app enters a read-only grace period of 7 to 30 days where you can still open and export everything. Data is only removed after that window closes, and only after repeated warnings and a final export prompt.",
    },
    {
      question: "Can I use it without an internet connection?",
      answer: `${seed.name} is offline-first. Work is written to an encrypted local database and synchronises when connectivity returns. Licence checks tolerate up to 14 days offline by default.`,
    },
    {
      question: "How many devices can one licence activate?",
      answer:
        "Starter activates a single device. Business covers up to 20 named users across branches, and Enterprise is unlimited. You can release and transfer a device from the customer portal at any time.",
    },
    {
      question: "Do you migrate our existing records?",
      answer:
        "Guided importers accept CSV and XLSX out of the box, and our onboarding team runs supervised migrations from common competitors at no charge on Business and Enterprise plans.",
    },
    {
      question: "How are updates delivered?",
      answer:
        "Updates are delta-patched in the background and applied on next launch. Enterprise customers can pin a version and roll updates out per branch on their own schedule.",
    },
  ];
}

function buildReleases(seed: Seed): ReleaseNote[] {
  const [major, minor, patch] = seed.version.replace(/^v/, "").split(".").map(Number);
  const base = new Date(`${seed.releaseDate}T00:00:00Z`);
  const step = (n: number) => {
    const d = new Date(base);
    d.setUTCDate(d.getUTCDate() - n * 42);
    return d.toISOString().slice(0, 10);
  };
  const names = seed.features.map((f) => f[0]);
  return [
    {
      version: `${major}.${minor}.${patch}`,
      date: step(0),
      channel: "stable",
      highlights: [
        `Rebuilt ${names[0].toLowerCase()} with incremental rendering — large datasets open around three times faster.`,
        "New offline conflict resolver shows a side-by-side diff before merging.",
        "Accessibility pass: full keyboard navigation and screen-reader labels across every dialog.",
      ],
      fixes: [
        "Fixed rounding drift on multi-currency totals exported to XLSX.",
        "Resolved a rare crash when a device resumed from sleep mid-sync.",
      ],
    },
    {
      version: `${major}.${Math.max(minor - 1, 0)}.4`,
      date: step(1),
      channel: "stable",
      highlights: [
        `${names[1]} now supports saved views shared across the team.`,
        "Added SHA-256 verification to the in-app updater.",
      ],
      fixes: ["Corrected timezone handling for scheduled reports.", "Fixed duplicate audit entries on bulk edits."],
    },
    {
      version: `${major}.${Math.max(minor - 2, 0)}.9`,
      date: step(2),
      channel: "stable",
      highlights: [`Introduced ${names[2].toLowerCase()}.`, "Dark mode refinements across print previews."],
      fixes: ["Hardened licence storage against clock tampering.", "Reduced installer size by 18 percent."],
    },
    {
      version: `${Math.max(major - 1, 1)}.9.12`,
      date: step(3),
      channel: "stable",
      highlights: ["Migrated the local store to an encrypted SQLite engine.", "Added multi-branch data partitioning."],
      fixes: ["Fixed printer discovery on Linux with CUPS 2.4."],
    },
  ];
}

const REVIEWERS = [
  { author: "Maria Santos", role: "Operations Manager", company: "Northgate Group" },
  { author: "Daniel Cruz", role: "Managing Director", company: "Bayview Holdings" },
  { author: "Priya Raman", role: "Finance Lead", company: "Meridian Retail" },
  { author: "Tomas Alvarez", role: "IT Administrator", company: "Solera Clinics" },
  { author: "Grace Okonkwo", role: "Head of People", company: "Lumina Services" },
  { author: "Kenji Watanabe", role: "Branch Supervisor", company: "Harbor Supply Co." },
  { author: "Amina Yusuf", role: "General Manager", company: "Crestpoint Trading" },
  { author: "Liam Donnelly", role: "Founder", company: "Ridgeway Stores" },
] as const;

const REVIEW_BODIES: Array<(n: string) => string> = [
  (n) =>
    `We ran ${n} beside our old system for the full 30-day trial and never went back. Migration took an afternoon, and offline mode has already saved us during two outages.`,
  (n) =>
    `The reporting alone justifies the subscription. What used to be a two-day month-end scramble in spreadsheets is now a scheduled export from ${n}.`,
  (n) =>
    `Support answered inside the hour on a Sunday. That, plus the fact that ${n} keeps working when our connection drops, is why we renewed annually.`,
  (n) => `Rolled ${n} out to six branches in a week. Head office finally sees the same numbers as the floor, in real time.`,
  () => `Staff training was minimal — the interface is genuinely obvious. Our slowest adopter was productive in a day.`,
  () =>
    `Honest review: the mobile app lagged behind the desktop at first, but the last two releases closed the gap and supervisors now use it daily.`,
];

const REVIEW_TITLES = [
  "Replaced three tools with one",
  "Worth every cent of the subscription",
  "Genuinely offline-first",
  "Smooth multi-branch rollout",
  "Fast to learn, hard to outgrow",
  "Improved a lot over the year",
];

function buildReviews(seed: Seed): CustomerReview[] {
  return Array.from({ length: 6 }, (_, i) => {
    const key = `${seed.slug}:review:${i}`;
    const person = REVIEWERS[(seededInt(key, 0, 999) + i) % REVIEWERS.length];
    const day = 2 + seededInt(`${key}:d`, 0, 25);
    const month = 1 + ((seededInt(`${key}:m`, 0, 11) + i) % 12);
    return {
      author: person.author,
      role: person.role,
      company: person.company,
      rating: i === 5 ? 4 : seededInt(`${key}:r`, 4, 5),
      date: `2025-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      title: REVIEW_TITLES[i % REVIEW_TITLES.length],
      body: REVIEW_BODIES[i % REVIEW_BODIES.length](seed.name),
      verified: i !== 4,
    };
  }).sort((a, b) => (a.date < b.date ? 1 : -1));
}

const PLATFORM_MIN_OS: Record<PlatformId, string> = {
  windows: "Windows 10 22H2",
  macos: "macOS 13 Ventura",
  linux: "Ubuntu 22.04 / Debian 12",
  android: "Android 10",
  ios: "iOS 16",
};

function buildBuilds(seed: Seed): DownloadBuild[] {
  return seed.platforms.map((platform) => {
    const mobile = platform === "android" || platform === "ios";
    const onlineMb = mobile
      ? seededFloat(`${seed.slug}:${platform}:on`, 24, 48)
      : seededFloat(`${seed.slug}:${platform}:on`, 3.4, 7.8);
    const offlineMb = mobile ? onlineMb : seededFloat(`${seed.slug}:${platform}:off`, 96, 248);
    return {
      platform,
      architectures: platform === "ios" || platform === "android" ? ["arm64"] : ["x64", "arm64"],
      installers: mobile ? ["online"] : ["online", "offline"],
      size: { online: `${onlineMb} MB`, offline: `${offlineMb} MB` },
      checksum: pseudoSha256(`${seed.slug}:${platform}:${seed.version}`),
      minOs: PLATFORM_MIN_OS[platform],
    };
  });
}

export function buildProduct(seed: Seed, category: CategorySlug): Product {
  return {
    slug: seed.slug,
    name: seed.name,
    category,
    tagline: seed.tagline,
    overview: seed.overview,
    icon: seed.icon,
    badge: seed.badge,
    rating: seededFloat(`${seed.slug}:rating`, 4.5, 4.9, 1),
    reviewCount: seededInt(`${seed.slug}:reviews`, 180, 2400),
    downloads: seededInt(`${seed.slug}:downloads`, 12_000, 240_000),
    version: seed.version,
    releaseDate: seed.releaseDate,
    platforms: seed.platforms,
    priceFrom: seed.priceFrom,
    highlights: seed.highlights,
    features: seed.features.map(([title, description, icon]) => ({ title, description, icon })),
    screenshots: buildScreenshots(seed),
    requirements: buildRequirements(seed),
    faqs: buildFaqs(seed),
    releases: buildReleases(seed),
    reviews: buildReviews(seed),
    builds: buildBuilds(seed),
    videoDuration: `${seededInt(`${seed.slug}:vid`, 2, 6)}:${String(seededInt(`${seed.slug}:vids`, 10, 58)).padStart(2, "0")}`,
  };
}
