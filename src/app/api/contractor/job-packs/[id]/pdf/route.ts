import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { getJobPackById, assembleJobPack, generateJobPackPdfHtml } from '@/server/contractor/job-pack-engine';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const { id } = await params;
  let pack = await getJobPackById(id, session);
  if (!pack) {
    try {
      pack = await assembleJobPack(id, session);
    } catch {
      return NextResponse.json({ error: 'Job pack not found' }, { status: 404 });
    }
  }

  const html = generateJobPackPdfHtml(pack);

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `inline; filename="${pack.id}_Job_Pack.html"`,
    },
  });
}
