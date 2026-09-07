/**
 * ENTIREFM XERO TAX INTEGRITY & RESOLUTION SERVICE
 * ==================================================
 * Provides dynamic tax-rate discovery, stable internal CAFM tax treatment mapping,
 * and strict pre-sync validation gates to prevent incorrect sales tax codes on ACCREC invoices.
 *
 * Guarantees:
 * - Connected Xero organisation is the authoritative source for available tax rates.
 * - Only rates with CanApplyToRevenue === true and Status === 'ACTIVE' can be used on sales invoices.
 * - Input/purchase/capital tax codes (e.g. CAPEXINPUT, INPUT2) are strictly rejected.
 * - Unknown or inactive tax rates reject sync with XERO_TAX_MAPPING_REQUIRED.
 * - Silent substitution of tax rates is prohibited.
 */

import { XeroClient } from './client';
import { XeroApiError } from './errors';
import type { CafmTaxTreatment, XeroTaxRate } from './types';

// In-memory cache for discovered tax rates per Xero tenant (TTL: 1 hour)
interface CachedTaxRates {
  rates: XeroTaxRate[];
  fetchedAt: number;
}

const taxRateCache = new Map<string, CachedTaxRates>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Maps a numeric VAT rate percentage (or explicit CAFM treatment) to the internal stable representation.
 */
export function determineCafmTaxTreatment(
  taxRatePct: number,
  explicitTreatment?: CafmTaxTreatment
): CafmTaxTreatment {
  if (explicitTreatment) return explicitTreatment;

  const rounded = Math.round(taxRatePct * 100) / 100;
  if (rounded === 20) return 'STANDARD_VAT';
  if (rounded === 5) return 'REDUCED_VAT';
  if (rounded === 0) return 'ZERO_RATED';

  // Unknown numeric percentage cannot be guessed
  throw new XeroApiError(
    400,
    `XERO_TAX_MAPPING_REQUIRED: Unsupported VAT percentage ${taxRatePct}%. Cannot determine statutory tax treatment without explicit classification.`
  );
}

/**
 * Discovers the actual available tax rates from the connected Xero organisation.
 * Uses cached rates if fresh, otherwise calls GET /api.xro/2.0/TaxRates.
 */
export async function getOrganisationTaxRates(
  client: XeroClient,
  forceRefresh = false
): Promise<XeroTaxRate[]> {
  const tenantId = client.tenantId;
  const now = Date.now();

  if (!forceRefresh && taxRateCache.has(tenantId)) {
    const cached = taxRateCache.get(tenantId)!;
    if (now - cached.fetchedAt < CACHE_TTL_MS) {
      return cached.rates;
    }
  }

  try {
    const response = await client.get<{ TaxRates: XeroTaxRate[] }>('TaxRates');
    const rates = response?.TaxRates || [];

    taxRateCache.set(tenantId, {
      rates,
      fetchedAt: now,
    });

    return rates;
  } catch (err: any) {
    // If rate limit or network error, fallback to cached if present
    if (taxRateCache.has(tenantId)) {
      return taxRateCache.get(tenantId)!.rates;
    }
    throw new XeroApiError(
      500,
      `Failed to discover tax rates from Xero organisation: ${err?.message || err}`
    );
  }
}

/**
 * Resolves the appropriate sales tax code for a given CAFM tax treatment against
 * the connected Xero organisation's real tax configuration.
 *
 * Strictly enforces that the resolved tax rate is active and can apply to revenue.
 */
export function resolveSalesTaxRate(
  treatment: CafmTaxTreatment,
  availableRates: XeroTaxRate[]
): XeroTaxRate {
  // 1. Filter to active revenue rates
  const salesRates = availableRates.filter(
    (r) => r.Status === 'ACTIVE' && r.CanApplyToRevenue === true
  );

  if (salesRates.length === 0) {
    throw new XeroApiError(
      400,
      'XERO_TAX_MAPPING_REQUIRED: The connected Xero organisation has no active sales tax rates enabled for revenue.'
    );
  }

  let matched: XeroTaxRate | undefined;

  switch (treatment) {
    case 'STANDARD_VAT': {
      // Look for standard 20% output rate (typically OUTPUT2 or 20% on Income)
      matched = salesRates.find(
        (r) =>
          r.TaxType === 'OUTPUT2' ||
          (Math.abs(r.EffectiveRate - 20) < 0.01 && r.ReportTaxType === 'OUTPUT') ||
          (r.Name.toLowerCase().includes('20%') && r.Name.toLowerCase().includes('income'))
      );
      break;
    }

    case 'REDUCED_VAT': {
      // Look for 5% reduced output rate (typically REDUCEDOUTPUT or 5% on Income)
      // NEVER match purchase/capital input codes like CAPEXINPUT!
      matched = salesRates.find(
        (r) =>
          (r.TaxType === 'REDUCEDOUTPUT' || (Math.abs(r.EffectiveRate - 5) < 0.01 && r.ReportTaxType === 'OUTPUT')) &&
          !r.TaxType.includes('INPUT')
      );
      break;
    }

    case 'ZERO_RATED': {
      // Look for 0% zero-rated income (typically ZERORATEDOUTPUT)
      matched = salesRates.find(
        (r) =>
          r.TaxType === 'ZERORATEDOUTPUT' ||
          (r.EffectiveRate === 0 && r.Name.toLowerCase().includes('zero') && r.ReportTaxType === 'OUTPUT')
      );
      break;
    }

    case 'EXEMPT': {
      // Look for exempt income (typically EXEMPTOUTPUT)
      matched = salesRates.find(
        (r) =>
          r.TaxType === 'EXEMPTOUTPUT' ||
          (r.EffectiveRate === 0 && r.Name.toLowerCase().includes('exempt') && r.ReportTaxType === 'OUTPUT')
      );
      break;
    }

    case 'OUT_OF_SCOPE': {
      // Look for out of scope / no tax (typically NONE or NO_VAT)
      matched = salesRates.find(
        (r) =>
          r.TaxType === 'NONE' ||
          (r.EffectiveRate === 0 && (r.Name.toLowerCase().includes('no vat') || r.Name.toLowerCase().includes('scope')))
      );
      break;
    }
  }

  if (!matched) {
    const availableSummaries = salesRates
      .map((r) => `${r.Name} (${r.TaxType}, ${r.EffectiveRate}%)`)
      .join(', ');

    throw new XeroApiError(
      400,
      `XERO_TAX_MAPPING_REQUIRED: No valid sales tax rate found in Xero for ${treatment}. Available sales rates: [${availableSummaries}]. Never substitute an input or capital purchase tax code.`
    );
  }

  // Pre-sync validation gate
  validateSalesTaxRate(matched);

  return matched;
}

/**
 * Validates that a tax rate is suitable for ACCREC sales invoices.
 * Throws XeroApiError if invalid.
 */
export function validateSalesTaxRate(rate: XeroTaxRate): void {
  if (rate.Status !== 'ACTIVE') {
    throw new XeroApiError(
      400,
      `XERO_TAX_MAPPING_REQUIRED: Tax rate '${rate.Name}' (${rate.TaxType}) is inactive in the connected Xero organisation.`
    );
  }

  if (!rate.CanApplyToRevenue) {
    throw new XeroApiError(
      400,
      `XERO_TAX_MAPPING_REQUIRED: Tax rate '${rate.Name}' (${rate.TaxType}) cannot be applied to revenue/sales. It is designated for expenses or assets.`
    );
  }

  // Explicitly guard against purchase / capital / input codes
  const upperType = rate.TaxType.toUpperCase();
  if (
    upperType.includes('INPUT') ||
    upperType.includes('CAPEX') ||
    upperType.includes('PURCHASE') ||
    upperType.startsWith('RRINPUT')
  ) {
    throw new XeroApiError(
      400,
      `XERO_TAX_MAPPING_REQUIRED: Input/Purchase tax code '${rate.TaxType}' cannot be used on ACCREC sales invoices.`
    );
  }
}
