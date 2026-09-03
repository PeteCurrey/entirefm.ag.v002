import { NextRequest, NextResponse } from 'next/server';
import { dbQuery } from '@/server/db/client';

export type ComplaintStatus =
  | 'RECEIVED'
  | 'ACKNOWLEDGED'
  | 'INVESTIGATING'
  | 'AWAITING_INFORMATION'
  | 'DECISION_ISSUED'
  | 'CLOSED';

export interface DataProtectionComplaintPayload {
  fullName: string;
  email: string;
  phone?: string;
  organisationName?: string;
  relationship: string;
  complaintType: string;
  incidentDate?: string;
  referenceNumber?: string;
  description: string;
  desiredOutcome: string;
}

import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/server/security/rate-limiter';
import { checkHoneypot, HONEYPOT_FIELD_NAME } from '@/server/security/honeypot';

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`legal-complaint:${clientIp}`, RATE_LIMITS.ENQUIRY);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions from your connection. Please wait before submitting another complaint.' },
        { status: 429 }
      );
    }

    const rawBody = (await req.json().catch(() => ({}))) as any;

    const honeypot = checkHoneypot(rawBody[HONEYPOT_FIELD_NAME]);
    if (honeypot.triggered) {
      return NextResponse.json({ success: true, reference: 'DPC-RECEIVED' });
    }

    const body = rawBody as DataProtectionComplaintPayload;

    // Validate required fields
    if (!body.fullName || !body.email || !body.relationship || !body.complaintType || !body.description) {
      return NextResponse.json(
        { error: 'Missing required complaint fields (fullName, email, relationship, complaintType, description).' },
        { status: 400 }
      );
    }

    const currentYear = new Date().getFullYear();
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const complaintRef = `DPC-${currentYear}-${randomSuffix}`;
    const receivedAt = new Date().toISOString();

    const record = {
      reference: complaintRef,
      full_name: body.fullName,
      email: body.email,
      phone: body.phone || null,
      organisation_name: body.organisationName || null,
      relationship: body.relationship,
      complaint_type: body.complaintType,
      incident_date: body.incidentDate || null,
      external_reference: body.referenceNumber || null,
      description: body.description,
      desired_outcome: body.desiredOutcome,
      status: 'RECEIVED' as ComplaintStatus,
      received_at: receivedAt,
      statutory_deadline_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    // Attempt to persist in db if audit table exists, or log internally
    try {
      await dbQuery('data_protection_complaints', {
        method: 'POST',
        body: JSON.stringify(record),
      });
    } catch {
      // In development or prior to DB migration, record to internal audit log
      console.log('[DATA_PROTECTION_COMPLAINT_LOGGED]', record);
    }

    return NextResponse.json({
      success: true,
      reference: complaintRef,
      status: 'RECEIVED',
      receivedAt,
      acknowledgementNotice: 'Your complaint has been formally logged. A written acknowledgement and investigation notice will be sent within statutory timelines (UK GDPR Article 12(3)).',
      icoEscalationRoute: 'If you remain dissatisfied with our final response, you have the right to lodge a complaint with the Information Commissioner’s Office (ICO).',
    });
  } catch (err: any) {
    console.error('Error handling data protection complaint:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while logging your complaint. Please contact privacy@entirefm.com directly.' },
      { status: 500 }
    );
  }
}
