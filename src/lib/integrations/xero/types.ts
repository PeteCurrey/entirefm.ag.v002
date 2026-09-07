/**
 * ENTIREFM XERO INTEGRATION DOMAIN TYPES
 * =====================================
 * Canonical TypeScript interfaces for Xero OAuth 2.0, granular accounting
 * models, synchronisation results, webhook events, and token lifecycle.
 */

export type XeroConnectionStatus =
  | 'CONNECTED'
  | 'DISCONNECTED'
  | 'ERROR'
  | 'PENDING_AUTH'
  | 'EXPIRED';

export interface XeroConnectionRecord {
  id: string;
  organisation_id: string;
  xero_tenant_id: string;
  xero_tenant_name: string;
  status: XeroConnectionStatus;
  authorised_by_person_id?: string;
  scopes_granted: string[];
  token_type: string;
  encrypted_access_token: string;
  encrypted_refresh_token: string;
  token_iv: string;
  token_auth_tag: string;
  expires_at: string;
  last_successful_sync_at?: string;
  last_failed_sync_at?: string;
  last_error?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface XeroTokenSet {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  tokenType: string;
  scope: string;
  idToken?: string;
}

export interface XeroTenant {
  id: string;
  authEventId: string;
  tenantId: string;
  tenantType: string;
  tenantName: string;
  createdDateUtc: string;
  updatedDateUtc: string;
}

export interface XeroAddress {
  AddressType: 'POBOX' | 'STREET' | 'DELIVERY';
  AddressLine1?: string;
  AddressLine2?: string;
  City?: string;
  Region?: string;
  PostalCode?: string;
  Country?: string;
  AttentionTo?: string;
}

export interface XeroPhone {
  PhoneType: 'DEFAULT' | 'DDI' | 'MOBILE' | 'FAX';
  PhoneNumber?: string;
  PhoneAreaCode?: string;
  PhoneCountryCode?: string;
}

export interface XeroContact {
  ContactID?: string;
  ContactNumber?: string;
  AccountNumber?: string;
  ContactStatus?: 'ACTIVE' | 'ARCHIVED' | 'GDPRREQUEST';
  Name: string;
  FirstName?: string;
  LastName?: string;
  EmailAddress?: string;
  Phones?: XeroPhone[];
  Addresses?: XeroAddress[];
  TaxNumber?: string;
  CompanyNumber?: string;
  UpdatedDateUTC?: string;
}

export interface XeroLineItem {
  LineItemID?: string;
  Description: string;
  Quantity: number;
  UnitAmount: number;
  ItemCode?: string;
  AccountCode?: string;
  TaxType?: string;
  TaxAmount?: number;
  LineAmount?: number;
}

export type XeroInvoiceType = 'ACCREC' | 'ACCPAY';

export type XeroInvoiceStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'AUTHORISED'
  | 'PAID'
  | 'VOIDED'
  | 'DELETED';

export type XeroLineAmountType = 'Exclusive' | 'Inclusive' | 'NoTax';

export interface XeroInvoice {
  InvoiceID?: string;
  InvoiceNumber?: string;
  Reference?: string;
  Type: XeroInvoiceType;
  Contact: {
    ContactID?: string;
    Name?: string;
  };
  LineItems: XeroLineItem[];
  Date: string; // YYYY-MM-DD
  DueDate: string; // YYYY-MM-DD
  LineAmountTypes: XeroLineAmountType;
  Status: XeroInvoiceStatus;
  SubTotal?: number;
  TotalTax?: number;
  Total?: number;
  AmountDue?: number;
  AmountPaid?: number;
  CurrencyCode?: string;
  UpdatedDateUTC?: string;
  Payments?: XeroPaymentSummary[];
}

export interface XeroPaymentSummary {
  PaymentID: string;
  Date: string;
  Amount: number;
  Reference?: string;
  Status?: string;
}

export interface XeroPayment {
  PaymentID?: string;
  Invoice: {
    InvoiceID: string;
    InvoiceNumber?: string;
  };
  Account: {
    AccountID?: string;
    Code?: string;
  };
  Date: string; // YYYY-MM-DD
  Amount: number;
  CurrencyRate?: number;
  Reference?: string;
  PaymentType?: 'ACCRECPAYMENT' | 'ACCPAYPAYMENT';
  Status?: 'AUTHORISED' | 'DELETED';
  UpdatedDateUTC?: string;
}

export interface XeroAttachment {
  AttachmentID: string;
  FileName: string;
  Url: string;
  MimeType: string;
  ContentLength: number;
}

// Webhook Types (Phase 1 Readiness)
export interface XeroWebhookEvent {
  resourceUrl: string;
  resourceId: string;
  eventDateUtc: string;
  eventType: 'CREATE' | 'UPDATE';
  eventCategory: 'INVOICE' | 'CONTACT';
  tenantId: string;
  tenantType: string;
}

export interface XeroWebhookPayload {
  events: XeroWebhookEvent[];
  firstEventSequence: number;
  lastEventSequence: number;
  entropy: string;
}

export interface XeroWebhookProcessingResult {
  accepted: boolean;
  receivedCount: number;
  processedCount: number;
  ignoredCount: number;
  failedCount: number;
  errors: string[];
}

// Tax & Chart of Accounts Types
export type CafmTaxTreatment =
  | 'STANDARD_VAT' // 20% UK standard rate
  | 'REDUCED_VAT'  // 5% UK reduced rate
  | 'ZERO_RATED'   // 0% UK zero rate
  | 'EXEMPT'       // Exempt from VAT
  | 'OUT_OF_SCOPE'; // Out of scope / outside EU/UK VAT

export interface XeroTaxRate {
  Name: string;
  TaxType: string;
  Status: 'ACTIVE' | 'DELETED' | 'ARCHIVED';
  ReportTaxType?: string;
  CanApplyToAssets?: boolean;
  CanApplyToEquity?: boolean;
  CanApplyToExpenses?: boolean;
  CanApplyToLiabilities?: boolean;
  CanApplyToRevenue: boolean;
  DisplayTaxRate?: number;
  EffectiveRate: number;
}

export interface XeroAccount {
  AccountID: string;
  Code: string;
  Name: string;
  Type: string;
  Status: 'ACTIVE' | 'ARCHIVED' | string;
  TaxType?: string;
  Description?: string;
  Class?: 'ASSET' | 'EQUITY' | 'EXPENSE' | 'LIABILITY' | 'REVENUE' | string;
  EnablePaymentsToAccount?: boolean;
}

// Synchronisation Results & Stats
export type XeroTaxType = 'OUTPUT2' | 'NONE' | 'CAPEXINPUT' | 'INPUT2' | 'ZERORATEDOUTPUT' | string;

export interface XeroSyncStats {
  invoicesSynced: number;
  paymentsSynced: number;
  contactsSynced: number;
  lastSyncAt: string | null;
  lastSuccessfulSyncAt: string | null;
  lastFailedSyncAt: string | null;
  lastError: string | null;
}

export interface XeroSyncError {
  entityType?: string;
  entityId?: string;
  message: string;
}

export interface XeroSyncResult {
  success: boolean;
  syncedAt: string;
  contactsProcessed: number;
  contactsCreated: number;
  contactsUpdated: number;
  invoicesProcessed: number;
  invoicesSynced: number;
  invoicesFailed: number;
  paymentsReconciled: number;
  paymentsUpdated: number;
  errors: Array<string | XeroSyncError>;
  completedAt?: string;
}
