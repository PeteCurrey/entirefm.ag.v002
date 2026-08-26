import { NextRequest, NextResponse } from 'next/server';
import { submitDigitalServiceReport } from '@/server/field/operations-store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      operativeId = 'op-jack-turner',
      work_completed_narrative = 'Work completed in accordance with EntireFM standard operating procedures.',
      engineer_recommendations = 'Continue routine planned maintenance schedule.',
      completion_outcome = 'COMPLETED',
      site_signatory,
      idempotencyKey = req.headers.get('x-idempotency-key') || undefined,
    } = body;

    const result = await submitDigitalServiceReport(
      id,
      operativeId,
      {
        work_completed_narrative,
        engineer_recommendations,
        completion_outcome,
        site_signatory,
      },
      idempotencyKey
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      report: result.report,
      reportNumber: result.report?.report_number,
      revisionNumber: result.report?.revision_number,
      message: 'Service report submitted successfully for EntireFM Operations validation.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
