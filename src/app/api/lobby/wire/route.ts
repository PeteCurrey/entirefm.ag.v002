import { NextResponse } from 'next/server';
import { getGroupedWeeklyWire, getPeopleMovesWire } from '@/server/wire/wire-store';

export async function GET() {
  try {
    const weeklyGroups = await getGroupedWeeklyWire();
    const latestItems = await getPeopleMovesWire(20);

    return NextResponse.json({
      success: true,
      weeklyGroups,
      latestItems,
      totalCount: latestItems.length,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
