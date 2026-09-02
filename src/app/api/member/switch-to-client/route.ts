import { NextResponse } from 'next/server';
import { getMemberSessionFromRequest } from '@/server/member/member-session';
import { getLobbyClientLinks } from '@/server/member/member-store';
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  getRolePermissions,
  RoleCode,
} from '@/server/identity';

export const dynamic = 'force-dynamic';

/**
 * POST /api/member/switch-to-client
 * Switches active authenticated context from Lobby to a linked Client Organisation.
 * Preserves the Member session — no re-login or session loss required.
 */
export async function POST(request: Request) {
  try {
    const memberSession = getMemberSessionFromRequest(request);
    if (!memberSession || !memberSession.authUserId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in as a Lobby Member.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { clientAccountId } = body;

    // Fetch verified client links for this member
    const clientLinks = await getLobbyClientLinks(memberSession.authUserId);

    if (clientLinks.length === 0) {
      return NextResponse.json(
        { success: false, error: 'This account has no linked client organisations.' },
        { status: 403 }
      );
    }

    const targetLink = clientAccountId
      ? clientLinks.find((l) => l.clientAccountId === clientAccountId && l.status === 'ACTIVE')
      : clientLinks[0];

    if (!targetLink) {
      return NextResponse.json(
        { success: false, error: 'Requested client organisation link not found or inactive.' },
        { status: 404 }
      );
    }

    const rCode = (targetLink.roleCode || 'CLIENT_USER') as RoleCode;
    const duration = 1000 * 60 * 60 * 24 * 7;

    const cafmSession = {
      personId: memberSession.memberId,
      email: memberSession.email,
      name: memberSession.displayName,
      role: rCode,
      orgId: targetLink.clientAccountId,
      orgName: targetLink.clientOrgName,
      orgType: 'CLIENT' as const,
      activeApplication: 'CLIENT' as const,
      permissions: getRolePermissions(rCode),
      scopes: [{ type: 'CLIENT_ACCOUNT' as const, id: targetLink.clientAccountId }],
      source: 'LOBBY_CONTEXT_SWITCH',
      expiresAt: Date.now() + duration,
    };

    const token = createSessionToken(cafmSession as any);

    const response = NextResponse.json({
      success: true,
      targetOrgName: targetLink.clientOrgName,
      redirectUrl: '/clients',
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: Math.floor(duration / 1000),
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
