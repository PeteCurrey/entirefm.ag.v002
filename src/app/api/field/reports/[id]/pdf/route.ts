import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import {
  getReportInstanceById,
  canUserAccessReport,
  generateRev4ReportHtml,
  generateRev4PdfBinary,
} from '@/server/field-reports';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getCurrentSession();

    const pack = await getReportInstanceById(id);
    if (!pack) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const accessCheck = canUserAccessReport(session, pack.instance);
    if (!accessCheck.allowed) {
      return NextResponse.json({ error: accessCheck.reason || 'Forbidden' }, { status: 403 });
    }

    const url = new URL(req.url);
    const format = url.searchParams.get('format');

    if (format === 'pdf') {
      const pdf = generateRev4PdfBinary(pack);
      return new NextResponse(new Uint8Array(pdf.buffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${pack.instance.report_number}.pdf"`,
          'ETag': `"${pdf.checksumSha256}"`,
        },
      });
    }

    // Default: Return high-fidelity Rev 4.0 Print HTML
    const html = generateRev4ReportHtml(pack);
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (err: any) {
    console.error('[API /api/field/reports/[id]/pdf Error]', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
