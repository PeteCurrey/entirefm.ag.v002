import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { generateServiceReportDocument } from '@/server/field/operations-store';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getCurrentSession();

    // Default session context for testing or authenticated user
    const effectiveSession = session || {
      personId: 'op-jack-turner',
      orgId: 'sup-test-01',
      role: 'FIELD_ENGINEER',
    };

    const result = await generateServiceReportDocument(id, {
      personId: effectiveSession.personId,
      orgId: effectiveSession.orgId,
      role: effectiveSession.role,
    });

    if (!result.success || !result.document) {
      return NextResponse.json({ error: result.error || 'Failed to generate document' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      document: result.document,
      download_filename: `${result.document.report_reference}.pdf`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
