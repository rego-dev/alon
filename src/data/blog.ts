import type { BlogCategory, BlogPost } from "@/types/content";

export const blogCategories: Array<{ id: BlogCategory; label: string; description: string; icon: string }> = [
  { id: "accounting", label: "Accounting", description: "Closing books, compliance and financial control.", icon: "Calculator" },
  { id: "retail", label: "Retail", description: "Counter operations, stock and margin.", icon: "Store" },
  { id: "payroll", label: "Payroll", description: "Pay runs, statutory filing and timekeeping.", icon: "Banknote" },
  { id: "business-tips", label: "Business Tips", description: "Operational practice that scales past ten people.", icon: "TrendingUp" },
  { id: "software-updates", label: "Software Updates", description: "Releases, roadmap and platform changes.", icon: "RefreshCw" },
  { id: "technology", label: "Technology", description: "How the platform is built and why.", icon: "Cpu" },
];

export const posts: BlogPost[] = [
  {
    slug: "why-offline-first-matters-for-retail",
    title: "Why offline-first matters more than uptime for retail software",
    description:
      "A 99.99% uptime SLA still leaves your till dead for the 40 minutes your ISP is down. Here is why we build for the disconnection instead of promising it away.",
    category: "retail",
    author: "Rajiv Menon",
    authorRole: "Chief Technology Officer",
    publishedAt: "2026-08-18",
    readTime: 8,
    tags: ["offline-first", "POS", "architecture", "reliability"],
    featured: true,
    body: [
      { type: "p", text: "Every cloud POS vendor publishes an uptime figure. Almost none of them publish the number that actually matters to a shop: how long the till is unusable in a typical month. Those are different numbers, and the gap between them is where most retail software fails." },
      { type: "h2", text: "The SLA measures the wrong thing" },
      { type: "p", text: "A vendor's uptime SLA measures their servers. Your till depends on their servers, your internet connection, your router, the local ISP's backhaul, and the wifi in a building full of refrigeration compressors. The vendor controls one link in a five-link chain and reports on that link alone." },
      { type: "quote", text: "We had a 99.99% vendor and lost about three hours of trading a month. The SLA was being met the whole time.", cite: "Operations director, six-store grocery chain" },
      { type: "h2", text: "What offline-first actually means" },
      { type: "p", text: "Offline-first is not a fallback mode bolted onto a cloud application. It inverts the relationship: the local database is authoritative for the device, and the server is a replication peer rather than the source of truth." },
      { type: "ul", items: [
        "Every write goes to the local encrypted database first and returns immediately.",
        "A replication log ships changes to the server whenever a connection exists.",
        "Conflicts are resolved by logical clocks and typed merge rules, not by whoever reconnects last.",
        "The user interface never blocks on the network — there is no spinner waiting for a round trip.",
      ] },
      { type: "callout", tone: "info", title: "The test we use internally", text: "Pull the network cable mid-transaction. If anything in the interface changes other than a small connectivity indicator, we have not finished the feature." },
      { type: "h2", text: "The costs, honestly" },
      { type: "p", text: "Offline-first is harder to build and there is no point pretending otherwise. You need conflict resolution, schema migration that works on devices that have been offline for weeks, and a sync protocol that tolerates partial failure. It roughly doubles the engineering cost of a feature that touches shared data." },
      { type: "p", text: "It also constrains what you can promise. Real-time cross-branch aggregation is not instant when a branch is offline; it is eventually consistent, and the interface has to be honest about that rather than showing a stale number as if it were live." },
      { type: "h2", text: "Why we pay that cost anyway" },
      { type: "p", text: "Because the alternative is telling a shop owner that the queue at their counter is their ISP's fault. That is technically true and commercially useless. The software either works when the connection does not, or it does not really work." },
    ],
  },
  {
    slug: "closing-the-books-in-two-days",
    title: "Closing the books in two days instead of two weeks",
    description:
      "Month-end takes as long as your worst reconciliation. Here is the sequence finance teams use to compress a fortnight into a couple of days.",
    category: "accounting",
    author: "Priya Raman",
    authorRole: "Finance Product Lead",
    publishedAt: "2026-08-05",
    readTime: 9,
    tags: ["month-end", "close", "reconciliation", "controls"],
    featured: true,
    body: [
      { type: "p", text: "Most finance teams treat month-end as a single event that starts on the first of the month. The teams that close fastest treat it as a continuous process that finishes on the first of the month. That is the whole difference." },
      { type: "h2", text: "Move reconciliation before the close, not after" },
      { type: "p", text: "Bank reconciliation performed daily takes about four minutes. Performed monthly it takes most of a day, because you are now investigating a variance across four hundred transactions instead of twelve." },
      { type: "ol", items: [
        "Import bank feeds daily and let the rules engine clear the obvious matches.",
        "Review only the exceptions — typically under ten items on a normal day.",
        "Investigate the same day, while someone still remembers the transaction.",
        "Arrive at month-end with a reconciled bank account already.",
      ] },
      { type: "h2", text: "Automate the entries that never change" },
      { type: "p", text: "Depreciation, accruals, prepayment releases and standard allocations are the same journal every month with different numbers. Set them up as recurring entries with a calculation rule and stop re-keying them." },
      { type: "table", head: ["Entry type", "Manual time per month", "Automated"], rows: [
        ["Depreciation", "45–90 minutes", "Posted automatically on close"],
        ["Prepayment release", "30 minutes", "Scheduled by schedule"],
        ["Accruals reversal", "40 minutes", "Auto-reversed on day 1"],
        ["Cost allocations", "2–3 hours", "Driver-based, computed"],
      ] },
      { type: "h2", text: "Lock the period and mean it" },
      { type: "p", text: "The single biggest cause of a close reopening is a back-dated transaction posted after the numbers were reported. Lock the period the moment you close it, and require an approved journal with a reason to post into a locked period." },
      { type: "callout", tone: "warning", title: "Soft locks do not work", text: "If the system merely warns, people click through the warning. The lock has to require a different person to approve, or it is not a control." },
      { type: "h2", text: "Cut the review loop" },
      { type: "p", text: "Most of the second week of a slow close is not work — it is waiting for review comments by email. Move the review into the system: comments attach to the account, the reviewer sees the drill-through, and the status is visible without asking." },
      { type: "h2", text: "A realistic timeline" },
      { type: "steps", items: [
        { title: "Day −5 to −1", text: "Daily bank reconciliation, supplier invoice capture, payroll accrual prepared." },
        { title: "Day 1", text: "Recurring journals post automatically. Sub-ledgers close. Exceptions worklist is generated." },
        { title: "Day 2", text: "Review, adjust, lock the period, publish the reporting pack." },
      ] },
    ],
  },
  {
    slug: "payroll-mistakes-that-cost-the-most",
    title: "The four payroll mistakes that cost the most to fix",
    description:
      "Payroll errors are expensive not because of the amount involved but because of what correcting them touches. These four are the ones worth engineering out.",
    category: "payroll",
    author: "Grace Okonkwo",
    authorRole: "Head of People Operations",
    publishedAt: "2026-07-21",
    readTime: 7,
    tags: ["payroll", "compliance", "timekeeping", "process"],
    body: [
      { type: "p", text: "A payroll error is rarely just a payroll error. It is a tax filing correction, a statutory contribution adjustment, a general ledger reversal and a conversation with an employee who now trusts you slightly less." },
      { type: "h2", text: "1. Treating timekeeping as an input, not a system" },
      { type: "p", text: "When hours arrive as a spreadsheet emailed by a supervisor, nobody can reconstruct why an employee was paid 168 hours instead of 164 three months later. Capture time in a system with an audit trail and approve it there." },
      { type: "h2", text: "2. Effective dates that are not really effective dates" },
      { type: "p", text: "A pay increase applied by editing the current salary field destroys the history. When someone asks what the employee earned in March, you cannot answer. Every compensation change should be a new effective-dated record, never an edit." },
      { type: "callout", tone: "danger", title: "This one compounds", text: "Retroactive calculations, back-pay, and any audit of historical pay all depend on effective-dated history. Once it is gone, it cannot be reconstructed from the current state." },
      { type: "h2", text: "3. Statutory tables maintained by hand" },
      { type: "p", text: "Contribution ceilings and tax bands change, usually with short notice and usually mid-year. If those tables are typed into a spreadsheet by whoever noticed the circular, you will find out they were wrong when the filing is rejected." },
      { type: "h2", text: "4. No separation between preparing and approving" },
      { type: "p", text: "The person who enters the pay run should not be the person who releases the payment file. This is not about distrust; it is about a second pair of eyes catching a transposed number before it reaches a bank." },
      { type: "table", head: ["Control", "Prevents", "Cost to implement"], rows: [
        ["System-captured time with approval", "Unverifiable hours", "Low"],
        ["Effective-dated compensation", "Lost history, wrong retro pay", "Low"],
        ["Maintained statutory tables", "Rejected filings, penalties", "None — included"],
        ["Preparer / approver split", "Payment errors reaching the bank", "Low"],
      ] },
    ],
  },
  {
    slug: "what-happens-to-your-data-when-you-stop-paying",
    title: "What happens to your data when you stop paying (ours, and theirs)",
    description:
      "Most vendors bury the answer in clause 14.3. We publish ours on the pricing page — and here is how to read anyone else's.",
    category: "business-tips",
    author: "Elena Vasquez",
    authorRole: "Chief Executive Officer",
    publishedAt: "2026-08-22",
    readTime: 6,
    tags: ["data retention", "vendor lock-in", "contracts", "policy"],
    featured: true,
    body: [
      { type: "p", text: "When you evaluate business software, you look at features and price. The clause that will matter most to you is neither: it is what the vendor does with your data when the relationship ends." },
      { type: "h2", text: "The three questions to ask" },
      { type: "ol", items: [
        "After a subscription lapses, can I still read my data — and for how long?",
        "Can I export it, in a format something else can read, without an active subscription?",
        "When exactly is it deleted, what warning do I get, and is that in the contract or just the marketing page?",
      ] },
      { type: "callout", tone: "warning", title: "Watch for 'may' and 'at our discretion'", text: "A retention clause that says the vendor may retain data for up to 90 days is not a promise to retain it for 90 days. It is permission to delete it sooner." },
      { type: "h2", text: "Our answer, in full" },
      { type: "p", text: "When a trial or subscription ends, the application enters a read-only grace period of 7 to 30 days depending on plan. During grace you can log in, view everything and export it — export stays enabled deliberately, because taking your data out should never require paying us first." },
      { type: "p", text: "After grace the application locks but your data stays on your device for the retention window, 30 days by default and configurable up to a year. You get warnings at the start of retention, at the halfway point, and 48 hours before deletion, plus a final export prompt on the last launch." },
      { type: "p", text: "Only then is local business data erased. If you subscribe at any point before that, everything is restored intact without reinstalling. If you subscribe after, the application reactivates against a clean database or your own backup." },
      { type: "h2", text: "Why publish it this prominently" },
      { type: "p", text: "Partly because it is the right thing to do. Mostly because a vendor whose retention policy is genuinely reasonable has no reason to hide it, and a vendor who hides it usually has one." },
    ],
  },
  {
    slug: "release-2026-08-platform-update",
    title: "August 2026 platform release: faster tables, better conflict resolution",
    description:
      "Incremental rendering across every list view, a redesigned sync conflict resolver, and accessibility improvements throughout.",
    category: "software-updates",
    author: "Kenji Watanabe",
    authorRole: "VP of Engineering",
    publishedAt: "2026-08-14",
    readTime: 5,
    tags: ["release", "performance", "accessibility", "sync"],
    body: [
      { type: "p", text: "This release lands across the whole catalogue on the usual six-week train. Three changes are worth calling out." },
      { type: "h2", text: "Incremental table rendering" },
      { type: "p", text: "Every list view now renders incrementally with windowed scrolling. A 200,000-row item list opens in under a second on the hardware our customers actually run, rather than the hardware we develop on." },
      { type: "table", head: ["Dataset", "Before", "After"], rows: [
        ["10,000 rows", "0.9 s", "0.2 s"],
        ["100,000 rows", "8.4 s", "0.4 s"],
        ["200,000 rows", "22.1 s", "0.7 s"],
      ] },
      { type: "h2", text: "Redesigned conflict resolver" },
      { type: "p", text: "Sync conflicts now open a side-by-side diff showing which branch, which user and which timestamp produced each version, with per-field selection instead of an all-or-nothing choice." },
      { type: "h2", text: "Accessibility" },
      { type: "p", text: "A full pass across every dialog: keyboard navigation without traps, screen-reader labels on all controls, and a minimum contrast ratio of 4.5:1 everywhere in both themes." },
      { type: "callout", tone: "success", title: "Delta updates", text: "This release patches in the background and applies on next launch. Enterprise customers with a pinned version can schedule it per branch." },
    ],
  },
  {
    slug: "device-fingerprinting-without-being-creepy",
    title: "Device fingerprinting without being creepy",
    description:
      "Anti-abuse and privacy are usually framed as a trade-off. In licensing they mostly are not, if you are careful about what you collect.",
    category: "technology",
    author: "Rajiv Menon",
    authorRole: "Chief Technology Officer",
    publishedAt: "2026-07-09",
    readTime: 7,
    tags: ["licensing", "privacy", "security", "anti-abuse"],
    body: [
      { type: "p", text: "Licensing needs to know whether this is the same machine as last time. It does not need to know anything else, and collecting anything else is both a liability and a reason for customers to distrust you." },
      { type: "h2", text: "What we collect" },
      { type: "ul", items: [
        "A stable machine identifier the operating system already exposes.",
        "The primary disk serial and first physical NIC MAC address, where available.",
        "A CPU signature and OS family.",
      ] },
      { type: "p", text: "These are hashed on the device before transmission. We store two hashes and never the raw components, which means a database breach yields hashes of hardware identifiers rather than a hardware inventory of our customers." },
      { type: "h2", text: "Two hashes, and why" },
      { type: "p", text: "A single strict hash breaks the moment someone replaces a disk, and then a legitimate customer is locked out. A single tolerant hash is easy to spoof. Storing both lets us distinguish 'same machine, new disk' from 'different machine entirely' without asking for more data." },
      { type: "code", lang: "typescript", code: "const strict = sha256([machineId, diskSerial, macAddress, cpuSignature, osName].join(\"|\"));\n// The tolerant hash deliberately omits swappable components.\nconst tolerant = sha256([machineId, cpuSignature, osName].join(\"|\"));" },
      { type: "h2", text: "What we deliberately do not do" },
      { type: "ul", items: [
        "No canvas or font fingerprinting — those exist to identify people, not machines.",
        "No collection of installed software, running processes or file listings.",
        "No location data beyond the coarse region implied by the request IP.",
        "No cross-product tracking of individual users.",
      ] },
      { type: "callout", tone: "info", title: "Clock tampering, handled cheaply", text: "Rather than inspecting the system, the server keeps a monotonic high-water mark of the latest time each device has reported. A clock rolled backwards contradicts a value we already hold, which is enough." },
      { type: "h2", text: "The honest limit" },
      { type: "p", text: "None of this makes trial abuse impossible. A determined person with a fresh virtual machine and a new email address will get another trial. The goal is to make that meaningfully more effort than paying, while never inconveniencing the overwhelming majority who are simply replacing a laptop." },
    ],
  },
  {
    slug: "stock-counts-that-are-worth-doing",
    title: "Stock counts that are actually worth doing",
    description:
      "An annual full count tells you that you were wrong. Cycle counting tells you where and while you can still act.",
    category: "retail",
    author: "Sofia Lindqvist",
    authorRole: "Chief Product Officer",
    publishedAt: "2026-06-24",
    readTime: 6,
    tags: ["inventory", "cycle counting", "shrinkage", "operations"],
    body: [
      { type: "p", text: "The annual stocktake is a ritual that closes the shop for a day, produces a large variance number, and gives you almost no information about how the variance happened." },
      { type: "h2", text: "Count by velocity, not alphabetically" },
      { type: "p", text: "Classify items by movement, then count fast movers frequently and slow movers rarely. In a typical grocery, 8% of SKUs account for most of the shrinkage exposure." },
      { type: "table", head: ["Class", "Share of SKUs", "Count frequency"], rows: [
        ["A — high velocity or high value", "~8%", "Weekly"],
        ["B — moderate", "~22%", "Monthly"],
        ["C — slow moving", "~70%", "Quarterly"],
      ] },
      { type: "h2", text: "Count blind" },
      { type: "p", text: "If the counter can see the expected quantity, the count converges on the expectation. Blind counts are the single highest-value change most operations can make, and cost nothing." },
      { type: "h2", text: "Investigate variances the same day" },
      { type: "p", text: "A variance investigated within 24 hours usually has an explanation someone remembers — a delivery signed in wrong, a breakage not recorded, a transfer not posted. The same variance investigated in six weeks is written off." },
      { type: "callout", tone: "success", title: "What good looks like", text: "Counting under 5% of SKUs a week, resolving over 80% of variances to a cause, and shrinkage trending down quarter over quarter." },
    ],
  },
  {
    slug: "choosing-between-plans",
    title: "How to choose between Starter, Business and Enterprise honestly",
    description:
      "Most vendors want you on the highest plan. Here is the actual decision tree, including when Starter is genuinely the right answer.",
    category: "business-tips",
    author: "Marcus Bell",
    authorRole: "Chief Financial Officer",
    publishedAt: "2026-05-16",
    readTime: 5,
    tags: ["pricing", "plans", "buying"],
    body: [
      { type: "p", text: "Plan selection should be driven by three things: how many places the software runs, how bad losing local data would be, and whether anything needs to talk to it programmatically." },
      { type: "h2", text: "Starter is right when" },
      { type: "ul", items: [
        "You operate from one location with one till or one back-office machine.",
        "You can commit to taking your own export on a schedule you will actually keep.",
        "Nothing else in your business needs to read the data automatically.",
      ] },
      { type: "h2", text: "Move to Business when" },
      { type: "ul", items: [
        "You have a second location, or more than two people entering data.",
        "Losing a week of records would be a serious problem — nightly cloud backup is the main reason to upgrade.",
        "You want an answer in an hour rather than the next business day.",
      ] },
      { type: "h2", text: "Enterprise is right when" },
      { type: "ul", items: [
        "You need write access to the API, or SSO against your identity provider.",
        "Your security or compliance team needs to set the licensing and retention policy themselves.",
        "You need the software to run inside your own network.",
      ] },
      { type: "callout", tone: "info", title: "Start lower than you think", text: "Upgrades are immediate and prorated; downgrades take effect at renewal. Starting on Business and moving up costs you nothing extra compared with starting on Enterprise and finding you did not need it." },
    ],
  },
  {
    slug: "building-a-release-train",
    title: "Shipping 31 products on one six-week release train",
    description:
      "How a small engineering organisation keeps thirty-one applications on a predictable cadence without a permanent freeze.",
    category: "technology",
    author: "Kenji Watanabe",
    authorRole: "VP of Engineering",
    publishedAt: "2026-04-28",
    readTime: 8,
    tags: ["engineering", "release", "process", "platform"],
    body: [
      { type: "p", text: "Thirty-one products sounds like thirty-one release processes. It is one, because the products are mostly the same platform with different domain modules on top." },
      { type: "h2", text: "The shared core" },
      { type: "ul", items: [
        "One offline-first sync engine and local storage layer.",
        "One licensing client, implementing the same state machine as the server.",
        "One reporting engine, one printing subsystem, one import/export framework.",
        "One design system, so a control fixed in one product is fixed everywhere.",
      ] },
      { type: "p", text: "Domain modules — what a grocery lane does versus what a laboratory does — sit on top and are genuinely different. Everything below them is shared, versioned and released together." },
      { type: "h2", text: "The cadence" },
      { type: "steps", items: [
        { title: "Weeks 1–4: development", text: "Feature work merges behind flags. Main is always releasable." },
        { title: "Week 5: stabilisation", text: "No new features. Bug burn-down, performance runs on reference hardware, accessibility audit." },
        { title: "Week 6: staged rollout", text: "5% of installs, then 25%, then everyone, with automatic rollback on a crash-rate regression." },
      ] },
      { type: "callout", tone: "warning", title: "Security fixes ignore the train", text: "Anything with a security impact ships the day it is ready, as a patch release on every supported version line." },
      { type: "h2", text: "What makes it hold" },
      { type: "p", text: "Feature flags, so an unfinished feature never delays a release. A main branch that is always releasable, so stabilisation is short. And a hard rule that the date does not move — a feature that misses the train catches the next one six weeks later, which is a much smaller cost than a slipping release everyone is waiting on." },
    ],
  },
];

export const postBySlug = Object.fromEntries(posts.map((p) => [p.slug, p])) as Record<string, BlogPost>;

export function postsInCategory(category: BlogCategory) {
  return posts.filter((p) => p.category === category);
}

export const sortedPosts = [...posts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

export function relatedPosts(post: BlogPost, limit = 3) {
  const sameCategory = sortedPosts.filter((p) => p.category === post.category && p.slug !== post.slug);
  const others = sortedPosts.filter((p) => p.category !== post.category && p.slug !== post.slug);
  return [...sameCategory, ...others].slice(0, limit);
}
