/**
 * ENTIREFM LOBBY & COMMUNITY MEMBER DATA MODEL
 * ============================================
 * Independent public/community member identity system.
 *
 * STRICT SEPARATION GUARANTEE:
 * - A Member record is NOT a CAFM User.
 * - Member accounts NEVER grant operational CAFM access or permissions.
 * - CAFM operational accounts NEVER leak to public community profiles without explicit action.
 */

export type MemberStatus =
  | 'pending_verification'
  | 'active'
  | 'restricted'
  | 'suspended'
  | 'banned'
  | 'deleted';

export type ProfileVisibility = 'public' | 'members_only' | 'private';

export interface PolicyConsentRecord {
  policyType: 'terms' | 'privacy' | 'community-guidelines' | 'marketing';
  version: string; // e.g. '2026.1'
  consentedAt: string; // ISO 8601 timestamp
  ipAddress?: string;
  userAgent?: string;
}

export interface EmailPreferences {
  weeklyBriefing: boolean; // Tuesday FM Briefing
  communityUpdates: boolean; // Community discussions & replies
  directMessages: boolean; // Member messages
  marketingConsent: boolean; // Optional marketing / event updates
  marketingConsentDate?: string;
}

export interface NotificationPreferences {
  inApp: boolean;
  emailDigest: boolean;
  mentionAlerts: boolean;
}

export interface Member {
  id: string; // UUID
  auth_user_id?: string; // ID in Supabase Auth if linked
  display_name: string;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at?: string;
  username: string; // URL-safe slug e.g. 'peter-currey'
  avatar_url?: string;
  headline?: string; // e.g. 'Head of Facilities & Asset Management | CEng'
  bio?: string;
  company?: string;
  job_title?: string;
  location?: string;
  website?: string;
  linkedin_url?: string;
  member_status: MemberStatus;
  profile_visibility: ProfileVisibility;
  disciplines: string[]; // e.g. ['HVAC', 'Building Safety', 'PPM']
  sectors: string[]; // e.g. ['Commercial Offices', 'Healthcare']
  qualifications: string[]; // e.g. ['IWFM Level 4', 'NEBOSH Diploma']
  badges: string[]; // e.g. ['Founding Member', 'Verified Practitioner']
  reputation_score: number;
  saved_content_ids: string[]; // Slugs of bookmarked Lobby articles
  joined_at: string;
  last_active_at: string;
  email_preferences: EmailPreferences;
  notification_preferences: NotificationPreferences;
  policy_consents: PolicyConsentRecord[];
  directory_opt_in?: boolean; // Explicit opt-in for public directory (default false)
  created_at: string;
  updated_at: string;
}

/**
 * Public directory search result entry
 */
export interface DirectoryMemberEntry {
  id: string;
  displayName: string;
  username: string;
  headline?: string;
  company?: string;
  jobTitle?: string;
  location?: string;
  avatarUrl?: string;
  sectors: string[];
  disciplines: string[];
  badges: string[];
  reputationScore: number;
  acceptedSolutionsCount: number;
  certifications: Array<{
    pathTitle: string;
    pathSlug: string;
    targetRole: string;
    badgeIssuedAt: string;
    publicCertId: string;
  }>;
  joinedAt: string;
}

/**
 * Publicly visible Member profile (safely excludes email, private settings, IP logs)
 */
export type PublicMemberProfile = Pick<
  Member,
  | 'id'
  | 'display_name'
  | 'first_name'
  | 'last_name'
  | 'username'
  | 'avatar_url'
  | 'headline'
  | 'bio'
  | 'company'
  | 'job_title'
  | 'location'
  | 'website'
  | 'linkedin_url'
  | 'member_status'
  | 'profile_visibility'
  | 'disciplines'
  | 'sectors'
  | 'qualifications'
  | 'badges'
  | 'reputation_score'
  | 'joined_at'
  | 'directory_opt_in'
>;

export interface ClientLinkSummary {
  linkId: string;
  clientAccountId: string;
  clientOrgName: string;
  roleCode: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
  linkedAt: string;
}

export interface MemberSession {
  memberId: string;
  authUserId?: string;
  email: string;
  username: string;
  displayName: string;
  status: MemberStatus;
  avatarUrl?: string;
  clientLinks: ClientLinkSummary[];
  expiresAt: number;
}

