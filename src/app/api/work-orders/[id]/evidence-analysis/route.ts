import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { analyzeWorkOrderEvidence } from '@/server/work/evidence-intelligence';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const result = await analyzeWorkOrderEvidence(id, session);

    return NextResponse.json({
      success: true,
      analysis: result,
    });
  } catch (err: any) {
    console.error('[API_EVIDENCE_ANALYSIS_ERROR]', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const result = await analyzeWorkOrderEvidence(id, session);

    return NextResponse.json({
      success: true,
      analysis: result,
      message: 'Multimodal evidence analysis successfully completed and logged.',
    });
  } catch (err: any) {
    console.error('[API_EVIDENCE_ANALYSIS_ERROR]', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
