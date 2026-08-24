import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { applyMappingAndValidate } from '@/server/data-import';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await req.json();
    const { mapping } = body;

    if (!mapping || typeof mapping !== 'object') {
      return NextResponse.json({ error: 'Mapping object is required.' }, { status: 400 });
    }

    const preview = await applyMappingAndValidate(id, mapping, session);
    return NextResponse.json(preview, { status: 200 });
  } catch (err: any) {
    const status = err.message?.includes('Permission denied') ? 403 : 500;
    return NextResponse.json({ error: err.message || 'Failed to apply mapping' }, { status });
  }
}
