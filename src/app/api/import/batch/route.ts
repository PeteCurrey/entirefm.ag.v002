import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { createImportBatch } from '@/server/data-import';

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { entityType, sourceSystem, filename, fileContent } = body;

    if (!entityType || !filename || !fileContent) {
      return NextResponse.json(
        { error: 'entityType, filename, and fileContent are required.' },
        { status: 400 }
      );
    }

    const result = await createImportBatch(
      { entityType, sourceSystem, filename, fileContent },
      session
    );

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    const status = err.message?.includes('Permission denied') ? 403 : 500;
    return NextResponse.json({ error: err.message || 'Failed to create import batch' }, { status });
  }
}
