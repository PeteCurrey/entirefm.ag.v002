import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const { data: quotes } = await dbQuery<any[]>(`quotes?id=eq.${id}&select=*`);
  if (!quotes || quotes.length === 0) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
  }

  const quote = quotes[0];
  const { data: lines } = await dbQuery<any[]>(`quote_lines?quote_id=eq.${id}&select=*`);
  const { data: provenance } = await dbQuery<any[]>(`quote_provenance?quote_id=eq.${id}&select=*`);
  const { data: versions } = await dbQuery<any[]>(`quote_versions?quote_id=eq.${id}&select=*&order=version.desc`);

  return NextResponse.json({
    quote: {
      ...quote,
      lines: lines || [],
      provenance: provenance || [],
      versions: versions || [],
    },
  });
}
