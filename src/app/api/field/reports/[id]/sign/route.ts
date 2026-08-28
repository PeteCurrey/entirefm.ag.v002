import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import {
  getReportInstanceById,
  recordReportSignature,
  canUserEditReport,
  SignatureType,
} from '@/server/field-reports';

export const dynamic = 'force-dynamic';

export async function POST(
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

    const editCheck = canUserEditReport(session, pack.instance);
    if (!editCheck.allowed) {
      return NextResponse.json({ error: editCheck.reason || 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { signatureType, signatoryName, signatoryPosition, signatureDataUrl, declarationText } = body;

    if (!signatureType || !signatoryName) {
      return NextResponse.json({ error: 'signatureType and signatoryName are required' }, { status: 400 });
    }

    const validTypes: SignatureType[] = ['ENGINEER', 'CLIENT_REP', 'ENTIREFM_REVIEWER'];
    if (!validTypes.includes(signatureType)) {
      return NextResponse.json({ error: 'Invalid signatureType' }, { status: 400 });
    }

    const recorded = await recordReportSignature({
      reportInstanceId: id,
      signatureType,
      signatoryName,
      signatoryPosition: signatoryPosition || null,
      signatureDataUrl: signatureDataUrl || null,
      signedByUserId: session?.personId || null,
      declarationText: declarationText || null,
    });

    return NextResponse.json({ success: true, signature: recorded });
  } catch (err: any) {
    console.error('[API /api/field/reports/[id]/sign Error]', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
