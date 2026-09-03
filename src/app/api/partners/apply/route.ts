/**
 * PUBLIC PARTNERSHIP ENQUIRY API — /api/partners/apply
 * ====================================================
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

const PartnerApplicationSchema = z.object({
  partnerType: z.string().min(2, 'Partner category is required').max(100),
  companyName: z.string().min(2, 'Company legal name is required').max(150),
  contactName: z.string().min(2, 'Contact name is required').max(100),
  contactEmail: z.string().email('Valid business email is required').max(254),
  contactPhone: z.string().min(7, 'Valid telephone number is required').max(40),
  websiteUrl: z.string().max(300).optional().default(''),
  portfolioOverview: z.string().min(5, 'Brief portfolio / client description is required').max(4000),
  estimatedManagedSqFt: z.string().max(100).optional().default(''),
  geographicFocus: z.string().max(150).optional().default('National / UK Wide'),
  primaryInterests: z.array(z.string().max(100)).min(1, 'Please select at least one collaboration area'),
  notes: z.string().max(3000).optional().default(''),
  consent: z.boolean().refine((v) => v === true, 'You must agree to the partner communication terms'),

  // Security tokens
  turnstile_token: z.string().optional(),
  turnstileToken: z.string().optional(),
  [HONEYPOT_FIELD_NAME]: z.any().optional(),
  fill_duration_ms: z.number().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = PartnerApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors, message: 'Validation failed' },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const partnerId = `PRT-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const rawMessage = `Partner Type: ${data.partnerType}\nCompany: ${data.companyName} (${data.websiteUrl || 'No website'})\nPortfolio / Focus: ${data.portfolioOverview}\nEstimated Scope: ${data.estimatedManagedSqFt || 'N/A'}\nAreas of Collaboration: ${data.primaryInterests.join(', ')}\nNotes: ${data.notes || 'None'}`;

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
      enquiryId: partnerId,
      request,
    });

    if (!guard.allowed) {
      return NextResponse.json(
        { success: false, error: guard.blockReason, message: guard.clientErrorMessage },
        { status: guard.blockStatusCode || 400 }
      );
    }

    // Store partner application durably
    await saveLead({
      name: guard.sanitizedName,
      email: data.contactEmail,
      phone: data.contactPhone,
      company: guard.sanitizedCompany,
      service: `Partner Network: ${sanitizeText(data.partnerType)} (${data.primaryInterests.map(sanitizeText).join(', ')})`,
      location: sanitizeText(data.geographicFocus),
      message: guard.sanitizedMessage,
      conversion_page: '/partner-network',
      form_id: 'partner-network-form',
      enquiryId: partnerId,
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
      partnerId,
      message: 'Partner enquiry received. Our commercial partnerships team will review your portfolio details and arrange an introductory consultation.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
