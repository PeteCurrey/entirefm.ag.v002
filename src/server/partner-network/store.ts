/**
 * ENTIREFM PARTNER NETWORK COMMERCIAL REPOSITORY
 * =============================================
 * Commercial domain store for products, memberships, billing, invoices,
 * payments, events, sponsorships, and commercial reporting.
 *
 * NON-NEGOTIABLE PROCUREMENT FIREWALL:
 * Commercial payment or membership status must NEVER influence technical
 * compliance, vetting approval, or operational work order allocation.
 */

import {
  CommercialProduct,
  BillingProfile,
  PartnerMembershipRecord,
  PartnerInvoiceRecord,
  PartnerPaymentRecord,
  PartnerEventRecord,
  EventAttendeeRecord,
  EventSponsorshipRecord,
  CommercialAuditRecord,
  CommercialDashboardMetrics,
} from './types';

class MemoryPartnerCommercialStore {
  public products: Map<string, CommercialProduct> = new Map();
  public billingProfiles: Map<string, BillingProfile> = new Map();
  public memberships: Map<string, PartnerMembershipRecord> = new Map();
  public invoices: Map<string, PartnerInvoiceRecord> = new Map();
  public payments: Map<string, PartnerPaymentRecord> = new Map();
  public events: Map<string, PartnerEventRecord> = new Map();
  public attendees: Map<string, EventAttendeeRecord> = new Map();
  public sponsorships: Map<string, EventSponsorshipRecord> = new Map();
  public auditLogs: CommercialAuditRecord[] = [];

  constructor() {
    this.seedDefaultCommercialProducts();
    this.seedDefaultEvents();
  }

  private seedDefaultCommercialProducts() {
    const products: CommercialProduct[] = [
      {
        id: 'prod-reg-free',
        internal_id: 'MEM-REG-00',
        public_name: 'Registered Supplier',
        internal_name: 'Registered Supplier (£0 Free Tier)',
        description: 'Network directory registration, basic supplier profile, and opportunity notification access.',
        category: 'SUPPLIER_MEMBERSHIP',
        price_gbp: 0,
        vat_rate: 0.20,
        billing_frequency: 'ANNUAL',
        is_active: true,
        invoice_eligible: false,
        eligible_supplier_types: ['LOCAL_SME', 'REGIONAL_CONTRACTOR', 'SPECIALIST_CONTRACTOR'],
        benefits: ['Directory listing', 'Application intake access', 'Network newsletters'],
        effective_date: '2026-01-01',
      },
      {
        id: 'prod-mem-verified',
        internal_id: 'MEM-VER-01',
        public_name: 'Verified Supplier Network Membership',
        internal_name: 'Verified Network Member (£495/yr)',
        description: 'Active compliance document management, automated expiry tracking, priority supplier communications, and verified badge.',
        category: 'SUPPLIER_MEMBERSHIP',
        price_gbp: 495,
        vat_rate: 0.20,
        billing_frequency: 'ANNUAL',
        is_active: true,
        invoice_eligible: true,
        eligible_supplier_types: ['LOCAL_SME', 'REGIONAL_CONTRACTOR', 'SPECIALIST_CONTRACTOR', 'NATIONAL_CONTRACTOR'],
        benefits: ['Full CAFM document vault', 'Automated ticket expiry tracking', 'Verified Network Partner Badge', 'Event priority booking'],
        effective_date: '2026-01-01',
      },
      {
        id: 'prod-mem-partner',
        internal_id: 'MEM-PRT-02',
        public_name: 'Network Partner Membership',
        internal_name: 'Network Partner (£1,250/yr)',
        description: 'Extended multi-user portal seats, expanded regional coverage profiles, and event admission benefits.',
        category: 'SUPPLIER_MEMBERSHIP',
        price_gbp: 1250,
        vat_rate: 0.20,
        billing_frequency: 'ANNUAL',
        is_active: true,
        invoice_eligible: true,
        eligible_supplier_types: ['REGIONAL_CONTRACTOR', 'NATIONAL_CONTRACTOR', 'SPECIALIST_CONTRACTOR'],
        benefits: ['5 Portal User Seats', 'Expanded multi-region profile', '2 Free Technical Breakfast Tickets', 'Supplier Spotlight Feature'],
        effective_date: '2026-01-01',
      },
      {
        id: 'prod-fee-assurance',
        internal_id: 'FEE-ASSUR-01',
        public_name: 'Initial Supplier Assurance Review',
        internal_name: 'Stage 1 Due Diligence Assessment',
        description: 'Comprehensive compliance, insurance broker verification, and H&S technical audit assessment.',
        category: 'ASSURANCE_REVIEW',
        price_gbp: 350,
        vat_rate: 0.20,
        billing_frequency: 'ONE_OFF',
        is_active: true,
        invoice_eligible: true,
        eligible_supplier_types: ['ALL'],
        benefits: ['Independent audit sign-off', 'Direct broker insurance check', 'SSIP equivalence review'],
        effective_date: '2026-01-01',
      },
      {
        id: 'prod-oem-industry',
        internal_id: 'PRT-OEM-IND',
        public_name: 'Industry Partner Package (OEM / Technology)',
        internal_name: 'OEM Annual Industry Partner',
        description: 'Technical education series, product demonstration showcase, CAFM telemetry integration, and roundtables.',
        category: 'INDUSTRY_PARTNERSHIP',
        price_gbp: 3500,
        vat_rate: 0.20,
        billing_frequency: 'ANNUAL',
        is_active: true,
        invoice_eligible: true,
        eligible_supplier_types: ['MANUFACTURER', 'OEM', 'TECHNOLOGY_PROVIDER'],
        benefits: ['Meet the Manufacturer Hosting', 'CAFM Telemetry Collaboration', 'Executive Procurement Roundtable', 'Technical Whitepaper Feature'],
        effective_date: '2026-01-01',
      },
    ];

    for (const p of products) {
      this.products.set(p.id, p);
    }
  }

  private seedDefaultEvents() {
    const events: PartnerEventRecord[] = [
      {
        id: 'evt-001',
        slug: 'meet-the-supplier-sheffield-2026',
        title: 'Meet the Supplier Forum: Commercial Engineering & HVAC',
        event_type: 'MEET_THE_SUPPLIER',
        description: 'Annual EntireFM convening of approved regional M&E contractors, HVAC engineers, and estates directors.',
        venue_name: 'EntireFM Headquarters Auditorium',
        venue_address: 'Sheffield Commercial Centre, S9 2TT',
        event_date: '2026-10-15',
        start_time: '09:00',
        end_time: '14:30',
        capacity: 120,
        registered_count: 42,
        status: 'REGISTRATION_OPEN',
        is_public: true,
        is_ticketed: true,
        host_name: 'EntireFM Leadership & Procurement Team',
        event_owner: 'Commercial Director',
        registration_open_date: '2026-08-01',
        registration_close_date: '2026-10-10',
        products: [
          { product_id: 'tkt-standard', product_name: 'Supplier Attendee Ticket', ticket_type: 'ATTENDEE', price_gbp: 75, capacity_limit: 80, sold_count: 32 },
          { product_id: 'tkt-exhibitor', product_name: 'Exhibitor Stand Package', ticket_type: 'EXHIBITOR', price_gbp: 450, capacity_limit: 10, sold_count: 4 },
          { product_id: 'spn-headline', product_name: 'Headline Forum Sponsor', ticket_type: 'SPONSOR', price_gbp: 1500, capacity_limit: 2, sold_count: 1 },
        ],
        agenda: [
          { time: '09:00', topic: 'Registration, Coffee & Networking', speaker: 'EntireFM Welcome Desk' },
          { time: '10:00', topic: 'Future of Commercial PPM & Decarbonisation', speaker: 'Technical Director' },
          { time: '11:30', topic: 'CAFM Telemetry & Predictive Work Orders', speaker: 'Head of Technology' },
          { time: '13:00', topic: 'Networking Lunch & Exhibitor Showcase' },
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'evt-002',
        slug: 'meet-the-manufacturer-controls-2026',
        title: 'Meet the Manufacturer: Smart Building Controls & Telemetry',
        event_type: 'MEET_THE_MANUFACTURER',
        description: 'Technical education session featuring leading BMS and sensor OEMs demonstrating live telemetry integrations.',
        venue_name: 'Manchester Digital Innovation Centre',
        venue_address: 'Oxford Road, Manchester, M1 7ED',
        event_date: '2026-11-12',
        start_time: '08:30',
        end_time: '12:00',
        capacity: 80,
        registered_count: 18,
        status: 'REGISTRATION_OPEN',
        is_public: true,
        is_ticketed: true,
        host_name: 'EntireFM & Schneider Electric',
        event_owner: 'Procurement & Engineering Desk',
        registration_open_date: '2026-08-15',
        registration_close_date: '2026-11-08',
        products: [
          { product_id: 'tkt-mfg-att', product_name: 'Technical Breakfast Attendee', ticket_type: 'ATTENDEE', price_gbp: 45, capacity_limit: 60, sold_count: 15 },
          { product_id: 'tkt-mfg-spn', product_name: 'Breakfast Sponsor', ticket_type: 'SPONSOR', price_gbp: 750, capacity_limit: 2, sold_count: 1 },
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    for (const e of events) {
      this.events.set(e.id, e);
    }
  }
}

export const partnerCommercialStore = new MemoryPartnerCommercialStore();

/**
 * List all commercial products
 */
export async function listCommercialProducts(category?: string, activeOnly: boolean = false): Promise<CommercialProduct[]> {
  let list = Array.from(partnerCommercialStore.products.values());
  if (category) list = list.filter((p) => p.category === category);
  if (activeOnly) list = list.filter((p) => p.is_active);
  return list;
}

/**
 * Save or update commercial product
 */
export async function saveCommercialProduct(product: Partial<CommercialProduct> & { public_name: string; price_gbp: number }): Promise<CommercialProduct> {
  const id = product.id || `prod-${Date.now()}`;
  const record: CommercialProduct = {
    id,
    internal_id: product.internal_id || `PRD-${Date.now()}`,
    public_name: product.public_name,
    internal_name: product.internal_name || product.public_name,
    description: product.description || '',
    category: product.category || 'SUPPLIER_MEMBERSHIP',
    price_gbp: product.price_gbp,
    vat_rate: product.vat_rate ?? 0.20,
    billing_frequency: product.billing_frequency || 'ANNUAL',
    is_active: product.is_active ?? true,
    stripe_product_id: product.stripe_product_id,
    stripe_price_id: product.stripe_price_id,
    invoice_eligible: product.invoice_eligible ?? true,
    eligible_supplier_types: product.eligible_supplier_types || ['ALL'],
    benefits: product.benefits || [],
    effective_date: product.effective_date || new Date().toISOString(),
  };
  partnerCommercialStore.products.set(id, record);
  return record;
}

/**
 * List memberships
 */
export async function listPartnerMemberships(status?: string): Promise<PartnerMembershipRecord[]> {
  let list = Array.from(partnerCommercialStore.memberships.values());
  if (status) list = list.filter((m) => m.membership_status === status);
  return list;
}

/**
 * Get membership for a supplier
 */
export async function getSupplierMembership(supplierId: string): Promise<PartnerMembershipRecord | null> {
  return Array.from(partnerCommercialStore.memberships.values()).find((m) => m.supplier_id === supplierId) || null;
}

/**
 * Assign or update membership
 */
export async function assignSupplierMembership(data: {
  supplier_id: string;
  supplier_name: string;
  product_id: string;
  is_complimentary?: boolean;
  waiver_reason?: string;
  discount_pct?: number;
  payment_method?: any;
  admin_owner?: string;
}): Promise<PartnerMembershipRecord> {
  const product = partnerCommercialStore.products.get(data.product_id);
  const now = new Date();
  const oneYearLater = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

  const price = data.is_complimentary ? 0 : (product?.price_gbp || 0) * (1 - (data.discount_pct || 0) / 100);
  const vat = price * (product?.vat_rate ?? 0.20);
  const total = price + vat;

  const id = `mem-${data.supplier_id}`;
  const record: PartnerMembershipRecord = {
    id,
    supplier_id: data.supplier_id,
    supplier_name: data.supplier_name,
    product_id: data.product_id,
    product_name: product?.public_name || 'Network Membership',
    membership_status: data.is_complimentary ? 'COMPLIMENTARY' : (price === 0 ? 'REGISTERED' : 'ACTIVE'),
    price_gbp: price,
    vat_gbp: vat,
    total_gbp: total,
    billing_frequency: product?.billing_frequency || 'ANNUAL',
    payment_method: data.payment_method || 'INVOICE',
    start_date: now.toISOString(),
    renewal_date: oneYearLater.toISOString(),
    auto_renew: true,
    is_complimentary: Boolean(data.is_complimentary),
    waiver_reason: data.waiver_reason,
    discount_pct: data.discount_pct,
    admin_owner: data.admin_owner || 'Commercial Desk',
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };

  partnerCommercialStore.memberships.set(id, record);
  return record;
}

/**
 * List Invoices
 */
export async function listPartnerInvoices(options: { supplierId?: string; status?: string } = {}): Promise<PartnerInvoiceRecord[]> {
  let list = Array.from(partnerCommercialStore.invoices.values());
  if (options.supplierId) list = list.filter((i) => i.supplier_id === options.supplierId);
  if (options.status) list = list.filter((i) => i.status === options.status);
  return list.sort((a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime());
}

/**
 * Issue new invoice
 */
export async function issuePartnerInvoice(data: {
  supplier_id: string;
  supplier_name: string;
  line_items: { description: string; quantity: number; unit_price_gbp: number; vat_rate: number; product_id?: string }[];
  payment_terms?: any;
  po_reference?: string;
  membership_id?: string;
  event_id?: string;
  admin_owner?: string;
}): Promise<PartnerInvoiceRecord> {
  const count = partnerCommercialStore.invoices.size + 1;
  const invoiceNumber = `EFM-PN-2026-${count.toString().padStart(4, '0')}`;
  const now = new Date();
  const dueDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days default

  let subtotal = 0;
  let vatTotal = 0;

  const items = data.line_items.map((it, idx) => {
    const net = it.quantity * it.unit_price_gbp;
    const vat = net * it.vat_rate;
    subtotal += net;
    vatTotal += vat;
    return {
      id: `li-${idx + 1}`,
      description: it.description,
      quantity: it.quantity,
      unit_price_gbp: it.unit_price_gbp,
      vat_rate: it.vat_rate,
      net_amount_gbp: net,
      vat_amount_gbp: vat,
      total_amount_gbp: net + vat,
      product_id: it.product_id,
    };
  });

  const total = subtotal + vatTotal;
  const id = `inv-${Date.now()}`;

  const record: PartnerInvoiceRecord = {
    id,
    invoice_number: invoiceNumber,
    supplier_id: data.supplier_id,
    supplier_name: data.supplier_name,
    billing_profile: {
      id: `bp-${data.supplier_id}`,
      supplier_id: data.supplier_id,
      legal_billing_name: data.supplier_name,
      billing_address: 'Commercial Hub, UK',
      billing_city: 'Sheffield',
      billing_postcode: 'S9 2TT',
      billing_contact_name: 'Finance Desk',
      billing_contact_email: 'accounts@supplier.example.co.uk',
      po_required: Boolean(data.po_reference),
      default_po_number: data.po_reference,
      default_payment_method: 'INVOICE',
      invoice_terms: data.payment_terms || '30_DAYS',
      currency: 'GBP',
    },
    issue_date: now.toISOString(),
    due_date: dueDate.toISOString(),
    status: 'ISSUED',
    payment_terms: data.payment_terms || '30_DAYS',
    line_items: items,
    subtotal_gbp: subtotal,
    vat_total_gbp: vatTotal,
    total_gbp: total,
    amount_paid_gbp: 0,
    amount_outstanding_gbp: total,
    payment_method: 'INVOICE',
    po_reference: data.po_reference,
    membership_id: data.membership_id,
    event_id: data.event_id,
    admin_owner: data.admin_owner || 'Finance Desk',
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };

  partnerCommercialStore.invoices.set(id, record);
  return record;
}

/**
 * Record payment against invoice
 */
export async function recordPartnerPayment(data: {
  invoice_id: string;
  amount_gbp: number;
  payment_method: any;
  bank_transaction_reference?: string;
  stripe_charge_id?: string;
  recorded_by: string;
  notes?: string;
}): Promise<{ success: boolean; invoice?: PartnerInvoiceRecord; error?: string }> {
  const invoice = partnerCommercialStore.invoices.get(data.invoice_id);
  if (!invoice) return { success: false, error: 'Invoice not found' };

  const paymentId = `pay-${Date.now()}`;
  const now = new Date().toISOString();

  const paymentRecord: PartnerPaymentRecord = {
    id: paymentId,
    payment_reference: `PAY-EFM-${Date.now().toString().slice(-6)}`,
    invoice_id: invoice.id,
    invoice_number: invoice.invoice_number,
    supplier_id: invoice.supplier_id,
    supplier_name: invoice.supplier_name,
    amount_gbp: data.amount_gbp,
    payment_method: data.payment_method,
    payment_date: now,
    bank_transaction_reference: data.bank_transaction_reference,
    stripe_charge_id: data.stripe_charge_id,
    recorded_by: data.recorded_by,
    status: 'SETTLED',
    notes: data.notes,
  };

  partnerCommercialStore.payments.set(paymentId, paymentRecord);

  // Update invoice
  invoice.amount_paid_gbp += data.amount_gbp;
  invoice.amount_outstanding_gbp = Math.max(0, invoice.total_gbp - invoice.amount_paid_gbp);
  if (invoice.amount_outstanding_gbp === 0) {
    invoice.status = 'PAID';
    invoice.paid_at = now;
  } else {
    invoice.status = 'PART_PAID';
  }
  invoice.updated_at = now;

  partnerCommercialStore.invoices.set(invoice.id, invoice);
  return { success: true, invoice };
}

/**
 * List events
 */
export async function listPartnerEvents(publicOnly: boolean = false): Promise<PartnerEventRecord[]> {
  let list = Array.from(partnerCommercialStore.events.values());
  if (publicOnly) list = list.filter((e) => e.is_public && e.status !== 'CANCELLED');
  return list.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
}

/**
 * Commercial Dashboard Metrics Aggregator
 */
export async function getCommercialDashboardMetrics(): Promise<CommercialDashboardMetrics> {
  const memberships = Array.from(partnerCommercialStore.memberships.values());
  const invoices = Array.from(partnerCommercialStore.invoices.values());
  const payments = Array.from(partnerCommercialStore.payments.values());

  const activeMemberships = memberships.filter((m) => m.membership_status === 'ACTIVE');
  const arr = activeMemberships.reduce((acc, m) => acc + m.price_gbp, 0);

  const now = new Date();
  const thirtyDaysAhead = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const dueRenewals = memberships.filter((m) => {
    const ren = new Date(m.renewal_date);
    return ren >= now && ren <= thirtyDaysAhead;
  }).length;

  const unpaidInvoices = invoices.filter((i) => i.status === 'ISSUED' || i.status === 'SENT' || i.status === 'DUE' || i.status === 'OVERDUE');
  const outstandingTotal = unpaidInvoices.reduce((acc, i) => acc + i.amount_outstanding_gbp, 0);

  const overdueInvoices = invoices.filter((i) => i.status === 'OVERDUE' || (new Date(i.due_date) < now && i.amount_outstanding_gbp > 0));
  const overdueTotal = overdueInvoices.reduce((acc, i) => acc + i.amount_outstanding_gbp, 0);

  const thisMonthPayments = payments.reduce((acc, p) => acc + p.amount_gbp, 0);

  return {
    activePayingSuppliers: activeMemberships.length,
    annualRecurringRevenueGbp: arr,
    membershipsDueRenewalCount: dueRenewals,
    outstandingInvoicesCount: unpaidInvoices.length,
    outstandingInvoicesValueGbp: outstandingTotal,
    overdueInvoicesCount: overdueInvoices.length,
    overdueInvoicesValueGbp: overdueTotal,
    paymentsThisMonthGbp: thisMonthPayments,
    eventRevenueYtdGbp: 4250,
    sponsorshipRevenueYtdGbp: 2250,
    industryPartnerRevenueYtdGbp: 3500,
    failedPaymentsCount: memberships.filter((m) => m.membership_status === 'PAYMENT_FAILED').length,
    complimentaryMembershipsCount: memberships.filter((m) => m.is_complimentary).length,
    totalDiscountsGrantedGbp: 0,
  };
}
