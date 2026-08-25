/**
 * ENTIREFM PARTNER NETWORK COMMERCIAL DOMAIN
 * ==========================================
 * Types for commercial products, supplier memberships, billing, invoices,
 * Stripe payments, event management, ticketing, sponsorship, and reporting.
 */

export type ProductCategory =
  | 'SUPPLIER_MEMBERSHIP'
  | 'ONBOARDING_FEE'
  | 'ASSURANCE_REVIEW'
  | 'EVENT_TICKET'
  | 'EVENT_EXHIBITOR'
  | 'EVENT_SPONSORSHIP'
  | 'INDUSTRY_PARTNERSHIP'
  | 'TRAINING'
  | 'PROMOTIONAL'
  | 'OTHER';

export type BillingFrequency = 'ONE_OFF' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'CUSTOM';

export type PaymentMethodType =
  | 'STRIPE_CARD'
  | 'STRIPE_PAYMENT_LINK'
  | 'INVOICE'
  | 'BANK_TRANSFER'
  | 'MANUAL_SETTLEMENT'
  | 'CREDIT';

export type MembershipStatus =
  | 'NONE'
  | 'REGISTERED'
  | 'PENDING_PAYMENT'
  | 'ACTIVE'
  | 'PAYMENT_FAILED'
  | 'PAST_DUE'
  | 'SUSPENDED'
  | 'NON_RENEWING'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'COMPLIMENTARY';

export type InvoiceStatus =
  | 'DRAFT'
  | 'ISSUED'
  | 'SENT'
  | 'DUE'
  | 'PART_PAID'
  | 'PAID'
  | 'OVERDUE'
  | 'VOID'
  | 'CREDITED'
  | 'WRITTEN_OFF';

export type InvoicePaymentTerms =
  | 'DUE_ON_RECEIPT'
  | '7_DAYS'
  | '14_DAYS'
  | '30_DAYS'
  | '60_DAYS'
  | 'CUSTOM';

export type EventStatus =
  | 'DRAFT'
  | 'PLANNING'
  | 'REGISTRATION_OPEN'
  | 'SOLD_OUT'
  | 'CLOSED'
  | 'LIVE'
  | 'COMPLETED'
  | 'CANCELLED';

export type EventType =
  | 'MEET_THE_SUPPLIER'
  | 'MEET_THE_MANUFACTURER'
  | 'MEET_THE_BUYER'
  | 'TECHNICAL_BREAKFAST'
  | 'INNOVATION_SESSION'
  | 'SUPPLIER_FORUM'
  | 'TRAINING_WORKSHOP'
  | 'ANNUAL_SUMMIT';

export type SponsorshipStatus =
  | 'PROSPECT'
  | 'DISCUSSION'
  | 'PROPOSED'
  | 'AGREED'
  | 'INVOICED'
  | 'PAID'
  | 'DELIVERING'
  | 'COMPLETED'
  | 'LOST';

export interface CommercialProduct {
  id: string;
  internal_id: string;
  public_name: string;
  internal_name: string;
  description: string;
  category: ProductCategory;
  price_gbp: number;
  vat_rate: number; // e.g. 0.20 for 20% standard VAT
  billing_frequency: BillingFrequency;
  is_active: boolean;
  stripe_product_id?: string;
  stripe_price_id?: string;
  invoice_eligible: boolean;
  eligible_supplier_types: string[];
  benefits: string[];
  effective_date: string;
  retirement_date?: string;
}

export interface BillingProfile {
  id: string;
  supplier_id: string;
  legal_billing_name: string;
  trading_name?: string;
  billing_address: string;
  billing_city: string;
  billing_postcode: string;
  company_number?: string;
  vat_number?: string;
  billing_contact_name: string;
  billing_contact_email: string;
  billing_contact_phone?: string;
  po_required: boolean;
  default_po_number?: string;
  default_payment_method: PaymentMethodType;
  invoice_terms: InvoicePaymentTerms;
  stripe_customer_id?: string;
  currency: string;
  finance_notes?: string;
}

export interface PartnerMembershipRecord {
  id: string;
  supplier_id: string;
  supplier_name: string;
  product_id: string;
  product_name: string;
  membership_status: MembershipStatus;
  price_gbp: number;
  vat_gbp: number;
  total_gbp: number;
  billing_frequency: BillingFrequency;
  payment_method: PaymentMethodType;
  start_date: string;
  renewal_date: string;
  auto_renew: boolean;
  stripe_subscription_id?: string;
  is_complimentary: boolean;
  waiver_reason?: string;
  discount_pct?: number;
  admin_owner?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price_gbp: number;
  vat_rate: number;
  net_amount_gbp: number;
  vat_amount_gbp: number;
  total_amount_gbp: number;
  product_id?: string;
}

export interface PartnerInvoiceRecord {
  id: string;
  invoice_number: string; // e.g. "EFM-PN-2026-0101"
  supplier_id: string;
  supplier_name: string;
  billing_profile: BillingProfile;
  issue_date: string;
  due_date: string;
  status: InvoiceStatus;
  payment_terms: InvoicePaymentTerms;
  line_items: InvoiceLineItem[];
  subtotal_gbp: number;
  vat_total_gbp: number;
  total_gbp: number;
  amount_paid_gbp: number;
  amount_outstanding_gbp: number;
  payment_method?: PaymentMethodType;
  po_reference?: string;
  membership_id?: string;
  event_id?: string;
  stripe_invoice_id?: string;
  stripe_payment_intent_id?: string;
  paid_at?: string;
  void_reason?: string;
  admin_owner?: string;
  created_at: string;
  updated_at: string;
}

export interface PartnerPaymentRecord {
  id: string;
  payment_reference: string;
  invoice_id: string;
  invoice_number: string;
  supplier_id: string;
  supplier_name: string;
  amount_gbp: number;
  payment_method: PaymentMethodType;
  payment_date: string;
  stripe_charge_id?: string;
  bank_transaction_reference?: string;
  recorded_by: string; // user ID / name
  status: 'SETTLED' | 'PENDING' | 'FAILED' | 'REFUNDED';
  refund_amount_gbp?: number;
  refund_reason?: string;
  notes?: string;
}

export interface PartnerEventRecord {
  id: string;
  slug: string;
  title: string;
  event_type: EventType;
  description: string;
  venue_name: string;
  venue_address: string;
  event_date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  registered_count: number;
  status: EventStatus;
  is_public: boolean;
  is_ticketed: boolean;
  host_name: string;
  event_owner: string;
  registration_open_date: string;
  registration_close_date: string;
  products: {
    product_id: string;
    product_name: string;
    ticket_type: 'ATTENDEE' | 'EXHIBITOR' | 'SPONSOR';
    price_gbp: number;
    capacity_limit: number;
    sold_count: number;
  }[];
  agenda?: { time: string; topic: string; speaker?: string }[];
  speakers?: { name: string; title: string; company: string }[];
  sponsors?: { sponsor_name: string; tier: string; logo_url?: string }[];
  created_at: string;
  updated_at: string;
}

export interface EventAttendeeRecord {
  id: string;
  event_id: string;
  event_title: string;
  attendee_name: string;
  attendee_email: string;
  attendee_phone?: string;
  company_name: string;
  job_title: string;
  attendee_type: 'SUPPLIER' | 'PARTNER' | 'CLIENT' | 'PROSPECT' | 'EMPLOYEE' | 'GUEST';
  ticket_type: string;
  ticket_price_gbp: number;
  invoice_id?: string;
  payment_status: 'PAID' | 'COMPLIMENTARY' | 'UNPAID' | 'REFUNDED';
  checked_in: boolean;
  checked_in_at?: string;
  dietary_requirements?: string;
  accessibility_requirements?: string;
  registered_at: string;
}

export interface EventSponsorshipRecord {
  id: string;
  event_id: string;
  event_title: string;
  sponsor_organisation_id?: string;
  sponsor_company_name: string;
  package_name: string; // e.g. "Headline Sponsor", "Breakfast Sponsor", "Exhibitor Booth"
  package_value_gbp: number;
  vat_gbp: number;
  total_gbp: number;
  status: SponsorshipStatus;
  invoice_id?: string;
  payment_status: 'UNPAID' | 'PART_PAID' | 'PAID' | 'WAIVED';
  benefits_description: string[];
  primary_contact_name: string;
  primary_contact_email: string;
  account_owner: string;
  po_number?: string;
  logo_asset_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CommercialAuditRecord {
  id: string;
  entity_type: 'MEMBERSHIP' | 'INVOICE' | 'PAYMENT' | 'PRODUCT' | 'EVENT' | 'SPONSORSHIP';
  entity_id: string;
  action: string;
  actor_id: string;
  actor_name: string;
  timestamp: string;
  previous_value?: string;
  new_value?: string;
  reason?: string;
}

export interface CommercialDashboardMetrics {
  activePayingSuppliers: number;
  annualRecurringRevenueGbp: number;
  membershipsDueRenewalCount: number;
  outstandingInvoicesCount: number;
  outstandingInvoicesValueGbp: number;
  overdueInvoicesCount: number;
  overdueInvoicesValueGbp: number;
  paymentsThisMonthGbp: number;
  eventRevenueYtdGbp: number;
  sponsorshipRevenueYtdGbp: number;
  industryPartnerRevenueYtdGbp: number;
  failedPaymentsCount: number;
  complimentaryMembershipsCount: number;
  totalDiscountsGrantedGbp: number;
}
