import { NextResponse } from 'next/server';
import { getMemberSessionFromRequest } from '@/server/member/member-session';
import { getMemberById, updateMemberProfile } from '@/server/member/member-store';

export async function GET(request: Request) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ authenticated: false, member: null }, { status: 200 });
  }

  const member = await getMemberById(session.memberId);
  if (!member || member.member_status === 'banned' || member.member_status === 'deleted') {
    return NextResponse.json({ authenticated: false, member: null }, { status: 200 });
  }

  // Sanitize policy consents to prevent leaking raw IP addresses and user agents
  const sanitizedConsents = (member.policy_consents || []).map((c) => ({
    policyType: c.policyType,
    version: c.version,
    consentedAt: c.consentedAt,
  }));

  return NextResponse.json({
    authenticated: true,
    clientLinks: session.clientLinks || [],
    member: {
      id: member.id,
      displayName: member.display_name,
      firstName: member.first_name,
      lastName: member.last_name,
      email: member.email,
      username: member.username,
      avatarUrl: member.avatar_url,
      headline: member.headline,
      bio: member.bio,
      company: member.company,
      jobTitle: member.job_title,
      location: member.location,
      website: member.website,
      linkedinUrl: member.linkedin_url,
      memberStatus: member.member_status,
      profileVisibility: member.profile_visibility,
      disciplines: member.disciplines,
      sectors: member.sectors,
      qualifications: member.qualifications,
      badges: member.badges,
      reputationScore: member.reputation_score,
      directoryOptIn: member.directory_opt_in ?? false,
      savedContentIds: member.saved_content_ids,
      joinedAt: member.joined_at,
      emailPreferences: member.email_preferences,
      notificationPreferences: member.notification_preferences,
      policyConsents: sanitizedConsents,
    },
  });
}

export async function PATCH(request: Request) {
  const session = getMemberSessionFromRequest(request);

  if (!session || !session.memberId) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in as a Member.' }, { status: 401 });
  }

  // Enforce account status: unverified or suspended members cannot update profile
  if (session.status === 'pending_verification') {
    return NextResponse.json(
      { error: 'Please verify your email address to update your profile.' },
      { status: 403 }
    );
  }

  if (session.status !== 'active') {
    return NextResponse.json(
      { error: 'Your account is currently not active.' },
      { status: 403 }
    );
  }

  const memberId = session.memberId;

  try {
    const body = await request.json().catch(() => ({}));
    const {
      headline,
      bio,
      company,
      jobTitle,
      location,
      website,
      linkedinUrl,
      disciplines,
      sectors,
      qualifications,
      profileVisibility,
      directoryOptIn,
      emailPreferences,
      notificationPreferences,
    } = body;

    const updates: Record<string, any> = {};

    // Strict whitelist of permitted profile fields
    if (headline !== undefined) updates.headline = String(headline).trim().slice(0, 140);
    if (bio !== undefined) updates.bio = String(bio).trim().slice(0, 1000);
    if (company !== undefined) updates.company = String(company).trim().slice(0, 100);
    if (jobTitle !== undefined) updates.job_title = String(jobTitle).trim().slice(0, 100);
    if (location !== undefined) updates.location = String(location).trim().slice(0, 100);
    if (website !== undefined) updates.website = String(website).trim().slice(0, 200);
    if (linkedinUrl !== undefined) updates.linkedin_url = String(linkedinUrl).trim().slice(0, 200);
    if (Array.isArray(disciplines)) updates.disciplines = disciplines.slice(0, 10);
    if (Array.isArray(sectors)) updates.sectors = sectors.slice(0, 10);
    if (Array.isArray(qualifications)) updates.qualifications = qualifications.slice(0, 10);
    if (directoryOptIn !== undefined) updates.directory_opt_in = Boolean(directoryOptIn);
    if (profileVisibility && ['public', 'members_only', 'members-only', 'private'].includes(profileVisibility)) {
      updates.profile_visibility = profileVisibility === 'members-only' ? 'members_only' : profileVisibility;
    }
    if (emailPreferences && typeof emailPreferences === 'object') {
      updates.email_preferences = emailPreferences;
    }
    if (notificationPreferences && typeof notificationPreferences === 'object') {
      updates.notification_preferences = notificationPreferences;
    }

    const updated = await updateMemberProfile(memberId, updates);

    return NextResponse.json({
      success: true,
      member: {
        id: updated.id,
        displayName: updated.display_name,
        username: updated.username,
        headline: updated.headline,
        bio: updated.bio,
        company: updated.company,
        jobTitle: updated.job_title,
        location: updated.location,
        website: updated.website,
        linkedinUrl: updated.linkedin_url,
        disciplines: updated.disciplines,
        sectors: updated.sectors,
        qualifications: updated.qualifications,
        profileVisibility: updated.profile_visibility,
        directoryOptIn: updated.directory_opt_in,
        emailPreferences: updated.email_preferences,
        notificationPreferences: updated.notification_preferences,
      },
    });
  } catch (err: any) {
    console.error('[PROFILE_UPDATE_ERROR]', err);
    return NextResponse.json({ error: 'Failed to update profile. Please try again.' }, { status: 400 });
  }
}
