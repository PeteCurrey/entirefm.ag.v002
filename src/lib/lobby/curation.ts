import type { LobbyHomepageCuration } from './types';
import { dbQuery, isDbConfigured } from '@/server/db/client';

/**
 * THE LOBBY — HOMEPAGE CURATION CONFIGURATION & PERSISTENCE
 * ============================================================
 * Manages editorial slot assignments for The Lobby homepage.
 * 
 * Supports both database-persisted configuration (via Supabase lobby_homepage_curation)
 * and fail-safe local fallback.
 * 
 * STALENESS SAFEGUARDS:
 * - Dynamic ISO week derivation at render time so edition labels never drift.
 * - Automated staleness alarm if updatedAt is > 8 days old.
 */

export const STATIC_LOBBY_HOMEPAGE_CURATION: LobbyHomepageCuration = {
  updatedAt: '2026-08-27',
  editionLabel: 'Edition 2026.35 · Daily Intelligence',

  // 1. Dominant "The Week That Matters" lead briefing
  leadStorySlug: 'building-safety-act-what-fm-teams-need-to-know-now',

  // 2. Secondary Compliance Watch module
  complianceWatchSlug: 'mandatory-digital-occurrence-reporting-duty-holder-rules',

  // 3. The Engineer's Note technical insight
  engineersNoteSlug: 'condenser-airflow-starvation-on-enclosed-rooftops',

  // 4. One Useful Thing practical asset CTA
  usefulThingSlug: 'fm-mobilisation-handover-audit-matrix',

  // 5. From The Field photography-led observation
  fromTheFieldSlug: 'rooftop-condenser-vibration-resonance-defect',

  // 6. Ask EntireFM Q&A feature
  askEntireFMSlug: 'mobilisation-handover-what-compliance-data-to-demand',

  // 7. Worth Attending curated event
  worthAttendingSlug: 'building-decarbonisation-hard-fm-summit-2026',

  // 8. Curated Toolkit highlighting existing tools
  featuredToolkitUrls: [
    '/tools/ppm-schedule-builder',
    '/tools/compliance-checker',
    '/tools/tender-brief',
  ],

  // 9. Active weekly knowledge question ID
  activeQuestionId: 'lq-2026-w35',

  // 10. Active industry pulse poll ID
  activePulseId: 'pulse-2026-08',
};

// Legacy sync export for backward compatibility
export let LOBBY_HOMEPAGE_CURATION: LobbyHomepageCuration = { ...STATIC_LOBBY_HOMEPAGE_CURATION };

/**
 * Calculate current ISO 8601 week number and year.
 */
export function getCurrentIsoWeek(date: Date = new Date()): { year: number; week: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { year: d.getUTCFullYear(), week: weekNo };
}

/**
 * Derives real, current ISO week edition label dynamically at render time.
 */
export function computeDynamicEditionLabel(date: Date = new Date()): string {
  const { year, week } = getCurrentIsoWeek(date);
  return `Edition ${year}.${week.toString().padStart(2, '0')} · Daily Intelligence`;
}

export interface StalenessCheckResult {
  isStale: boolean;
  ageInDays: number;
  thresholdDays: number;
  updatedAt: string;
  warning?: string;
}

/**
 * Automated staleness check: logs warning if curation is older than thresholdDays (default 8).
 */
export function checkCurationStaleness(updatedAt: string, thresholdDays = 8): StalenessCheckResult {
  const updatedTime = new Date(updatedAt).getTime();
  const now = Date.now();
  const diffMs = now - updatedTime;
  const ageInDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  const isStale = ageInDays > thresholdDays;

  const warning = isStale
    ? `[CURATION_STALE_ALERT] The Lobby homepage curation is ${ageInDays} days old (updatedAt: ${updatedAt}). Threshold is ${thresholdDays} days. Content refresh required!`
    : undefined;

  if (isStale) {
    console.warn(warning);
  }

  return { isStale, ageInDays, thresholdDays, updatedAt, warning };
}

/**
 * Async getter: resolves active curation from Supabase database, falling back to static config.
 */
export async function getLobbyHomepageCuration(): Promise<LobbyHomepageCuration> {
  const dynamicEditionLabel = computeDynamicEditionLabel();

  if (!isDbConfigured()) {
    checkCurationStaleness(LOBBY_HOMEPAGE_CURATION.updatedAt);
    return {
      ...LOBBY_HOMEPAGE_CURATION,
      editionLabel: dynamicEditionLabel,
    };
  }

  try {
    const { data } = await dbQuery<any[]>('lobby_homepage_curation?id=eq.current&limit=1');
    if (data && data.length > 0) {
      const row = data[0];
      const updatedAt = row.updated_at ? new Date(row.updated_at).toISOString().split('T')[0] : '2026-08-27';
      checkCurationStaleness(updatedAt);

      const resolved: LobbyHomepageCuration = {
        updatedAt,
        editionLabel: dynamicEditionLabel,
        leadStorySlug: row.lead_story_slug || STATIC_LOBBY_HOMEPAGE_CURATION.leadStorySlug,
        complianceWatchSlug: row.compliance_watch_slug || STATIC_LOBBY_HOMEPAGE_CURATION.complianceWatchSlug,
        engineersNoteSlug: row.engineers_note_slug || STATIC_LOBBY_HOMEPAGE_CURATION.engineersNoteSlug,
        usefulThingSlug: row.useful_thing_slug || STATIC_LOBBY_HOMEPAGE_CURATION.usefulThingSlug,
        fromTheFieldSlug: row.from_the_field_slug || STATIC_LOBBY_HOMEPAGE_CURATION.fromTheFieldSlug,
        askEntireFMSlug: row.ask_entirefm_slug || STATIC_LOBBY_HOMEPAGE_CURATION.askEntireFMSlug,
        worthAttendingSlug: row.worth_attending_slug || STATIC_LOBBY_HOMEPAGE_CURATION.worthAttendingSlug,
        featuredToolkitUrls: row.featured_toolkit_urls || STATIC_LOBBY_HOMEPAGE_CURATION.featuredToolkitUrls,
        activeQuestionId: row.active_question_id || STATIC_LOBBY_HOMEPAGE_CURATION.activeQuestionId,
        activePulseId: row.active_pulse_id || STATIC_LOBBY_HOMEPAGE_CURATION.activePulseId,
      };

      // Keep sync export aligned in memory
      LOBBY_HOMEPAGE_CURATION = resolved;
      return resolved;
    }
  } catch (err) {
    console.error('Error reading lobby_homepage_curation from DB:', err);
  }

  checkCurationStaleness(LOBBY_HOMEPAGE_CURATION.updatedAt);
  return {
    ...LOBBY_HOMEPAGE_CURATION,
    editionLabel: dynamicEditionLabel,
  };
}

/**
 * Save new editorial slot assignments to the database without requiring an application redeploy.
 */
export async function saveLobbyHomepageCuration(
  curation: Partial<LobbyHomepageCuration>,
  updatedBy: string
): Promise<LobbyHomepageCuration> {
  const now = new Date().toISOString();
  const payload = {
    id: 'current',
    lead_story_slug: curation.leadStorySlug || LOBBY_HOMEPAGE_CURATION.leadStorySlug,
    compliance_watch_slug: curation.complianceWatchSlug || LOBBY_HOMEPAGE_CURATION.complianceWatchSlug,
    engineers_note_slug: curation.engineersNoteSlug || LOBBY_HOMEPAGE_CURATION.engineersNoteSlug,
    useful_thing_slug: curation.usefulThingSlug || LOBBY_HOMEPAGE_CURATION.usefulThingSlug,
    from_the_field_slug: curation.fromTheFieldSlug || LOBBY_HOMEPAGE_CURATION.fromTheFieldSlug,
    ask_entirefm_slug: curation.askEntireFMSlug || LOBBY_HOMEPAGE_CURATION.askEntireFMSlug,
    worth_attending_slug: curation.worthAttendingSlug || LOBBY_HOMEPAGE_CURATION.worthAttendingSlug,
    featured_toolkit_urls: curation.featuredToolkitUrls || LOBBY_HOMEPAGE_CURATION.featuredToolkitUrls,
    active_question_id: curation.activeQuestionId || LOBBY_HOMEPAGE_CURATION.activeQuestionId,
    active_pulse_id: curation.activePulseId || LOBBY_HOMEPAGE_CURATION.activePulseId,
    updated_at: now,
    updated_by: updatedBy,
  };

  if (isDbConfigured()) {
    await dbQuery('lobby_homepage_curation', {
      method: 'POST',
      body: payload,
      headers: { Prefer: 'resolution=merge-duplicates' },
    });
  }

  LOBBY_HOMEPAGE_CURATION = {
    ...LOBBY_HOMEPAGE_CURATION,
    ...curation,
    updatedAt: now.split('T')[0],
    editionLabel: computeDynamicEditionLabel(),
  };

  return LOBBY_HOMEPAGE_CURATION;
}
