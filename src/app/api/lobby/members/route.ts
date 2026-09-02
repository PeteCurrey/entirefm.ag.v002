import { NextResponse } from 'next/server';
import { getDirectoryMembers } from '@/server/member/member-store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || searchParams.get('query') || undefined;
  const certification = searchParams.get('certification') || searchParams.get('pathSlug') || undefined;
  const sector = searchParams.get('sector') || undefined;
  const location = searchParams.get('location') || searchParams.get('region') || undefined;

  const members = await getDirectoryMembers({
    query: q,
    pathSlug: certification,
    sector,
    location,
  });

  return NextResponse.json({ success: true, count: members.length, members });
}

