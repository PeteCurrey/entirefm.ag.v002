import crypto from 'crypto';
import type { Member, MemberSession } from './types';

export const MEMBER_COOKIE_NAME = 'efm_member_session';

const MEMBER_SECRET =
  process.env.MEMBER_AUTH_SECRET ||
  process.env.SESSION_SECRET ||
  'entirefm-member-community-auth-secret-key-2026-v1';

/**
 * Creates an HMAC-signed session token for an authenticated Lobby Member.
 */
export function createMemberSessionToken(member: Member, durationMs: number = 1000 * 60 * 60 * 24 * 30): string {
  const session: MemberSession = {
    memberId: member.id,
    email: member.email,
    username: member.username,
    displayName: member.display_name,
    status: member.member_status,
    avatarUrl: member.avatar_url,
    expiresAt: Date.now() + durationMs,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(session)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', MEMBER_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  return `${payloadBase64}.${signature}`;
}

/**
 * Verifies and decodes a Member session token.
 * Returns null if invalid, expired, or tampered.
 */
export function verifyMemberSessionToken(token: string | undefined | null): MemberSession | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadBase64, providedSignature] = parts;

  const expectedSignature = crypto
    .createHmac('sha256', MEMBER_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  // Constant-time comparison to prevent timing attacks
  const sigA = Buffer.from(providedSignature);
  const sigB = Buffer.from(expectedSignature);
  if (sigA.length !== sigB.length || !crypto.timingSafeEqual(sigA, sigB)) {
    return null;
  }

  try {
    const jsonStr = Buffer.from(payloadBase64, 'base64url').toString('utf8');
    const session = JSON.parse(jsonStr) as MemberSession;

    if (!session.memberId || !session.expiresAt) return null;
    if (session.expiresAt < Date.now()) return null;

    return session;
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies the Member session from an incoming Request / NextRequest.
 */
export function getMemberSessionFromRequest(request: Request): MemberSession | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${MEMBER_COOKIE_NAME}=([^;]+)`));
  if (!match) return null;

  const token = decodeURIComponent(match[1]);
  return verifyMemberSessionToken(token);
}
