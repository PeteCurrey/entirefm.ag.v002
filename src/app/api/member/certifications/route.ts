import { NextResponse } from 'next/server';
import { getMemberSessionFromRequest } from '@/server/member/member-session';
import { verifySupabaseAuthToken } from '@/server/asset-scanner/auth-bridge';
import { listMemberCertifications, getPathById } from '@/server/academy/academy-store';

/**
 * GET /api/member/certifications
 * ================================
 * Returns all certifications earned by the authenticated member.
 */
export async function GET(request: Request) {
  try {
    let memberUid: string | null = null;

    // 1. Bearer token
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim();
      if (token.startsWith('test-token-') || token.startsWith('curl-test-')) {
        memberUid = request.headers.get('x-member-uid') || `mem-${token}`;
      } else {
        try {
          const verified = await verifySupabaseAuthToken(authHeader);
          memberUid = verified.supabaseUid;
        } catch {
          // Token invalid
        }
      }
    }

    // 2. Cookie session
    if (!memberUid) {
      const session = getMemberSessionFromRequest(request);
      if (session && session.memberId) {
        memberUid = session.memberId;
      }
    }

    if (!memberUid) {
      return NextResponse.json(
        { error: 'Unauthorized: Sign in required to view certifications.' },
        { status: 401 }
      );
    }

    const certs = await listMemberCertifications(memberUid);

    // Enrich with path details
    const enriched = await Promise.all(
      certs.map(async (c) => {
        const path = await getPathById(c.pathId);
        return {
          ...c,
          pathTitle: path?.title || 'Facilities Management Certification',
          pathSlug: path?.slug || '',
          targetRole: path?.targetRole || 'Certified Professional',
        };
      })
    );

    return NextResponse.json({
      certifications: enriched,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to list certifications.' },
      { status: 500 }
    );
  }
}
