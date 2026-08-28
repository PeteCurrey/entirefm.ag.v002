import crypto from 'crypto';
import type {
  Member,
  PublicMemberProfile,
  PolicyConsentRecord,
  MemberStatus,
} from './types';

// In-memory persistent store for Lobby Members (isolated from CAFM)
// In production, this syncs with the public member table while keeping CAFM RBAC strictly segregated.
const MEMBERS_STORE: Map<string, Member> = new Map();
const MEMBER_PASSWORDS: Map<string, string> = new Map(); // email -> hashed password

// Helper to hash password with PBKDF2
export function hashPassword(password: string): string {
  const salt = 'efm-member-salt-2026';
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

// Helper to generate a URL-safe username
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Seed demonstration founding members
function seedInitialMembers() {
  if (MEMBERS_STORE.size > 0) return;

  const now = new Date().toISOString();

  const seed1: Member = {
    id: 'mem-00000000-0000-4000-8000-000000000001',
    display_name: 'Peter Currey',
    first_name: 'Peter',
    last_name: 'Currey',
    email: 'peter.currey@entirefm.com',
    username: 'peter-currey',
    avatar_url: undefined,
    headline: 'CEO | EntireFM',
    bio: 'Chief Executive Officer at EntireFM. Leading UK facilities management operations, statutory compliance governance, and mechanical engineering delivery across commercial estates.',
    company: 'EntireFM',
    job_title: 'CEO',
    location: 'London & Nationwide',
    linkedin_url: 'https://linkedin.com/company/entirefm',
    member_status: 'active',
    profile_visibility: 'public',
    disciplines: ['Building Safety', 'HVAC', 'PPM', 'Mobilisation'],
    sectors: ['Commercial Offices', 'Logistics', 'Retail'],
    qualifications: ['Hard FM Specialist', 'Executive Leadership'],
    badges: ['Founding Member', 'Editorial Contributor'],
    reputation_score: 250,
    saved_content_ids: [
      'building-safety-act-what-fm-teams-need-to-know-now',
      'condenser-airflow-starvation-on-enclosed-rooftops',
    ],
    joined_at: '2026-08-01T09:00:00.000Z',
    last_active_at: now,
    email_preferences: {
      weeklyBriefing: true,
      communityUpdates: true,
      directMessages: true,
      marketingConsent: true,
      marketingConsentDate: '2026-08-01T09:00:00.000Z',
    },
    notification_preferences: {
      inApp: true,
      emailDigest: true,
      mentionAlerts: true,
    },
    policy_consents: [
      {
        policyType: 'terms',
        version: '2026.1',
        consentedAt: '2026-08-01T09:00:00.000Z',
      },
      {
        policyType: 'privacy',
        version: '2026.1',
        consentedAt: '2026-08-01T09:00:00.000Z',
      },
      {
        policyType: 'community-guidelines',
        version: '2026.1',
        consentedAt: '2026-08-01T09:00:00.000Z',
      },
    ],
    created_at: '2026-08-01T09:00:00.000Z',
    updated_at: now,
  };

  MEMBERS_STORE.set(seed1.id, seed1);
  MEMBER_PASSWORDS.set(seed1.email.toLowerCase(), hashPassword('Member2026!'));
}

seedInitialMembers();

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

export async function createMember(input: CreateMemberInput): Promise<Member> {
  const emailClean = input.email.trim().toLowerCase();

  // Check if email already registered
  for (const m of MEMBERS_STORE.values()) {
    if (m.email.toLowerCase() === emailClean && m.member_status !== 'deleted') {
      throw new Error('An account with this email address already exists.');
    }
  }

  // Generate base username and ensure uniqueness
  let baseSlug = slugify(`${input.first_name}-${input.last_name}`);
  if (!baseSlug) baseSlug = slugify(emailClean.split('@')[0]);

  let uniqueSlug = baseSlug;
  let counter = 1;
  while (Array.from(MEMBERS_STORE.values()).some((m) => m.username === uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  const now = new Date().toISOString();
  const id = `mem-${crypto.randomUUID()}`;

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

  const newMember: Member = {
    id,
    auth_user_id: input.auth_user_id,
    display_name: `${input.first_name.trim()} ${input.last_name.trim()}`,
    first_name: input.first_name.trim(),
    last_name: input.last_name.trim(),
    email: emailClean,
    username: uniqueSlug,
    headline: input.headline || `${input.job_title || 'Facilities Professional'}${input.company ? ` at ${input.company}` : ''}`,
    company: input.company,
    job_title: input.job_title,
    location: input.location,
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

  MEMBERS_STORE.set(id, newMember);

  if (input.password) {
    MEMBER_PASSWORDS.set(emailClean, hashPassword(input.password));
  }

  return newMember;
}

export async function activateMember(id: string): Promise<Member | null> {
  const member = MEMBERS_STORE.get(id);
  if (!member || member.member_status === 'deleted') return null;

  const now = new Date().toISOString();
  member.member_status = 'active';
  member.email_verified_at = now;
  member.updated_at = now;
  MEMBERS_STORE.set(id, member);

  return { ...member };
}

export async function getMemberById(id: string): Promise<Member | null> {
  const member = MEMBERS_STORE.get(id);
  if (!member || member.member_status === 'deleted') return null;
  return { ...member };
}

export async function getMemberByEmail(email: string): Promise<Member | null> {
  const emailClean = email.trim().toLowerCase();
  for (const m of MEMBERS_STORE.values()) {
    if (m.email.toLowerCase() === emailClean && m.member_status !== 'deleted') {
      return { ...m };
    }
  }
  return null;
}

export async function getMemberByUsername(username: string): Promise<Member | null> {
  const slugClean = username.trim().toLowerCase();
  for (const m of MEMBERS_STORE.values()) {
    if (m.username.toLowerCase() === slugClean && m.member_status !== 'deleted') {
      return { ...m };
    }
  }
  return null;
}

export async function authenticateMemberCredentials(
  email: string,
  password: string
): Promise<{ success: boolean; member?: Member; error?: string; requiresVerification?: boolean }> {
  const emailClean = email.trim().toLowerCase();
  const member = await getMemberByEmail(emailClean);

  if (!member) {
    return { success: false, error: 'Invalid email address or password.' };
  }

  if (member.member_status === 'pending_verification') {
    return {
      success: false,
      error: 'Please verify your email address to access Member features.',
      requiresVerification: true,
    };
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

  const storedHash = MEMBER_PASSWORDS.get(emailClean);
  if (!storedHash) {
    return { success: false, error: 'Invalid authentication credentials.' };
  }

  const inputHash = hashPassword(password);
  if (storedHash !== inputHash) {
    return { success: false, error: 'Invalid email address or password.' };
  }

  // Update last active timestamp
  member.last_active_at = new Date().toISOString();
  MEMBERS_STORE.set(member.id, member);

  return { success: true, member };
}

export async function updateMemberProfile(
  id: string,
  updates: Partial<Omit<Member, 'id' | 'email' | 'created_at'>>
): Promise<Member> {
  const member = await getMemberById(id);
  if (!member) throw new Error('Member not found');

  const updated: Member = {
    ...member,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  MEMBERS_STORE.set(id, updated);
  return updated;
}

export async function getPublicMemberProfile(username: string): Promise<PublicMemberProfile | null> {
  const member = await getMemberByUsername(username);
  if (!member) return null;

  if (member.member_status === 'banned' || member.member_status === 'deleted') {
    return null;
  }

  // Strip sensitive fields
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

// ─── Missing Exports for API Routes ──────────────────────────────────────────

export async function getAllMembers(query?: string): Promise<PublicMemberProfile[]> {
  seedInitialMembers();
  const members = Array.from(MEMBERS_STORE.values());
  const q = (query || '').toLowerCase();
  const filtered = q
    ? members.filter(
        (m) =>
          m.display_name.toLowerCase().includes(q) ||
          (m.headline || '').toLowerCase().includes(q) ||
          (m.company || '').toLowerCase().includes(q) ||
          (m.disciplines || []).some((d: string) => d.toLowerCase().includes(q))
      )
    : members;

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

export async function toggleSavedContent(
  memberId: string,
  contentId: string
): Promise<{ saved: boolean; savedIds: string[] }> {
  seedInitialMembers();
  const member = MEMBERS_STORE.get(memberId);
  if (!member) {
    return { saved: false, savedIds: [] };
  }
  const ids = member.saved_content_ids || [];
  const idx = ids.indexOf(contentId);
  if (idx >= 0) {
    ids.splice(idx, 1);
    member.saved_content_ids = ids;
    return { saved: false, savedIds: ids };
  } else {
    ids.push(contentId);
    member.saved_content_ids = ids;
    return { saved: true, savedIds: ids };
  }
}

export async function updateMemberPassword(
  email: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  seedInitialMembers();
  const emailClean = email.trim().toLowerCase();
  MEMBER_PASSWORDS.set(emailClean, hashPassword(newPassword));
  return { success: true };
}

