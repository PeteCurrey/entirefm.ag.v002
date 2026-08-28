import { NextRequest, NextResponse } from 'next/server';
import {
  createSupplierRfi,
  resolveSupplierRfi,
  conditionallyApproveSupplier,
} from '@/server/suppliers/rfi-store';
import {
  approveSupplierApplicationAndActivateProvider,
  declineSupplierApplicationAction,
  requestApplicationInformation,
} from '@/server/suppliers/applications-repo';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, supplierId, data } = body;

    if (!action || !supplierId) {
      return NextResponse.json({ error: 'action and supplierId are required' }, { status: 400 });
    }

    switch (action) {
      case 'CREATE_RFI': {
        const result = await requestApplicationInformation({
          applicationId: supplierId,
          title: data.title,
          requirementDescription: data.requirement_description,
          sectionKey: data.section_key || 'general',
          dueDate: data.due_date,
          raisedBy: data.raised_by || 'EntireFM Reviewer',
        });
        return NextResponse.json({ success: true, rfi: result.rfi });
      }

      case 'RESOLVE_RFI': {
        const result = await resolveSupplierRfi(data.rfi_id, data.resolved_by || 'EntireFM Reviewer', data.notes);
        return NextResponse.json(result);
      }

      case 'APPROVE': {
        // Canonical activation: updates supplier org → creates organisations + provider_organisations + memberships
        const result = await approveSupplierApplicationAndActivateProvider({
          applicationId: supplierId,
          approvedServices: data.approved_services || [],
          decidedBy: data.decided_by || 'Head of Supply Chain Assurance',
          effectiveDate: data.effective_date,
          notes: data.notes,
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
        const result = await declineSupplierApplicationAction({
          applicationId: supplierId,
          reasonCategory: data.reason_category || 'UNSPECIFIED',
          explanation: data.explanation || '',
          decidedBy: data.decided_by || 'Head of Supply Chain Assurance',
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
