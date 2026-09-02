import { NextResponse } from 'next/server';
import {
  getLobbyClientLinks,
  addLobbyClientLink,
  revokeLobbyClientLink,
} from '@/server/member/member-store';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/lobby/client-links
 * List links for a specific auth user or all active links.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const authUserId = url.searchParams.get('authUserId');

    if (authUserId) {
      const links = await getLobbyClientLinks(authUserId);
      return NextResponse.json({ success: true, links });
    }

    const { data: allLinks, error } = await dbQuery<any[]>(
      'lobby_client_links?select=*,client_account:client_accounts(id,account_code,organisation:organisations(id,name,org_type))&order=created_at.desc'
    );

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    return NextResponse.json({ success: true, links: allLinks || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * POST /api/admin/lobby/client-links
 * Explicitly link or revoke a client organisation link for a Lobby member.
 * Zero automation: must be an explicit admin action.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action = 'link', authUserId, clientAccountId, roleCode = 'CLIENT_USER' } = body;

    if (!authUserId || !clientAccountId) {
      return NextResponse.json(
        { success: false, error: 'authUserId and clientAccountId are required.' },
        { status: 400 }
      );
    }

    if (action === 'revoke') {
      const revoked = await revokeLobbyClientLink(authUserId, clientAccountId);
      return NextResponse.json({ success: revoked });
    }

    const link = await addLobbyClientLink(authUserId, clientAccountId, roleCode, 'ADMIN');
    if (!link) {
      return NextResponse.json(
        { success: false, error: 'Failed to create client organisation link.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, link });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
