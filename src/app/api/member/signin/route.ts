import { NextResponse } from 'next/server';
import { authenticateMemberCredentials, getLobbyClientLinks } from '@/server/member/member-store';
import { createMemberSessionToken, MEMBER_COOKIE_NAME } from '@/server/member/member-session';
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  getRolePermissions,
  RoleCode,
} from '@/server/identity';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/server/security/rate-limiter';
import { logSecurityEvent } from '@/server/security/security-logger';

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  const userAgent = request.headers.get('user-agent') || undefined;

  // 1. IP-Based Rate Limiting to prevent brute-force attacks
  const ipCheck = checkRateLimit(`signin:${clientIp}`, RATE_LIMITS.SIGNIN);
  if (!ipCheck.allowed) {
    await logSecurityEvent({
      eventType: 'SIGNIN_RATE_LIMITED',
      ipAddress: clientIp,
      userAgent,
      details: {
        endpoint: '/api/member/signin',
        retryAfterSeconds: ipCheck.retryAfterSeconds,
      },
    });

    return NextResponse.json(
      { error: 'Too many sign-in attempts. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(ipCheck.retryAfterSeconds) },
      }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { email, password, rememberMe } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please enter both your email address and password.' },
        { status: 400 }
      );
    }

    const emailClean = String(email).trim().toLowerCase();
    const authResult = await authenticateMemberCredentials(emailClean, password);

    if (!authResult.success) {
      if (authResult.notAMember) {
        // Do NOT expose authUserId to the client
        return NextResponse.json(
          {
            success: false,
            notAMember: true,
            error: 'You have an EntireFM account, but have not joined The Lobby yet.',
            redirectUrl: `/join?email=${encodeURIComponent(emailClean)}`,
          },
          { status: 403 }
        );
      }

      if (authResult.requiresVerification) {
        return NextResponse.json(
          {
            success: false,
            requiresVerification: true,
            error: authResult.error || 'Please verify your email address to access Member features.',
            redirectUrl: `/verify-email?email=${encodeURIComponent(emailClean)}`,
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { error: authResult.error || 'Invalid email address or password.' },
        { status: 401 }
      );
    }

    const member = authResult.member!;
    const authUserId = member.auth_user_id || authResult.authUserId || '';
    const clientLinks = authUserId ? await getLobbyClientLinks(authUserId) : [];

    const duration = rememberMe ? 1000 * 60 * 60 * 24 * 60 : 1000 * 60 * 60 * 24 * 7;
    const token = createMemberSessionToken(member, duration, clientLinks);

    // Landing logic on login:
    // If account has an active client link, land on Client Dashboard by default (/clients)
    // Lobby-only accounts land on Lobby as today, unchanged (/member/profile)
    const redirectUrl = clientLinks.length > 0 ? '/clients' : '/member/profile';

    const response = NextResponse.json({
      success: true,
      member: {
        id: member.id,
        displayName: member.display_name,
        email: member.email,
        username: member.username,
        avatarUrl: member.avatar_url,
      },
      clientLinks,
      redirectUrl,
    });

    response.cookies.set(MEMBER_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: Math.floor(duration / 1000),
    });

    // If client-linked, also establish client portal session seamlessly
    if (clientLinks.length > 0) {
      const primaryLink = clientLinks[0];
      const rCode = (primaryLink.roleCode || 'CLIENT_USER') as RoleCode;
      const cafmSession = {
        personId: member.id,
        email: member.email,
        name: member.display_name,
        role: rCode,
        orgId: primaryLink.clientAccountId,
        orgName: primaryLink.clientOrgName,
        orgType: 'CLIENT' as const,
        activeApplication: 'CLIENT' as const,
        permissions: getRolePermissions(rCode),
        scopes: [{ type: 'CLIENT_ACCOUNT' as const, id: primaryLink.clientAccountId }],
        source: 'LOBBY_UNIFIED_LOGIN',
        expiresAt: Date.now() + duration,
      };

      const cafmToken = createSessionToken(cafmSession as any);
      response.cookies.set(AUTH_COOKIE_NAME, cafmToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: Math.floor(duration / 1000),
      });
    }

    return response;
  } catch (err: any) {
    console.error('[SIGNIN_ERROR]', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred during sign in. Please try again.' },
      { status: 500 }
    );
  }
}
