import { NextRequest, NextResponse } from 'next/server';
import {
  createComplaintRecord,
  ComplaintCategory,
  ComplaintSeverity,
  CATEGORY_ROUTING,
} from '@/server/complaints';
import { LEGAL_CONFIG } from '@/config/legal';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      category,
      subCategory,
      fullName,
      email,
      phone,
      organisationName,
      relationship,
      siteAddress,
      externalReference,
      severity,
      description,
      desiredResolution,
    } = body;

    // Validate required fields
    if (!category || !fullName || !email || !relationship || !description || !desiredResolution) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: category, fullName, email, relationship, description, desiredResolution.',
        },
        { status: 400 }
      );
    }

    const validCategory = (category as ComplaintCategory) || 'SERVICE';
    const routing = CATEGORY_ROUTING[validCategory] || CATEGORY_ROUTING.SERVICE;

    const { record, reference } = await createComplaintRecord({
      category: validCategory,
      sub_category: subCategory,
      full_name: fullName,
      email,
      phone,
      organisation_name: organisationName,
      relationship,
      site_address: siteAddress,
      external_reference: externalReference,
      severity: (severity as ComplaintSeverity) || 'MEDIUM',
      description,
      desired_resolution: desiredResolution,
      source: 'PUBLIC_WEB',
    });

    return NextResponse.json({
      success: true,
      reference,
      status: record.status,
      category: record.category,
      responsibleTeam: record.responsible_team,
      receivedAt: record.received_at,
      acknowledgementTargetAt: record.internal_acknowledgement_target_at,
      notice:
        routing.statutoryNotice ||
        `Your complaint has been formally logged and routed to our ${routing.team} team for investigation. A written acknowledgment will be sent to ${email} within ${routing.internalAckTargetDays} business days.`,

      escalationRoute:
        validCategory === 'DATA_PROTECTION'
          ? 'Information Commissioner’s Office (ICO) — ico.org.uk'
          : validCategory === 'HEALTH_SAFETY'
          ? 'Health and Safety Executive (HSE) — hse.gov.uk'
          : validCategory === 'WHISTLEBLOWING'
          ? 'Independent whistleblowing & Protect helpline — protect-advice.org.uk'
          : 'Independent Alternative Dispute Resolution / Senior Executive Review',
    });
  } catch (err: any) {
    console.error('Error creating complaint:', err);
    return NextResponse.json(
      {
        error:
          'An unexpected error occurred while registering your complaint. Please email compliance@entirefm.com directly.',
      },
      { status: 500 }
    );
  }
}
