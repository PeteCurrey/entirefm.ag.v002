import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { createFieldQuoteScope } from '@/server/field';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { workOrderId, visitId, assetId, defectId, scopeDescription, engineersCount, estimatedHours, materialsSummary, materialsItems, voiceCaptureId } = body;
  if (!visitId || !scopeDescription) {
    return NextResponse.json({ error: 'visitId and scopeDescription are required' }, { status: 400 });
  }

  const result = await createFieldQuoteScope(
    {
      workOrderId,
      visitId,
      assetId,
      defectId,
      scopeDescription,
      engineersCount,
      estimatedHours,
      materialsSummary,
      materialsItems,
      voiceCaptureId,
    },
    session
  );

  if (!result.id) {
    return NextResponse.json({ error: result.error || 'Failed to create quote scope' }, { status: 400 });
  }

  return NextResponse.json({ success: true, id: result.id });
}
