import { NextRequest, NextResponse } from 'next/server';
import { recordOperationalPart } from '@/server/field/operations-store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      part_name,
      manufacturer = 'Generic',
      part_number = 'N/A',
      quantity = 1,
      is_installed = true,
      is_awaiting_delivery = false,
      expected_arrival_date,
    } = body;

    if (!part_name) {
      return NextResponse.json({ error: 'part_name is required' }, { status: 400 });
    }

    const result = await recordOperationalPart(id, {
      part_name,
      manufacturer,
      part_number,
      quantity: Number(quantity),
      is_installed: Boolean(is_installed),
      is_awaiting_delivery: Boolean(is_awaiting_delivery),
      expected_arrival_date,
    });

    if (!result.success) {
      return NextResponse.json({ error: 'Failed to record part' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      part: result.part,
      message: is_awaiting_delivery
        ? 'Part marked as awaiting delivery. Job status updated to Awaiting Parts with return visit required.'
        : 'Part recorded as installed.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
