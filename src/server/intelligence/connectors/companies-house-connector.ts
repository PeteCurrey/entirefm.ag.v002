/**
 * ENTIREFM LIVE INTELLIGENCE PLATFORM — COMPANIES HOUSE CONNECTOR
 * ================================================================
 * Server-only client for the official UK Companies House REST API.
 * Uses COMPANIES_HOUSE_API_KEY (Basic Auth).
 * Resolves contractor entities, verified company numbers, and filing status.
 */

import type { CompanyEntity } from '../types';

export interface CompaniesHouseSearchItem {
  company_number: string;
  title: string;
  company_status: string;
  date_of_creation?: string;
  address_snippet?: string;
  sic_codes?: string[];
  links?: {
    self: string;
  };
}

export class CompaniesHouseConnector {
  private baseUrl = 'https://api.company-information.service.gov.uk';
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.COMPANIES_HOUSE_API_KEY;
  }

  public isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  /** Search company by name */
  public async searchCompany(query: string): Promise<CompanyEntity | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const url = new URL(`${this.baseUrl}/search/companies`);
      url.searchParams.set('q', query);
      url.searchParams.set('items_per_page', '1');

      // Companies House uses Basic Auth with the API key as the username and an empty password
      const authHeader = `Basic ${Buffer.from(`${this.apiKey}:`).toString('base64')}`;

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: authHeader,
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!res.ok) {
        return null;
      }

      const data = await res.json();
      const item: CompaniesHouseSearchItem = data.items?.[0];
      if (!item) return null;

      return {
        id: `co-${item.company_number}`,
        companyNumber: item.company_number,
        companyName: item.title,
        status: item.company_status === 'active' ? 'active' : item.company_status === 'dissolved' ? 'dissolved' : 'unverified',
        incorporationDate: item.date_of_creation,
        registeredOfficeAddress: item.address_snippet,
        sicCodes: item.sic_codes || [],
        isVerified: true,
        contractWinsCount: 0,
        totalPublicContractValue: '£0',
        recentAwards: [],
      };
    } catch {
      return null;
    }
  }

  /** Get specific company profile by company number */
  public async getCompanyProfile(companyNumber: string): Promise<Record<string, unknown> | null> {
    if (!this.isAvailable()) return null;

    try {
      const authHeader = `Basic ${Buffer.from(`${this.apiKey}:`).toString('base64')}`;
      const res = await fetch(`${this.baseUrl}/company/${companyNumber}`, {
        headers: {
          Authorization: authHeader,
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
}

export const companiesHouseConnector = new CompaniesHouseConnector();
