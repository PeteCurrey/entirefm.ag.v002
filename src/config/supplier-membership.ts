/**
 * ENTIREFM CANONICAL SUPPLIER MEMBERSHIP CONFIGURATION
 * =====================================================
 * Single authoritative source of truth for the EntireFM Supplier Membership
 * commercial model. ALL UI, payment, and application logic must derive from
 * this configuration — never hardcode prices or product names in components.
 *
 * COMMERCIAL MODEL:
 *   One supplier membership. One annual fee. Full platform proposition.
 *
 * CRITICAL: Do not add tier variants below. There is ONE membership.
 *
 * For historical payment records (£295 / £695 legacy transactions) see the
 * supplier application draft / audit ledger — those records must not be altered.
 */

export const SUPPLIER_MEMBERSHIP = {
  /** The canonical product name — use this everywhere in UI/comms */
  name: 'EntireFM Supplier Membership',

  /** Short form for tight UI contexts */
  shortName: 'Supplier Membership',

  /** Internal canonical identifier */
  internalId: 'MEM-SUPPLIER-ANNUAL-V3',

  /** Annual price excluding VAT (GBP) — canonical commercial figure */
  annualPriceExVat: 95,

  /** UK standard VAT rate */
  vatRate: 0.20,

  /** VAT amount (£19.00) */
  get vatAmount() {
    return Math.round(this.annualPriceExVat * this.vatRate * 100) / 100;
  },

  /** Total price including VAT (£114.00) */
  get totalPriceIncVat() {
    return Math.round(this.annualPriceExVat * (1 + this.vatRate) * 100) / 100;
  },

  /** Total in pence (for Stripe unit_amount) */
  get totalPricePence() {
    return Math.round(this.annualPriceExVat * (1 + this.vatRate) * 100);
  },

  /** Monthly equivalent for display purposes only (ex VAT) */
  get monthlyEquivalentExVat() {
    return Math.round((this.annualPriceExVat / 12) * 100) / 100; // ~£7.92
  },

  /** Billing interval */
  billingInterval: 'year' as const,

  /** Currency */
  currency: 'GBP' as const,

  /** VAT applicable */
  vatApplicable: true,

  /** Display strings */
  displayPrice: '£95 + VAT / year',
  displayPriceIncVat: '£114.00 including VAT',
  displayMonthly: '~£7.92 / month before VAT',

  /** Description for checkout line item */
  checkoutDescription: 'Annual supplier membership giving access to the EntireFM supplier platform, compliance infrastructure, operational tools, business tools, and Partner Network.',

  /** What membership includes — used in platform descriptions */
  platformDescription: 'One membership gives your business access to the EntireFM supplier platform, compliance infrastructure, operational tools, business tools, intelligence and Partner Network.',

  /** Canonical disclaimer — membership does not buy work */
  disclaimer: 'Membership does not guarantee work. Supplier approval and work allocation remain based on capability, compliance, competency, geography, availability and operational requirements.',

  /** Feature pillars for the membership page */
  pillars: {
    OPERATE: {
      label: 'Operate',
      features: [
        'Contractor Control Centre & task management',
        'Work order & job management',
        'RAMS creation and digital Job Pack assembly',
        'Digital field forms and service reporting',
        'Field execution and completion evidence',
      ],
    },
    CONTROL: {
      label: 'Control',
      features: [
        'Compliance Centre with automated expiry tracking',
        'Document Vault (90/60/30-day radar alerts)',
        'Insurance schedules and records',
        'Accreditation tracking and management',
        'Workforce competency matrix',
      ],
    },
    DEVELOP: {
      label: 'Develop',
      features: [
        'Supplier Academy onboarding and guidance',
        'Technical briefings and industry events',
        'CPD opportunities where available',
        'Technical event programme participation',
      ],
    },
    STAY_INFORMED: {
      label: 'Stay Informed',
      features: [
        'Compliance Watch — regulatory updates',
        'Company Watch — contractor intelligence',
        'Credential Watch — accreditation alerts',
        'Trade updates and safety bulletins',
        'Standards and technical change notifications',
      ],
    },
    RUN_THE_BUSINESS: {
      label: 'Run the Business',
      features: [
        'Labour rate calculator',
        'Job margin and quote builder',
        'Call-out cost and mileage/travel tools',
        'Engineer utilisation planner',
        'PPM planner',
        'VAT calculation tools',
      ],
    },
    CONNECT: {
      label: 'Connect',
      features: [
        'EntireFM Partner Network participation',
        'Supplier profile and network presence',
        'Network communications and engagement',
        'Consideration for suitable EntireFM requirements',
        'Technical and industry engagement opportunities',
      ],
    },
  },

  /** Canonical feature checklist for membership panels */
  includedFeatures: [
    'Supplier Platform & Contractor Control Centre',
    'Compliance Centre & Document Vault',
    'RAMS & Job Pack tools',
    'Workforce & Competency management',
    'Digital field forms & evidence capture',
    'Business tools & calculators',
    'Contractor Intelligence (Company Watch, alerts)',
    'Events & Technical engagement',
    'EntireFM Partner Network participation',
    'Supplier profile within the network',
  ],
} as const;

// ── Application Journey States ────────────────────────────────────────────────
// Applicant Status is a workflow state — NOT a membership tier.

export type ApplicationLifecycleStatus =
  | 'DRAFT'
  | 'PAYMENT_REQUIRED'
  | 'PAYMENT_PENDING'    // Redirected to Stripe, not yet confirmed
  | 'PAYMENT_COMPLETE'   // Stripe webhook confirmed — under EntireFM review
  | 'UNDER_REVIEW'
  | 'INFORMATION_REQUIRED'
  | 'APPROVED'
  | 'REJECTED'
  | 'WITHDRAWN';

export type MembershipPaymentStatus =
  | 'UNPAID'
  | 'PENDING'    // Stripe session created, awaiting webhook confirmation
  | 'PAID'
  | 'WAIVED'     // Authorised EntireFM invitation code — £0 charged, full review still applies
  | 'FAILED'
  | 'REFUNDED';

/** Labels for supplier-facing display (never expose internal RBAC role names) */
export const APPLICATION_STATUS_LABELS: Record<ApplicationLifecycleStatus, string> = {
  DRAFT: 'Application In Progress',
  PAYMENT_REQUIRED: 'Payment Required',
  PAYMENT_PENDING: 'Payment Pending',
  PAYMENT_COMPLETE: 'Application Submitted',
  UNDER_REVIEW: 'Under Review',
  INFORMATION_REQUIRED: 'Further Information Required',
  APPROVED: 'Supplier Approved',
  REJECTED: 'Application Not Successful',
  WITHDRAWN: 'Application Withdrawn',
};

/** CTA labels for each application state — used in dashboard */
export const APPLICATION_STATUS_CTA: Partial<Record<ApplicationLifecycleStatus, string>> = {
  DRAFT: 'Continue Application',
  PAYMENT_REQUIRED: 'Complete Payment — £95 + VAT',
  UNDER_REVIEW: 'Application Under Review',
  APPROVED: 'Supplier Platform',
};

// ── Historical Context ─────────────────────────────────────────────────────────
// Existing approved suppliers who were previously on £295 / £695 tiers must
// NOT be forced through a new application. Preserve their approval state and
// data. The new £95 annual model applies only to new or renewing memberships
// where a commercial transition is appropriate.

export const LEGACY_TIER_CODES = ['TIER_1', 'TIER_2'] as const;
export type LegacyTierCode = typeof LEGACY_TIER_CODES[number];

export const LEGACY_TIER_DISPLAY: Record<LegacyTierCode, string> = {
  TIER_1: 'Contractor Network Member (Legacy £295/yr)',
  TIER_2: 'Network Partner (Legacy £695/yr)',
};
