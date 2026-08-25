import { NextRequest, NextResponse } from 'next/server';
import {
  createSupplierRfi,
  resolveSupplierRfi,
  approveSupplierWithScope,
  conditionallyApproveSupplier,
  declineSupplierApplication,
} from '@/server/suppliers/rfi-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, supplierId, data } = body;

    if (!action || !supplierId) {
      return NextResponse.json({ error: 'action and supplierId are required' }, { status: 400 });
    }

    switch (action) {
      case 'CREATE_RFI': {
        const rfi = await createSupplierRfi({
          supplier_id: supplierId,
          application_ref: data.application_ref || 'SUP-APP',
          section_key: data.section_key || 'general',
          title: data.title,
          requirement_description: data.requirement_description,
          due_date: data.due_date,
          raised_by: data.raised_by || 'EntireFM Reviewer',
        });
        return NextResponse.json({ success: true, rfi });
      }

      case 'RESOLVE_RFI': {
        const result = await resolveSupplierRfi(data.rfi_id, data.resolved_by || 'EntireFM Reviewer', data.notes);
        return NextResponse.json(result);
      }

      case 'APPROVE': {
        const result = await approveSupplierWithScope(supplierId, {
          approved_services: data.approved_services || [],
          decided_by: data.decided_by || 'Head of Supply Chain Assurance',
          effective_date: data.effective_date,
          next_review_date: data.next_review_date,
        });
        return NextResponse.json(result);
      }

      case 'CONDITIONALLY_APPROVE': {
        const result = await conditionallyApproveSupplier(supplierId, {
          condition_description: data.condition_description,
          condition_deadline: data.condition_deadline,
          approved_services: data.approved_services || [],
          decided_by: data.decided_by || 'Head of Supply Chain Assurance',
        });
        return NextResponse.json(result);
      }

      case 'DECLINE': {
        const result = await declineSupplierApplication(supplierId, {
          reason_category: data.reason_category,
          explanation: data.explanation,
          decided_by: data.decided_by || 'Head of Supply Chain Assurance',
        });
        return NextResponse.json(result);
      }

      default:
        return NextResponse.json({ error: `Unsupported action: ${action}` }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
