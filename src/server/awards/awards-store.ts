/**
 * ENTIREFM LOBBY INDUSTRY AWARDS STORE — DATABASE-BACKED
 * ========================================================
 * Persists verified UK FM industry award listings via PostgREST dbQuery.
 * Seed data (3 verified real awards) is managed in migration 0047.
 * Every exported function signature is identical to the prior in-memory implementation.
 */

import type { IndustryAward, AwardsQueryOptions } from './types';
import { dbQuery } from '@/server/db/client';

function mapAward(row: any): IndustryAward {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    organiser: row.organiser,
    description: row.description,
    categories: row.categories || [],
    entryOpenDate: row.entry_open_date,
    entryDeadline: row.entry_deadline,
    shortlistDate: row.shortlist_date,
    eventDate: row.event_date,
    location: row.location,
    officialUrl: row.official_url,
    provenance: row.provenance || {},
    status: row.status,
    isSponsored: row.is_sponsored,
    sponsorName: row.sponsor_name,
    sponsorshipDisclosure: row.sponsorship_disclosure,
    whyItMatters: row.why_it_matters,
  };
}

class AwardsStore {
  public async getAll(): Promise<IndustryAward[]> {
    const { data } = await dbQuery<any[]>(
      'lobby_industry_awards?order=entry_deadline.asc'
    );
    if (!data) return [];
    return data.map(mapAward);
  }

  public async getBySlug(slug: string): Promise<IndustryAward | undefined> {
    const { data } = await dbQuery<any[]>(
      `lobby_industry_awards?slug=eq.${encodeURIComponent(slug)}&limit=1`
    );
    if (!data || data.length === 0) return undefined;
    return mapAward(data[0]);
  }

  public async getClosingSoon(): Promise<IndustryAward[]> {
    const all = await this.getAll();
    return all.filter((a) => a.status === 'closing-soon' || a.status === 'entries-open');
  }

  public async query(options: AwardsQueryOptions): Promise<{ awards: IndustryAward[]; total: number }> {
    let endpoint = 'lobby_industry_awards?order=entry_deadline.asc';

    if (options.status && options.status !== 'all') {
      endpoint += `&status=eq.${encodeURIComponent(options.status)}`;
    }

    const { data } = await dbQuery<any[]>(endpoint);
    if (!data) return { awards: [], total: 0 };

    let list = data.map(mapAward);

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

export async function getIndustryAwards(options?: AwardsQueryOptions) {
  return awardsStore.query(options || {});
}

export async function getIndustryAwardBySlug(slug: string) {
  return awardsStore.getBySlug(slug);
}

export async function getClosingSoonAwards() {
  return awardsStore.getClosingSoon();
}
