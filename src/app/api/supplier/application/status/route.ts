import { NextRequest, NextResponse } from 'next/server';
import { getSupplierOnboardingDraft } from '@/server/suppliers/store';
import { listSupplierRfis } from '@/server/suppliers/rfi-store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const supplierId = searchParams.get('supplierId');

    if (!supplierId) {
      return NextResponse.json({ error: 'supplierId query parameter is required' }, { status: 400 });
    }

    const draft = await getSupplierOnboardingDraft(supplierId);
    const rfis = await listSupplierRfis(supplierId);
    const pendingRfis = rfis.filter((r) => r.status === 'ACTION_REQUIRED');

    return NextResponse.json({
      supplierId,
      applicationRef: draft.application_reference,
      companyName: draft.legal_company_name,
      status: draft.status,
      submittedAt: draft.submitted_at,
      paymentStatus: draft.assurance_payment?.status || 'UNPAID',
      paymentMethod: draft.assurance_payment?.payment_method,
      transactionRef: draft.assurance_payment?.transaction_reference,
      paidAt: draft.assurance_payment?.paid_at,
      pendingRfiCount: pendingRfis.length,
      rfis,
    });
  } catch (error: any) {
    console.error('Error fetching supplier application status:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch application status' },
      { status: 500 }
    );
  }
}
