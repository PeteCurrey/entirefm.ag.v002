import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { commitImport } from '@/server/data-import';

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const result = await commitImport(id, session);
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    const status = err.message?.includes('Permission denied') ? 403 : 500;
    return NextResponse.json({ error: err.message || 'Failed to commit import batch' }, { status });
  }
}
