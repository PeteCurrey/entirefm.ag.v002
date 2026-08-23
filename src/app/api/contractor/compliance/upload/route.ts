import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { saveContractorComplianceDocument } from '@/server/supply-chain';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { documentType, documentTitle, storagePath, fileSizeBytes, mimeType, expiryDate } = body;
  if (!documentType || !documentTitle || !storagePath) {
    return NextResponse.json({ error: 'Missing required compliance document fields' }, { status: 400 });
  }

  const orgId = session.orgId || session.personId;

  const result = await saveContractorComplianceDocument(
    {
      orgId,
      documentType,
      documentTitle,
      storagePath,
      fileSizeBytes,
      mimeType,
      expiryDate,
      uploadedByPersonId: session.personId,
    },
    session
  );

  if (!result.id) {
    return NextResponse.json({ error: result.error || 'Failed to save document' }, { status: 400 });
  }

  return NextResponse.json({ success: true, id: result.id });
}
