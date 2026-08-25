import { NextRequest, NextResponse } from 'next/server';
import { requestVariation } from '@/server/field/operations-store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { reason, additional_scope, estimated_labour_hours, estimated_parts_cost_gbp } = body;

    if (!reason || !additional_scope || estimated_labour_hours === undefined || estimated_parts_cost_gbp === undefined) {
      return NextResponse.json(
        { error: 'reason, additional_scope, estimated_labour_hours, and estimated_parts_cost_gbp are required' },
        { status: 400 }
      );
    }

    const result = await requestVariation(id, {
      reason,
      additional_scope,
      estimated_labour_hours: Number(estimated_labour_hours),
      estimated_parts_cost_gbp: Number(estimated_parts_cost_gbp),
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      variation: result.variation,
      message: result.variation?.nte_breached
        ? 'Variation requested. Total estimate exceeds standard NTE ceiling and requires EntireFM client approval.'
        : 'Variation requested and queued for approval.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
