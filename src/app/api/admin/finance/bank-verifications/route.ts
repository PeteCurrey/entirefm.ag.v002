/**
 * GET  /api/admin/finance/bank-verifications   — list pending verifications
 * POST /api/admin/finance/bank-verifications   — request a new bank detail change
 * PATCH /api/admin/finance/bank-verifications  — verify or reject a pending request
 *
 * Phase 0H-R: Supplier bank details cannot be changed from an invoice screen.
 * A separate two-person privileged workflow is required.
 */

import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import {
  requestSupplierBankDetailChange,
  verifySupplierBankDetailChange,
} from '@/server/finance';
import { dbQuery } from '@/server/db/client';

export async function GET(req: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    if (!session.permissions.includes('finance:bank_details_view') &&
        !session.permissions.includes('finance:bank_details_manage')) {
      return NextResponse.json({ error: 'Forbidden: finance:bank_details_view required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') ?? 'PENDING';
    const supplierId = searchParams.get('supplier_org_id');

    let endpoint = `supplier_bank_detail_verifications?verification_status=eq.${encodeURIComponent(status)}&select=*,supplier:organisations(name)&order=requested_at.desc&limit=50`;
    if (supplierId) endpoint += `&supplier_org_id=eq.${encodeURIComponent(supplierId)}`;

    const { data } = await dbQuery<any[]>(endpoint);
    const verifications = data || [];
    return NextResponse.json({ verifications });
  } catch (err: any) {
    console.error('[bank-verifications] GET error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

    const body = await req.json();
    const {
      supplier_org_id,
      proposed_account_name,
      proposed_sort_code,
      proposed_account_number_last4,
      proposed_iban_last4,
      evidence_reference,
    } = body;

    if (!supplier_org_id || !proposed_account_name || !evidence_reference) {
      return NextResponse.json(
        { error: 'supplier_org_id, proposed_account_name and evidence_reference are required' },
        { status: 400 }
      );
    }

    const result = await requestSupplierBankDetailChange({
      supplierOrgId: supplier_org_id,
      proposedAccountName: proposed_account_name,
      proposedSortCode: proposed_sort_code,
      proposedAccountNumberLast4: proposed_account_number_last4,
      proposedIbanLast4: proposed_iban_last4,
      evidenceReference: evidence_reference,
      session,
    });

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (err: any) {
    const status = err.message?.startsWith('PERMISSION_DENIED') ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

    const body = await req.json();
    const { verification_id, approved, rejection_reason } = body;
    if (!verification_id || typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'verification_id and approved (boolean) are required' }, { status: 400 });
    }

    await verifySupplierBankDetailChange({
      verificationId: verification_id,
      approved,
      rejectionReason: rejection_reason,
      session,
    });

    return NextResponse.json({ success: true, status: approved ? 'VERIFIED' : 'REJECTED' });
  } catch (err: any) {
    const status = err.message?.startsWith('PERMISSION_DENIED') ? 403
                 : err.message?.startsWith('SEGREGATION_OF_DUTIES') ? 409
                 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
