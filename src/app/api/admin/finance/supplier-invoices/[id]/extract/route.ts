import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { recordExtractionResult } from '@/server/finance';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!hasPermission(session, 'finance:write'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  // extractionResult must come from AI or manual review — never invented here
  if (!body.extractionResult) {
    return NextResponse.json({ error: 'extractionResult is required' }, { status: 400 });
  }

  await recordExtractionResult({
    invoiceId: id,
    extractionResult: body.extractionResult,
    agentId: body.agentId,
  }, session);

  return NextResponse.json({ ok: true });
}
