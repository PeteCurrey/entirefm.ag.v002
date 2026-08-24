import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { generateIssueCSV } from '@/server/data-import';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const csvContent = await generateIssueCSV(id, session);

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="import-issues-${id}.csv"`,
      },
    });
  } catch (err: any) {
    const status = err.message?.includes('Permission denied') ? 403 : 500;
    return NextResponse.json({ error: err.message || 'Failed to generate issue CSV' }, { status });
  }
}
