import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { uploadReplacementDocument } from '@/server/contractor/document-vault-service';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: existingDocumentId } = await params;
    const body = await request.json();

    const contractorOrgId = body.contractorOrgId || session.orgId;

    if (session.orgType === 'CONTRACTOR' && !session.viewAsContext && session.orgId !== contractorOrgId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const result = await uploadReplacementDocument(
      {
        existingDocumentId,
        contractorOrgId,
        fileName: body.fileName || 'Replacement_Document.pdf',
        fileUrl: body.fileUrl || `/storage/compliance/${contractorOrgId}/${Date.now()}_replacement.pdf`,
        fileSizeBytes: body.fileSizeBytes,
        issueDate: body.issueDate,
        expiryDate: body.expiryDate,
        notes: body.notes,
      },
      session
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to upload replacement' }, { status: 400 });
    }

    return NextResponse.json({ success: true, newDocumentId: result.newDocumentId });
  } catch (err: any) {
    console.error('[API_REPLACE_DOCUMENT] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
