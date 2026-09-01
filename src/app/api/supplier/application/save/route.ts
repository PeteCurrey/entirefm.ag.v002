import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import {
  getOrCreateApplicationDraft,
  updateApplicationDraft,
  validateSupplierAuthUser,
} from '@/server/suppliers/supplier-auth-store';
import { sendAdminSignupAlert } from '@/server/notifications/admin-alert';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    const body = await req.json();
    const { orgId, draftData } = body;

    const targetOrgId =
      orgId ||
      session?.orgId ||
      (session?.personId ? (await validateSupplierAuthUser(session.personId))?.supplierUser?.organisation_id : null);

    if (!targetOrgId) {
      return NextResponse.json({ error: 'Organisation ID is required' }, { status: 400 });
    }

    // Save to canonical supplier-auth-store (Supabase-backed)
    const updated = await updateApplicationDraft(targetOrgId, draftData || {});

    if (updated) {
      // Dispatch Admin Notification (Moment 2: Full Application Submitted)
      if (draftData?.status === 'SUBMITTED' || draftData?.lifecycleStatus === 'SUBMITTED') {
        sendAdminSignupAlert({
          type: 'CONTRACTOR_SUBMITTED',
          name: updated.primaryContactName || updated.declarantName || session?.name || 'Contractor Applicant',
          email: updated.primaryContactEmail || updated.generalEmail || session?.email || 'N/A',
          company: updated.tradingName || updated.legalCompanyName || 'New Contractor',
          phone: updated.primaryContactPhone || updated.mainPhone,
          roleOrTrade: (updated.selectedServices || []).join(', ') || 'Specialist Contractor',
          actionUrl: `/admin/suppliers/applications`,
          details: {
            'Application Ref': updated.applicationReference,
            'Selected Services': (updated.selectedServices || []).join(', ') || 'None specified',
            'Selected Regions': (updated.selectedRegions || []).join(', ') || 'National',
            'Payment Status': updated.membershipPaymentStatus || 'PENDING',
          },
        }).catch((err) => console.error('[ADMIN_ALERT_ERROR: Contractor Submitted]', err));
      }
    }

    return NextResponse.json({
      success: true,
      savedAt: new Date().toISOString(),
      draft: updated,
    });
  } catch (error: any) {
    console.error('Error saving supplier application draft:', error);
    return NextResponse.json({ error: error.message || 'Failed to save draft' }, { status: 500 });
  }
}
