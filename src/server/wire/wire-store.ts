/**
 * ENTIREFM THE WIRE — PEOPLE MOVES & APPOINTMENTS STORE
 * ========================================================
 * Filtered, formatted view of canonical_intelligence_items where
 * trade_tags contains 'people-appointments' or event_type = 'appointment'.
 */

import { dbQuery } from '@/server/db/client';

export interface PeopleMoveItem {
  id: string;
  slug: string;
  title: string;
  personName: string;
  newRole: string;
  organisationName: string;
  previousRole?: string;
  summary: string;
  publishedAt: string;
  sourceName: string;
  sourceUrl: string;
  sourcePublisher?: string;
}

export interface WeeklyWireDigest {
  weekLabel: string;
  startDate: string;
  endDate: string;
  items: PeopleMoveItem[];
}

function parsePersonMeta(title: string, summary: string): { personName: string; newRole: string; organisationName: string } {
  // Extract standard patterns like: "John Smith appointed Head of FM at Mitie"
  const appointMatch = title.match(/^(?:Appointment:\s*)?([A-Z][a-zA-Z\s.-]+?)\s+(?:appointed|named|joins|promoted to)\s+([^,]+?)(?:\s+at|\s+for|\s+with)\s+([^,.-]+)/i);
  if (appointMatch) {
    return {
      personName: appointMatch[1].trim(),
      newRole: appointMatch[2].trim(),
      organisationName: appointMatch[3].trim(),
    };
  }

  return {
    personName: title.split(/appointed|joins|promoted/i)[0]?.trim() || 'Senior Professional',
    newRole: 'Appointed Role',
    organisationName: 'UK FM Sector',
  };
}

export async function getPeopleMovesWire(limit = 40): Promise<PeopleMoveItem[]> {
  // Query canonical intelligence items tagged with people-appointments
  const { data } = await dbQuery<any[]>(
    `canonical_intelligence_items?trade_tags=cs.{people-appointments}&review_status=in.(approved,auto_published)&order=published_at.desc&limit=${limit}`
  );

  if (!data || data.length === 0) {
    // Fallback search across title for appointment keywords if specific tag is empty
    const { data: keywordData } = await dbQuery<any[]>(
      `canonical_intelligence_items?title=ilike.*appoint*&review_status=in.(approved,auto_published)&order=published_at.desc&limit=${limit}`
    );
    if (!keywordData) return [];
    return keywordData.map(mapIntelligenceToPeopleMove);
  }

  return data.map(mapIntelligenceToPeopleMove);
}

function mapIntelligenceToPeopleMove(row: any): PeopleMoveItem {
  const meta = parsePersonMeta(row.title, row.summary || row.key_takeaways?.[0] || '');
  return {
    id: row.id,
    slug: row.slug || row.id,
    title: row.title,
    personName: meta.personName,
    newRole: meta.newRole,
    organisationName: meta.organisationName,
    summary: row.summary || (row.key_takeaways && row.key_takeaways[0]) || row.title,
    publishedAt: row.published_at || row.created_at,
    sourceName: row.source_name || 'Industry Wire',
    sourceUrl: row.source_url || '#',
    sourcePublisher: row.source_publisher,
  };
}

export async function getGroupedWeeklyWire(): Promise<WeeklyWireDigest[]> {
  const items = await getPeopleMovesWire(60);
  if (items.length === 0) return [];

  // Group by week
  const groups: Map<string, PeopleMoveItem[]> = new Map();

  for (const item of items) {
    const d = new Date(item.publishedAt);
    const year = d.getFullYear();
    // Calculate ISO week number
    const target = new Date(d.valueOf());
    const dayNr = (d.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }
    const weekNum = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
    const key = `${year}-W${weekNum < 10 ? '0' + weekNum : weekNum}`;

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  }

  const result: WeeklyWireDigest[] = [];
  for (const [key, groupItems] of groups.entries()) {
    result.push({
      weekLabel: `Week ${key.split('-W')[1]}, ${key.split('-')[0]}`,
      startDate: groupItems[groupItems.length - 1]?.publishedAt || '',
      endDate: groupItems[0]?.publishedAt || '',
      items: groupItems,
    });
  }

  return result;
}
