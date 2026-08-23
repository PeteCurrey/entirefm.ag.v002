/**
 * LEAD STORE — SUPABASE OVER REST
 * ===============================
 * Reads and writes the `leads` table through PostgREST with plain `fetch`.
 *
 * WHY NOT THE SUPABASE CLIENT
 * ---------------------------
 * The project has Supabase credentials but no Supabase package, and adding one
 * to ship a table insert is a dependency for no benefit — PostgREST is an
 * ordinary HTTP API. Two functions of `fetch` do the whole job and there is no
 * client library to keep current.
 *
 * SECURITY
 * --------
 * Everything here uses the SERVICE ROLE key, which bypasses row level
 * security. It must never reach the browser, which is why every function in
 * this file is server-only and why the table has RLS enabled with no policies:
 * the anon key ships in the client bundle, so without RLS anyone could read
 * every enquiry the site has ever taken.
 *
 * FAILURE
 * -------
 * `saveLead` returns false rather than throwing. The endpoint above it decides
 * what to do, and it has other sinks to try — a Supabase outage should fall
 * through to email, not 500 the request.
 */

// No `server-only` import: the package is not a dependency here. This module
// is only ever imported from route handlers and server components, and the
// service role key it reads is not exposed to the client bundle in either.

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

/** Persist one enquiry. Returns true only when the row was actually written. */
export async function saveLead(lead: LeadInput): Promise<boolean> {
  const cfg = config();
  if (!cfg) return false;

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
    form_id: lead.form_id ?? 'enquiry-form',
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
      console.error('[LEAD_STORE] insert failed', res.status, await res.text().catch(() => ''));
      return false;
    }
    return true;
  } catch (e) {
    console.error('[LEAD_STORE] insert threw', e);
    return false;
  }
}

/** Most recent enquiries, newest first. */
export async function listLeads(limit = 200): Promise<LeadRow[]> {
  const cfg = config();
  if (!cfg) return [];
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
  const cfg = config();
  if (!cfg) return false;
  try {
    const res = await fetch(`${cfg.url}/rest/v1/leads?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: headers(cfg.key, { Prefer: 'return=minimal' }),
      body: JSON.stringify({ status }),
      cache: 'no-store',
    });
    return res.ok;
  } catch {
    return false;
  }
}
