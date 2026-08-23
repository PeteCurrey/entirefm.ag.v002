import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listImportBatches, createImportBatch, generateBatchNumber } from '@/server/ppm';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const clientAccountId = searchParams.get('clientAccountId') || undefined;
  const batches = await listImportBatches(clientAccountId, session);
  return NextResponse.json({ batches });
}

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  let body: any = {};
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  const { clientAccountId, siteId, fileName, fileStoragePath, sourceFormat } = body;
  if (!clientAccountId || !fileName || !sourceFormat) {
    return NextResponse.json({ error: 'clientAccountId, fileName, and sourceFormat are required' }, { status: 400 });
  }
  const result = await createImportBatch(
    { clientAccountId, siteId, fileName, fileStoragePath: fileStoragePath || `imports/${generateBatchNumber()}/${fileName}`, sourceFormat },
    session
  );
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ id: result.id, batchNumber: result.batchNumber });
}
