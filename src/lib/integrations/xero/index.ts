/**
 * ENTIREFM XERO INTEGRATION — PUBLIC API
 * ========================================
 * Unified export barrel for all Xero integration modules.
 *
 * Import from this module for clean, stable imports:
 *   import { createAuthorizationUrl, syncInvoiceToXero, ... } from '@/lib/integrations/xero';
 */

// Types
export type {
  XeroConnectionRecord,
  XeroContact,
  XeroInvoice,
  XeroLineItem,
  XeroPayment as XeroPaymentRecord,
  XeroAttachment,
  XeroWebhookPayload,
  XeroWebhookEvent,
  XeroWebhookProcessingResult,
  XeroSyncResult,
  XeroLineAmountType,
  XeroTaxType,
} from './types';

// Errors
export {
  XeroAuthError,
  XeroScopeError,
  XeroRateLimitError,
  XeroApiError,
  XeroNetworkError,
  XeroWebhookError,
  redactSecrets,
} from './errors';

// Crypto
export {
  encryptToken,
  decryptToken,
  generateOAuthState,
  verifyXeroWebhookSignature,
} from './crypto';

// OAuth lifecycle
export {
  createAuthorizationUrl,
  handleAuthorizationCallback,
  getActiveConnection,
  refreshConnectionTokens,
  getValidAccessToken,
  disconnectXeroConnection,
} from './oauth';

// HTTP client
export { XeroClient } from './client';

// Data sync
export { syncClientToXeroContact } from './contacts';
export { syncInvoiceToXero, getInvoiceSyncStatus } from './invoices';
export type { InvoiceSyncResult, CafmSyncStatus } from './invoices';
export { reconcileInvoicePayment, reconcileAllPayments } from './payments';
export type { PaymentReconciliationResult } from './payments';
export { uploadInvoiceAttachment } from './attachments';
export type { AttachmentUploadResult } from './attachments';

// Tax & Chart of Accounts
export {
  getOrganisationTaxRates,
  determineCafmTaxTreatment,
  resolveSalesTaxRate,
  validateSalesTaxRate,
} from './tax';
export type { CafmTaxTreatment, XeroTaxRate } from './types';
export {
  getOrganisationRevenueAccounts,
  resolveSalesAccountCode,
} from './accounts';
export type { XeroAccount } from './types';

// Sync orchestrator
export { runXeroSync } from './sync';
export type { SyncRunOptions } from './sync';

// Webhook handler
export { validateWebhookRequest, processWebhookPayload } from './webhooks';
