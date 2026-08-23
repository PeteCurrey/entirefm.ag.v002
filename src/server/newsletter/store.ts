/**
-- ============================================================================
-- ENTIREFM NEWSLETTER DATABASE STORE & MEMORY FALLBACK
-- ============================================================================
*/

import {
  NewsletterSubscriber,
  NewsletterCampaign,
  NewsletterSuppression,
  NewsletterAutomationSettings,
  SocialDistributionDraft,
  WebsiteFeaturePlacement,
} from './types';
import { dbQuery, isDbConfigured } from '@/server/db/client';

export const DEFAULT_AUTOMATION_SETTINGS: NewsletterAutomationSettings = {
  id: 'default',
  autoDraftEnabled: true,
  autoScheduleEnabled: false,
  autoSendEnabled: false,
  draftDayOfWeek: 2, // Tuesday
  draftHourUtc: 8,
  killSwitchPaused: false,
  emailDeliveryProvider: 'RESEND',
  sendingDomain: 'entirefm.com',
  updatedAt: new Date().toISOString(),
};

/** In-memory fallback for local development / offline PostgREST */
class NewsletterMemoryStore {
  subscribers = new Map<string, NewsletterSubscriber>();
  campaigns = new Map<string, NewsletterCampaign>();
  suppressions = new Map<string, NewsletterSuppression>();
  automationSettings: NewsletterAutomationSettings = { ...DEFAULT_AUTOMATION_SETTINGS };
  socialDrafts = new Map<string, SocialDistributionDraft>();
  featurePlacements = new Map<string, WebsiteFeaturePlacement>();
}

export const memoryStore = new NewsletterMemoryStore();

// ----------------------------------------------------------------------------
// SUBSCRIBER REPOSITORY
// ----------------------------------------------------------------------------

export async function addSubscriber(
  input: Omit<NewsletterSubscriber, 'id' | 'createdAt' | 'updatedAt' | 'unsubscribeToken'>
): Promise<{ subscriber: NewsletterSubscriber; created: boolean; error?: string }> {
  const email = input.email.trim().toLowerCase();

  // 1. Check suppression list first
  const isSuppressed = await checkSuppression(email);
  if (isSuppressed) {
    return {
      subscriber: null as any,
      created: false,
      error: 'This email address is currently on the suppression list.',
    };
  }

  // 2. Check if already exists in DB / Memory
  const existing = await getSubscriberByEmail(email);
  if (existing) {
    if (existing.status === 'UNSUBSCRIBED') {
      // Re-subscribe with updated consent
      existing.status = 'ACTIVE';
      existing.consentedAt = new Date().toISOString();
      existing.consentSource = input.consentSource;
      existing.updatedAt = new Date().toISOString();
      if (input.firstName) existing.firstName = input.firstName;
      if (input.company) existing.company = input.company;
      if (input.role) existing.role = input.role;

      if (isDbConfigured()) {
        await dbQuery(`newsletter_subscribers?email=eq.${encodeURIComponent(email)}`, {
          method: 'PATCH',
          body: {
            status: 'ACTIVE',
            consented_at: existing.consentedAt,
            consent_source: existing.consentSource,
            first_name: existing.firstName,
            company: existing.company,
            role: existing.role,
            updated_at: existing.updatedAt,
          },
        });
      }
      return { subscriber: existing, created: false };
    }
    return { subscriber: existing, created: false };
  }

  // 3. Create fresh subscriber record
  const newSub: NewsletterSubscriber = {
    id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    email,
    firstName: input.firstName,
    company: input.company,
    role: input.role,
    status: input.status || 'ACTIVE',
    consentSource: input.consentSource || 'PUBLIC_WEBSITE',
    consentTextVersion: input.consentTextVersion || '2026-V1',
    consentedAt: input.consentedAt || new Date().toISOString(),
    signupPage: input.signupPage || '/fm-briefing',
    utmSource: input.utmSource,
    utmMedium: input.utmMedium,
    utmCampaign: input.utmCampaign,
    utmTerm: input.utmTerm,
    utmContent: input.utmContent,
    unsubscribeToken: `unsub-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    interests: input.interests || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memoryStore.subscribers.set(email, newSub);

  if (isDbConfigured()) {
    await dbQuery('newsletter_subscribers', {
      method: 'POST',
      body: {
        email: newSub.email,
        first_name: newSub.firstName,
        company: newSub.company,
        role: newSub.role,
        status: newSub.status,
        consent_source: newSub.consentSource,
        consent_text_version: newSub.consentTextVersion,
        consented_at: newSub.consentedAt,
        signup_page: newSub.signupPage,
        utm_source: newSub.utmSource,
        utm_medium: newSub.utmMedium,
        utm_campaign: newSub.utmCampaign,
        utm_term: newSub.utmTerm,
        utm_content: newSub.utmContent,
        unsubscribe_token: newSub.unsubscribeToken,
        interests: newSub.interests,
      },
    });
  }

  return { subscriber: newSub, created: true };
}

export async function getSubscriberByEmail(email: string): Promise<NewsletterSubscriber | null> {
  const cleanEmail = email.trim().toLowerCase();
  if (memoryStore.subscribers.has(cleanEmail)) {
    return memoryStore.subscribers.get(cleanEmail)!;
  }

  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>(
      `newsletter_subscribers?email=eq.${encodeURIComponent(cleanEmail)}&select=*`
    );
    if (data && data.length > 0) {
      const row = data[0];
      const sub: NewsletterSubscriber = {
        id: row.id,
        email: row.email,
        firstName: row.first_name,
        company: row.company,
        role: row.role,
        status: row.status,
        consentSource: row.consent_source,
        consentTextVersion: row.consent_text_version,
        consentedAt: row.consented_at,
        signupPage: row.signup_page,
        utmSource: row.utm_source,
        utmMedium: row.utm_medium,
        utmCampaign: row.utm_campaign,
        utmTerm: row.utm_term,
        utmContent: row.utm_content,
        unsubscribeToken: row.unsubscribe_token,
        interests: row.interests || [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
      memoryStore.subscribers.set(cleanEmail, sub);
      return sub;
    }
  }

  return null;
}

export async function getSubscriberByToken(token: string): Promise<NewsletterSubscriber | null> {
  for (const sub of memoryStore.subscribers.values()) {
    if (sub.unsubscribeToken === token) return sub;
  }

  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>(
      `newsletter_subscribers?unsubscribe_token=eq.${encodeURIComponent(token)}&select=*`
    );
    if (data && data.length > 0) {
      const row = data[0];
      return {
        id: row.id,
        email: row.email,
        firstName: row.first_name,
        company: row.company,
        role: row.role,
        status: row.status,
        consentSource: row.consent_source,
        consentTextVersion: row.consent_text_version,
        consentedAt: row.consented_at,
        signupPage: row.signup_page,
        unsubscribeToken: row.unsubscribe_token,
        interests: row.interests || [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    }
  }

  return null;
}

export async function unsubscribeByToken(
  token: string,
  reason: string = 'User requested unsubscribe'
): Promise<{ success: boolean; email?: string; error?: string }> {
  const sub = await getSubscriberByToken(token);
  if (!sub) return { success: false, error: 'Invalid or expired unsubscribe token' };

  sub.status = 'UNSUBSCRIBED';
  sub.updatedAt = new Date().toISOString();

  // Add to suppression
  await addSuppression(sub.email, 'UNSUBSCRIBED', 'ONE_CLICK_LINK', reason);

  if (isDbConfigured()) {
    await dbQuery(`newsletter_subscribers?id=eq.${sub.id}`, {
      method: 'PATCH',
      body: { status: 'UNSUBSCRIBED', updated_at: sub.updatedAt },
    });
  }

  return { success: true, email: sub.email };
}

export async function listSubscribers(
  options: { status?: string; limit?: number; offset?: number } = {}
): Promise<{ subscribers: NewsletterSubscriber[]; total: number }> {
  let list = Array.from(memoryStore.subscribers.values());

  if (isDbConfigured()) {
    let q = 'newsletter_subscribers?select=*&order=created_at.desc';
    if (options.status) q += `&status=eq.${options.status}`;
    const { data } = await dbQuery<any[]>(q);
    if (data) {
      list = data.map((row) => ({
        id: row.id,
        email: row.email,
        firstName: row.first_name,
        company: row.company,
        role: row.role,
        status: row.status,
        consentSource: row.consent_source,
        consentTextVersion: row.consent_text_version,
        consentedAt: row.consented_at,
        signupPage: row.signup_page,
        utmSource: row.utm_source,
        utmMedium: row.utm_medium,
        utmCampaign: row.utm_campaign,
        unsubscribeToken: row.unsubscribe_token,
        interests: row.interests || [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    }
  }

  if (options.status) {
    list = list.filter((s) => s.status === options.status);
  }

  const total = list.length;
  const offset = options.offset || 0;
  const limit = options.limit || 50;

  return { subscribers: list.slice(offset, offset + limit), total };
}

// ----------------------------------------------------------------------------
// SUPPRESSIONS
// ----------------------------------------------------------------------------

export async function checkSuppression(email: string): Promise<boolean> {
  const clean = email.trim().toLowerCase();
  if (memoryStore.suppressions.has(clean)) return true;

  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>(
      `newsletter_suppressions?email=eq.${encodeURIComponent(clean)}&select=id`
    );
    if (data && data.length > 0) return true;
  }

  return false;
}

export async function addSuppression(
  email: string,
  reason: NewsletterSuppression['reason'],
  source: string = 'ADMIN_MANUAL',
  notes?: string
): Promise<NewsletterSuppression> {
  const clean = email.trim().toLowerCase();
  const suppression: NewsletterSuppression = {
    id: `sup-${Date.now()}`,
    email: clean,
    reason,
    source,
    notes,
    createdAt: new Date().toISOString(),
  };

  memoryStore.suppressions.set(clean, suppression);

  if (isDbConfigured()) {
    await dbQuery('newsletter_suppressions', {
      method: 'POST',
      body: {
        email: clean,
        reason,
        source,
        notes,
      },
    });
  }

  return suppression;
}

export async function listSuppressions(): Promise<NewsletterSuppression[]> {
  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>('newsletter_suppressions?select=*&order=created_at.desc');
    if (data) {
      return data.map((row) => ({
        id: row.id,
        email: row.email,
        reason: row.reason,
        source: row.source,
        notes: row.notes,
        createdAt: row.created_at,
      }));
    }
  }
  return Array.from(memoryStore.suppressions.values());
}

// ----------------------------------------------------------------------------
// CAMPAIGNS
// ----------------------------------------------------------------------------

export async function saveCampaign(
  campaign: NewsletterCampaign
): Promise<NewsletterCampaign> {
  campaign.updatedAt = new Date().toISOString();
  memoryStore.campaigns.set(campaign.id, campaign);

  if (isDbConfigured()) {
    await dbQuery('newsletter_campaigns', {
      method: 'POST',
      body: {
        id: campaign.id,
        name: campaign.name,
        subject: campaign.subject,
        preview_text: campaign.previewText,
        sender_name: campaign.senderName,
        reply_to: campaign.replyTo,
        status: campaign.status,
        scheduled_at: campaign.scheduledAt,
        sent_at: campaign.sentAt,
        utm_campaign: campaign.utmCampaign,
        content_blocks: campaign.contentBlocks,
        target_audience: campaign.targetAudience,
        total_recipients: campaign.totalRecipients,
        total_delivered: campaign.totalDelivered,
        total_opened: campaign.totalOpened,
        total_clicked: campaign.totalClicked,
        total_unsubscribed: campaign.totalUnsubscribed,
        total_bounced: campaign.totalBounced,
        validation_passed: campaign.validationPassed,
        validation_details: campaign.validationDetails,
      },
    });
  }

  return campaign;
}

export async function getCampaignById(id: string): Promise<NewsletterCampaign | null> {
  if (memoryStore.campaigns.has(id)) {
    return memoryStore.campaigns.get(id)!;
  }

  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>(`newsletter_campaigns?id=eq.${id}&select=*`);
    if (data && data.length > 0) {
      const row = data[0];
      return {
        id: row.id,
        name: row.name,
        subject: row.subject,
        previewText: row.preview_text,
        senderName: row.sender_name,
        replyTo: row.reply_to,
        status: row.status,
        scheduledAt: row.scheduled_at,
        sentAt: row.sent_at,
        utmCampaign: row.utm_campaign,
        contentBlocks: row.content_blocks || [],
        targetAudience: row.target_audience || { all: true },
        totalRecipients: row.total_recipients || 0,
        totalDelivered: row.total_delivered || 0,
        totalOpened: row.total_opened || 0,
        totalClicked: row.total_clicked || 0,
        totalUnsubscribed: row.total_unsubscribed || 0,
        totalBounced: row.total_bounced || 0,
        validationPassed: row.validation_passed || false,
        validationDetails: row.validation_details,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    }
  }

  return null;
}

export async function listCampaigns(): Promise<NewsletterCampaign[]> {
  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>('newsletter_campaigns?select=*&order=created_at.desc');
    if (data) {
      return data.map((row) => ({
        id: row.id,
        name: row.name,
        subject: row.subject,
        previewText: row.preview_text,
        senderName: row.sender_name,
        replyTo: row.reply_to,
        status: row.status,
        scheduledAt: row.scheduled_at,
        sentAt: row.sent_at,
        utmCampaign: row.utm_campaign,
        contentBlocks: row.content_blocks || [],
        targetAudience: row.target_audience || { all: true },
        totalRecipients: row.total_recipients || 0,
        totalDelivered: row.total_delivered || 0,
        totalOpened: row.total_opened || 0,
        totalClicked: row.total_clicked || 0,
        totalUnsubscribed: row.total_unsubscribed || 0,
        totalBounced: row.total_bounced || 0,
        validationPassed: row.validation_passed || false,
        validationDetails: row.validation_details,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    }
  }
  return Array.from(memoryStore.campaigns.values());
}

// ----------------------------------------------------------------------------
// AUTOMATION SETTINGS
// ----------------------------------------------------------------------------

export async function getAutomationSettings(): Promise<NewsletterAutomationSettings> {
  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>('newsletter_automation_settings?id=eq.default&select=*');
    if (data && data.length > 0) {
      const row = data[0];
      return {
        id: 'default',
        autoDraftEnabled: row.auto_draft_enabled,
        autoScheduleEnabled: row.auto_schedule_enabled,
        autoSendEnabled: row.auto_send_enabled,
        draftDayOfWeek: row.draft_day_of_week,
        draftHourUtc: row.draft_hour_utc,
        killSwitchPaused: row.kill_switch_paused,
        emailDeliveryProvider: row.email_delivery_provider,
        sendingDomain: row.sending_domain,
        updatedAt: row.updated_at,
      };
    }
  }
  return memoryStore.automationSettings;
}

export async function updateAutomationSettings(
  patch: Partial<NewsletterAutomationSettings>
): Promise<NewsletterAutomationSettings> {
  const current = await getAutomationSettings();
  const updated: NewsletterAutomationSettings = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  memoryStore.automationSettings = updated;

  if (isDbConfigured()) {
    await dbQuery('newsletter_automation_settings?id=eq.default', {
      method: 'PATCH',
      body: {
        auto_draft_enabled: updated.autoDraftEnabled,
        auto_schedule_enabled: updated.autoScheduleEnabled,
        auto_send_enabled: updated.autoSendEnabled,
        draft_day_of_week: updated.draftDayOfWeek,
        draft_hour_utc: updated.draftHourUtc,
        kill_switch_paused: updated.killSwitchPaused,
        email_delivery_provider: updated.emailDeliveryProvider,
        sending_domain: updated.sendingDomain,
        updated_at: updated.updatedAt,
      },
    });
  }

  return updated;
}
