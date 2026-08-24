import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listImportBatches, getDataStatus } from '@/server/data-import';

export async function GET(_req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [batches, status] = await Promise.all([
      listImportBatches(session),
      getDataStatus(session),
    ]);

    return NextResponse.json({ batches, status }, { status: 200 });
  } catch (err: any) {
    const statusCode = err.message?.includes('Permission denied') ? 403 : 500;
    return NextResponse.json({ error: err.message || 'Failed to list import history' }, { status: statusCode });
  }
}
