/**
 * ENTIREFM CP-09R2 — LIVE AUTHORITATIVE INTELLIGENCE CONNECTORS
 * ===============================================================
 * Production-hardened external data ingestion connectors for:
 * 1. GOV.UK Search API (public, no key required)
 * 2. GOV.UK Content API (canonical metadata resolution)
 * 3. legislation.gov.uk Atom / XML Feeds (public, no key required)
 * 4. HSE Public Media Wire & Safety Alerts (public RSS, no key required)
 * 5. OPSS Product Safety Notices (public GOV.UK organisation feed)
 * 6. Contracts Finder OCDS API (public, no key required) — ADMIN ONLY
 * 7. Find a Tender OCDS API (public, no key required) — ADMIN ONLY
 * 8. Companies House REST API (live, authenticated via COMPANIES_HOUSE_API_KEY)
 * 9. Optional status connectors (Changedetection, SFG20, GNews)
 *
 * PROVENANCE & DEDUPLICATION:
 * - Full 64-character SHA-256 digest hashing
 * - Distinct Source Authenticity (OFFICIAL_SOURCE) vs Operational Interpretation (PENDING_REVIEW)
 * - Strict product boundary (Tenders are strictly internal Admin Tender Radar only)
 */

import crypto from 'crypto';
import type {
  NormalisedIntelligenceItem,
  TenderOpportunity,
  CompanyWatchRecord,
  IntelligenceEventType,
  IntelligenceSeverity,
} from '../intelligence-engine';
import type { UKJurisdiction, FMTradeCategory } from '../types';
import { classifyFMTrades } from '../fm-classifier';

/**
 * Full 64-character SHA-256 Hexadecimal Digest
 */
export function hashSha256(input: string): string {
  return crypto.createHash('sha256').update(input.trim()).digest('hex');
}

// ─────────────────────────────────────────────────────────────
// 1. GOV.UK SEARCH API CONNECTOR
// ─────────────────────────────────────────────────────────────

export interface GovUkSearchResult {
  items: NormalisedIntelligenceItem[];
  total: number;
  source: string;
}

export async function fetchGovUkSearch(
  topics: string[] = ['building safety', 'fire safety', 'f-gas', 'asbestos', 'electrical safety']
): Promise<GovUkSearchResult> {
  const allItems: NormalisedIntelligenceItem[] = [];
  const query = encodeURIComponent(topics.join(' OR '));
  const url = `https://www.gov.uk/api/search.json?q=${query}&count=15&order=-public_timestamp`;

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'EntireFM-Intelligence-Engine/1.0' },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`GOV.UK Search API returned ${res.status}`);
    const data: any = await res.json();

    const results = data.results || [];
    for (const r of results) {
      const canonicalUrl = r.link.startsWith('http') ? r.link : `https://www.gov.uk${r.link}`;
      const title = r.title || 'GOV.UK Regulatory Publication';
      const description = r.description || '';
      const contentHash = hashSha256(`${title}::${description}::${r.link}`);
      const classifiedTrades = classifyFMTrades(`${title} ${description}`);

      allItems.push({
        id: `govuk-search-${hashSha256(r.link).substring(0, 16)}`,
        externalId: r.link,
        contentHash,
        version: 1,
        title,
        entirefmSummary: description || `Official GOV.UK publication: ${title}. Refer to primary source for statutory provisions.`,
        whatChanged: undefined,
        suggestedContractorAction: 'Review publication relevance against your operational trade activities.',
        whyYoureSeeing: [],
        sourceId: 'src-govuk-search',
        sourceName: 'GOV.UK Search',
        canonicalUrl,
        authorityTier: 1,
        sourceAuthenticity: 'OFFICIAL_SOURCE',
        operationalInterpretation: 'PENDING_REVIEW',
        requiresHumanApproval: true,
        isMandatoryAction: false,
        legalStatus: 'ACOP_GUIDANCE',
        eventType: 'REGULATORY_CHANGE',
        severity: 'ACTION_MAY_BE_REQUIRED',
        jurisdictions: ['United Kingdom', 'England'],
        tradeTags: classifiedTrades.length > 0 ? classifiedTrades : ['building-safety'],
        credentialTags: [],
        workTypeTags: ['compliance', 'guidance'],
        publishedAt: r.public_timestamp || new Date().toISOString(),
        rightsLicence: 'Open Government Licence v3.0',
        parserVersion: '1.2.0',
        fetchedAt: new Date().toISOString(),
        rawSourceHash: contentHash,
        reviewStatus: 'PENDING_REVIEW', // Tier 1 awareness published, operational impact pending review
        linkedComplianceRequirementIds: [],
        audienceRoles: ['CONTRACTOR_ADMIN'],
        secondarySources: [],
      });
    }

    return { items: allItems, total: data.total || allItems.length, source: 'GOV.UK Search' };
  } catch (err: any) {
    console.error('[GOV.UK Search Connector Error]:', err.message);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
// 2. GOV.UK CONTENT API CONNECTOR (CANONICAL RESOLUTION)
// ─────────────────────────────────────────────────────────────

export interface GovUkContentDetails {
  contentId: string;
  basePath: string;
  title: string;
  description: string;
  documentType: string;
  publishingApp: string;
  firstPublishedAt: string;
  publicUpdatedAt: string;
  withdrawn: boolean;
  contentHash: string;
}

export async function fetchGovUkContent(basePath: string): Promise<NormalisedIntelligenceItem | null> {
  const cleanPath = basePath.startsWith('/') ? basePath : `/${basePath}`;
  const url = `https://www.gov.uk/api/content${cleanPath}`;

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'EntireFM-Intelligence-Engine/1.0' },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`GOV.UK Content API returned ${res.status}`);
    }

    const data: any = await res.json();
    const title = data.title || 'GOV.UK Guidance';
    const description = data.description || '';
    const contentHash = hashSha256(`${title}::${description}::${data.updated_at || data.first_published_at}`);
    const classifiedTrades = classifyFMTrades(`${title} ${description}`);

    return {
      id: `govuk-content-${hashSha256(cleanPath).substring(0, 16)}`,
      externalId: data.content_id || cleanPath,
      contentHash,
      version: 1,
      title,
      entirefmSummary: description || `Canonical GOV.UK guidance published by ${data.publishing_app || 'government'}.`,
      whatChanged: data.change_history?.[0]?.note || undefined,
      suggestedContractorAction: 'Verify compliance alignment with updated guidance.',
      whyYoureSeeing: [],
      sourceId: 'src-govuk-content',
      sourceName: 'GOV.UK Content API',
      canonicalUrl: `https://www.gov.uk${cleanPath}`,
      authorityTier: 1,
      sourceAuthenticity: 'OFFICIAL_SOURCE',
      operationalInterpretation: 'PENDING_REVIEW',
      requiresHumanApproval: true,
      isMandatoryAction: false,
      legalStatus: 'ACOP_GUIDANCE',
      eventType: 'REGULATORY_CHANGE',
      severity: 'ACTION_MAY_BE_REQUIRED',
      jurisdictions: ['United Kingdom', 'England'],
      tradeTags: classifiedTrades.length > 0 ? classifiedTrades : ['building-safety'],
      credentialTags: [],
      workTypeTags: ['guidance', 'statutory-guidance'],
      publishedAt: data.first_published_at || new Date().toISOString(),
      updatedAt: data.public_updated_at || data.updated_at,
      rightsLicence: 'Open Government Licence v3.0',
      parserVersion: '1.2.0',
      fetchedAt: new Date().toISOString(),
      rawSourceHash: contentHash,
      reviewStatus: 'PENDING_REVIEW',
      linkedComplianceRequirementIds: [],
      audienceRoles: ['CONTRACTOR_ADMIN'],
      secondarySources: [],
    };
  } catch (err: any) {
    console.error('[GOV.UK Content Connector Error]:', err.message);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
// 3. LEGISLATION.GOV.UK ATOM FEED CONNECTOR
// ─────────────────────────────────────────────────────────────

export async function fetchLegislationUkFeed(): Promise<NormalisedIntelligenceItem[]> {
  const url = 'https://www.legislation.gov.uk/new/data.feed';
  const items: NormalisedIntelligenceItem[] = [];

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/atom+xml, application/xml, text/xml', 'User-Agent': 'EntireFM-Intelligence-Engine/1.0' },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`legislation.gov.uk returned ${res.status}`);
    const xmlText = await res.text();

    const entryRegex = /<entry[\s\S]*?<\/entry>/gi;
    const entries = xmlText.match(entryRegex) || [];

    for (const entry of entries.slice(0, 15)) {
      const titleMatch = entry.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const linkMatch = entry.match(/<link[^>]*href="([^"]+)"/i);
      const idMatch = entry.match(/<id[^>]*>([\s\S]*?)<\/id>/i);
      const summaryMatch = entry.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i);

      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'UK Statutory Instrument';
      const canonicalUrl = linkMatch ? linkMatch[1] : (idMatch ? idMatch[1] : 'https://www.legislation.gov.uk');
      const summary = summaryMatch ? summaryMatch[1].replace(/<[^>]+>/g, '').trim() : `Statutory legislation published on legislation.gov.uk: ${title}`;
      const contentHash = hashSha256(`${title}::${canonicalUrl}`);

      const jurisdictions: UKJurisdiction[] = ['United Kingdom'];
      if (title.toLowerCase().includes('scotland') || canonicalUrl.includes('/ssi/')) jurisdictions.push('Scotland');
      else if (title.toLowerCase().includes('wales') || canonicalUrl.includes('/wsi/')) jurisdictions.push('Wales');
      else if (title.toLowerCase().includes('northern ireland') || canonicalUrl.includes('/nisr/')) jurisdictions.push('Northern Ireland');
      else jurisdictions.push('Great Britain', 'England');

      const classifiedTrades = classifyFMTrades(`${title} ${summary}`);

      items.push({
        id: `legislation-${hashSha256(canonicalUrl).substring(0, 16)}`,
        externalId: idMatch ? idMatch[1].trim() : canonicalUrl,
        contentHash,
        version: 1,
        title,
        entirefmSummary: summary,
        suggestedContractorAction: 'Verify if your statutory maintenance activities are impacted by this legislative enactment.',
        whyYoureSeeing: [],
        sourceId: 'src-legislation-uk',
        sourceName: 'legislation.gov.uk',
        canonicalUrl,
        authorityTier: 1,
        sourceAuthenticity: 'OFFICIAL_SOURCE',
        operationalInterpretation: 'PENDING_REVIEW',
        requiresHumanApproval: true,
        isMandatoryAction: false,
        legalStatus: 'STATUTORY_INSTRUMENT',
        eventType: 'LEGISLATION_PUBLISHED',
        severity: 'ACTION_MAY_BE_REQUIRED',
        jurisdictions,
        tradeTags: classifiedTrades.length > 0 ? classifiedTrades : ['building-safety', 'compliance'],
        credentialTags: [],
        workTypeTags: ['statute', 'compliance'],
        publishedAt: new Date().toISOString(),
        rightsLicence: 'Open Government Licence v3.0',
        parserVersion: '1.2.0',
        fetchedAt: new Date().toISOString(),
        rawSourceHash: contentHash,
        reviewStatus: 'PENDING_REVIEW',
        linkedComplianceRequirementIds: [],
        audienceRoles: ['CONTRACTOR_ADMIN'],
        secondarySources: [],
      });
    }

    return items;
  } catch (err: any) {
    console.error('[legislation.gov.uk Connector Error]:', err.message);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
// 4. HSE PUBLIC WIRE & SAFETY ALERTS
// ─────────────────────────────────────────────────────────────

export async function fetchHseMediaWire(): Promise<NormalisedIntelligenceItem[]> {
  const url = 'https://press.hse.gov.uk/feed/';
  const items: NormalisedIntelligenceItem[] = [];

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/rss+xml, application/xml, text/xml', 'User-Agent': 'EntireFM-Intelligence-Engine/1.0' },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`HSE Wire returned ${res.status}`);
    const xmlText = await res.text();

    const itemRegex = /<item[\s\S]*?<\/item>/gi;
    const itemBlocks = xmlText.match(itemRegex) || [];

    for (const block of itemBlocks.slice(0, 15)) {
      const titleMatch = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const linkMatch = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
      const pubDateMatch = block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i);
      const descMatch = block.match(/<description[^>]*>([\s\S]*?)<\/description>/i);

      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : 'HSE Enforcement Notice';
      const canonicalUrl = linkMatch ? linkMatch[1].replace(/<[^>]+>/g, '').trim() : 'https://press.hse.gov.uk';
      const description = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : '';
      const contentHash = hashSha256(`${title}::${canonicalUrl}`);

      const classifiedTrades = classifyFMTrades(`${title} ${description}`);

      items.push({
        id: `hse-${hashSha256(canonicalUrl).substring(0, 16)}`,
        externalId: canonicalUrl,
        contentHash,
        version: 1,
        title,
        entirefmSummary: description || `Official HSE enforcement announcement: ${title}`,
        suggestedContractorAction: 'Review risk assessments, RAMS, and training records for the highlighted hazards.',
        whyYoureSeeing: [],
        sourceId: 'src-hse-public',
        sourceName: 'Health and Safety Executive',
        canonicalUrl,
        authorityTier: 1,
        sourceAuthenticity: 'OFFICIAL_SOURCE',
        operationalInterpretation: 'PENDING_REVIEW',
        requiresHumanApproval: true,
        isMandatoryAction: false,
        legalStatus: 'ACOP_GUIDANCE',
        eventType: 'HSE_ENFORCEMENT',
        severity: 'ACTION_MAY_BE_REQUIRED',
        jurisdictions: ['Great Britain', 'England', 'Scotland', 'Wales'],
        tradeTags: classifiedTrades.length > 0 ? classifiedTrades : ['building-safety', 'fire-safety'],
        credentialTags: [],
        workTypeTags: ['health-safety', 'enforcement'],
        publishedAt: pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString(),
        rightsLicence: 'Open Government Licence v3.0',
        parserVersion: '1.2.0',
        fetchedAt: new Date().toISOString(),
        rawSourceHash: contentHash,
        reviewStatus: 'PENDING_REVIEW',
        linkedComplianceRequirementIds: [],
        audienceRoles: ['CONTRACTOR_ADMIN', 'OPERATIVE'],
        secondarySources: [],
      });
    }

    return items;
  } catch (err: any) {
    console.error('[HSE Wire Connector Error]:', err.message);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
// 5. OPSS PRODUCT SAFETY NOTICES & RECALLS
// ─────────────────────────────────────────────────────────────

export async function fetchOpssProductSafety(): Promise<NormalisedIntelligenceItem[]> {
  const url = 'https://www.gov.uk/api/search.json?filter_organisations=office-for-product-safety-and-standards&count=10&order=-public_timestamp';
  const items: NormalisedIntelligenceItem[] = [];

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'EntireFM-Intelligence-Engine/1.0' },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`OPSS API returned ${res.status}`);
    const data: any = await res.json();
    const results = data.results || [];

    for (const r of results) {
      const canonicalUrl = r.link.startsWith('http') ? r.link : `https://www.gov.uk${r.link}`;
      const title = r.title || 'OPSS Product Safety Notification';
      const description = r.description || '';
      const contentHash = hashSha256(`${title}::${description}::${r.link}`);
      const classifiedTrades = classifyFMTrades(`${title} ${description}`);

      items.push({
        id: `opss-${hashSha256(r.link).substring(0, 16)}`,
        externalId: r.link,
        contentHash,
        version: 1,
        title,
        entirefmSummary: description || `OPSS Product Safety publication: ${title}`,
        suggestedContractorAction: 'Check asset registers and parts inventory for affected products or serial ranges.',
        whyYoureSeeing: [],
        sourceId: 'src-opss-psn',
        sourceName: 'Office for Product Safety and Standards',
        canonicalUrl,
        authorityTier: 1,
        sourceAuthenticity: 'OFFICIAL_SOURCE',
        operationalInterpretation: 'PENDING_REVIEW',
        requiresHumanApproval: true,
        isMandatoryAction: false,
        legalStatus: 'ACOP_GUIDANCE',
        eventType: 'PRODUCT_SAFETY_RECALL',
        severity: 'ACTION_REQUIRED',
        jurisdictions: ['United Kingdom'],
        tradeTags: classifiedTrades.length > 0 ? classifiedTrades : ['electrical', 'mechanical'],
        credentialTags: [],
        workTypeTags: ['product-safety', 'recall'],
        publishedAt: r.public_timestamp || new Date().toISOString(),
        rightsLicence: 'Open Government Licence v3.0',
        parserVersion: '1.2.0',
        fetchedAt: new Date().toISOString(),
        rawSourceHash: contentHash,
        reviewStatus: 'PENDING_REVIEW',
        linkedComplianceRequirementIds: [],
        audienceRoles: ['CONTRACTOR_ADMIN', 'OPERATIVE'],
        secondarySources: [],
      });
    }

    return items;
  } catch (err: any) {
    console.error('[OPSS Product Safety Connector Error]:', err.message);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
// 6. CONTRACTS FINDER & FIND A TENDER OCDS API CONNECTOR — ADMIN ONLY
// ─────────────────────────────────────────────────────────────

export async function fetchContractsFinderOcds(): Promise<TenderOpportunity[]> {
  const url = 'https://www.contractsfinder.service.gov.uk/Published/Notices/OCDS/Search?stages=tender&size=50';
  const tenders: TenderOpportunity[] = [];

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'EntireFM-BD-Engine/1.0' },
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) throw new Error(`Contracts Finder API returned ${res.status}`);
    const data: any = await res.json();

    const releases = data.releases || [];
    for (const rel of releases) {
      const tender = rel.tender || {};
      const buyer = rel.buyer || {};
      const ocid = rel.ocid || `ocds-cf-${rel.id || Math.random().toString(36)}`;
      const title = tender.title || 'Public Procurement Tender';
      const description = tender.description || '';
      
      const isFatNotice = ocid.startsWith('ocds-b5fd17');
      const source = isFatNotice ? 'Find a Tender' : 'Contracts Finder';
      const canonicalUrl = isFatNotice
        ? `https://www.find-tender.service.gov.uk/Notice/${rel.id || ''}`
        : `https://www.contractsfinder.service.gov.uk/Notice/${rel.id || ''}`;
        
      const cpvCodes = (tender.items || []).map((i: any) => i.classification?.id).filter(Boolean);
      const isAward = (rel.tag || []).some((t: string) => t.toLowerCase().includes('award'));
      const isPlanning = (rel.tag || []).some((t: string) => t.toLowerCase().includes('planning'));
      const noticeType = isAward ? 'award' : (isPlanning ? 'planning' : 'tender');
      const isBidEligible = !isAward;

      const valueGbp = tender.value?.amount;
      const formattedValue = valueGbp
        ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(valueGbp)
        : undefined;

      tenders.push({
        id: `${isFatNotice ? 'fat' : 'cf'}-${hashSha256(ocid).substring(0, 16)}`,
        ocid,
        source,
        noticeType,
        title,
        description,
        buyerName: buyer.name || 'UK Public Sector Authority',
        buyerRegion: tender.deliveryAddresses?.[0]?.region || 'United Kingdom',
        cpvCodes: cpvCodes.length > 0 ? cpvCodes : ['50700000'],
        isFramework: !!tender.hasEnquiries,
        isSmeAppropriate: tender.suitability?.sme ?? true,
        publishedAt: rel.date || new Date().toISOString(),
        closingDate: tender.tenderPeriod?.endDate,
        contractStartDate: tender.contractPeriod?.startDate,
        estimatedValueGbp: valueGbp,
        estimatedValueFormatted: formattedValue,
        canonicalUrl,
        status: 'ACTIVE',
        contentHash: hashSha256(`${title}::${description}::${ocid}`),
        fetchedAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
        isBidEligible,
        rawPayload: { ocid, id: rel.id, tag: rel.tag, source },
      });
    }

    return tenders;
  } catch (err: any) {
    console.error('[Contracts Finder / FTS Connector Error]:', err.message);
    throw err;
  }
}

export async function fetchFindATenderOcds(): Promise<TenderOpportunity[]> {
  // Leverages OCDS feed with FTS tag filtering and returns active Find a Tender items
  const allTenders = await fetchContractsFinderOcds();
  return allTenders.filter((t) => t.source === 'Find a Tender');
}

// ─────────────────────────────────────────────────────────────
// 7. COMPANIES HOUSE REST API CONNECTOR
// ─────────────────────────────────────────────────────────────

export async function fetchCompaniesHouseProfile(companyNumber: string): Promise<CompanyWatchRecord | null> {
  const cleanNumber = companyNumber.trim().toUpperCase().padStart(8, '0');
  const apiKey = process.env.COMPANIES_HOUSE_API_KEY;

  if (!apiKey) {
    return null;
  }

  const authHeader = 'Basic ' + Buffer.from(apiKey + ':').toString('base64');
  const url = `https://api.company-information.service.gov.uk/company/${encodeURIComponent(cleanNumber)}`;

  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Companies House API returned ${res.status}`);
    }

    const data: any = await res.json();
    const now = new Date().toISOString();

    const record: CompanyWatchRecord = {
      contractorOrgId: '',
      companyNumber: cleanNumber,
      companyName: data.company_name || '',
      companyStatus: (data.company_status || 'active').toUpperCase(),
      jurisdiction: data.jurisdiction || 'england-wales',
      companyType: data.type || 'ltd',
      accounts: {
        nextDueDate: data.accounts?.next_due,
        lastMadeUpTo: data.accounts?.last_accounts?.made_up_to,
        overdue: data.accounts?.overdue ?? false,
        accountType: data.accounts?.last_accounts?.type,
      },
      confirmationStatement: {
        nextDueDate: data.confirmation_statement?.next_due,
        lastMadeUpTo: data.confirmation_statement?.last_made_up_to,
        overdue: data.confirmation_statement?.overdue ?? false,
      },
      confirmationStatementNextDue: data.confirmation_statement?.next_due,
      confirmationStatementOverdue: data.confirmation_statement?.overdue ?? false,
      accountsNextDue: data.accounts?.next_due,
      accountsOverdue: data.accounts?.overdue ?? false,
      hasInsolvencyHistory: data.has_insolvency_history ?? false,
      hasCharges: data.has_charges ?? false,
      registeredOfficeAddress: [
        data.registered_office_address?.address_line_1,
        data.registered_office_address?.postal_code,
      ].filter(Boolean).join(', '),
      verificationStatus: (data.company_status || '').toLowerCase() === 'active' ? 'ACTIVE_AND_CURRENT' : 'ATTENTION_REQUIRED',
      lastCheckedAt: now,
      nextScheduledCheck: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      rawPayloadHash: hashSha256(JSON.stringify(data)),
    };

    return record;
  } catch (err: any) {
    console.error(`[Companies House Connector Error for ${cleanNumber}]:`, err.message);
    throw err;
  }
}
