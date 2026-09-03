/**
 * PUBLIC SUPPLIER APPLICATION API — /api/suppliers/apply
 * =======================================================
 * Hardened with Turnstile validation, honeypot detection, sliding-window
 * rate limiting, spam scoring, and safe lead storage.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { saveLead } from '@/lib/leads/store';
import { guardEnquirySubmission } from '@/server/security/enquiry-guard';
import { HONEYPOT_FIELD_NAME } from '@/server/security/honeypot';
import { RATE_LIMITS } from '@/server/security/rate-limiter';
import { sanitizeText } from '@/server/security/spam-detector';

const SupplierApplicationSchema = z.object({
  companyName: z.string().min(2, 'Company legal name is required').max(150),
  tradingName: z.string().max(150).optional().default(''),
  websiteUrl: z.string().max(300).optional().default(''),
  companyNumber: z.string().max(50).optional().default(''),
  yearEstablished: z.string().max(10).optional().default(''),
  employeeCount: z.string().max(50).optional().default(''),
  businessType: z.string().min(2, 'Business type is required').max(100),
  contactName: z.string().min(2, 'Contact name is required').max(100),
  contactEmail: z.string().email('Valid business email address is required').max(254),
  contactPhone: z.string().min(7, 'Valid telephone number is required').max(40),
  registeredAddress: z.string().min(5, 'Registered business address is required').max(300),
  coverageTier: z.enum(['LOCAL', 'REGIONAL', 'NATIONAL']).default('REGIONAL'),
  geographicCoverage: z.string().min(2, 'Primary operational regions are required').max(200),
  primaryTrades: z.array(z.string().max(100)).min(1, 'Please select at least one service category or trade discipline'),
  publicLiabilityCover: z.string().min(1, 'Public liability cover amount is required').max(50),
  employersLiabilityCover: z.string().max(50).optional().default(''),
  professionalIndemnityCover: z.string().max(50).optional().default(''),
  ssipAccreditations: z.array(z.string().max(100)).optional().default([]),
  accreditationNumbers: z.record(z.string(), z.string().max(100)).optional().default({}),
  tradeCertifications: z.string().max(300).optional().default(''),
  additionalNotes: z.string().max(3000).optional().default(''),
  complianceDeclaration: z.boolean().refine((v) => v === true, 'You must confirm compliance standards declaration'),
  privacyConsent: z.boolean().refine((v) => v === true, 'You must accept the privacy notice'),

  // Security tokens
  turnstile_token: z.string().optional(),
  turnstileToken: z.string().optional(),
  [HONEYPOT_FIELD_NAME]: z.any().optional(),
  fill_duration_ms: z.number().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = SupplierApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors, message: 'Validation failed' },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const applicationId = `SUP-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Format structured accreditations
    const formattedAccreditations = data.ssipAccreditations.map((a) => {
      const num = data.accreditationNumbers[a];
      return num ? `${a} (Scheme #: ${num})` : a;
    });

    // Structure summary message for admin review
    const rawMessage = [
      `[SUPPLIER APPLICATION — PHASE 1 QUALIFICATION]`,
      `Application ID: ${applicationId}`,
      `Company Legal Name: ${data.companyName}`,
      data.tradingName ? `Trading Name: ${data.tradingName}` : null,
      data.websiteUrl ? `Website: ${data.websiteUrl}` : null,
      data.companyNumber ? `Companies House / Reg: ${data.companyNumber}` : null,
      data.yearEstablished ? `Year Established: ${data.yearEstablished}` : null,
      data.employeeCount ? `Employees: ${data.employeeCount}` : null,
      `Business Type: ${data.businessType}`,
      `Primary Contact: ${data.contactName} (${data.contactEmail} / ${data.contactPhone})`,
      `Address: ${data.registeredAddress}`,
      `Coverage Scope: ${data.coverageTier} — ${data.geographicCoverage}`,
      `Disciplines / Services: ${data.primaryTrades.join(', ')}`,
      `Public Liability: ${data.publicLiabilityCover}`,
      data.employersLiabilityCover ? `Employers Liability: ${data.employersLiabilityCover}` : null,
      data.professionalIndemnityCover ? `Professional Indemnity: ${data.professionalIndemnityCover}` : null,
      formattedAccreditations.length > 0 ? `Accreditations & Scheme Numbers:\n  • ${formattedAccreditations.join('\n  • ')}` : null,
      data.tradeCertifications ? `Legacy Trade Certifications: ${data.tradeCertifications}` : null,
      data.additionalNotes ? `\nApplicant Statement / Notes:\n${data.additionalNotes}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    // Security guard
    const turnstileToken = data.turnstile_token || data.turnstileToken;
    const honeypotValue = (data as any)[HONEYPOT_FIELD_NAME];

    const guard = await guardEnquirySubmission({
      name: data.contactName,
      email: data.contactEmail,
      phone: data.contactPhone,
      company: data.companyName,
      message: rawMessage,
      turnstileToken,
      honeypotValue,
      fillDurationMs: data.fill_duration_ms,
      rateLimitConfig: RATE_LIMITS.PARTNER_APPLY,
      enquiryId: applicationId,
      request,
    });

    if (!guard.allowed) {
      return NextResponse.json(
        { success: false, error: guard.blockReason, message: guard.clientErrorMessage },
        { status: guard.blockStatusCode || 400 }
      );
    }

    // Store supplier application durably
    await saveLead({
      enquiryId: applicationId,
      name: guard.sanitizedName,
      email: data.contactEmail,
      phone: data.contactPhone,
      company: guard.sanitizedCompany,
      service: `Supplier Application: ${sanitizeText(data.businessType)} · ${data.primaryTrades.slice(0, 3).map(sanitizeText).join(', ')}${data.primaryTrades.length > 3 ? ' +' + (data.primaryTrades.length - 3) : ''}`,
      location: sanitizeText(data.geographicCoverage),
      message: guard.sanitizedMessage,
      landing_page: '/suppliers',
      conversion_page: '/suppliers/apply',
      page_type: 'supplier-application',
      form_id: 'supplier-application-form',
      lead_priority: 'HIGH',
      sector_interest: sanitizeText(data.businessType),
      location_interest: sanitizeText(data.geographicCoverage),
      spam_score: guard.riskScore,
      spam_flags: guard.spamFlags,
      spam_status: guard.spamStatus,
      submission_ip: guard.clientIp,
      submission_duration_ms: data.fill_duration_ms || null,
      turnstile_verified: guard.turnstileVerified,
      duplicate_of: guard.duplicateOf || null,
      notification_dispatched: guard.dispatchNotification,
    });

    return NextResponse.json({
      success: true,
      applicationId,
      status: 'APPLICATION',
      message: 'Supplier application received. Our supply chain governance and compliance team will review your application against our Assurance Framework.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
