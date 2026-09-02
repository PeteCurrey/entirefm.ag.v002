import crypto from 'crypto';
import type {
  Member,
  PublicMemberProfile,
  DirectoryMemberEntry,
  PolicyConsentRecord,
  MemberStatus,
} from './types';
import { dbQuery, getDbConfig } from '../db/client';
import { supabaseSignIn, supabaseSignUp } from '../auth/supabase-auth';
import { listMemberCertifications, getPathById } from '../academy/academy-store';

// Test harness memory fallback
const TEST_MOCK_MEMBERS: Map<string, Member> = new Map();

// Helper to generate a URL-safe username
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface CreateMemberInput {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  auth_user_id?: string;
  headline?: string;
  company?: string;
  job_title?: string;
  location?: string;
  termsVersion: string; // e.g. '2026.1'
  privacyVersion: string; // e.g. '2026.1'
  marketingConsent?: boolean;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * 1. Create a Lobby Member backed by a canonical Supabase Auth User
 */
export async function createMember(input: CreateMemberInput): Promise<Member> {
  const emailClean = input.email.trim().toLowerCase();
  const cfg = getDbConfig();

  let canonicalAuthUserId = input.auth_user_id;

  // Step 1: Ensure Supabase Auth User exists or create one
  if (!canonicalAuthUserId) {
    if (!input.password) {
      throw new Error('A password is required to create a new Member account.');
    }

    if (cfg) {
      // Attempt sign up with Supabase Auth
      const authRes = await supabaseSignUp(emailClean, input.password, {
        first_name: input.first_name.trim(),
        last_name: input.last_name.trim(),
        user_type: 'LOBBY_MEMBER',
      });

      if (authRes.error) {
        // If user already exists in Supabase Auth, verify credentials or handle
        if (authRes.error.message.toLowerCase().includes('already registered') || authRes.error.message.toLowerCase().includes('already exists')) {
          // Try sign in to verify password and obtain auth_user_id
          const signInRes = await supabaseSignIn(emailClean, input.password);
          if (signInRes.data?.user) {
            canonicalAuthUserId = signInRes.data.user.id;
          } else {
            throw new Error('An account with this email address already exists. Please sign in instead.');
          }
        } else {
          throw new Error(authRes.error.message || 'Failed to create authentication account.');
        }
      } else if (authRes.data?.user) {
        canonicalAuthUserId = authRes.data.user.id;
      }
    } else {
      // Test environment fallback
      canonicalAuthUserId = `auth-test-${crypto.randomUUID()}`;
    }
  }

  if (!canonicalAuthUserId) {
    throw new Error('Could not establish canonical authentication user for this registration.');
  }

  // Step 2: Check if lobby_members record already exists for this auth_user_id
  const { data: existingMembers } = await dbQuery<any[]>(
    `lobby_members?auth_user_id=eq.${encodeURIComponent(canonicalAuthUserId)}&select=*`
  );

  if (existingMembers && existingMembers.length > 0) {
    const existing = existingMembers[0];
    if (existing.member_status !== 'deleted') {
      throw new Error('You are already registered as a Lobby Member. Please sign in.');
    }
  }

  // Step 3: Generate unique slug
  let baseSlug = slugify(`${input.first_name}-${input.last_name}`);
  if (!baseSlug) baseSlug = slugify(emailClean.split('@')[0]);

  let uniqueSlug = baseSlug;
  const { data: slugCheck } = await dbQuery<any[]>(`lobby_members?username=eq.${encodeURIComponent(uniqueSlug)}&select=id`);
  if (slugCheck && slugCheck.length > 0) {
    uniqueSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  const now = new Date().toISOString();
  const displayName = `${input.first_name.trim()} ${input.last_name.trim()}`;

  const consents: PolicyConsentRecord[] = [
    {
      policyType: 'terms',
      version: input.termsVersion,
      consentedAt: now,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    },
    {
      policyType: 'privacy',
      version: input.privacyVersion,
      consentedAt: now,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    },
    {
      policyType: 'community-guidelines',
      version: '2026.1',
      consentedAt: now,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    },
  ];

  if (input.marketingConsent) {
    consents.push({
      policyType: 'marketing',
      version: '2026.1',
      consentedAt: now,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });
  }

  const headline = input.headline || `${input.job_title || 'Facilities Professional'}${input.company ? ` at ${input.company}` : ''}`;

  const memberPayload = {
    auth_user_id: canonicalAuthUserId,
    email: emailClean,
    display_name: displayName,
    first_name: input.first_name.trim(),
    last_name: input.last_name.trim(),
    username: uniqueSlug,
    headline,
    company: input.company || undefined,
    job_title: input.job_title || undefined,
    location: input.location || undefined,
    member_status: 'pending_verification',
    profile_visibility: 'public',
    disciplines: [],
    sectors: [],
    qualifications: [],
    badges: ['Lobby Member'],
    reputation_score: 10,
    saved_content_ids: [],
    joined_at: now,
    last_active_at: now,
    email_preferences: {
      weeklyBriefing: true,
      communityUpdates: true,
      directMessages: true,
      marketingConsent: Boolean(input.marketingConsent),
      marketingConsentDate: input.marketingConsent ? now : undefined,
    },
    notification_preferences: {
      inApp: true,
      emailDigest: true,
      mentionAlerts: true,
    },
    policy_consents: consents,
    created_at: now,
    updated_at: now,
  };

  // Fallback for test harness without DB connection
  if (!cfg) {
    const testMember: Member = {
      ...memberPayload,
      id: `mem-test-${crypto.randomUUID()}`,
      member_status: 'pending_verification',
      profile_visibility: 'public',
      email_preferences: memberPayload.email_preferences,
      notification_preferences: memberPayload.notification_preferences,
      policy_consents: consents,
    };
    TEST_MOCK_MEMBERS.set(testMember.id, testMember);
    TEST_MOCK_MEMBERS.set(testMember.email, testMember);
    return testMember;
  }

  // Step 4: Insert into database tables
  const { data: createdRows, error: insertErr } = await dbQuery<any[]>(
    'lobby_members',
    {
      method: 'POST',
      body: {
        ...memberPayload,
        company: input.company || null,
        job_title: input.job_title || null,
        location: input.location || null,
      },
    }
  );

  if (insertErr || !createdRows || createdRows.length === 0) {
    console.error('[MEMBER_STORE] Failed to insert lobby_member:', insertErr);
    throw new Error('Database error creating Lobby Member profile.');
  }

  // Ensure user_identities record exists
  await dbQuery('user_identities', {
    method: 'POST',
    body: {
      auth_user_id: canonicalAuthUserId,
      primary_email_snapshot: emailClean,
      display_name: displayName,
      first_name: input.first_name.trim(),
      last_name: input.last_name.trim(),
      status: 'PENDING_VERIFICATION',
      created_at: now,
      updated_at: now,
    },
  }).catch((err) => console.warn('[MEMBER_STORE] user_identities sync notice:', err));

  // Log audit
  await dbQuery('user_identity_audit_log', {
    method: 'POST',
    body: {
      auth_user_id: canonicalAuthUserId,
      action: 'LOBBY_JOINED',
      actor_id: canonicalAuthUserId,
      details: { email: emailClean, username: uniqueSlug },
      created_at: now,
    },
  }).catch(() => {});

  const newMember: Member = {
    ...memberPayload,
    id: createdRows[0].id,
    member_status: createdRows[0].member_status as MemberStatus,
    profile_visibility: createdRows[0].profile_visibility,
    email_preferences: createdRows[0].email_preferences,
    notification_preferences: createdRows[0].notification_preferences,
    policy_consents: createdRows[0].policy_consents,
  };

  return newMember;
}

/**
 * 2. Activate Member account upon email verification
 */
export async function activateMember(idOrAuthUserId: string): Promise<Member | null> {
  const now = new Date().toISOString();
  const cfg = getDbConfig();

  if (!cfg) {
    const mem = TEST_MOCK_MEMBERS.get(idOrAuthUserId);
    if (mem) {
      mem.member_status = 'active';
      mem.email_verified_at = now;
      return { ...mem };
    }
    return null;
  }

  // Try finding by id or auth_user_id
  const { data: rows } = await dbQuery<any[]>(
    `lobby_members?or=(id.eq.${encodeURIComponent(idOrAuthUserId)},auth_user_id.eq.${encodeURIComponent(idOrAuthUserId)})&select=*`
  );

  if (!rows || rows.length === 0) return null;
  const member = rows[0];

  const { data: updatedRows, error } = await dbQuery<any[]>(
    `lobby_members?id=eq.${encodeURIComponent(member.id)}`,
    {
      method: 'PATCH',
      body: {
        member_status: 'active',
        email_verified_at: now,
        updated_at: now,
      },
    }
  );

  if (error || !updatedRows || updatedRows.length === 0) {
    return null;
  }

  // Update user_identities status
  if (member.auth_user_id) {
    await dbQuery(`user_identities?auth_user_id=eq.${encodeURIComponent(member.auth_user_id)}`, {
      method: 'PATCH',
      body: { status: 'ACTIVE', updated_at: now },
    }).catch(() => {});
  }

  return updatedRows[0] as Member;
}

/**
 * 3. Fetch Member by ID or Auth User ID
 */
export async function getMemberById(idOrAuthUserId: string): Promise<Member | null> {
  if (!idOrAuthUserId) return null;

  if (!getDbConfig()) {
    const mem = TEST_MOCK_MEMBERS.get(idOrAuthUserId);
    return mem ? { ...mem } : null;
  }

  const { data: rows } = await dbQuery<any[]>(
    `lobby_members?or=(id.eq.${encodeURIComponent(idOrAuthUserId)},auth_user_id.eq.${encodeURIComponent(idOrAuthUserId)})&select=*`
  );

  if (!rows || rows.length === 0) return null;
  const m = rows[0];
  if (m.member_status === 'deleted') return null;

  return m as Member;
}

/**
 * 4. Fetch Member by email
 */
export async function getMemberByEmail(email: string): Promise<Member | null> {
  const emailClean = email.trim().toLowerCase();

  if (!getDbConfig()) {
    const mem = TEST_MOCK_MEMBERS.get(emailClean);
    return mem ? { ...mem } : null;
  }

  const { data: rows } = await dbQuery<any[]>(
    `lobby_members?email=eq.${encodeURIComponent(emailClean)}&select=*`
  );

  if (!rows || rows.length === 0) return null;
  const m = rows[0];
  if (m.member_status === 'deleted') return null;

  return m as Member;
}

/**
 * 5. Fetch Member by public username
 */
export async function getMemberByUsername(username: string): Promise<Member | null> {
  const slugClean = username.trim().toLowerCase();

  if (!getDbConfig()) {
    for (const mem of TEST_MOCK_MEMBERS.values()) {
      if (mem.username.toLowerCase() === slugClean) return { ...mem };
    }
    return null;
  }

  const { data: rows } = await dbQuery<any[]>(
    `lobby_members?username=eq.${encodeURIComponent(slugClean)}&select=*`
  );

  if (!rows || rows.length === 0) return null;
  const m = rows[0];
  if (m.member_status === 'deleted') return null;

  return m as Member;
}

/**
 * 6. Authenticate Member Credentials against Supabase Auth & Verify Lobby Membership
 */
export async function authenticateMemberCredentials(
  email: string,
  password: string
): Promise<{
  success: boolean;
  member?: Member;
  authUserId?: string;
  notAMember?: boolean;
  error?: string;
  requiresVerification?: boolean;
}> {
  const emailClean = email.trim().toLowerCase();

  if (!getDbConfig()) {
    const mem = TEST_MOCK_MEMBERS.get(emailClean);
    if (!mem) return { success: false, error: 'Invalid credentials.' };
    if (mem.member_status === 'pending_verification') {
      return { success: false, error: 'Please verify your email address.', requiresVerification: true };
    }
    return { success: true, member: mem, authUserId: mem.auth_user_id };
  }

  // 1. Authenticate against canonical Supabase Auth
  const authRes = await supabaseSignIn(emailClean, password);

  if (authRes.error || !authRes.data?.user) {
    return { success: false, error: authRes.error?.message || 'Invalid email address or password.' };
  }

  const authUser = authRes.data.user;
  const authUserId = authUser.id;

  // 2. Resolve Lobby Member row by auth_user_id
  let member = await getMemberById(authUserId);

  // If not found by auth_user_id, fallback check by email and link auth_user_id if orphan
  if (!member) {
    member = await getMemberByEmail(emailClean);
    if (member && !member.auth_user_id) {
      // Reconcile orphan
      await dbQuery(`lobby_members?id=eq.${encodeURIComponent(member.id)}`, {
        method: 'PATCH',
        body: { auth_user_id: authUserId, updated_at: new Date().toISOString() },
      });
      member.auth_user_id = authUserId;
    }
  }

  // If user is valid in Supabase Auth but has not joined The Lobby
  if (!member) {
    return {
      success: false,
      notAMember: true,
      authUserId,
      error: 'You have an EntireFM account, but have not joined The Lobby yet.',
    };
  }

  if (member.member_status === 'pending_verification') {
    // If Supabase Auth says email is confirmed, auto-activate
    if (authUser.email_confirmed_at) {
      const activated = await activateMember(member.id);
      if (activated) member = activated;
    } else {
      return {
        success: false,
        error: 'Please verify your email address to access Member features.',
        requiresVerification: true,
      };
    }
  }

  // If member is already 'active', they are cleared regardless of email_confirmed_at state
  // (handles admin-confirmed accounts and members who verified via alternative flow)
  if (member.member_status === 'active' && !authUser.email_confirmed_at) {
    // Silently repair the Supabase Auth record so this inconsistency self-heals
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users/${authUser.id}`, {
        method: 'PUT',
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_confirm: true }),
      });
    } catch {
      // Non-critical — silently ignore, member is already active and can proceed
    }
  }

  if (member.member_status === 'banned') {
    return {
      success: false,
      error: 'This account has been permanently suspended for Community Guidelines violations.',
    };
  }

  if (member.member_status === 'suspended') {
    return {
      success: false,
      error: 'This account is temporarily suspended. Please contact community@entirefm.com.',
    };
  }

  // Update last active timestamp
  await dbQuery(`lobby_members?id=eq.${encodeURIComponent(member.id)}`, {
    method: 'PATCH',
    body: { last_active_at: new Date().toISOString() },
  }).catch(() => {});

  return { success: true, member, authUserId };
}

/**
 * 7. Update Member Profile
 */
export async function updateMemberProfile(
  idOrAuthUserId: string,
  updates: Partial<Omit<Member, 'id' | 'email' | 'created_at'>>
): Promise<Member> {
  const member = await getMemberById(idOrAuthUserId);
  if (!member) throw new Error('Member not found');

  const now = new Date().toISOString();
  const patchPayload: Record<string, any> = {
    ...updates,
    updated_at: now,
  };

  if (!getDbConfig()) {
    const updated: Member = {
      ...member,
      ...updates,
      updated_at: now,
    };
    TEST_MOCK_MEMBERS.set(member.id, updated);
    if (member.auth_user_id) TEST_MOCK_MEMBERS.set(member.auth_user_id, updated);
    TEST_MOCK_MEMBERS.set(member.email, updated);
    return updated;
  }

  const { data: updatedRows, error } = await dbQuery<any[]>(
    `lobby_members?id=eq.${encodeURIComponent(member.id)}`,
    {
      method: 'PATCH',
      body: patchPayload,
    }
  );

  if (error || !updatedRows || updatedRows.length === 0) {
    throw new Error('Failed to update member profile in database.');
  }

  return updatedRows[0] as Member;
}

/**
 * 8. Get Public Member Profile (Strips private email & credentials)
 */
export async function getPublicMemberProfile(username: string): Promise<PublicMemberProfile | null> {
  const member = await getMemberByUsername(username);
  if (!member) return null;

  if (member.member_status === 'banned' || member.member_status === 'deleted') {
    return null;
  }

  const publicProfile: PublicMemberProfile = {
    id: member.id,
    display_name: member.display_name,
    first_name: member.first_name,
    last_name: member.last_name,
    username: member.username,
    avatar_url: member.avatar_url,
    headline: member.headline,
    bio: member.bio,
    company: member.company,
    job_title: member.job_title,
    location: member.location,
    website: member.website,
    linkedin_url: member.linkedin_url,
    member_status: member.member_status,
    profile_visibility: member.profile_visibility,
    disciplines: member.disciplines,
    sectors: member.sectors,
    qualifications: member.qualifications,
    badges: member.badges,
    reputation_score: member.reputation_score,
    joined_at: member.joined_at,
  };

  return publicProfile;
}

/**
 * 9. Get all members for directory
 */
export async function getAllMembers(query?: string): Promise<PublicMemberProfile[]> {
  const q = (query || '').toLowerCase().trim();
  const { data: rows } = await dbQuery<any[]>(
    'lobby_members?member_status=eq.active&select=*&order=reputation_score.desc'
  );

  if (!rows) return [];

  const filtered = q
    ? rows.filter(
        (m) =>
          m.display_name.toLowerCase().includes(q) ||
          (m.headline || '').toLowerCase().includes(q) ||
          (m.company || '').toLowerCase().includes(q) ||
          (m.disciplines || []).some((d: string) => d.toLowerCase().includes(q))
      )
    : rows;

  return filtered.map((m) => ({
    id: m.id,
    display_name: m.display_name,
    first_name: m.first_name,
    last_name: m.last_name,
    username: m.username,
    avatar_url: m.avatar_url,
    headline: m.headline,
    bio: m.bio,
    company: m.company,
    job_title: m.job_title,
    location: m.location,
    website: m.website,
    linkedin_url: m.linkedin_url,
    member_status: m.member_status,
    profile_visibility: m.profile_visibility,
    disciplines: m.disciplines,
    sectors: m.sectors,
    qualifications: m.qualifications,
    badges: m.badges,
    reputation_score: m.reputation_score,
    joined_at: m.joined_at,
  }));
}

/**
 * 10. Toggle saved content for member
 */
export async function toggleSavedContent(
  memberId: string,
  contentId: string
): Promise<{ saved: boolean; savedIds: string[] }> {
  const member = await getMemberById(memberId);
  if (!member) {
    return { saved: false, savedIds: [] };
  }

  const ids = [...(member.saved_content_ids || [])];
  const idx = ids.indexOf(contentId);
  let isSaved = false;

  if (idx >= 0) {
    ids.splice(idx, 1);
    isSaved = false;
  } else {
    ids.push(contentId);
    isSaved = true;
  }

  await dbQuery(`lobby_members?id=eq.${encodeURIComponent(member.id)}`, {
    method: 'PATCH',
    body: { saved_content_ids: ids, updated_at: new Date().toISOString() },
  });

  return { saved: isSaved, savedIds: ids };
}

/**
 * 11. Update Member Password in canonical Supabase Auth
 */
export async function updateMemberPassword(
  email: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const cfg = getDbConfig();
  if (!cfg) {
    return { success: false, error: 'Database configuration missing' };
  }

  const emailClean = email.trim().toLowerCase();

  // Find user by email in Supabase Auth
  const authRes = await fetch(`${cfg.url}/auth/v1/admin/users`, {
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
    },
  });

  const authJson = await authRes.json().catch(() => ({}));
  const user = (authJson?.users || []).find((u: any) => u.email?.toLowerCase() === emailClean);

  if (!user) {
    return { success: false, error: 'User account not found' };
  }

  const updateRes = await fetch(`${cfg.url}/auth/v1/admin/users/${user.id}`, {
    method: 'PUT',
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password: newPassword }),
  });

  if (!updateRes.ok) {
    const json = await updateRes.json().catch(() => ({}));
    return { success: false, error: json.message || 'Failed to update password' };
  }

  return { success: true };
}

/**
 * Test harness helper to register or seed a member in memory
 */
export function registerTestMockMember(member: Member): void {
  TEST_MOCK_MEMBERS.set(member.id, member);
  if (member.auth_user_id) TEST_MOCK_MEMBERS.set(member.auth_user_id, member);
  TEST_MOCK_MEMBERS.set(member.email.toLowerCase(), member);
}

export interface DirectoryFilters {
  query?: string;
  pathSlug?: string;
  sector?: string;
  location?: string;
}

/**
 * 12. Get Public FM Practitioner Directory Members
 * 
 * STRICT OPT-IN: Only members with directory_opt_in === true and member_status === 'active'
 * are returned. Toggling opt-out immediately excludes the member.
 * 
 * Aggregates live passed certifications and live community reputation signals.
 */
export async function getDirectoryMembers(
  filters: DirectoryFilters = {}
): Promise<DirectoryMemberEntry[]> {
  const q = (filters.query || '').toLowerCase().trim();
  const filterPathSlug = (filters.pathSlug || '').toLowerCase().trim();
  const filterSector = (filters.sector || '').toLowerCase().trim();
  const filterLocation = (filters.location || '').toLowerCase().trim();

  let activeMembers: Member[] = [];

  if (getDbConfig()) {
    const { data: rows } = await dbQuery<any[]>(
      'lobby_members?member_status=eq.active&directory_opt_in=eq.true&select=*&order=reputation_score.desc'
    );
    if (rows && rows.length > 0) {
      activeMembers = rows as Member[];
    }
  } else {
    // Memory fallback for tests
    activeMembers = Array.from(new Set(TEST_MOCK_MEMBERS.values())).filter(
      (m) => m.member_status === 'active' && Boolean(m.directory_opt_in)
    );
  }

  // Filter out any explicitly private visibility
  activeMembers = activeMembers.filter((m) => m.profile_visibility !== 'private');

  const entries: DirectoryMemberEntry[] = [];

  for (const m of activeMembers) {
    // 1. Get real certifications held by this member
    const certs = await listMemberCertifications(m.auth_user_id || m.id);
    const passedCerts = certs.filter(
      (c) => c.status === 'passed' && Boolean(c.badgeIssuedAt) && Boolean(c.publicCertId)
    );

    const enrichedCerts = await Promise.all(
      passedCerts.map(async (c) => {
        const path = await getPathById(c.pathId);
        return {
          pathTitle: path?.title || 'Certified FM Professional',
          pathSlug: path?.slug || 'certified',
          targetRole: path?.targetRole || 'Practitioner',
          badgeIssuedAt: c.badgeIssuedAt!,
          publicCertId: c.publicCertId!,
        };
      })
    );

    // 2. Get live community accepted solution count
    let acceptedSolutionsCount = 0;
    if (getDbConfig()) {
      try {
        const { data: acceptedRows } = await dbQuery<any[]>(
          `community_discussion_replies?author_member_id=eq.${encodeURIComponent(m.id)}&is_accepted_answer=eq.true&select=id`
        );
        acceptedSolutionsCount = acceptedRows ? acceptedRows.length : 0;
      } catch {
        acceptedSolutionsCount = 0;
      }
    }

    // 3. Filter check: Certification / Learning Path
    if (filterPathSlug) {
      const holdsPath = enrichedCerts.some(
        (c) =>
          c.pathSlug.toLowerCase() === filterPathSlug ||
          c.targetRole.toLowerCase() === filterPathSlug ||
          c.pathTitle.toLowerCase().includes(filterPathSlug)
      );
      if (!holdsPath) continue;
    }

    // 4. Filter check: Sector
    if (filterSector) {
      const hasSector = (m.sectors || []).some((s) =>
        s.toLowerCase().includes(filterSector)
      );
      if (!hasSector) continue;
    }

    // 5. Filter check: Location / Region
    if (filterLocation) {
      const matchesLoc = (m.location || '').toLowerCase().includes(filterLocation);
      if (!matchesLoc) continue;
    }

    // 6. Filter check: Query (Name, Headline, Company, Disciplines, Target Role)
    if (q) {
      const inName = m.display_name.toLowerCase().includes(q);
      const inHeadline = (m.headline || '').toLowerCase().includes(q);
      const inCompany = (m.company || '').toLowerCase().includes(q);
      const inDisciplines = (m.disciplines || []).some((d) => d.toLowerCase().includes(q));
      const inCerts = enrichedCerts.some(
        (c) =>
          c.pathTitle.toLowerCase().includes(q) ||
          c.targetRole.toLowerCase().includes(q)
      );
      if (!inName && !inHeadline && !inCompany && !inDisciplines && !inCerts) {
        continue;
      }
    }

    entries.push({
      id: m.id,
      displayName: m.display_name,
      username: m.username,
      headline: m.headline || undefined,
      company: m.company || undefined,
      jobTitle: m.job_title || undefined,
      location: m.location || undefined,
      avatarUrl: m.avatar_url || undefined,
      sectors: m.sectors || [],
      disciplines: m.disciplines || [],
      badges: m.badges || [],
      reputationScore: m.reputation_score || 0,
      acceptedSolutionsCount,
      certifications: enrichedCerts,
      joinedAt: m.joined_at,
    });
  }

  // Sort by reputation score descending, then certifications count
  return entries.sort((a, b) => {
    if (b.reputationScore !== a.reputationScore) {
      return b.reputationScore - a.reputationScore;
    }
    return b.certifications.length - a.certifications.length;
  });
}
