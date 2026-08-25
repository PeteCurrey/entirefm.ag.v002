import { NextRequest, NextResponse } from 'next/server';
import { recordVisitNoAccess } from '@/server/field/operations-store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      operativeId = 'op-jack-turner',
      reason = 'Site closed / No keyholder present',
      contact_attempted = true,
      contact_notes = 'Called site manager Dave Smith 3 times with no answer.',
      photo_evidence_url,
    } = body;

    const result = await recordVisitNoAccess(id, operativeId, {
      reason,
      contact_attempted,
      contact_notes,
      photo_evidence_url,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      visit: result.visit,
      message: 'No Access recorded. SLA has been paused and a return visit has been requested.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
