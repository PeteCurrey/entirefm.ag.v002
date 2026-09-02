import { NextRequest, NextResponse } from 'next/server';
import { getIndustryAwards, getClosingSoonAwards } from '@/server/awards/awards-store';
import type { AwardStatus } from '@/server/awards/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as AwardStatus | null;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 20;

    const { awards, total } = await getIndustryAwards({
      status: status || undefined,
      search,
      limit,
    });

    const closingSoon = await getClosingSoonAwards();

    return NextResponse.json({
      success: true,
      awards,
      closingSoon,
      total,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
