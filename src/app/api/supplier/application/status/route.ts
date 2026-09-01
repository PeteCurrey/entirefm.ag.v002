import { NextRequest, NextResponse } from 'next/server';
import { getApplicationDraft } from '@/server/suppliers/supplier-auth-store';
import { listSupplierRfis } from '@/server/suppliers/rfi-store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const supplierId = searchParams.get('supplierId');

    if (!supplierId) {
      return NextResponse.json({ error: 'supplierId query parameter is required' }, { status: 400 });
    }

    const draft = await getApplicationDraft(supplierId);
    const rfis = await listSupplierRfis(supplierId);
    const pendingRfis = rfis.filter((r) => r.status === 'ACTION_REQUIRED');

    return NextResponse.json({
      supplierId,
      applicationRef: draft?.applicationReference || '',
      companyName: draft?.legalCompanyName || draft?.tradingName || '',
      status: draft?.lifecycleStatus || 'DRAFT',
      submittedAt: draft?.submittedAt,
      paymentStatus: draft?.membershipPaymentStatus || 'UNPAID',
      paymentMethod: draft?.membershipPaymentStatus === 'PAID' ? 'CARD' : undefined,
      transactionRef: draft?.membershipPaymentIntentId,
      paidAt: draft?.membershipPaidAt,
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
