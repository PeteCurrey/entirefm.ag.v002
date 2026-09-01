import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
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
  // ── Authorization guard ──────────────────────────────────────────────────────
  // Must be a valid, unexpired session issued to an internal EntireFM user.
  // No granular approval-role check exists elsewhere in this codebase for supplier
  // onboarding actions, so we gate on orgType === 'ENTIREFM' consistent with all
  // other admin API routes (e.g. src/app/api/admin/users/route.ts).
  const session = await getCurrentSession();
  if (!session || session.orgType !== 'ENTIREFM') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Derive the canonical actor identity from the authenticated session.
  // session.email is always present on UserSession; session.name is the display
  // name stored at login time. Both are sourced from the server-verified token —
  // the client cannot supply or override either value.
  const actorIdentifier = session.email;

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
          raisedBy: actorIdentifier,
        });
        return NextResponse.json({ success: true, rfi: result.rfi });
      }

      case 'RESOLVE_RFI': {
        const result = await resolveSupplierRfi(data.rfi_id, actorIdentifier, data.notes);
        return NextResponse.json(result);
      }

      case 'APPROVE': {
        // Canonical activation: updates supplier org → creates organisations + provider_organisations + memberships
        const result = await approveSupplierApplicationAndActivateProvider({
          applicationId: supplierId,
          approvedServices: data.approved_services || [],
          decidedBy: actorIdentifier,
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
          decided_by: actorIdentifier,
        });
        return NextResponse.json(result);
      }

      case 'DECLINE': {
        const result = await declineSupplierApplicationAction({
          applicationId: supplierId,
          reasonCategory: data.reason_category || 'UNSPECIFIED',
          explanation: data.explanation || '',
          decidedBy: actorIdentifier,
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
