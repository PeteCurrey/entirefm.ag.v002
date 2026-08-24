/**
 * POST /api/legal/data-rights
 * UK GDPR Data Subject Rights Request intake endpoint
 * Distinct from /api/legal/complaints (Data Protection Complaints)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createDataRightsRequest, type DataSubjectRightType } from '@/server/data-rights';

const VALID_RIGHT_TYPES: DataSubjectRightType[] = [
  'ACCESS',
  'RECTIFICATION',
  'ERASURE',
  'RESTRICTION',
  'PORTABILITY',
  'OBJECTION',
  'AUTOMATED_DECISION_REVIEW',
  'OTHER',
];

const VALID_RELATIONSHIPS = [
  'CLIENT_CONTACT',
  'BUILDING_OCCUPANT',
  'CONTRACTOR_PERSONNEL',
  'JOB_APPLICANT',
  'WEBSITE_VISITOR',
  'OTHER',
] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      right_type,
      full_name,
      email,
      phone,
      relationship,
      organisation_name,
      request_details,
      specific_data_scope,
    } = body;

    // Validate required fields
    if (!right_type || !VALID_RIGHT_TYPES.includes(right_type)) {
      return NextResponse.json(
        { error: 'A valid right type is required.' },
        { status: 400 }
      );
    }
    if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2) {
      return NextResponse.json({ error: 'Your full name is required.' }, { status: 400 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }
    if (!relationship || !VALID_RELATIONSHIPS.includes(relationship)) {
      return NextResponse.json({ error: 'Please describe your relationship to EntireFM.' }, { status: 400 });
    }
    if (!request_details || request_details.trim().length < 20) {
      return NextResponse.json(
        { error: 'Please provide sufficient detail to enable us to process your request.' },
        { status: 400 }
      );
    }

    const { record, reference } = await createDataRightsRequest({
      right_type: right_type as DataSubjectRightType,
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      relationship,
      organisation_name: organisation_name?.trim() || undefined,
      request_details: request_details.trim(),
      specific_data_scope: specific_data_scope?.trim() || undefined,
    });

    return NextResponse.json({
      success: true,
      reference,
      status: record.status,
      right_type: record.right_type,
      received_at: record.clock.receivedAt,
      statutory_due_date: record.clock.finalStatutoryDueDate,
      notice: `Your ${rightTypeLabel(record.right_type)} has been formally recorded under reference ${reference}. We will acknowledge receipt and complete your request without undue delay and at the latest within 1 calendar month in accordance with UK GDPR Article 12(3). Our Data Protection Officer will contact you at ${email} if identity verification is required.`,
      escalation: "If you remain dissatisfied with how we have handled your request, you may lodge a complaint with the Information Commissioner's Office (ICO) at ico.org.uk or on 0303 123 1113.",
    });
  } catch (err: any) {
    console.error('[DATA_RIGHTS_API_ERROR]', err);
    return NextResponse.json(
      {
        error:
          'An unexpected error occurred while registering your request. Please email dpo@entirefm.com directly.',
      },
      { status: 500 }
    );
  }
}

function rightTypeLabel(type: DataSubjectRightType): string {
  const labels: Record<DataSubjectRightType, string> = {
    ACCESS: 'Subject Access Request (SAR)',
    RECTIFICATION: 'Rectification Request',
    ERASURE: 'Erasure Request (Right to be Forgotten)',
    RESTRICTION: 'Restriction of Processing Request',
    PORTABILITY: 'Data Portability Request',
    OBJECTION: 'Objection to Processing',
    AUTOMATED_DECISION_REVIEW: 'Request for Human Review of Automated Decision',
    OTHER: 'Statutory Data Subject Rights Request',
  };
  return labels[type] ?? 'Data Subject Rights Request';
}

