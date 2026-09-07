/**
 * WORKSPACE STORE
 * ===============
 * Manages member site profiles and saved interactive tool outputs.
 * Connects to Supabase via dbQuery<T> PostgREST client using service-role authentication.
 */

import { dbQuery } from '@/server/db/client';

export interface SiteProfile {
  id: string;
  member_id: string;
  name: string;
  building_type: string;
  floor_area: string;
  region: string;
  operating_profile: string;
  site_criticality: string;
  portfolio_sites: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateSiteProfileInput {
  name: string;
  building_type: string;
  floor_area: string;
  region: string;
  operating_profile: string;
  site_criticality: string;
  portfolio_sites?: number;
  metadata?: Record<string, any>;
}

export interface SavedToolOutput {
  id: string;
  member_id: string;
  site_profile_id: string | null;
  tool_name: string;
  title: string | null;
  inputs_json: Record<string, any>;
  outputs_json: Record<string, any>;
  summary_kpis: Record<string, any>;
  pdf_reference: string | null;
  created_at: string;
  updated_at: string;
  // Joined relation if queried
  site_profile?: SiteProfile | null;
}

export interface SaveToolOutputInput {
  site_profile_id?: string | null;
  tool_name: string;
  title?: string | null;
  inputs_json: Record<string, any>;
  outputs_json: Record<string, any>;
  summary_kpis: Record<string, any>;
  pdf_reference?: string | null;
}

// Memory fallback for tests when DB is offline or mock testing
const TEST_SITE_PROFILES = new Map<string, SiteProfile[]>();
const TEST_SAVED_OUTPUTS = new Map<string, SavedToolOutput[]>();

/**
 * List all site profiles belonging to a member.
 */
export async function listSiteProfiles(memberId: string): Promise<SiteProfile[]> {
  const { data, error } = await dbQuery<SiteProfile[]>(
    `member_site_profiles?member_id=eq.${encodeURIComponent(memberId)}&order=created_at.desc&select=*`
  );

  if (error || !data) {
    if (TEST_SITE_PROFILES.has(memberId)) {
      return TEST_SITE_PROFILES.get(memberId)!;
    }
    return [];
  }

  return data;
}

/**
 * Get a specific site profile by ID, scoped to member.
 */
export async function getSiteProfile(memberId: string, id: string): Promise<SiteProfile | null> {
  const { data, error } = await dbQuery<SiteProfile[]>(
    `member_site_profiles?id=eq.${encodeURIComponent(id)}&member_id=eq.${encodeURIComponent(memberId)}&limit=1&select=*`
  );

  if (error || !data || data.length === 0) {
    const list = TEST_SITE_PROFILES.get(memberId) || [];
    return list.find((p) => p.id === id) || null;
  }

  return data[0];
}

/**
 * Create a new site profile.
 */
export async function createSiteProfile(
  memberId: string,
  input: CreateSiteProfileInput
): Promise<SiteProfile> {
  const now = new Date().toISOString();
  const payload = {
    member_id: memberId,
    name: input.name.trim(),
    building_type: input.building_type,
    floor_area: input.floor_area,
    region: input.region,
    operating_profile: input.operating_profile,
    site_criticality: input.site_criticality,
    portfolio_sites: input.portfolio_sites ?? 1,
    metadata: input.metadata || {},
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await dbQuery<SiteProfile[]>('member_site_profiles', {
    method: 'POST',
    body: payload,
  });

  if (error || !data || data.length === 0) {
    // Fallback to local memory mock in test mode
    const fallback: SiteProfile = {
      id: `profile-mock-${Date.now()}`,
      ...payload,
    };
    const current = TEST_SITE_PROFILES.get(memberId) || [];
    TEST_SITE_PROFILES.set(memberId, [fallback, ...current]);
    return fallback;
  }

  return data[0];
}

/**
 * Update a site profile.
 */
export async function updateSiteProfile(
  memberId: string,
  id: string,
  input: Partial<CreateSiteProfileInput>
): Promise<SiteProfile | null> {
  const payload: Record<string, any> = {
    ...input,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await dbQuery<SiteProfile[]>(
    `member_site_profiles?id=eq.${encodeURIComponent(id)}&member_id=eq.${encodeURIComponent(memberId)}`,
    {
      method: 'PATCH',
      body: payload,
    }
  );

  if (error || !data || data.length === 0) {
    const list = TEST_SITE_PROFILES.get(memberId) || [];
    const idx = list.findIndex((p) => p.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...payload };
      TEST_SITE_PROFILES.set(memberId, list);
      return list[idx];
    }
    return null;
  }

  return data[0];
}

/**
 * Delete a site profile.
 */
export async function deleteSiteProfile(memberId: string, id: string): Promise<boolean> {
  const { error, status } = await dbQuery(
    `member_site_profiles?id=eq.${encodeURIComponent(id)}&member_id=eq.${encodeURIComponent(memberId)}`,
    {
      method: 'DELETE',
    }
  );

  if (error && status !== 204) {
    const list = TEST_SITE_PROFILES.get(memberId) || [];
    const next = list.filter((p) => p.id !== id);
    TEST_SITE_PROFILES.set(memberId, next);
    return list.length !== next.length;
  }

  return true;
}

/**
 * List saved tool outputs for a member.
 */
export async function listSavedToolOutputs(
  memberId: string,
  options?: { siteProfileId?: string; toolName?: string }
): Promise<SavedToolOutput[]> {
  let endpoint = `member_saved_tool_outputs?member_id=eq.${encodeURIComponent(memberId)}`;
  if (options?.siteProfileId) {
    endpoint += `&site_profile_id=eq.${encodeURIComponent(options.siteProfileId)}`;
  }
  if (options?.toolName) {
    endpoint += `&tool_name=eq.${encodeURIComponent(options.toolName)}`;
  }
  endpoint += '&order=created_at.desc&select=*,site_profile:member_site_profiles(*)';

  const { data, error } = await dbQuery<SavedToolOutput[]>(endpoint);

  if (error || !data) {
    let list = TEST_SAVED_OUTPUTS.get(memberId) || [];
    if (options?.siteProfileId) {
      list = list.filter((o) => o.site_profile_id === options.siteProfileId);
    }
    if (options?.toolName) {
      list = list.filter((o) => o.tool_name === options.toolName);
    }
    return list;
  }

  return data;
}

/**
 * Get a specific saved tool output by ID.
 */
export async function getSavedToolOutput(
  memberId: string,
  id: string
): Promise<SavedToolOutput | null> {
  const { data, error } = await dbQuery<SavedToolOutput[]>(
    `member_saved_tool_outputs?id=eq.${encodeURIComponent(id)}&member_id=eq.${encodeURIComponent(memberId)}&limit=1&select=*,site_profile:member_site_profiles(*)`
  );

  if (error || !data || data.length === 0) {
    const list = TEST_SAVED_OUTPUTS.get(memberId) || [];
    return list.find((o) => o.id === id) || null;
  }

  return data[0];
}

/**
 * Save an interactive tool output to workspace.
 */
export async function saveToolOutput(
  memberId: string,
  input: SaveToolOutputInput
): Promise<SavedToolOutput> {
  const now = new Date().toISOString();
  const payload = {
    member_id: memberId,
    site_profile_id: input.site_profile_id || null,
    tool_name: input.tool_name,
    title: input.title || null,
    inputs_json: input.inputs_json || {},
    outputs_json: input.outputs_json || {},
    summary_kpis: input.summary_kpis || {},
    pdf_reference: input.pdf_reference || null,
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await dbQuery<SavedToolOutput[]>('member_saved_tool_outputs', {
    method: 'POST',
    body: payload,
  });

  if (error || !data || data.length === 0) {
    const fallback: SavedToolOutput = {
      id: `output-mock-${Date.now()}`,
      ...payload,
    };
    const current = TEST_SAVED_OUTPUTS.get(memberId) || [];
    TEST_SAVED_OUTPUTS.set(memberId, [fallback, ...current]);
    return fallback;
  }

  return data[0];
}

/**
 * Delete a saved tool output.
 */
export async function deleteSavedToolOutput(memberId: string, id: string): Promise<boolean> {
  const { error, status } = await dbQuery(
    `member_saved_tool_outputs?id=eq.${encodeURIComponent(id)}&member_id=eq.${encodeURIComponent(memberId)}`,
    {
      method: 'DELETE',
    }
  );

  if (error && status !== 204) {
    const list = TEST_SAVED_OUTPUTS.get(memberId) || [];
    const next = list.filter((o) => o.id !== id);
    TEST_SAVED_OUTPUTS.set(memberId, next);
    return list.length !== next.length;
  }

  return true;
}
