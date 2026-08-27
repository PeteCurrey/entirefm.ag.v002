import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { getRamsRecordById, generateRamsPdfHtml } from '@/server/contractor/rams-service';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const { id } = await params;
  const rams = await getRamsRecordById(id, session);
  if (!rams) return NextResponse.json({ error: 'RAMS not found' }, { status: 404 });

  const html = generateRamsPdfHtml(rams);

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `inline; filename="${rams.id}_RAMS_Pack.html"`,
    },
  });
}
