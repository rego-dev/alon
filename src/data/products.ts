import type { CategorySlug, Product } from "@/types";
import { ALL, DESKTOP, DESKTOP_MOBILE, buildProduct, type Seed } from "./product-builder";

/* -------------------------------------------------------------------------- */
/*  Retail                                                                     */
/* -------------------------------------------------------------------------- */

const retail: Seed[] = [
  {
    slug: "grocery-pos",
    name: "Grocery POS",
    tagline: "Fast lanes, accurate stock, zero downtime",
    overview:
      "A supermarket-grade point of sale built around weight-based items, promotions and high-volume checkout. Cashiers scan, weigh and settle in a single screen, while head office watches margins per lane in real time. Everything keeps running when the internet does not.",
    icon: "ShoppingCart",
    badge: "popular",
    priceFrom: 29,
    platforms: DESKTOP_MOBILE,
    version: "12.4.2",
    releaseDate: "2026-07-14",
    highlights: [
      "Scan-to-settle in under four seconds per basket",
      "Weighing scale, barcode and cash drawer support out of the box",
      "Offline queue reconciles automatically when the line returns",
    ],
    features: [
      ["Lightning checkout", "Keyboard-first lane screen with scale integration, split tender and instant item lookup.", "Zap"],
      ["Promotions engine", "Mix-and-match, buy-one-get-one, happy hour and loyalty pricing evaluated at the lane.", "Sparkles"],
      ["Shrinkage control", "Cycle counts, variance alerts and per-cashier void tracking that surface losses early.", "Shield"],
      ["Supplier ordering", "Reorder points generate purchase orders from live sell-through, not guesswork.", "Truck"],
      ["Branch consolidation", "Every store rolls up to one dashboard with per-lane and per-hour margin views.", "Building2"],
    ],
  },
  {
    slug: "boutique-pos",
    name: "Boutique POS",
    tagline: "Style, size and colour handled properly",
    overview:
      "Apparel retail lives and dies by variants. Boutique POS models size, colour and fit as first-class attributes, so a single style can hold hundreds of SKUs without turning your catalogue into a spreadsheet. Clienteling and layaway are built in.",
    icon: "Store",
    priceFrom: 29,
    platforms: DESKTOP_MOBILE,
    version: "9.8.1",
    releaseDate: "2026-06-02",
    highlights: [
      "Matrix inventory for size and colour grids",
      "Clienteling profiles with purchase history at the till",
      "Layaway, exchange and store credit workflows",
    ],
    features: [
      ["Variant matrix", "Enter a whole size run in one grid and let the system generate and track every SKU.", "Layers"],
      ["Clienteling", "Customer profiles, wish lists and follow-up reminders attached to each sale.", "Users"],
      ["Layaway and credit", "Deposits, instalments and store credit tracked against the customer ledger.", "Wallet"],
      ["Season planning", "Sell-through by style and week, so markdowns happen before the season turns.", "TrendingUp"],
      ["Tag and label printing", "Barcode, price and care labels printed straight from the receiving screen.", "Printer"],
    ],
  },
  {
    slug: "pharmacy-pos",
    name: "Pharmacy POS",
    tagline: "Dispensing with the paperwork built in",
    overview:
      "Controlled substance logs, batch and expiry tracking, and prescription validation combined with a fast retail counter. Pharmacy POS keeps the regulator satisfied and the queue moving, with every dispense traceable to a batch, a prescriber and a staff member.",
    icon: "Pill",
    badge: "top-rated",
    priceFrom: 39,
    platforms: DESKTOP_MOBILE,
    version: "8.3.0",
    releaseDate: "2026-08-05",
    highlights: [
      "Batch, lot and expiry enforced at the point of sale",
      "Controlled substance register with tamper-evident audit trail",
      "Drug interaction warnings before the sale completes",
    ],
    features: [
      ["Batch and expiry control", "FEFO picking, near-expiry alerts and blocked sales on expired stock.", "CalendarClock"],
      ["Prescription capture", "Prescriber details, refill limits and partial dispensing tracked per script.", "ClipboardList"],
      ["Regulatory register", "Controlled drug movements logged immutably and exported in the required format.", "Lock"],
      ["Interaction checks", "Configurable interaction and allergy warnings raised before tender.", "TriangleAlert"],
      ["Insurance claims", "Co-pay splits and claim files generated from the dispensing record.", "Receipt"],
    ],
  },
  {
    slug: "restaurant-pos",
    name: "Restaurant POS",
    tagline: "Front of house, kitchen and bar in sync",
    overview:
      "Table plans, course firing and kitchen display screens that keep service moving on a full floor. Restaurant POS handles split bills, service charges and modifiers without slowing the server down, and recipe-level costing tells you what each plate actually earns.",
    icon: "UtensilsCrossed",
    badge: "popular",
    priceFrom: 35,
    platforms: DESKTOP_MOBILE,
    version: "11.2.5",
    releaseDate: "2026-07-28",
    highlights: [
      "Table map with course firing and coursing timers",
      "Kitchen display screens replace paper dockets",
      "Recipe costing down to the gram",
    ],
    features: [
      ["Table and floor plan", "Drag-to-arrange floor maps with covers, timers and server sections.", "LayoutDashboard"],
      ["Kitchen display", "Orders routed to the right station with prep timing and bump-bar support.", "Monitor"],
      ["Modifiers and courses", "Nested modifiers, allergen flags and coursing rules applied per item.", "Puzzle"],
      ["Recipe costing", "Ingredient-level costs roll up to plate margin and theoretical usage.", "Calculator"],
      ["Split and share bills", "Split by seat, item or percentage, with tips and service charges handled cleanly.", "Receipt"],
    ],
  },
  {
    slug: "hardware-pos",
    name: "Hardware POS",
    tagline: "Bulk, cut-to-length and trade accounts",
    overview:
      "Building supply and hardware retail runs on unusual units: metres of cable, kilos of nails, pallets of cement. Hardware POS handles unit conversion, trade pricing tiers and account customers, with quotations that convert straight into invoices.",
    icon: "Wrench",
    priceFrom: 29,
    platforms: DESKTOP,
    version: "7.6.3",
    releaseDate: "2026-05-19",
    highlights: [
      "Cut-to-length and bulk unit conversion",
      "Trade account pricing tiers and credit limits",
      "Quotation to invoice in one step",
    ],
    features: [
      ["Unit conversion", "Buy by pallet, sell by piece or metre — conversions handled at the item level.", "Boxes"],
      ["Trade accounts", "Credit limits, statements and negotiated price tiers per customer.", "Handshake"],
      ["Quotations", "Build a quote, hold the price, and convert to an order without re-keying.", "FileText"],
      ["Serial tracking", "Power tools and equipment tracked by serial through sale and warranty.", "Barcode"],
      ["Delivery scheduling", "Assign orders to vehicles and print picking lists per run.", "Truck"],
    ],
  },
  {
    slug: "convenience-store-pos",
    name: "Convenience Store POS",
    tagline: "Small floor, tight margins, total control",
    overview:
      "Built for the corner shop and forecourt: fast tender, age-restricted item prompts, shift-based cash handling and supplier consignment tracking. Convenience Store POS is deliberately simple to run and hard to defraud.",
    icon: "Store",
    priceFrom: 25,
    platforms: DESKTOP_MOBILE,
    version: "6.9.4",
    releaseDate: "2026-06-23",
    highlights: [
      "Shift cash-up with blind counts and variance alerts",
      "Age verification prompts on restricted items",
      "Consignment and vendor-managed stock supported",
    ],
    features: [
      ["Shift management", "Blind cash counts, drop tracking and per-shift variance reporting.", "Clock"],
      ["Age restriction", "Configurable prompts and ID capture on restricted categories.", "ShieldCheck"],
      ["Bill payments", "Airtime, utility and e-load transactions handled at the same counter.", "Smartphone"],
      ["Consignment stock", "Track vendor-owned stock separately and settle on sales, not receipts.", "Package"],
      ["Fuel and forecourt", "Optional pump integration with per-nozzle reconciliation.", "Gauge"],
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Accounting                                                                 */
/* -------------------------------------------------------------------------- */

const accounting: Seed[] = [
  {
    slug: "accounting-software",
    name: "Accounting Software",
    tagline: "The complete double-entry core",
    overview:
      "A full accounting suite covering the general ledger, banking, tax and financial statements. It is the hub the rest of the finance range plugs into, with multi-currency, multi-entity and multi-branch support from day one.",
    icon: "Calculator",
    badge: "popular",
    priceFrom: 39,
    platforms: DESKTOP,
    version: "15.1.0",
    releaseDate: "2026-08-11",
    highlights: [
      "Multi-entity and multi-currency consolidation",
      "Bank feeds with rule-based auto-reconciliation",
      "Statutory statements ready to file",
    ],
    features: [
      ["Double-entry core", "Every transaction balanced and traceable, with an immutable audit trail.", "Landmark"],
      ["Bank reconciliation", "Import feeds, match by rules and clear a month of statements in minutes.", "RefreshCw"],
      ["Tax handling", "VAT, GST and withholding computed per line and summarised per return period.", "Receipt"],
      ["Consolidation", "Roll several legal entities into one set of group statements automatically.", "Building2"],
      ["Period locking", "Close a period, lock it, and require an approved journal to reopen.", "Lock"],
    ],
  },
  {
    slug: "bookkeeping",
    name: "Bookkeeping",
    tagline: "Daily books without an accounting degree",
    overview:
      "A simplified front end over the same ledger the accountants use. Bookkeeping is designed for owners and admin staff who need to record income, expenses and receipts accurately without learning debits and credits.",
    icon: "BookOpen",
    priceFrom: 19,
    platforms: ALL,
    version: "5.4.7",
    releaseDate: "2026-04-30",
    highlights: [
      "Plain-language entry that posts correct journals underneath",
      "Receipt capture from phone camera",
      "Accountant hand-off with one export",
    ],
    features: [
      ["Guided entry", "Describe the transaction in plain terms; the correct journal is posted for you.", "Sparkles"],
      ["Receipt capture", "Photograph a receipt and have the amount, date and vendor extracted.", "Smartphone"],
      ["Expense categories", "A chart of accounts pre-mapped to common small business categories.", "Layers"],
      ["Accountant export", "Hand over a clean trial balance and transaction listing at year end.", "Send"],
      ["Cash flow view", "See money in and out by week without building a single report.", "TrendingUp"],
    ],
  },
  {
    slug: "financial-reports",
    name: "Financial Reports",
    tagline: "Board-ready statements on a schedule",
    overview:
      "A reporting layer that turns ledger data into the packs your board, bank and auditor expect. Build a report once, schedule it, and have it delivered as a formatted PDF or workbook every period without anyone touching a spreadsheet.",
    icon: "ChartColumn",
    priceFrom: 29,
    platforms: DESKTOP,
    version: "6.2.1",
    releaseDate: "2026-07-07",
    highlights: [
      "Drag-and-drop report designer over the live ledger",
      "Comparatives, budgets and variance built in",
      "Scheduled delivery to inboxes and shared drives",
    ],
    features: [
      ["Report designer", "Compose statements from account groups with formulas and sub-totals you control.", "Layers"],
      ["Budget variance", "Actual against budget and prior year, with drill-through to the source entry.", "Target"],
      ["Consolidated packs", "Bundle P&L, balance sheet, cash flow and notes into one distributable pack.", "FileText"],
      ["Scheduling", "Run monthly, quarterly or on close, and deliver automatically.", "CalendarDays"],
      ["Drill-through", "Click any figure and land on the transactions behind it.", "Search"],
    ],
  },
  {
    slug: "general-ledger",
    name: "General Ledger",
    tagline: "The single source of financial truth",
    overview:
      "A dedicated ledger engine for organisations with complex chart structures, dimensional reporting and heavy journal volume. Designed for finance teams who need cost centres, projects and funds tracked alongside every posting.",
    icon: "Landmark",
    priceFrom: 35,
    platforms: DESKTOP,
    version: "10.5.2",
    releaseDate: "2026-06-16",
    highlights: [
      "Dimensional postings: cost centre, project, fund, branch",
      "Recurring and reversing journals with approval routing",
      "Immutable audit trail on every change",
    ],
    features: [
      ["Flexible chart", "Multi-segment account codes with validation rules per segment combination.", "Layers"],
      ["Journal workflow", "Prepare, review and approve journals with full attachment support.", "ClipboardList"],
      ["Recurring entries", "Accruals, depreciation and allocations posted automatically each period.", "RefreshCw"],
      ["Allocation rules", "Spread shared costs across departments by percentage or driver.", "Boxes"],
      ["Audit trail", "Every posting, edit and reversal recorded with user, time and reason.", "Shield"],
    ],
  },
  {
    slug: "accounts-payable",
    name: "Accounts Payable",
    tagline: "Pay the right supplier, once, on time",
    overview:
      "Vendor invoices captured, matched against purchase orders and receipts, routed for approval and paid in scheduled runs. Accounts Payable removes duplicate payments and gives you a defensible approval trail for every cent that leaves.",
    icon: "Banknote",
    priceFrom: 29,
    platforms: DESKTOP,
    version: "7.1.6",
    releaseDate: "2026-05-05",
    highlights: [
      "Three-way match against PO and goods receipt",
      "Approval routing by amount and department",
      "Duplicate invoice detection before posting",
    ],
    features: [
      ["Invoice capture", "Email or scan invoices in; header and line data extracted for review.", "FileText"],
      ["Three-way match", "Automatically match invoice, purchase order and receipt, flagging only exceptions.", "Check"],
      ["Approval routing", "Thresholds and delegations route each invoice to the right approver.", "Users"],
      ["Payment runs", "Batch payments by due date and discount terms, with bank file export.", "CreditCard"],
      ["Aging and forecast", "See what falls due when, and model the cash impact before committing.", "ChartColumn"],
    ],
  },
  {
    slug: "accounts-receivable",
    name: "Accounts Receivable",
    tagline: "Get paid faster, chase less",
    overview:
      "Invoicing, statements, collections and cash application in one module. Accounts Receivable automates the follow-up ladder so overdue accounts get chased consistently, and shows a live picture of what is collectable this week.",
    icon: "Wallet",
    priceFrom: 29,
    platforms: DESKTOP_MOBILE,
    version: "7.3.2",
    releaseDate: "2026-07-21",
    highlights: [
      "Automated dunning ladder with escalation",
      "Online payment links on every invoice",
      "Cash application matched against open items",
    ],
    features: [
      ["Invoicing", "Branded invoices with payment links, recurring billing and credit notes.", "Receipt"],
      ["Dunning ladder", "Escalating reminders by email and SMS on a schedule you configure.", "Bell"],
      ["Collections desk", "One worklist showing promises to pay, disputes and next actions.", "ClipboardList"],
      ["Cash application", "Match receipts to open items automatically, part-payments included.", "Check"],
      ["Credit control", "Credit limits, holds and risk scoring applied before new orders ship.", "ShieldCheck"],
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Human Resources                                                            */
/* -------------------------------------------------------------------------- */

const humanResources: Seed[] = [
  {
    slug: "payroll",
    name: "Payroll",
    tagline: "Statutory-accurate pay, every cycle",
    overview:
      "Payroll computes gross to net across salaried, hourly and commission earners, applies statutory contributions and taxes, and produces payslips, bank files and government returns. Retroactive adjustments and back-pay are handled without manual recalculation.",
    icon: "Banknote",
    badge: "top-rated",
    priceFrom: 35,
    platforms: DESKTOP_MOBILE,
    version: "13.0.4",
    releaseDate: "2026-08-18",
    highlights: [
      "Gross-to-net with statutory contributions and tax tables",
      "Payslip distribution by email and self-service portal",
      "Bank transfer files and government returns generated",
    ],
    features: [
      ["Pay computation", "Salaried, hourly, piece-rate and commission earners in one run.", "Calculator"],
      ["Statutory compliance", "Contribution and tax tables maintained and versioned per effective date.", "Shield"],
      ["Retro and back-pay", "Adjust a prior period and let the system compute the catch-up automatically.", "RefreshCw"],
      ["Payslips", "Digital payslips delivered securely, with a self-service archive per employee.", "FileText"],
      ["Cost allocation", "Split labour cost to departments, projects and cost centres for the ledger.", "Boxes"],
    ],
  },
  {
    slug: "hris",
    name: "HRIS",
    tagline: "One employee record, end to end",
    overview:
      "The system of record for people: contracts, documents, job history, compensation, performance and offboarding. HRIS gives managers self-service access to their team and gives HR a defensible history of every change.",
    icon: "IdCard",
    priceFrom: 29,
    platforms: ALL,
    version: "9.4.0",
    releaseDate: "2026-06-09",
    highlights: [
      "Complete employee record with effective-dated history",
      "Manager and employee self-service",
      "Document expiry tracking for permits and certifications",
    ],
    features: [
      ["Employee records", "Personal, contractual and job data with effective-dated change history.", "Users"],
      ["Self-service", "Employees update details and request changes; managers approve in the app.", "Smartphone"],
      ["Org structure", "Reporting lines, positions and headcount planning kept in one chart.", "Building2"],
      ["Document vault", "Contracts, IDs and certifications stored with expiry reminders.", "Lock"],
      ["Onboarding flows", "Checklists that assign tasks to IT, finance and the hiring manager.", "ClipboardList"],
    ],
  },
  {
    slug: "timekeeping",
    name: "Timekeeping",
    tagline: "Hours you can defend at an audit",
    overview:
      "Capture time from biometric terminals, mobile geofenced clock-ins or web punches, apply rounding and grace rules, and feed approved hours straight into payroll. Timekeeping is built to eliminate the spreadsheet between the clock and the payslip.",
    icon: "Clock",
    priceFrom: 19,
    platforms: ALL,
    version: "8.7.3",
    releaseDate: "2026-07-02",
    highlights: [
      "Biometric, mobile and web capture in one timesheet",
      "Rounding, grace and overtime rules applied automatically",
      "Approved hours flow directly to payroll",
    ],
    features: [
      ["Multi-source capture", "Fingerprint and face terminals, geofenced mobile punches and kiosk mode.", "FingerprintPattern"],
      ["Shift rules", "Rounding, grace periods, night differential and overtime thresholds per policy.", "Timer"],
      ["Exception handling", "Missed punches and anomalies surfaced as a worklist for supervisors.", "TriangleAlert"],
      ["Project time", "Allocate hours to jobs and cost centres for accurate labour costing.", "Target"],
      ["Payroll hand-off", "Approved timesheets post to payroll with no re-keying.", "Send"],
    ],
  },
  {
    slug: "attendance",
    name: "Attendance",
    tagline: "Who is in, who is out, right now",
    overview:
      "A live attendance view across sites and shifts, with absence patterns surfaced before they become a problem. Attendance covers rosters, schedule adherence and real-time headcount for safety and operational planning.",
    icon: "CalendarDays",
    priceFrom: 19,
    platforms: ALL,
    version: "6.5.8",
    releaseDate: "2026-05-26",
    highlights: [
      "Live floor and site headcount",
      "Roster publishing with shift swap requests",
      "Absence pattern detection and alerts",
    ],
    features: [
      ["Live board", "Real-time in/out board per site, useful for muster and safety checks.", "Activity"],
      ["Rostering", "Build and publish schedules, with coverage warnings before you post them.", "CalendarClock"],
      ["Shift swaps", "Employees request swaps; supervisors approve within policy limits.", "RefreshCw"],
      ["Absence analytics", "Bradford-style scoring highlights repeated short absences.", "ChartColumn"],
      ["Notifications", "Late and no-show alerts pushed to supervisors as they happen.", "Bell"],
    ],
  },
  {
    slug: "leave-management",
    name: "Leave Management",
    tagline: "Balances that always add up",
    overview:
      "Accruals, carry-over, encashment and statutory entitlements computed per policy, with requests and approvals handled in the app. Leave Management removes the recurring argument about how many days someone actually has left.",
    icon: "CalendarClock",
    priceFrom: 15,
    platforms: ALL,
    version: "5.9.1",
    releaseDate: "2026-04-14",
    highlights: [
      "Accrual, carry-over and encashment rules per policy",
      "Team calendar with coverage conflict warnings",
      "Balances reconciled against payroll automatically",
    ],
    features: [
      ["Policy engine", "Different accrual rules by tenure, grade and location, all effective-dated.", "Layers"],
      ["Request and approve", "Multi-level approval with delegation while managers are away.", "Check"],
      ["Team calendar", "See overlapping absences before approving and avoid understaffing.", "CalendarDays"],
      ["Balance ledger", "Every accrual, deduction and adjustment traceable to its rule.", "BookOpen"],
      ["Payroll sync", "Unpaid leave and encashment flow into the pay run automatically.", "Send"],
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Healthcare                                                                 */
/* -------------------------------------------------------------------------- */

const healthcare: Seed[] = [
  {
    slug: "clinic-management",
    name: "Clinic Management",
    tagline: "Front desk to follow-up in one system",
    overview:
      "Appointments, patient charts, billing and clinician scheduling for outpatient practice. Clinic Management is built so the front desk, the consultation room and the cashier are working from the same record, with a complete audit trail.",
    icon: "Stethoscope",
    badge: "popular",
    priceFrom: 45,
    platforms: DESKTOP_MOBILE,
    version: "10.2.3",
    releaseDate: "2026-08-01",
    highlights: [
      "Appointment book with reminders and no-show tracking",
      "Consultation notes, orders and billing on one screen",
      "Role-based access with full audit logging",
    ],
    features: [
      ["Appointment book", "Multi-clinician scheduling with SMS and email reminders.", "CalendarDays"],
      ["Consultation notes", "Structured templates per specialty, with free text where it matters.", "ClipboardList"],
      ["Billing and claims", "Charge capture at the point of care, with insurance claim generation.", "Receipt"],
      ["Access control", "Granular permissions and access logs appropriate to clinical data.", "Lock"],
      ["Recall and follow-up", "Automated recall lists for reviews, vaccinations and chronic care.", "Bell"],
    ],
  },
  {
    slug: "prescription-software",
    name: "Prescription Software",
    tagline: "Legible, checked, traceable prescribing",
    overview:
      "Electronic prescribing with formulary lookup, interaction and allergy checking, and dosage guidance. Prescriptions print or transmit to the dispensing pharmacy, and every script is retained against the patient record.",
    icon: "Pill",
    priceFrom: 39,
    platforms: DESKTOP_MOBILE,
    version: "6.8.0",
    releaseDate: "2026-06-30",
    highlights: [
      "Interaction, allergy and duplication checks at prescribing",
      "Favourite and protocol-based prescription sets",
      "Digital transmission to dispensing pharmacies",
    ],
    features: [
      ["Formulary lookup", "Searchable drug database with strengths, forms and local availability.", "Search"],
      ["Safety checks", "Interaction, allergy, duplication and dose-range warnings before signing.", "ShieldCheck"],
      ["Protocol sets", "Save common regimens as one-click sets for chronic and acute care.", "Layers"],
      ["Repeat management", "Track refills, review dates and authorisation limits per patient.", "RefreshCw"],
      ["Transmission", "Send to a nominated pharmacy or print a signed, barcoded script.", "Send"],
    ],
  },
  {
    slug: "medical-records",
    name: "Medical Records",
    tagline: "A complete, searchable patient history",
    overview:
      "Longitudinal patient records covering encounters, results, imaging references, medications and documents. Medical Records is designed around retrievability under pressure: find the relevant history in seconds, with every access logged.",
    icon: "FileText",
    priceFrom: 45,
    platforms: DESKTOP,
    version: "11.6.2",
    releaseDate: "2026-07-19",
    highlights: [
      "Longitudinal timeline across every encounter",
      "Document and result attachment with OCR search",
      "Access logging on every record view",
    ],
    features: [
      ["Patient timeline", "Every visit, result and prescription on one chronological view.", "Activity"],
      ["Document archive", "Scanned documents indexed and searchable by content, not just filename.", "Search"],
      ["Results integration", "Laboratory and imaging results filed against the ordering encounter.", "FlaskConical"],
      ["Consent and sharing", "Track consent and produce a shareable summary for referrals.", "Handshake"],
      ["Retention policy", "Configurable retention and archival aligned to local regulation.", "Database"],
    ],
  },
  {
    slug: "patient-queue",
    name: "Patient Queue",
    tagline: "Shorter waits, calmer waiting rooms",
    overview:
      "Ticketing, display screens and triage priority that keep an outpatient department orderly. Patient Queue shows expected wait times, calls patients to the right room, and gives management the data to fix bottlenecks.",
    icon: "Timer",
    priceFrom: 25,
    platforms: DESKTOP_MOBILE,
    version: "4.7.5",
    releaseDate: "2026-05-12",
    highlights: [
      "Ticketing with triage priority overrides",
      "Waiting-room displays and audio call-out",
      "Wait time analytics per station and hour",
    ],
    features: [
      ["Ticketing", "Kiosk or reception issued tickets, grouped by service and priority.", "Ticket"],
      ["Display screens", "Now-serving boards with room routing and multilingual call-out.", "Monitor"],
      ["Triage priority", "Clinical urgency overrides arrival order under a rule you control.", "TriangleAlert"],
      ["Mobile queue", "Patients hold their place from their phone and are notified to return.", "Smartphone"],
      ["Flow analytics", "Wait and service times per station reveal where the queue actually stalls.", "ChartColumn"],
    ],
  },
  {
    slug: "laboratory",
    name: "Laboratory",
    tagline: "Specimen to validated result",
    overview:
      "A laboratory information system covering order entry, specimen tracking, analyser interfacing, result validation and report release. Built for diagnostic labs that need chain of custody and reference ranges enforced.",
    icon: "FlaskConical",
    priceFrom: 55,
    platforms: DESKTOP,
    version: "9.1.4",
    releaseDate: "2026-07-25",
    highlights: [
      "Barcoded specimen tracking with chain of custody",
      "Analyser interfacing with automatic result capture",
      "Two-stage validation before any result is released",
    ],
    features: [
      ["Order entry", "Test panels, profiles and add-on tests ordered against the patient episode.", "ClipboardList"],
      ["Specimen tracking", "Barcode labels and scan checkpoints from collection through disposal.", "Barcode"],
      ["Analyser interface", "Bidirectional interfacing with common analysers, results captured automatically.", "Cpu"],
      ["Validation rules", "Reference ranges, deltas and critical values flagged for review before release.", "ShieldCheck"],
      ["Result reporting", "Cumulative reports delivered to clinicians and patients securely.", "Send"],
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Business Operations                                                        */
/* -------------------------------------------------------------------------- */

const businessOperations: Seed[] = [
  {
    slug: "inventory-management",
    name: "Inventory Management",
    tagline: "Know exactly what you have, everywhere",
    overview:
      "Real-time stock across branches, warehouses and vans, with costing, reorder automation and full movement history. Inventory Management is the backbone module that the POS, procurement and accounting products all read from.",
    icon: "Boxes",
    badge: "popular",
    priceFrom: 35,
    platforms: DESKTOP_MOBILE,
    version: "14.3.1",
    releaseDate: "2026-08-08",
    highlights: [
      "Live stock across every location and vehicle",
      "Weighted average, FIFO and standard costing",
      "Reorder automation from real demand history",
    ],
    features: [
      ["Multi-location stock", "Branches, warehouses, bins and vans tracked as distinct locations.", "Warehouse"],
      ["Costing methods", "FIFO, weighted average or standard cost per item category.", "Calculator"],
      ["Reorder automation", "Min/max and demand-based reorder suggestions that become purchase orders.", "RefreshCw"],
      ["Stock counts", "Cycle and full counts on mobile, with variance approval before posting.", "ClipboardList"],
      ["Movement history", "Every receipt, transfer, adjustment and sale traceable per unit.", "Activity"],
    ],
  },
  {
    slug: "warehouse-management",
    name: "Warehouse Management",
    tagline: "Pick faster, ship accurately",
    overview:
      "Directed putaway, zone-based picking, packing verification and dispatch for operations that outgrow simple stock control. Warehouse Management drives handheld scanners and measurably reduces mis-picks.",
    icon: "Warehouse",
    priceFrom: 55,
    platforms: DESKTOP_MOBILE,
    version: "8.4.6",
    releaseDate: "2026-06-27",
    highlights: [
      "Directed putaway and zone-based pick paths",
      "Scan verification at pack to eliminate mis-ships",
      "Wave and batch picking for high order volumes",
    ],
    features: [
      ["Bin management", "Location hierarchy with capacity, velocity and replenishment rules.", "Boxes"],
      ["Directed picking", "Optimised pick paths issued to handhelds, wave or batch grouped.", "Target"],
      ["Pack verification", "Every item scanned at pack; the carton cannot close until it matches.", "ShieldCheck"],
      ["Dispatch", "Carrier selection, labels and manifests generated at the door.", "Truck"],
      ["Labour metrics", "Lines per hour by picker and zone, so you can staff to actual throughput.", "Gauge"],
    ],
  },
  {
    slug: "crm",
    name: "CRM",
    tagline: "Every deal, contact and promise in one place",
    overview:
      "Pipeline management, activity tracking and customer history that connects sales to the rest of the business. Because CRM reads the same customer record as invoicing and support, a rep sees unpaid invoices and open tickets before they call.",
    icon: "Handshake",
    badge: "new",
    priceFrom: 29,
    platforms: ALL,
    version: "7.8.2",
    releaseDate: "2026-08-15",
    highlights: [
      "Visual pipeline with weighted forecasting",
      "Full customer context including invoices and tickets",
      "Mobile app for field sales with offline notes",
    ],
    features: [
      ["Pipeline board", "Drag deals through stages, with probability-weighted forecast totals.", "TrendingUp"],
      ["Activity tracking", "Calls, meetings and emails logged against the contact automatically.", "Activity"],
      ["360 customer view", "Orders, invoices, payments and support history on the contact record.", "Eye"],
      ["Quotations", "Build quotes from the live price list and convert won deals to orders.", "FileText"],
      ["Field mobility", "Route planning and visit logging that works without signal.", "MapPin"],
    ],
  },
  {
    slug: "procurement",
    name: "Procurement",
    tagline: "Controlled buying, better prices",
    overview:
      "Requisition to purchase order to receipt, with approval thresholds, supplier comparison and contract pricing enforced. Procurement stops maverick spending and gives finance the commitment data it needs for cash forecasting.",
    icon: "Package",
    priceFrom: 35,
    platforms: DESKTOP,
    version: "6.6.9",
    releaseDate: "2026-05-28",
    highlights: [
      "Requisition approval thresholds by value and department",
      "Supplier quote comparison side by side",
      "Committed spend visible to finance in real time",
    ],
    features: [
      ["Requisitions", "Staff request; the system routes for approval before any money is committed.", "ClipboardList"],
      ["Supplier comparison", "Request and compare quotes on price, lead time and terms.", "Layers"],
      ["Contract pricing", "Negotiated rates enforced automatically on every order raised.", "Handshake"],
      ["Goods receipt", "Receive against the order, with partial receipts and rejection handling.", "Package"],
      ["Spend analytics", "Spend by category, supplier and department, with savings tracked.", "ChartColumn"],
    ],
  },
  {
    slug: "sales-management",
    name: "Sales Management",
    tagline: "Targets, territories and commissions",
    overview:
      "Order management, territory assignment, quota tracking and commission calculation for distributed sales teams. Sales Management closes the loop between what was sold, what shipped and what the rep actually gets paid.",
    icon: "Target",
    priceFrom: 29,
    platforms: DESKTOP_MOBILE,
    version: "5.7.4",
    releaseDate: "2026-06-11",
    highlights: [
      "Order to fulfilment tracking per rep and territory",
      "Quota and target tracking with live attainment",
      "Commission schemes computed and reconciled to payroll",
    ],
    features: [
      ["Order management", "Capture, credit-check and release orders with margin visibility per line.", "Receipt"],
      ["Territories", "Assign accounts by geography, segment or named list with clear ownership.", "MapPin"],
      ["Quota tracking", "Targets by rep, team and period, with live attainment dashboards.", "Gauge"],
      ["Commission engine", "Tiered, split and clawback rules computed and exported to payroll.", "Calculator"],
      ["Price control", "Discount limits enforced by role, with exception approval workflow.", "ShieldCheck"],
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Education                                                                  */
/* -------------------------------------------------------------------------- */

const education: Seed[] = [
  {
    slug: "school-management",
    name: "School Management",
    tagline: "The whole campus, one platform",
    overview:
      "Timetabling, attendance, grading, discipline and parent communication for primary and secondary schools. School Management is designed to be operated by teaching staff, not a dedicated IT department.",
    icon: "School",
    badge: "popular",
    priceFrom: 39,
    platforms: ALL,
    version: "11.9.0",
    releaseDate: "2026-07-30",
    highlights: [
      "Timetabling with clash detection",
      "Parent portal for grades, attendance and announcements",
      "Report cards generated from live assessment data",
    ],
    features: [
      ["Timetabling", "Build schedules with automatic clash detection for rooms, staff and classes.", "CalendarClock"],
      ["Attendance", "Period-level attendance from a tablet, with guardian alerts on absence.", "Check"],
      ["Assessment", "Weighted grading schemes producing report cards and transcripts.", "Award"],
      ["Parent portal", "Guardians see grades, attendance and fees, and receive announcements.", "Users"],
      ["Discipline records", "Incidents and interventions logged with a confidential access model.", "ClipboardList"],
    ],
  },
  {
    slug: "student-information-system",
    name: "Student Information System",
    tagline: "One record from application to alumnus",
    overview:
      "The institutional record for every student: applications, programmes, course registration, transcripts and graduation audit. Built for colleges and universities where credit rules and prerequisites must be enforced, not merely documented.",
    icon: "GraduationCap",
    priceFrom: 49,
    platforms: DESKTOP_MOBILE,
    version: "12.1.3",
    releaseDate: "2026-08-04",
    highlights: [
      "Prerequisite and credit rules enforced at registration",
      "Official transcripts and graduation audit",
      "Complete history from application to alumni status",
    ],
    features: [
      ["Student record", "One durable record across programmes, transfers and re-admissions.", "IdCard"],
      ["Course registration", "Prerequisite checking, capacity limits and waitlists at registration.", "ClipboardList"],
      ["Transcripts", "Official and unofficial transcripts generated from validated grade history.", "FileText"],
      ["Graduation audit", "Automatic checks of remaining requirements per programme.", "Award"],
      ["Reporting", "Enrolment, retention and completion statistics ready for regulators.", "ChartColumn"],
    ],
  },
  {
    slug: "enrollment",
    name: "Enrollment",
    tagline: "Admissions without the paper mountain",
    overview:
      "Online applications, document collection, entrance assessment and offer management. Enrollment turns admissions season into a tracked pipeline instead of a shared inbox, and hands accepted students straight to the student record.",
    icon: "ClipboardList",
    priceFrom: 29,
    platforms: ALL,
    version: "6.3.7",
    releaseDate: "2026-05-21",
    highlights: [
      "Online application forms with document upload",
      "Applicant pipeline with stage tracking",
      "Offers, acceptance and deposit handling",
    ],
    features: [
      ["Online applications", "Configurable forms per programme, saved and resumed by the applicant.", "FileText"],
      ["Document collection", "Required documents tracked, with reminders until the file is complete.", "Package"],
      ["Assessment", "Entrance exams and interview scoring recorded against the application.", "Check"],
      ["Offer management", "Generate offers, track acceptance and collect reservation deposits.", "Send"],
      ["Conversion analytics", "See where applicants drop out of the funnel and by how much.", "TrendingUp"],
    ],
  },
  {
    slug: "billing",
    name: "Billing",
    tagline: "Tuition, fees and plans that reconcile",
    overview:
      "Fee structures, instalment plans, scholarships and discounts computed per student, with statements and online payment. Billing posts straight to the ledger so bursary and finance never argue about the receivables balance.",
    icon: "CreditCard",
    priceFrom: 29,
    platforms: DESKTOP_MOBILE,
    version: "7.2.8",
    releaseDate: "2026-06-18",
    highlights: [
      "Fee schedules by programme, year and student category",
      "Instalment plans with automated reminders",
      "Scholarships and discounts applied as auditable adjustments",
    ],
    features: [
      ["Fee structures", "Define fees by programme, level and category, effective-dated per term.", "Layers"],
      ["Instalment plans", "Split balances into schedules with reminders and late-fee rules.", "CalendarClock"],
      ["Scholarships", "Grants and discounts posted as traceable adjustments, not edited invoices.", "Award"],
      ["Online payment", "Card, bank transfer and wallet payments applied to the student account.", "Wallet"],
      ["Ledger posting", "Every charge, receipt and write-off posts to the general ledger automatically.", "Landmark"],
    ],
  },
];

const seedsByCategory: Array<[CategorySlug, Seed[]]> = [
  ["retail", retail],
  ["accounting", accounting],
  ["human-resources", humanResources],
  ["healthcare", healthcare],
  ["business-operations", businessOperations],
  ["education", education],
];

export const products: Product[] = seedsByCategory.flatMap(([category, seeds]) =>
  seeds.map((seed) => buildProduct(seed, category)),
);

export const productBySlug = Object.fromEntries(products.map((p) => [p.slug, p])) as Record<string, Product>;

export function getProduct(slug: string): Product | undefined {
  return productBySlug[slug];
}

export function productsByCategory(category: CategorySlug): Product[] {
  return products.filter((p) => p.category === category);
}

export const featuredProducts: Product[] = products.filter((p) => p.badge === "popular").slice(0, 6);

export function relatedProducts(product: Product, limit = 3): Product[] {
  return products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, limit);
}
