/**
 * ENTIREFM LIVE INTELLIGENCE PLATFORM — SOURCE REGISTRY
 * =======================================================
 * Canonical configuration of all primary statutory, technical, trade,
 * procurement, and aggregator intelligence sources.
 */

import type { IntelligenceSource } from './types';

export const INTELLIGENCE_SOURCES: IntelligenceSource[] = [
  // ─── TIER 1: STATUTORY / REGULATORS / GOVERNMENT ────────────────────────────
  {
    id: 'src-govuk-search',
    name: 'GOV.UK Search & Discovery API',
    slug: 'govuk-search',
    sourceType: 'api',
    authorityTier: 1,
    accessType: 'open_no_key',
    baseDomain: 'gov.uk',
    baseUrl: 'https://www.gov.uk/api/search.json',
    enabled: true,
    pollIntervalMinutes: 20,
    jurisdictions: ['United Kingdom', 'England'],
    primaryTrades: ['building-safety', 'compliance', 'fire-safety', 'energy-sustainability', 'waste-environment'],
    requiresHumanReview: true,
    healthStatus: 'LIVE',
    recordsIngested24h: 0,
    duplicateRatePercentage: 0,
    description: 'UK Government statutory search API for consultations, policy papers, and statutory guidance.',
    docUrl: 'https://content-api.publishing.service.gov.uk/',
  },
  {
    id: 'src-govuk-content',
    name: 'GOV.UK Content API',
    slug: 'govuk-content',
    sourceType: 'api',
    authorityTier: 1,
    accessType: 'open_no_key',
    baseDomain: 'gov.uk',
    baseUrl: 'https://www.gov.uk/api/content',
    enabled: true,
    pollIntervalMinutes: 20,
    jurisdictions: ['United Kingdom', 'England'],
    primaryTrades: ['building-safety', 'compliance', 'fire-safety'],
    requiresHumanReview: true,
    healthStatus: 'LIVE',
    recordsIngested24h: 0,
    duplicateRatePercentage: 0,
    description: 'Structured JSON representation of official statutory instruments, guidance, and consultation closures.',
  },
  {
    id: 'src-legislation-uk',
    name: 'legislation.gov.uk Statutory Feed',
    slug: 'legislation-uk',
    sourceType: 'rss',
    authorityTier: 1,
    accessType: 'open_no_key',
    baseDomain: 'legislation.gov.uk',
    baseUrl: 'https://www.legislation.gov.uk/new/data.feed',
    enabled: true,
    pollIntervalMinutes: 30,
    jurisdictions: ['United Kingdom', 'England', 'Wales', 'Scotland', 'Northern Ireland'],
    primaryTrades: ['compliance', 'building-safety', 'electrical', 'hvac', 'water-hygiene'],
    requiresHumanReview: true,
    healthStatus: 'LIVE',
    recordsIngested24h: 0,
    duplicateRatePercentage: 0,
    description: 'The official home of UK legislation: UK Statutory Instruments, Acts of Parliament, and Devolved Regulations.',
  },
  {
    id: 'src-uk-parliament-bills',
    name: 'UK Parliament Bills API',
    slug: 'parliament-bills',
    sourceType: 'api',
    authorityTier: 1,
    accessType: 'open_no_key',
    baseDomain: 'parliament.uk',
    baseUrl: 'https://bills-api.parliament.uk/api/v1/Bills',
    enabled: true,
    pollIntervalMinutes: 60,
    jurisdictions: ['United Kingdom', 'Great Britain', 'England'],
    primaryTrades: ['building-safety', 'compliance', 'energy-sustainability', 'procurement-contracts'],
    requiresHumanReview: false,
    healthStatus: 'LIVE',
    recordsIngested24h: 0,
    duplicateRatePercentage: 0,
    description: 'Official UK Parliament legislative tracking API: Bill stages, readings, amendments, and Committee sittings.',
  },
  {
    id: 'src-hse-public',
    name: 'Health and Safety Executive (HSE) Public Media Wire',
    slug: 'hse-media',
    sourceType: 'rss',
    authorityTier: 1,
    accessType: 'open_no_key',
    baseDomain: 'hse.gov.uk',
    baseUrl: 'https://www.hse.gov.uk/news/rss/news.xml',
    enabled: true,
    pollIntervalMinutes: 30,
    jurisdictions: ['Great Britain', 'England', 'Wales', 'Scotland'],
    primaryTrades: ['compliance', 'building-safety', 'asbestos', 'electrical', 'water-hygiene'],
    requiresHumanReview: false,
    healthStatus: 'LIVE',
    recordsIngested24h: 0,
    duplicateRatePercentage: 0,
    description: 'HSE enforcement bulletins, statutory prosecution summaries, and safety alert notices.',
  },
  {
    id: 'src-contracts-finder',
    name: 'Contracts Finder (Crown Commercial Service / GOV.UK)',
    slug: 'contracts-finder',
    sourceType: 'ocds',
    authorityTier: 1,
    accessType: 'open_no_key',
    baseDomain: 'contractsfinder.service.gov.uk',
    baseUrl: 'https://www.contractsfinder.service.gov.uk/Published/Notices/OCDS/Search',
    enabled: true,
    pollIntervalMinutes: 30,
    jurisdictions: ['England', 'United Kingdom'],
    primaryTrades: ['procurement-contracts', 'mechanical', 'electrical', 'cleaning-soft-fm', 'security'],
    requiresHumanReview: false,
    healthStatus: 'LIVE',
    recordsIngested24h: 0,
    duplicateRatePercentage: 0,
    description: 'Official UK public sector tender & contract award repository under the Open Contracting Data Standard.',
  },
  {
    id: 'src-find-a-tender',
    name: 'Find a Tender Service (FTS)',
    slug: 'find-a-tender',
    sourceType: 'ocds',
    authorityTier: 1,
    accessType: 'open_no_key',
    baseDomain: 'find-tender.service.gov.uk',
    baseUrl: 'https://www.find-tender.service.gov.uk/api/1.0/ocdsReleasePackages',
    enabled: true,
    pollIntervalMinutes: 30,
    jurisdictions: ['United Kingdom'],
    primaryTrades: ['procurement-contracts', 'building-safety', 'hvac', 'mechanical'],
    requiresHumanReview: false,
    healthStatus: 'LIVE',
    recordsIngested24h: 0,
    duplicateRatePercentage: 0,
    description: 'UK high-value public procurement notices, major framework awards, and tender lifecycle notices.',
  },
  {
    id: 'src-opss-recalls',
    name: 'Office for Product Safety and Standards (OPSS)',
    slug: 'opss-recalls',
    sourceType: 'rss',
    authorityTier: 1,
    accessType: 'open_no_key',
    baseDomain: 'gov.uk',
    baseUrl: 'https://www.gov.uk/product-safety-alerts-reports-recalls.atom',
    enabled: true,
    pollIntervalMinutes: 60,
    jurisdictions: ['United Kingdom'],
    primaryTrades: ['electrical', 'fire-safety', 'building-safety'],
    requiresHumanReview: false,
    healthStatus: 'LIVE',
    recordsIngested24h: 0,
    duplicateRatePercentage: 0,
    description: 'Statutory product safety alerts and recalls for commercial electrical, fire, and construction plant.',
  },

  // ─── TIER 2: TECHNICAL & PROFESSIONAL BODIES ────────────────────────────────
  {
    id: 'src-cibse-news',
    name: 'CIBSE (Chartered Institution of Building Services Engineers)',
    slug: 'cibse-news',
    sourceType: 'rss',
    authorityTier: 2,
    accessType: 'open_no_key',
    baseDomain: 'cibse.org',
    baseUrl: 'https://www.cibse.org/rss/news',
    enabled: true,
    pollIntervalMinutes: 60,
    jurisdictions: ['United Kingdom'],
    primaryTrades: ['hvac', 'electrical', 'energy-sustainability', 'building-safety'],
    requiresHumanReview: false,
    healthStatus: 'LIVE',
    recordsIngested24h: 0,
    duplicateRatePercentage: 0,
    description: 'Technical guidance updates, M&E standards, building performance methodologies, and CIBSE events.',
  },
  {
    id: 'src-besa-wire',
    name: 'BESA (Building Engineering Services Association)',
    slug: 'besa-wire',
    sourceType: 'rss',
    authorityTier: 2,
    accessType: 'open_no_key',
    baseDomain: 'thebesa.com',
    baseUrl: 'https://www.thebesa.com/news/rss',
    enabled: true,
    pollIntervalMinutes: 60,
    jurisdictions: ['United Kingdom'],
    primaryTrades: ['hvac', 'mechanical', 'building-safety', 'compliance'],
    requiresHumanReview: false,
    healthStatus: 'LIVE',
    recordsIngested24h: 0,
    duplicateRatePercentage: 0,
    description: 'Ventilation hygiene, SFG20 updates, F-gas compliance, and engineering contractor standards.',
  },
  {
    id: 'src-iwfm-insights',
    name: 'IWFM (Institute of Workplace and Facilities Management)',
    slug: 'iwfm-insights',
    sourceType: 'rss',
    authorityTier: 2,
    accessType: 'open_no_key',
    baseDomain: 'iwfm.org.uk',
    baseUrl: 'https://www.iwfm.org.uk/news.rss',
    enabled: true,
    pollIntervalMinutes: 60,
    jurisdictions: ['United Kingdom'],
    primaryTrades: ['compliance', 'workplace-property', 'people-appointments', 'procurement-contracts'],
    requiresHumanReview: false,
    healthStatus: 'LIVE',
    recordsIngested24h: 0,
    duplicateRatePercentage: 0,
    description: 'Workplace trends, professional standards, IWFM Impact Awards notices, and executive appointments.',
  },
  {
    id: 'src-fia-fire',
    name: 'FIA (Fire Industry Association)',
    slug: 'fia-fire',
    sourceType: 'rss',
    authorityTier: 2,
    accessType: 'open_no_key',
    baseDomain: 'fia.uk.com',
    baseUrl: 'https://www.fia.uk.com/news/rss.xml',
    enabled: true,
    pollIntervalMinutes: 60,
    jurisdictions: ['United Kingdom'],
    primaryTrades: ['fire-safety', 'building-safety', 'compliance'],
    requiresHumanReview: false,
    healthStatus: 'LIVE',
    recordsIngested24h: 0,
    duplicateRatePercentage: 0,
    description: 'Fire alarm standards, BS 5839 revisions, competence frameworks, and third-party certification.',
  },
  {
    id: 'src-eca-electrical',
    name: 'ECA (Electrical Contractors’ Association)',
    slug: 'eca-electrical',
    sourceType: 'rss',
    authorityTier: 2,
    accessType: 'open_no_key',
    baseDomain: 'eca.co.uk',
    baseUrl: 'https://www.eca.co.uk/news-and-events/news/rss',
    enabled: true,
    pollIntervalMinutes: 60,
    jurisdictions: ['England', 'Wales', 'Northern Ireland'],
    primaryTrades: ['electrical', 'energy-sustainability', 'compliance'],
    requiresHumanReview: false,
    healthStatus: 'LIVE',
    recordsIngested24h: 0,
    duplicateRatePercentage: 0,
    description: 'BS 7671 electrical wiring updates, renewable energy infrastructure, and contractor competency.',
  },

  // ─── TIER 3 & 4: CREDENTIALLED CONNECTORS & DISCOVERY ───────────────────────
  {
    id: 'src-companies-house',
    name: 'Companies House API',
    slug: 'companies-house',
    sourceType: 'api',
    authorityTier: 1,
    accessType: 'api_key',
    baseDomain: 'api.company-information.service.gov.uk',
    baseUrl: 'https://api.company-information.service.gov.uk',
    enabled: true,
    pollIntervalMinutes: 0, // on-demand
    jurisdictions: ['United Kingdom'],
    primaryTrades: ['procurement-contracts', 'people-appointments'],
    requiresHumanReview: false,
    credentialEnvKey: 'COMPANIES_HOUSE_API_KEY',
    healthStatus: process.env.COMPANIES_HOUSE_API_KEY ? 'LIVE' : 'CREDENTIAL_REQUIRED',
    recordsIngested24h: 0,
    duplicateRatePercentage: 0,
    description: 'UK Registrar of Companies: contractor verification, incorporation status, and public supplier enrichment.',
    docUrl: 'https://developer.company-information.service.gov.uk/',
  },
  {
    id: 'src-gnews-fm',
    name: 'GNews Discovery Engine',
    slug: 'gnews-discovery',
    sourceType: 'api',
    authorityTier: 4,
    accessType: 'api_key',
    baseDomain: 'gnews.io',
    baseUrl: 'https://gnews.io/api/v4/search',
    enabled: true,
    pollIntervalMinutes: 30,
    jurisdictions: ['United Kingdom'],
    primaryTrades: ['procurement-contracts', 'people-appointments', 'building-safety', 'hvac'],
    requiresHumanReview: false,
    credentialEnvKey: 'GNEWS_API_KEY',
    healthStatus: process.env.GNEWS_API_KEY ? 'LIVE' : 'CREDENTIAL_REQUIRED',
    recordsIngested24h: 0,
    duplicateRatePercentage: 0,
    description: 'FM trade news discovery engine capturing media releases, contract wins, and leadership moves.',
  },
  {
    id: 'src-changedetection',
    name: 'ChangeDetection.io Web Monitor',
    slug: 'changedetection-monitors',
    sourceType: 'changedetection',
    authorityTier: 3,
    accessType: 'api_key',
    baseDomain: 'changedetection.io',
    baseUrl: process.env.CHANGEDETECTION_BASE_URL || 'https://changedetection.entirefm.com',
    enabled: true,
    pollIntervalMinutes: 60,
    jurisdictions: ['United Kingdom'],
    primaryTrades: ['procurement-contracts', 'compliance'],
    requiresHumanReview: true,
    credentialEnvKey: 'CHANGEDETECTION_API_KEY',
    healthStatus: process.env.CHANGEDETECTION_API_KEY ? 'LIVE' : 'CREDENTIAL_REQUIRED',
    recordsIngested24h: 0,
    duplicateRatePercentage: 0,
    description: 'Monitored trade award submission deadlines, shortlisted entries, and non-RSS public pages.',
  },
];

export class SourceRegistry {
  private sources: Map<string, IntelligenceSource> = new Map();

  constructor() {
    for (const src of INTELLIGENCE_SOURCES) {
      // Dynamic runtime health evaluation based on environment keys
      let currentHealth = src.healthStatus;
      if (src.accessType === 'api_key' && src.credentialEnvKey) {
        currentHealth = process.env[src.credentialEnvKey] ? 'LIVE' : 'CREDENTIAL_REQUIRED';
      }
      this.sources.set(src.id, { ...src, healthStatus: currentHealth });
    }
  }

  public getAllSources(): IntelligenceSource[] {
    return Array.from(this.sources.values());
  }

  public getSourceById(id: string): IntelligenceSource | undefined {
    return this.sources.get(id);
  }

  public getLiveSources(): IntelligenceSource[] {
    return this.getAllSources().filter((s) => s.enabled && s.healthStatus === 'LIVE');
  }

  public updateSourceHealth(
    id: string,
    health: IntelligenceSource['healthStatus'],
    lastError?: string,
    recordsCount?: number
  ): void {
    const src = this.sources.get(id);
    if (!src) return;

    src.healthStatus = health;
    if (lastError) src.lastError = lastError;
    if (health === 'LIVE') {
      src.lastSuccessfulFetch = new Date().toISOString();
      src.lastError = undefined;
    }
    if (typeof recordsCount === 'number') {
      src.recordsIngested24h += recordsCount;
    }
    this.sources.set(id, src);
  }
}

export const sourceRegistry = new SourceRegistry();
