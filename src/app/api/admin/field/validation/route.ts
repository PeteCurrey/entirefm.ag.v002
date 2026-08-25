import { NextRequest, NextResponse } from 'next/server';
import { validateServiceReport } from '@/server/field/operations-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      visitId,
      action = 'VALIDATE',
      reviewerName = 'EntireFM Operations Lead',
      correctionReason,
    } = body;

    if (!visitId || !['VALIDATE', 'CORRECTION_REQUIRED'].includes(action)) {
      return NextResponse.json({ error: 'visitId and valid action required' }, { status: 400 });
    }

    const result = await validateServiceReport(visitId, action, reviewerName, correctionReason);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      report: result.report,
      message: action === 'VALIDATE' ? 'Service report validated successfully.' : 'Correction request sent to supplier organisation.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
