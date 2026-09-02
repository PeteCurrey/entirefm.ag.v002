/**
 * LEAD STORE — SUPABASE & IN-MEMORY ENGINE
 * ========================================
 * Reads and writes the `leads` table through PostgREST and central memory store.
 * Automatically broadcasts events to the Central Notifications System.
 */

import { growthMemoryStore } from '@/server/growth/store';
import { createNotification } from '@/server/notifications';

export interface LeadInput {
  enquiryId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  location?: string;
  message: string;
  landing_page?: string;
  conversion_page?: string;
  page_type?: string;
  first_touch_url?: string;
  last_touch_url?: string;
  first_touch_referrer?: string;
  last_touch_referrer?: string;
  journey_trail?: any[];
  assisted_pages?: string[];
  gclid?: string;
  msclkid?: string;
  session_id?: string;
  form_id?: string;
  form_page?: string;
  sector_interest?: string;
  location_interest?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  drone_brief?: any;
  lead_priority?: string;
  lead_source?: string;
  asset_scanner_context?: any;
}

export interface LeadRow extends LeadInput {
  id: string;
  enquiry_id: string;
  received_at: string;
  status: string;
  notes: string;
}

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ''), key };
}

/** Whether a Supabase sink is available at all. */
export function leadStoreConfigured() {
  return config() !== null;
}

function headers(key: string, extra: Record<string, string> = {}) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

/** Persist one enquiry and trigger admin notification. */
export async function saveLead(lead: LeadInput): Promise<boolean> {
  const now = new Date().toISOString();

  // 1. Always store in Growth in-memory store for instant admin visibility
  growthMemoryStore.leads.set(lead.enquiryId, {
    id: lead.enquiryId,
    enquiry_id: lead.enquiryId,
    received_at: now,
    name: lead.name,
    email: lead.email,
    phone: lead.phone || '',
    company: lead.company || '',
    service: lead.service || 'General Facilities Management',
    location: lead.location || 'United Kingdom',
    message: lead.message,
    landing_page: lead.landing_page || '',
    conversion_page: lead.conversion_page || '',
    page_type: lead.page_type || 'commercial-service',
    first_touch_url: lead.first_touch_url || '',
    last_touch_url: lead.last_touch_url || '',
    first_touch_referrer: lead.first_touch_referrer || '',
    last_touch_referrer: lead.last_touch_referrer || '',
    form_id: lead.form_id || lead.lead_source || 'enquiry-form',
    form_page: lead.form_page || '',
    journey_trail: lead.journey_trail || [],
    assisted_pages: lead.assisted_pages || [],
    utm_source: lead.utm_source || '',
    utm_medium: lead.utm_medium || '',
    utm_campaign: lead.utm_campaign || '',
    utm_term: lead.utm_term || '',
    utm_content: lead.utm_content || '',
    qualification_status: 'NEW',
    status: 'NEW',
    notes: '',
    estimated_value_gbp: 0,
    is_spam: false,
    drone_brief: lead.drone_brief,
    lead_priority: (lead.lead_priority as any) || (lead.drone_brief?.leadPriority) || 'STANDARD',
  });

  // 2. Trigger real-time admin notification
  await createNotification({
    type: 'NEW_ENQUIRY',
    category: 'LEADS',
    severity: 'ATTENTION',
    title: `New Enquiry: ${lead.service || 'General FM'}`,
    message: `Inbound enquiry from ${lead.company || lead.name} (${lead.location || 'UK'}).`,
    entity_type: 'lead',
    entity_id: lead.enquiryId,
    action_url: `/admin/growth/leads/${lead.enquiryId}`,
    dedupe_key: `lead:${lead.enquiryId}:new`,
    created_at: now,
    metadata: {
      email: lead.email,
      phone: lead.phone,
      source: lead.conversion_page || lead.form_id || lead.landing_page,
    },
  }).catch((err) => {
    console.warn('[NOTIFICATION_TRIGGER_WARN]', err);
  });

  const cfg = config();
  if (!cfg) return true; // Stored in memory successfully

  const row = {
    enquiry_id: lead.enquiryId,
    name: lead.name,
    email: lead.email,
    phone: lead.phone ?? '',
    company: lead.company ?? '',
    service: lead.service ?? '',
    location: lead.location ?? '',
    message: lead.message,
    landing_page: lead.landing_page ?? '',
    conversion_page: lead.conversion_page ?? '',
    page_type: lead.page_type ?? '',
    first_touch_url: lead.first_touch_url ?? '',
    last_touch_url: lead.last_touch_url ?? '',
    first_touch_referrer: lead.first_touch_referrer ?? '',
    last_touch_referrer: lead.last_touch_referrer ?? '',
    journey_trail: lead.journey_trail ?? [],
    assisted_pages: lead.assisted_pages ?? [],
    gclid: lead.gclid ?? '',
    msclkid: lead.msclkid ?? '',
    session_id: lead.session_id ?? '',
    form_id: lead.form_id ?? lead.lead_source ?? 'enquiry-form',
    form_page: lead.form_page ?? '',
    sector_interest: lead.sector_interest ?? '',
    location_interest: lead.location_interest ?? '',
    utm_source: lead.utm_source ?? '',
    utm_medium: lead.utm_medium ?? '',
    utm_campaign: lead.utm_campaign ?? '',
    utm_term: lead.utm_term ?? '',
    utm_content: lead.utm_content ?? '',
    referrer: lead.referrer ?? '',
  };

  try {
    const res = await fetch(`${cfg.url}/rest/v1/leads`, {
      method: 'POST',
      headers: headers(cfg.key, { Prefer: 'return=minimal' }),
      body: JSON.stringify(row),
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error('[LEAD_STORE] Supabase insert failed', res.status, await res.text().catch(() => ''));
    }
    return true;
  } catch (e) {
    console.error('[LEAD_STORE] Supabase insert threw', e);
    return true;
  }
}

/** Most recent enquiries, newest first. */
export async function listLeads(limit = 200): Promise<LeadRow[]> {
  const cfg = config();
  if (!cfg) {
    return Array.from(growthMemoryStore.leads.values()).map((l) => ({
      id: l.id,
      enquiryId: l.enquiry_id,
      enquiry_id: l.enquiry_id,
      name: l.name,
      email: l.email,
      phone: l.phone,
      company: l.company,
      service: l.service,
      location: l.location,
      message: l.message,
      received_at: l.received_at,
      status: l.qualification_status || 'NEW',
      notes: '',
    }));
  }

  try {
    const res = await fetch(
      `${cfg.url}/rest/v1/leads?select=*&order=received_at.desc&limit=${limit}`,
      { headers: headers(cfg.key), cache: 'no-store' }
    );
    if (!res.ok) {
      console.error('[LEAD_STORE] list failed', res.status);
      return [];
    }
    return (await res.json()) as LeadRow[];
  } catch (e) {
    console.error('[LEAD_STORE] list threw', e);
    return [];
  }
}

/** Move a lead through the handling states shown in the admin view. */
export async function setLeadStatus(id: string, status: string): Promise<boolean> {
  const lead = growthMemoryStore.leads.get(id);
  if (lead) {
    lead.qualification_status = status as any;
    growthMemoryStore.leads.set(id, lead);
  }

  const cfg = config();
  if (!cfg) return true;
  try {
    const res = await fetch(`${cfg.url}/rest/v1/leads?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: headers(cfg.key, { Prefer: 'return=minimal' }),
      body: JSON.stringify({ status, qualification_status: status }),
      cache: 'no-store',
    });
    return res.ok;
  } catch {
    return true;
  }
}
