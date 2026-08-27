import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { getContractorOperativeById } from '@/server/contractor/workforce-service';
import { evaluateOperativeEligibility } from '@/server/contractor/operative-eligibility-engine';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { operativeId, workOrderReq } = body;
  if (!operativeId || !workOrderReq) {
    return NextResponse.json({ error: 'operativeId and workOrderReq are required' }, { status: 400 });
  }

  const operative = await getContractorOperativeById(operativeId, session);
  if (!operative) {
    return NextResponse.json({ error: 'Operative not found' }, { status: 404 });
  }

  const evaluation = await evaluateOperativeEligibility(operative, workOrderReq, session);
  return NextResponse.json({ success: true, evaluation });
}
