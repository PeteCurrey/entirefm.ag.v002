import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { reviewDocumentVerification } from '@/server/contractor/document-vault-service';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session || (session.orgType !== 'ENTIREFM' && !session.viewAsContext)) {
      return NextResponse.json({ error: 'Forbidden: EntireFM compliance staff only' }, { status: 403 });
    }

    const { id: contractorOrgId } = await params;
    const body = await request.json();

    const { documentId, decision, rejectionReason, contractorVisibleNote, internalEntirefmNote } = body;

    if (!documentId || !decision) {
      return NextResponse.json({ error: 'documentId and decision (VERIFY | REJECT) are required' }, { status: 400 });
    }

    const result = await reviewDocumentVerification(
      {
        documentId,
        contractorOrgId,
        decision,
        rejectionReason,
        contractorVisibleNote,
        internalEntirefmNote,
      },
      session
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to review document' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[API_ADMIN_VERIFY_DOCUMENT] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
