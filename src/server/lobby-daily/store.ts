/**
 * ENTIREFM THE LOBBY DAILY — DATABASE STORE & MEMORY FALLBACK
 * =============================================================
 * Handles Supabase DB persistence for daily editions, candidate audit logs,
 * delivery logs, settings, and subscriber preferences.
 * Includes in-memory fallback for local offline testing and CI.
 */

import {
  LobbyDailyEdition,
  CandidateStory,
  LobbyDailySettings,
  EditionStatus,
  SubscriptionFrequency,
} from './types';
import { dbQuery, isDbConfigured } from '@/server/db/client';

export const DEFAULT_LOBBY_DAILY_SETTINGS: LobbyDailySettings = {
  id: 'default',
  sendScheduleType: 'WEEKDAYS_ONLY',
  sendTimeLondon: '06:45',
  timezone: 'Europe/London',
  minStoriesPerEdition: 8,
  maxStoriesPerEdition: 14,
  autoSendEnabled: false,
  manualApprovalRequired: true,
  emergencyKillSwitch: false,
  senderName: 'The Lobby by EntireFM',
  senderEmail: 'briefing@entirefm.com',
  replyToEmail: 'editorial@entirefm.com',
  sponsorEnabled: false,
  sponsorConfig: {},
  sourceAllowlist: [],
  sourceBlocklist: [],
  updatedAt: new Date().toISOString(),
};

/** In-memory fallback store for local development / testing */
class LobbyDailyMemoryStore {
  editions = new Map<string, LobbyDailyEdition>();
  candidates = new Map<string, CandidateStory>();
  deliveryLogs = new Map<string, any>();
  settings: LobbyDailySettings = { ...DEFAULT_LOBBY_DAILY_SETTINGS };
}

export const memoryStore = new LobbyDailyMemoryStore();

// ----------------------------------------------------------------------------
// 1. EDITIONS REPOSITORY
// ----------------------------------------------------------------------------

export async function saveEdition(edition: LobbyDailyEdition): Promise<LobbyDailyEdition> {
  edition.updatedAt = new Date().toISOString();
  memoryStore.editions.set(edition.id, edition);

  if (isDbConfigured()) {
    await dbQuery('lobby_daily_editions', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates' },
      body: {
        id: edition.id,
        edition_number: edition.editionNumber,
        edition_date: edition.editionDate,
        slug: edition.slug,
        status: edition.status,
        subject_line: edition.subjectLine,
        preheader: edition.preheader,
        reading_time_minutes: edition.readingTimeMinutes,
        masthead_data: edition.masthead,
        lead_story: edition.leadStory,
        morning_brief: edition.morningBrief,
        what_changed_today: edition.whatChangedToday,
        compliance_watch: edition.complianceWatch,
        contracts_mobilisations: edition.contractsMobilisations,
        engineers_note: edition.engineersNote,
        on_the_horizon: edition.onTheHorizon,
        one_useful_thing: edition.oneUsefulThing,
        sponsor_block: edition.sponsorBlock,
        footer_details: edition.footer,
        validation_passed: edition.validationPassed,
        validation_report: edition.validationReport,
        approved_by_admin_id: edition.approvedByAdminId,
        approved_at: edition.approvedAt,
        scheduled_send_at: edition.scheduledSendAt,
        sent_at: edition.sentAt,
        editorial_audit_trail: edition.editorialAuditTrail,
        utm_campaign: edition.utmCampaign,
        total_recipients: edition.totalRecipients,
        total_delivered: edition.totalDelivered,
        total_opened: edition.totalOpened,
        total_clicked: edition.totalClicked,
        total_unsubscribed: edition.totalUnsubscribed,
        total_bounced: edition.totalBounced,
        total_complaints: edition.totalComplaints,
        story_click_metrics: edition.storyClickMetrics,
        is_indexable_web_edition: edition.isIndexableWebEdition,
        updated_at: edition.updatedAt,
      },
    });
  }

  return edition;
}

export async function getEditionById(id: string): Promise<LobbyDailyEdition | null> {
  const mem = memoryStore.editions.get(id);
  if (mem) return mem;

  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>(`lobby_daily_editions?id=eq.${id}&limit=1`);
    if (data && data[0]) {
      const row = data[0];
      const edition: LobbyDailyEdition = {
        id: row.id,
        editionNumber: row.edition_number,
        editionDate: row.edition_date,
        slug: row.slug,
        status: row.status,
        subjectLine: row.subject_line,
        preheader: row.preheader,
        readingTimeMinutes: row.reading_time_minutes,
        masthead: row.masthead_data,
        leadStory: row.lead_story,
        morningBrief: row.morning_brief || [],
        whatChangedToday: row.what_changed_today || [],
        complianceWatch: row.compliance_watch,
        contractsMobilisations: row.contracts_mobilisations || [],
        engineersNote: row.engineers_note,
        onTheHorizon: row.on_the_horizon,
        oneUsefulThing: row.one_useful_thing,
        sponsorBlock: row.sponsor_block,
        footer: row.footer_details,
        validationPassed: row.validation_passed,
        validationReport: row.validation_report || { errors: [], warnings: [], verifiedLinks: [] },
        approvedByAdminId: row.approved_by_admin_id,
        approvedAt: row.approved_at,
        scheduledSendAt: row.scheduled_send_at,
        sentAt: row.sent_at,
        editorialAuditTrail: row.editorial_audit_trail || [],
        utmCampaign: row.utm_campaign,
        totalRecipients: row.total_recipients || 0,
        totalDelivered: row.total_delivered || 0,
        totalOpened: row.total_opened || 0,
        totalClicked: row.total_clicked || 0,
        totalUnsubscribed: row.total_unsubscribed || 0,
        totalBounced: row.total_bounced || 0,
        totalComplaints: row.total_complaints || 0,
        storyClickMetrics: row.story_click_metrics || {},
        isIndexableWebEdition: row.is_indexable_web_edition || false,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
      memoryStore.editions.set(edition.id, edition);
      return edition;
    }
  }

  return null;
}

export async function getEditionBySlug(slug: string): Promise<LobbyDailyEdition | null> {
  for (const ed of memoryStore.editions.values()) {
    if (ed.slug === slug) return ed;
  }

  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>(`lobby_daily_editions?slug=eq.${slug}&limit=1`);
    if (data && data[0]) {
      return getEditionById(data[0].id);
    }
  }

  return null;
}

export async function listEditions(options: {
  status?: EditionStatus;
  limit?: number;
  offset?: number;
} = {}): Promise<{ editions: LobbyDailyEdition[]; total: number }> {
  let list = Array.from(memoryStore.editions.values());

  if (options.status) {
    list = list.filter((e) => e.status === options.status);
  }

  list.sort((a, b) => new Date(b.editionDate).getTime() - new Date(a.editionDate).getTime());

  if (isDbConfigured()) {
    const filter = options.status ? `&status=eq.${options.status}` : '';
    const { data } = await dbQuery<any[]>(
      `lobby_daily_editions?order=edition_date.desc&limit=${options.limit || 50}&offset=${options.offset || 0}${filter}`
    );
    if (data && data.length > 0) {
      const dbEditions: LobbyDailyEdition[] = [];
      for (const row of data) {
        const ed = await getEditionById(row.id);
        if (ed) dbEditions.push(ed);
      }
      return { editions: dbEditions, total: dbEditions.length };
    }
  }

  const offset = options.offset || 0;
  const limit = options.limit || 50;
  return {
    editions: list.slice(offset, offset + limit),
    total: list.length,
  };
}

export async function updateEditionStatus(
  id: string,
  status: EditionStatus,
  adminId: string = 'ADMIN',
  details?: string
): Promise<LobbyDailyEdition | null> {
  const edition = await getEditionById(id);
  if (!edition) return null;

  edition.status = status;
  if (status === 'AWAITING_APPROVAL' || status === 'SCHEDULED' || status === 'SENT') {
    edition.approvedByAdminId = adminId;
    edition.approvedAt = new Date().toISOString();
  }
  if (status === 'SENT') {
    edition.sentAt = new Date().toISOString();
  }

  edition.editorialAuditTrail.push({
    action: `STATUS_CHANGED_TO_${status}`,
    adminId,
    timestamp: new Date().toISOString(),
    details,
  });

  return saveEdition(edition);
}

// ----------------------------------------------------------------------------
// 2. CANDIDATES & DEDUPLICATION LEDGER
// ----------------------------------------------------------------------------

export async function saveCandidates(candidates: CandidateStory[]): Promise<void> {
  for (const cand of candidates) {
    memoryStore.candidates.set(cand.id, cand);
  }

  if (isDbConfigured() && candidates.length > 0) {
    const rows = candidates.map((c) => ({
      id: c.id,
      source_id: c.sourceId,
      publisher_name: c.publisherName,
      authority_tier: c.authorityTier,
      source_url: c.sourceUrl,
      canonical_url: c.canonicalUrl,
      normalized_headline: c.normalizedHeadline,
      original_headline: c.originalHeadline,
      published_at: c.publishedAt,
      category: c.category,
      summary: c.summary,
      operational_takeaway: c.operationalTakeaway,
      original_image_url: c.originalImageUrl,
      resolved_image_url: c.resolvedImageUrl,
      image_rights_status: c.imageRightsStatus,
      image_rights_basis: c.imageRightsBasis,
      image_credit: c.imageCredit,
      image_alt: c.imageAlt,
      source_confidence: c.sourceConfidence,
      is_duplicate: c.isDuplicate,
      rejection_reason: c.rejectionReason,
      used_in_edition_id: c.usedInEditionId,
      is_manually_excluded: c.isManuallyExcluded,
      contract_value: c.contractValue,
      buyer_authority: c.buyerAuthority,
      supplier_winner: c.supplierWinner,
    }));

    await dbQuery('lobby_daily_candidates', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates' },
      body: rows,
    });
  }
}

export async function getPreviouslyUsedUrls(daysBack: number = 30): Promise<Set<string>> {
  const used = new Set<string>();

  for (const ed of memoryStore.editions.values()) {
    if (ed.leadStory?.sourceUrl) used.add(ed.leadStory.sourceUrl);
    for (const mb of ed.morningBrief || []) {
      if (mb.sourceUrl) used.add(mb.sourceUrl);
    }
    for (const wc of ed.whatChangedToday || []) {
      if (wc.sourceUrl) used.add(wc.sourceUrl);
    }
    for (const c of ed.contractsMobilisations || []) {
      if (c.sourceUrl) used.add(c.sourceUrl);
    }
  }

  return used;
}

export async function getPreviouslyUsedHeadlines(daysBack: number = 30): Promise<string[]> {
  const headlines: string[] = [];

  for (const ed of memoryStore.editions.values()) {
    if (ed.leadStory?.headline) headlines.push(ed.leadStory.headline);
    for (const mb of ed.morningBrief || []) {
      if (mb.headline) headlines.push(mb.headline);
    }
    for (const wc of ed.whatChangedToday || []) {
      if (wc.headline) headlines.push(wc.headline);
    }
    for (const c of ed.contractsMobilisations || []) {
      if (c.headline) headlines.push(c.headline);
    }
  }

  return headlines;
}

// ----------------------------------------------------------------------------
// 3. SETTINGS
// ----------------------------------------------------------------------------

export async function getLobbyDailySettings(): Promise<LobbyDailySettings> {
  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>('lobby_daily_settings?id=eq.default&limit=1');
    if (data && data[0]) {
      const row = data[0];
      return {
        id: row.id,
        sendScheduleType: row.send_schedule_type || 'WEEKDAYS_ONLY',
        sendTimeLondon: row.send_time_london || '06:45',
        timezone: row.timezone || 'Europe/London',
        minStoriesPerEdition: row.min_stories_per_edition || 8,
        maxStoriesPerEdition: row.max_stories_per_edition || 14,
        autoSendEnabled: row.auto_send_enabled || false,
        manualApprovalRequired: row.manual_approval_required !== false,
        emergencyKillSwitch: row.emergency_kill_switch || false,
        senderName: row.sender_name || 'The Lobby by EntireFM',
        senderEmail: row.sender_email || 'briefing@entirefm.com',
        replyToEmail: row.reply_to_email || 'editorial@entirefm.com',
        sponsorEnabled: row.sponsor_enabled || false,
        sponsorConfig: row.sponsor_config || {},
        sourceAllowlist: row.source_allowlist || [],
        sourceBlocklist: row.source_blocklist || [],
        updatedByAdminId: row.updated_by_admin_id,
        updatedAt: row.updated_at,
      };
    }
  }
  return memoryStore.settings;
}

export async function updateLobbyDailySettings(
  settings: Partial<LobbyDailySettings>,
  adminId: string = 'ADMIN'
): Promise<LobbyDailySettings> {
  const current = await getLobbyDailySettings();
  const updated: LobbyDailySettings = {
    ...current,
    ...settings,
    updatedByAdminId: adminId,
    updatedAt: new Date().toISOString(),
  };

  memoryStore.settings = updated;

  if (isDbConfigured()) {
    await dbQuery('lobby_daily_settings', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates' },
      body: {
        id: 'default',
        send_schedule_type: updated.sendScheduleType,
        send_time_london: updated.sendTimeLondon,
        timezone: updated.timezone,
        min_stories_per_edition: updated.minStoriesPerEdition,
        max_stories_per_edition: updated.maxStoriesPerEdition,
        auto_send_enabled: updated.autoSendEnabled,
        manual_approval_required: updated.manualApprovalRequired,
        emergency_kill_switch: updated.emergencyKillSwitch,
        sender_name: updated.senderName,
        sender_email: updated.senderEmail,
        reply_to_email: updated.replyToEmail,
        sponsor_enabled: updated.sponsorEnabled,
        sponsor_config: updated.sponsorConfig,
        source_allowlist: updated.sourceAllowlist,
        source_blocklist: updated.sourceBlocklist,
        updated_by_admin_id: adminId,
        updated_at: updated.updatedAt,
      },
    });
  }

  return updated;
}
