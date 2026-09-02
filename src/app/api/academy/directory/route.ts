import { NextResponse } from 'next/server';
import { getDirectoryMembers } from '@/server/member/member-store';

export const dynamic = 'force-dynamic';

/**
 * GET /api/academy/directory
 * 
 * Public searchable & filterable FM Practitioner Directory.
 * Surfaces verified certifications, badges, live reputation, and community accepted solutions.
 * 
 * STRICT PRIVACY REQUIREMENT:
 * Only returns members who have explicitly opted in (directory_opt_in === true).
 * An opt-out immediately excludes the member from results.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query') || undefined;
    const certification = searchParams.get('certification') || searchParams.get('pathSlug') || undefined;
    const sector = searchParams.get('sector') || undefined;
    const location = searchParams.get('location') || searchParams.get('region') || undefined;

    const members = await getDirectoryMembers({
      query,
      pathSlug: certification,
      sector,
      location,
    });

    return NextResponse.json({
      success: true,
      count: members.length,
      members,
    });
  } catch (err: any) {
    console.error('[ACADEMY_DIRECTORY_API] Error fetching directory:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch directory' },
      { status: 500 }
    );
  }
}
