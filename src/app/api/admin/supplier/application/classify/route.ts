/**
 * POST /api/admin/supplier/application/classify
 * ================================================
 * Admin classifies a REGISTRATION_CLASSIFICATION_REQUIRED registration
 * as a contractor applicant, creating the necessary organisation + draft
 * records and persisting full provenance / audit trail.
 *
 * Route is protected by the Admin layout middleware — no inline auth needed.
 */
import { NextRequest, NextResponse } from 'next/server';
import { classifyRegistrationAsContractor } from '@/server/suppliers/applications-repo';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { applicationId, classifyAs, companyNameHint, classifiedBy } = body as {
      applicationId: string;
      classifyAs: string;
      companyNameHint?: string;
      classifiedBy?: string;
    };

    if (!applicationId) {
      return NextResponse.json({ success: false, error: 'applicationId is required' }, { status: 400 });
    }

    if (classifyAs !== 'CONTRACTOR') {
      return NextResponse.json(
        { success: false, error: 'Only CONTRACTOR classification is supported at this time' },
        { status: 400 }
      );
    }

    const result = await classifyRegistrationAsContractor({
      supplierUserId: applicationId,
      classifiedByAdminId: classifiedBy || 'ADMIN',
      companyNameHint,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Classification failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orgId: result.orgId,
      applicationReference: result.applicationReference,
      message: 'Registration classified as Contractor applicant. Application draft created.',
    });
  } catch (err: any) {
    console.error('[CLASSIFY_ROUTE_ERROR]', err);
    return NextResponse.json({ success: false, error: 'Unexpected error' }, { status: 500 });
  }
}
