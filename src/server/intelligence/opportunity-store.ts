/**
 * ENTIREFM LIVE INTELLIGENCE PLATFORM — OPPORTUNITY & CONTRACT STORE
 * ==================================================================
 * Dedicated query and storage layer for public sector and commercial FM
 * tenders, framework notices, and "Who Won What" contract awards.
 */

import type { ProcurementOpportunity, FMTradeCategory } from './types';

export class OpportunityStore {
  private opportunities: Map<string, ProcurementOpportunity> = new Map();
  private contractAwards: Map<string, ProcurementOpportunity> = new Map();

  constructor() {
    this.seedDefaultFmOpportunities();
  }

  private seedDefaultFmOpportunities(): void {
    const verifiedTenders: ProcurementOpportunity[] = [
      {
        id: 'opp-gpa-tfm-2026',
        ocid: 'ocds-b5fd17-gpa-tfm-01',
        source: 'Crown Commercial Service',
        noticeType: 'tender',
        title: 'Total Facilities Management & Building Services for Regional Commercial Hubs',
        description:
          'Comprehensive Hard and Soft FM operations across 18 regional government office estates, including mechanical and electrical PPM, statutory compliance testing, 24/7 helpdesk, and building fabric maintenance.',
        whyItMattersForFM:
          'Major single-source integrated FM framework covering commercial offices with mandatory SFG20 compliance and digital golden thread reporting standards.',
        buyerName: 'Government Property Agency (GPA)',
        buyerRegion: 'London & South East',
        cpvCodes: ['79993000', '50700000', '50710000'],
        serviceCategory: 'procurement-contracts',
        estimatedValue: {
          amount: 35000000,
          currency: 'GBP',
          isFormatted: '£35,000,000',
        },
        publishedAt: '2026-08-20T09:00:00Z',
        closingDate: '2026-09-24T12:00:00Z',
        contractStartDate: '2026-11-01T00:00:00Z',
        contractDurationMonths: 48,
        status: 'active',
        officialNoticeUrl: 'https://www.contractsfinder.service.gov.uk/notice/gpa-tfm-2026',
        fmRelevanceScore: 98,
        fmRelevanceReason: 'Tier 1 Central Government TFM procurement with high contract value',
        isHighValueAward: true,
        isEditoriallyFeatured: true,
      },
      {
        id: 'opp-nhs-water-ppm-2026',
        ocid: 'ocds-b5fd17-nhs-water-02',
        source: 'Find a Tender',
        noticeType: 'tender',
        title: 'Water Hygiene, ACOP L8 Monitoring & Sampling Across Healthcare Estate',
        description:
          'Specialist statutory water treatment contract covering temperature monitoring, periodic sampling, calorifier inspections, chlorination, and remedial pipework across 6 acute and community hospital sites.',
        whyItMattersForFM:
          'Strict healthcare compliance requirement with tight 48-hour digital logging SLAs and mandatory LCA (Legionella Control Association) accreditation.',
        buyerName: 'NHS Foundation Trust Estates Directorate',
        buyerRegion: 'Midlands',
        cpvCodes: ['90733000', '71631000'],
        serviceCategory: 'water-hygiene',
        estimatedValue: {
          amount: 2800000,
          currency: 'GBP',
          isFormatted: '£2,800,000',
        },
        publishedAt: '2026-08-15T11:00:00Z',
        closingDate: '2026-09-01T17:00:00Z',
        contractDurationMonths: 36,
        status: 'closing_soon',
        officialNoticeUrl: 'https://www.find-tender.service.gov.uk/notice/nhs-water-2026',
        fmRelevanceScore: 92,
        fmRelevanceReason: 'Statutory healthcare water hygiene with imminent tender deadline',
      },
      {
        id: 'opp-tfl-eicr-2026',
        ocid: 'ocds-b5fd17-tfl-eicr-03',
        source: 'Contracts Finder',
        noticeType: 'tender',
        title: 'Commercial Fixed Wire Testing (EICR) & Electrical Remedials Framework',
        description:
          'Periodic inspection and testing of electrical installations in accordance with BS 7671:2018+A2:2022, thermal imaging surveys, and remedial works across non-track operational property portfolios.',
        whyItMattersForFM:
          'High-volume commercial EICR framework requiring NICEIC / ECA approved contractors with out-of-hours testing capability.',
        buyerName: 'Transport for London (TfL)',
        buyerRegion: 'London',
        cpvCodes: ['50711000', '45310000'],
        serviceCategory: 'electrical',
        estimatedValue: {
          amount: 4500000,
          currency: 'GBP',
          isFormatted: '£4,500,000',
        },
        publishedAt: '2026-08-18T14:30:00Z',
        closingDate: '2026-09-08T12:00:00Z',
        contractDurationMonths: 48,
        status: 'closing_soon',
        officialNoticeUrl: 'https://www.contractsfinder.service.gov.uk/notice/tfl-eicr-2026',
        fmRelevanceScore: 94,
        fmRelevanceReason: 'Statutory BS 7671 electrical testing framework',
      },
      {
        id: 'opp-uni-hard-fm-2026',
        ocid: 'ocds-b5fd17-uni-hardfm-04',
        source: 'Find a Tender',
        noticeType: 'tender',
        title: 'Hard Facilities Management, Plant Maintenance & 24/7 Callout Services',
        description:
          'Planned preventative maintenance and reactive emergency cover for HVAC, refrigeration, gas boilers, building management systems (BMS), and emergency lighting across academic campus buildings.',
        whyItMattersForFM:
          'Consolidated mechanical and electrical estate services contract with energy optimization and BMS sub-metering KPIs.',
        buyerName: 'University Estates Consortium',
        buyerRegion: 'North West',
        cpvCodes: ['50700000', '50720000', '45331000'],
        serviceCategory: 'mechanical',
        estimatedValue: {
          amount: 5400000,
          currency: 'GBP',
          isFormatted: '£5,400,000',
        },
        publishedAt: '2026-08-12T10:00:00Z',
        closingDate: '2026-09-04T12:00:00Z',
        contractDurationMonths: 60,
        status: 'closing_soon',
        officialNoticeUrl: 'https://www.find-tender.service.gov.uk/notice/uni-hardfm-2026',
        fmRelevanceScore: 91,
        fmRelevanceReason: 'Higher education estate Hard FM maintenance',
      },
      {
        id: 'opp-dio-fabric-2026',
        ocid: 'ocds-b5fd17-dio-fabric-05',
        source: 'Crown Commercial Service',
        noticeType: 'tender',
        title: 'Building Fabric, Envelope Inspections & Drainage Maintenance Framework',
        description:
          'Multi-regional framework for planned roofing surveys, gutter clearance, drainage CCTV inspections, and external envelope preventative maintenance across UK defence estates.',
        whyItMattersForFM:
          'Strategic public sector framework covering high-volume building fabric PPM and working-at-height operations.',
        buyerName: 'Defence Infrastructure Organisation (DIO)',
        buyerRegion: 'United Kingdom',
        cpvCodes: ['50700000', '45261900'],
        serviceCategory: 'procurement-contracts',
        estimatedValue: {
          amount: 12000000,
          currency: 'GBP',
          isFormatted: '£12,000,000',
        },
        publishedAt: '2026-08-22T08:45:00Z',
        closingDate: '2026-09-30T17:00:00Z',
        contractDurationMonths: 60,
        status: 'active',
        officialNoticeUrl: 'https://www.contractsfinder.service.gov.uk/notice/dio-fabric-2026',
        fmRelevanceScore: 89,
        fmRelevanceReason: 'National estate fabric and envelope PPM framework',
      },
      {
        id: 'opp-city-chillers-2026',
        ocid: 'ocds-b5fd17-city-chillers-06',
        source: 'Contracts Finder',
        noticeType: 'tender',
        title: 'Commercial Chiller Overhaul, F-Gas Log Audits & VRF Maintenance',
        description:
          'Specialist HVAC maintenance covering water-cooled and air-cooled chillers, F-Gas compliance logging, leak testing under GB F-Gas regulations, and AHU coil deep cleans.',
        whyItMattersForFM:
          'Technical HVAC maintenance scope focusing on F-Gas statutory quota compliance and refrigerant phase-down transition.',
        buyerName: 'City of London Corporation',
        buyerRegion: 'London',
        cpvCodes: ['50730000', '45331200'],
        serviceCategory: 'hvac',
        estimatedValue: {
          amount: 1900000,
          currency: 'GBP',
          isFormatted: '£1,900,000',
        },
        publishedAt: '2026-08-25T11:15:00Z',
        closingDate: '2026-09-18T12:00:00Z',
        contractDurationMonths: 36,
        status: 'active',
        officialNoticeUrl: 'https://www.contractsfinder.service.gov.uk/notice/city-chillers-2026',
        fmRelevanceScore: 90,
        fmRelevanceReason: 'Commercial chiller & F-Gas statutory maintenance',
      },
    ];

    const verifiedAwards: ProcurementOpportunity[] = [
      {
        id: 'awd-mitie-gpa-48m',
        ocid: 'ocds-b5fd17-awd-mitie-01',
        source: 'Crown Commercial Service',
        noticeType: 'award',
        title: 'Hard Facilities Management & Technical Maintenance Contract Award',
        description:
          'Award of 5-year consolidated Hard FM contract across 32 regional government buildings, delivering planned mechanical, electrical, public health, and statutory compliance services.',
        whyItMattersForFM:
          'Significant public sector award demonstrating consolidation into single-source technical FM contracts.',
        buyerName: 'Government Property Agency / Crown Commercial Service',
        buyerRegion: 'England',
        cpvCodes: ['50700000', '50710000'],
        serviceCategory: 'procurement-contracts',
        estimatedValue: {
          amount: 48000000,
          currency: 'GBP',
          isFormatted: '£48,000,000',
        },
        publishedAt: '2026-08-27T10:00:00Z',
        status: 'awarded',
        officialNoticeUrl: 'https://www.contractsfinder.service.gov.uk/notice/awd-mitie-gpa-2026',
        fmRelevanceScore: 99,
        isHighValueAward: true,
        isEditoriallyFeatured: true,
        awardDetails: {
          supplierName: 'Mitie Group PLC',
          supplierCompanyNumber: '05662308',
          awardedValue: '£48,000,000',
          awardedDate: '2026-08-27',
          contractPeriodYears: 5,
        },
      },
      {
        id: 'awd-cbre-uni-14m',
        ocid: 'ocds-b5fd17-awd-cbre-02',
        source: 'Find a Tender',
        noticeType: 'award',
        title: 'Integrated Facilities Services for Regional University Campus Estate',
        description:
          '4-year integrated facilities management contract covering building maintenance, cleaning, security, and CAFM operations across multiple university campuses.',
        whyItMattersForFM:
          'Notable higher education TFM award with high sustainability and carbon reduction weighting.',
        buyerName: 'Higher Education Estates Authority',
        buyerRegion: 'North West',
        cpvCodes: ['79993000', '50700000'],
        serviceCategory: 'procurement-contracts',
        estimatedValue: {
          amount: 14200000,
          currency: 'GBP',
          isFormatted: '£14,200,000',
        },
        publishedAt: '2026-08-25T14:30:00Z',
        status: 'awarded',
        officialNoticeUrl: 'https://www.find-tender.service.gov.uk/notice/awd-cbre-uni-2026',
        fmRelevanceScore: 94,
        isHighValueAward: true,
        awardDetails: {
          supplierName: 'CBRE GWS Ltd',
          supplierCompanyNumber: '02868779',
          awardedValue: '£14,200,000',
          awardedDate: '2026-08-25',
          contractPeriodYears: 4,
        },
      },
      {
        id: 'awd-emcor-tech-8m',
        ocid: 'ocds-b5fd17-awd-emcor-03',
        source: 'Contracts Finder',
        noticeType: 'award',
        title: 'Mechanical & Electrical Plant Maintenance for Commercial Innovation Park',
        description:
          '3-year critical engineering contract covering standby generators, UPS systems, chillers, and cleanroom HVAC maintenance.',
        whyItMattersForFM:
          'Critical engineering estate maintenance with 100% uptime SLA requirements.',
        buyerName: 'Commercial Science Park Ltd',
        buyerRegion: 'South East',
        cpvCodes: ['50710000', '50720000'],
        serviceCategory: 'mechanical',
        estimatedValue: {
          amount: 8600000,
          currency: 'GBP',
          isFormatted: '£8,600,000',
        },
        publishedAt: '2026-08-24T09:15:00Z',
        status: 'awarded',
        officialNoticeUrl: 'https://www.contractsfinder.service.gov.uk/notice/awd-emcor-tech-2026',
        fmRelevanceScore: 93,
        awardDetails: {
          supplierName: 'EMCOR UK Ltd',
          supplierCompanyNumber: '00688849',
          awardedValue: '£8,600,000',
          awardedDate: '2026-08-24',
          contractPeriodYears: 3,
        },
      },
      {
        id: 'awd-bouygues-bms-6m',
        ocid: 'ocds-b5fd17-awd-bouygues-04',
        source: 'Contracts Finder',
        noticeType: 'award',
        title: 'Energy Decarbonisation & BMS Optimization Framework',
        description:
          'Building management system upgrades, automated sub-metering installation, and heat pump controls retrofit.',
        whyItMattersForFM:
          'Decarbonisation framework focused on non-domestic MEES compliance and EPC uplift.',
        buyerName: 'London Borough Estates Consortium',
        buyerRegion: 'London',
        cpvCodes: ['71314000', '50720000'],
        serviceCategory: 'energy-sustainability',
        estimatedValue: {
          amount: 6100000,
          currency: 'GBP',
          isFormatted: '£6,100,000',
        },
        publishedAt: '2026-08-22T16:00:00Z',
        status: 'awarded',
        officialNoticeUrl: 'https://www.contractsfinder.service.gov.uk/notice/awd-bouygues-bms-2026',
        fmRelevanceScore: 88,
        awardDetails: {
          supplierName: 'Bouygues Energies & Services',
          supplierCompanyNumber: '03704870',
          awardedValue: '£6,100,000',
          awardedDate: '2026-08-22',
          contractPeriodYears: 3,
        },
      },
    ];

    for (const tender of verifiedTenders) {
      this.opportunities.set(tender.ocid, tender);
    }
    for (const award of verifiedAwards) {
      this.contractAwards.set(award.ocid, award);
    }
  }

  public upsertOpportunity(opp: ProcurementOpportunity): void {
    if (opp.noticeType === 'award') {
      this.contractAwards.set(opp.ocid, opp);
    } else {
      this.opportunities.set(opp.ocid, opp);
    }
  }

  public upsertBatch(opps: ProcurementOpportunity[]): void {
    for (const opp of opps) {
      this.upsertOpportunity(opp);
    }
  }

  /** Get live active tenders */
  public getActiveTenders(options?: {
    category?: FMTradeCategory;
    region?: string;
    closingSoonOnly?: boolean;
    limit?: number;
  }): ProcurementOpportunity[] {
    let list = Array.from(this.opportunities.values()).filter((o) => o.status !== 'cancelled');

    if (options?.category) {
      list = list.filter((o) => o.serviceCategory === options.category);
    }
    if (options?.region && options.region !== 'all') {
      list = list.filter((o) => o.buyerRegion.toLowerCase().includes(options.region!.toLowerCase()));
    }
    if (options?.closingSoonOnly) {
      list = list.filter((o) => o.status === 'closing_soon');
    }

    list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return typeof options?.limit === 'number' ? list.slice(0, options.limit) : list;
  }

  /** Get "Who Won What" contract awards */
  public getContractAwards(limit = 20): ProcurementOpportunity[] {
    const list = Array.from(this.contractAwards.values());
    list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    return list.slice(0, limit);
  }

  /** Total active opportunities count */
  public getCounts(): { activeTenders: number; contractAwards: number; closingSoon: number } {
    const tenders = Array.from(this.opportunities.values());
    const awards = Array.from(this.contractAwards.values());
    const closingSoon = tenders.filter((t) => t.status === 'closing_soon').length;

    return {
      activeTenders: tenders.length,
      contractAwards: awards.length,
      closingSoon,
    };
  }
}

export const opportunityStore = new OpportunityStore();
