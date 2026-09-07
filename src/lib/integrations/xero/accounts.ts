/**
 * ENTIREFM XERO CHART OF ACCOUNTS RESOLUTION SERVICE
 * ====================================================
 * Discovers and validates revenue account codes for sales invoice line items.
 *
 * Guarantees:
 * - Line items explicitly specify a valid active REVENUE account code.
 * - Does not rely on unstated or missing Xero UI defaults.
 * - Validates that the specified account exists in the connected organisation.
 * - Allows per-client or per-tenant account code configuration.
 * - If resolution fails, rejects sync with XERO_ACCOUNT_MAPPING_REQUIRED.
 */

import { XeroClient } from './client';
import { XeroApiError } from './errors';
import type { XeroAccount } from './types';

interface CachedAccounts {
  accounts: XeroAccount[];
  fetchedAt: number;
}

const accountsCache = new Map<string, CachedAccounts>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Discovers all active revenue and income accounts from the connected Xero organisation.
 */
export async function getOrganisationRevenueAccounts(
  client: XeroClient,
  forceRefresh = false
): Promise<XeroAccount[]> {
  const tenantId = client.tenantId;
  const now = Date.now();

  if (!forceRefresh && accountsCache.has(tenantId)) {
    const cached = accountsCache.get(tenantId)!;
    if (now - cached.fetchedAt < CACHE_TTL_MS) {
      return cached.accounts;
    }
  }

  try {
    const response = await client.get<{ Accounts: XeroAccount[] }>('Accounts', {
      where: 'Type=="REVENUE" OR Type=="OTHERINCOME"',
    });

    const accounts = response?.Accounts?.filter((a) => a.Status === 'ACTIVE') || [];

    accountsCache.set(tenantId, {
      accounts,
      fetchedAt: now,
    });

    return accounts;
  } catch (err: any) {
    if (accountsCache.has(tenantId)) {
      return accountsCache.get(tenantId)!.accounts;
    }
    throw new XeroApiError(
      500,
      `Failed to fetch revenue accounts from Xero: ${err?.message || err}`
    );
  }
}

/**
 * Resolves and validates the appropriate revenue AccountCode for a sales line item.
 */
export async function resolveSalesAccountCode(params: {
  client: XeroClient;
  preferredCode?: string;
  availableAccounts?: XeroAccount[];
}): Promise<string> {
  const accounts =
    params.availableAccounts || (await getOrganisationRevenueAccounts(params.client));

  if (accounts.length === 0) {
    throw new XeroApiError(
      400,
      'XERO_ACCOUNT_MAPPING_REQUIRED: No active revenue accounts found in the connected Xero organisation. An active Sales/Revenue account is required.'
    );
  }

  // 1. Try preferred code (from client account or invoice config)
  const targetCode =
    params.preferredCode ||
    process.env.XERO_DEFAULT_SALES_ACCOUNT_CODE ||
    '200'; // Standard UK chart of accounts default for Sales

  const matched = accounts.find((a) => a.Code === targetCode);
  if (matched) {
    return matched.Code;
  }

  // 2. If target code not found, look for an account named 'Sales' or 'Revenue'
  const salesNamed = accounts.find(
    (a) =>
      a.Name.toLowerCase() === 'sales' ||
      a.Name.toLowerCase() === 'revenue' ||
      a.Name.toLowerCase().includes('fee income')
  );

  if (salesNamed) {
    return salesNamed.Code;
  }

  // 3. If still not matched, reject with clear instructions
  const availableList = accounts.map((a) => `${a.Code} (${a.Name})`).join(', ');
  throw new XeroApiError(
    400,
    `XERO_ACCOUNT_MAPPING_REQUIRED: Specified revenue account code '${targetCode}' does not exist in the connected Xero organisation. Available revenue accounts: [${availableList}]. Configure a valid sales account in settings.`
  );
}
