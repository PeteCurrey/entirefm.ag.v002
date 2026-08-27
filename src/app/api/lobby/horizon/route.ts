import { NextResponse } from 'next/server';
import { getOnTheHorizonItems } from '@/server/events/horizon-store';

export async function GET() {
  try {
    const items = getOnTheHorizonItems();
    return NextResponse.json({
      success: true,
      items,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
