import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { queryFieldCopilot } from '@/server/field';

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

  const { query, visitId, workOrderId, assetId, clientAccountId } = body;
  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  const result = await queryFieldCopilot(
    query,
    { visitId, workOrderId, assetId, clientAccountId },
    session
  );

  return NextResponse.json(result);
}
