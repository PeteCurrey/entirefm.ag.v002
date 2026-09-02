/**
 * ENTIREFM REAL-WORLD EVENT PRESENCE & NETWORKING STORE
 * ========================================================
 * Manages authentic member RSVPs and peer-to-peer networking
 * for industry conferences, exhibitions, and symposia.
 */

import { dbQuery } from '@/server/db/client';

export interface EventRsvpAttendee {
  memberId: string;
  displayName: string;
  headline?: string;
  company?: string;
  avatarUrl?: string;
  badges: string[];
  status: 'attending' | 'interested';
  rsvpdAt: string;
}

export interface EventDetails {
  id: string;
  slug: string;
  title: string;
  organiser: string;
  dateRange: string;
  startDate: string;
  endDate: string;
  locationName: string;
  city: string;
  fullAddress: string;
  description: string;
  officialUrl: string;
  standNumber?: string;
  topics: string[];
  entireFmPresenceNote?: string;
}

export const CANONICAL_FEATURED_EVENTS: Record<string, EventDetails> = {
  'facilities-estates-management-live-2026': {
    id: 'evt-fem-live-2026',
    slug: 'facilities-estates-management-live-2026',
    title: 'Facilities & Estates Management LIVE 2026',
    organiser: 'FM Media & Technical Conferences UK',
    dateRange: '20–21 October 2026',
    startDate: '2026-10-20T09:00:00Z',
    endDate: '2026-10-21T17:00:00Z',
    locationName: 'Business Design Centre',
    city: 'London',
    fullAddress: '52 Upper Street, Islington, London N1 0QH',
    description:
      'The UK’s premier autumn operational facilities and estates management exhibition. Covering statutory building safety, Golden Thread duty holder compliance, HVAC decarbonisation, and commercial CAFM automation.',
    officialUrl: 'https://www.businessdesigncentre.co.uk',
    standNumber: 'EntireFM Operational Stand B14',
    topics: ['Building Safety Act', 'Golden Thread', 'Hard FM & M&E', 'Decarbonisation', 'CAFM Telemetry'],
    entireFmPresenceNote:
      'EntireFM engineering leads will be attending and hosting practitioner coffee meetups across both days.',
  },
};

/**
 * Retrieve attendees who have RSVP'd to a given event (respects public/member profile visibility).
 */
export async function getEventRsvps(eventSlug: string): Promise<{
  attendees: EventRsvpAttendee[];
  totalAttending: number;
  totalInterested: number;
}> {
  const { data: rsvps } = await dbQuery<any[]>(
    `lobby_event_rsvps?event_slug=eq.${encodeURIComponent(eventSlug)}&order=created_at.desc`
  );

  if (!rsvps || rsvps.length === 0) {
    return { attendees: [], totalAttending: 0, totalInterested: 0 };
  }

  const memberIds = rsvps.map((r) => r.member_id);
  const { data: members } = await dbQuery<any[]>(
    `lobby_members?id=in.(${memberIds.map((id) => `"${id}"`).join(',')})`
  );

  const memberMap = new Map((members || []).map((m) => [m.id, m]));

  const attendees: EventRsvpAttendee[] = [];
  let totalAttending = 0;
  let totalInterested = 0;

  for (const r of rsvps) {
    if (r.status === 'attending') totalAttending++;
    if (r.status === 'interested') totalInterested++;

    const mem = memberMap.get(r.member_id);
    if (mem && mem.profile_visibility !== 'private') {
      attendees.push({
        memberId: mem.id,
        displayName: mem.display_name,
        headline: mem.headline || mem.job_title,
        company: mem.company,
        avatarUrl: mem.avatar_url,
        badges: mem.badges || [],
        status: r.status,
        rsvpdAt: r.created_at,
      });
    }
  }

  return { attendees, totalAttending, totalInterested };
}

/**
 * Check if a member has RSVP'd to an event.
 */
export async function getMemberEventRsvp(
  eventSlug: string,
  memberId: string
): Promise<'attending' | 'interested' | null> {
  const { data } = await dbQuery<any[]>(
    `lobby_event_rsvps?event_slug=eq.${encodeURIComponent(eventSlug)}&member_id=eq.${encodeURIComponent(memberId)}&limit=1`
  );
  if (!data || data.length === 0) return null;
  return data[0].status;
}

/**
 * Toggle or update member RSVP status for an event.
 */
export async function setMemberEventRsvp(
  eventSlug: string,
  memberId: string,
  status: 'attending' | 'interested' | 'cancelled'
): Promise<{ status: string }> {
  if (status === 'cancelled') {
    await dbQuery(
      `lobby_event_rsvps?event_slug=eq.${encodeURIComponent(eventSlug)}&member_id=eq.${encodeURIComponent(memberId)}`,
      { method: 'DELETE' }
    );
    return { status: 'none' };
  }

  const now = new Date().toISOString();
  const id = `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  await dbQuery('lobby_event_rsvps', {
    method: 'POST',
    body: {
      id,
      event_slug: eventSlug,
      member_id: memberId,
      status,
      created_at: now,
      updated_at: now,
    },
    headers: { Prefer: 'resolution=merge-duplicates' },
  });

  return { status };
}
