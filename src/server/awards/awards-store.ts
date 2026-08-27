import type { IndustryAward, AwardsQueryOptions, AwardStatus } from './types';
import { resolveEditorialImage } from '@/lib/lobby/image-resolver';

export const INITIAL_AWARDS: IndustryAward[] = [
  {
    id: 'award-001',
    slug: 'iwfm-impact-awards-2026',
    name: 'IWFM Impact Awards 2026',
    organiser: 'Institute of Workplace and Facilities Management (IWFM)',
    description:
      'The premier benchmark of excellence in workplace and facilities management, recognising leadership, technological innovation, sustainability, and service partnership across the UK sector.',
    categories: [
      'Excellence in Customer Experience',
      'Workplace Experience: Non-commercial',
      'Change Management',
      'Product or Service Development',
      'Sustainability Impact',
      'Manager of the Year',
    ],
    entryOpenDate: '2026-03-01T09:00:00Z',
    entryDeadline: '2026-09-04T17:00:00Z',
    shortlistDate: '2026-09-28T09:00:00Z',
    eventDate: '2026-10-19T18:30:00Z',
    location: 'JW Marriott Grosvenor House, London W1',
    officialUrl: 'https://www.iwfmawards.org',
    status: 'closing-soon',
    whyItMatters:
      'The gold standard for UK FM benchmark recognition. Submissions require verified client KPI data and carbon reduction audits.',
    provenance: resolveEditorialImage({
      topic: 'awards',
      sourcePublisher: 'IWFM Impact Awards Directorate',
      customProvenance: {
        altText: 'JW Marriott Grosvenor House London event architecture',
        credit: 'EntireFM Industry Recognition Wire',
      },
    }),
  },
  {
    id: 'award-002',
    slug: 'pfm-partnership-awards-2026',
    name: 'PFM Partnership Awards 2026',
    organiser: 'Premises & Facilities Management (PFM)',
    description:
      'Recognising the most effective client-supplier partnerships in UK facilities management with rigorous independent judging and site inspection visits.',
    categories: [
      'Partnership in Hard FM',
      'Partnership in Corporate Offices',
      'Partnership in Healthcare',
      'Partnership in Public Sector',
      'FM Technology Innovation',
    ],
    entryOpenDate: '2026-04-15T09:00:00Z',
    entryDeadline: '2026-09-18T17:00:00Z',
    shortlistDate: '2026-10-05T09:00:00Z',
    eventDate: '2026-11-04T18:00:00Z',
    location: 'The Brewery, Chiswell Street, London EC1',
    officialUrl: 'https://www.pfmawards.co.uk',
    status: 'entries-open',
    whyItMatters:
      'PFM uniquely evaluates the strength of client-contractor trust and collaborative problem-solving rather than sales volume.',
    provenance: resolveEditorialImage({
      topic: 'events',
      sourcePublisher: 'PFM Awards',
      customProvenance: {
        altText: 'London architectural heritage and ceremony venue',
        credit: 'EntireFM Industry Recognition Wire',
      },
    }),
  },
  {
    id: 'award-003',
    slug: 'cibse-building-performance-awards-2027',
    name: 'CIBSE Building Performance Awards 2027',
    organiser: 'Chartered Institution of Building Services Engineers (CIBSE)',
    description:
      'The only awards recognising measured, in-use operational building performance rather than theoretical architectural design.',
    categories: [
      'Commercial Building Performance',
      'Building Operations & Maintenance Team',
      'Building Performance Consultancy',
      'Retrofit of the Year',
      'Facilities Management Team of the Year',
    ],
    entryOpenDate: '2026-07-01T09:00:00Z',
    entryDeadline: '2026-09-25T17:00:00Z',
    shortlistDate: '2026-11-12T09:00:00Z',
    eventDate: '2027-02-25T18:30:00Z',
    location: 'Park Plaza Westminster Bridge, London SE1',
    officialUrl: 'https://www.cibse.org/bpa',
    status: 'entries-open',
    whyItMatters:
      'Entries require at least 12 months of actual meter data demonstrating energy reduction and indoor air quality performance.',
    provenance: resolveEditorialImage({
      topic: 'property-estates',
      sourcePublisher: 'CIBSE Building Performance Directorate',
      customProvenance: {
        altText: 'Modern commercial building facade and energy infrastructure',
        credit: 'EntireFM Industry Recognition Wire',
      },
    }),
  },
  {
    id: 'award-004',
    slug: 'national-building-construction-awards-2026',
    name: 'National Building & Construction Awards 2026',
    organiser: 'Events & PR UK',
    description:
      'Celebrating excellence across commercial construction, M&E engineering, refurbishment, and estate maintenance contractors across the United Kingdom.',
    categories: [
      'Commercial Refurbishment Project',
      'Health & Safety Excellence',
      'M&E Contractor of the Year',
      'Sustainability Champion',
    ],
    entryOpenDate: '2026-02-01T09:00:00Z',
    entryDeadline: '2026-08-15T17:00:00Z',
    shortlistDate: '2026-09-01T09:00:00Z',
    eventDate: '2026-11-19T19:00:00Z',
    location: 'Hilton London Wembley, HA9',
    officialUrl: 'https://www.nbcawards.co.uk',
    status: 'shortlisted',
    whyItMatters:
      'Provides specialist recognition for tier-2 and regional mechanical and electrical maintenance providers.',
    provenance: resolveEditorialImage({
      topic: 'awards',
      sourcePublisher: 'National Building Awards',
      customProvenance: {
        altText: 'Wembley commercial venue and engineering recognition context',
        credit: 'EntireFM Industry Recognition Wire',
      },
    }),
  },
];

class AwardsStore {
  private awards: Map<string, IndustryAward> = new Map();

  constructor() {
    for (const award of INITIAL_AWARDS) {
      this.awards.set(award.slug, award);
    }
  }

  public getAll(): IndustryAward[] {
    return Array.from(this.awards.values()).sort(
      (a, b) => new Date(a.entryDeadline).getTime() - new Date(b.entryDeadline).getTime()
    );
  }

  public getBySlug(slug: string): IndustryAward | undefined {
    return this.awards.get(slug);
  }

  public getClosingSoon(): IndustryAward[] {
    return this.getAll().filter((a) => a.status === 'closing-soon' || a.status === 'entries-open');
  }

  public query(options: AwardsQueryOptions): { awards: IndustryAward[]; total: number } {
    let list = this.getAll();

    if (options.status && options.status !== 'all') {
      list = list.filter((a) => a.status === options.status);
    }

    if (options.search) {
      const q = options.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.organiser.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }

    const total = list.length;
    const offset = options.offset || 0;
    const limit = options.limit || 20;

    return {
      awards: list.slice(offset, offset + limit),
      total,
    };
  }
}

export const awardsStore = new AwardsStore();

export function getIndustryAwards(options?: AwardsQueryOptions) {
  return awardsStore.query(options || {});
}

export function getIndustryAwardBySlug(slug: string) {
  return awardsStore.getBySlug(slug);
}

export function getClosingSoonAwards() {
  return awardsStore.getClosingSoon();
}
