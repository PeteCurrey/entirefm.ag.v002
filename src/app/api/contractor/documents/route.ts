import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listVaultDocuments, VaultCategory, DocumentVerificationState } from '@/server/contractor/document-vault-service';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('orgId') || session.orgId;
    const category = (searchParams.get('category') || 'ALL') as VaultCategory | 'ALL';
    const verification = (searchParams.get('verification') || 'ALL') as DocumentVerificationState | 'ALL';
    const expiryWindow = (searchParams.get('expiryWindow') || 'ALL') as any;
    const searchQuery = searchParams.get('q') || undefined;
    const includeSuperseded = searchParams.get('includeSuperseded') === 'true';

    // Tenant isolation check
    if (session.orgType === 'CONTRACTOR' && !session.viewAsContext && session.orgId !== orgId) {
      return NextResponse.json({ error: 'Forbidden: Cannot access other contractor documents' }, { status: 403 });
    }

    if (!orgId) {
      return NextResponse.json({ error: 'Contractor organisation ID required' }, { status: 400 });
    }

    const documents = await listVaultDocuments(
      {
        contractorOrgId: orgId,
        category,
        verificationState: verification,
        expiryWindow,
        searchQuery,
        includeSuperseded,
      },
      session
    );

    return NextResponse.json({ success: true, documents });
  } catch (err: any) {
    console.error('[API_VAULT_DOCUMENTS] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
