import { NextResponse } from 'next/server';
import { getMemberSessionFromRequest } from '@/server/member/member-session';
import { getLobbyClientLinks } from '@/server/member/member-store';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/member/estate/managed-portfolio
 * Returns read-only view of client-managed portfolio assets for dual-context members.
 * Strictly read-only: no write paths back into client contract data.
 */
export async function GET(request: Request) {
  try {
    const session = getMemberSessionFromRequest(request);
    if (!session || !session.authUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clientLinks = await getLobbyClientLinks(session.authUserId);
    if (clientLinks.length === 0) {
      return NextResponse.json({
        success: true,
        hasClientLink: false,
        assets: [],
      });
    }

    // Query authoritative client assets
    const { data: assets, error } = await dbQuery<any[]>(
      'assets?status=neq.ARCHIVED&select=id,name,category,manufacturer,model,serial_number,status,condition,created_at&limit=50&order=name.asc'
    );

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      hasClientLink: true,
      clientOrgName: clientLinks[0].clientOrgName,
      assets: assets || [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
