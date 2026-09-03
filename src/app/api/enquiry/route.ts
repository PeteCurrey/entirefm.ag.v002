/**
 * ENQUIRY SUBMISSION API ENDPOINT — /api/enquiry
 * ===============================================
 * Production-grade durable, anti-spam hardened lead delivery pipeline.
 *
 * Security Enhancements:
 * 1. Cloudflare Turnstile anti-bot verification (fail-closed if secret configured)
 * 2. Invisible honeypot field trapping
 * 3. Sliding-window IP rate limiting (5 / hr / IP)
 * 4. Disposable email domain blocking
 * 5. Rules-based spam content analysis (URLs, crypto, gambling, adult, SEO spam)
 * 6. Rapid duplicate enquiry fingerprinting and throttling
 * 7. HTML entity sanitization in stored and dispatched messages (anti-XSS)
 * 8. Strict anti-header injection safeguards on email reply-to
 * 9. Quarantine routing: suspends transactional email and notification floods on suspected spam
 * 10. Privacy-preserving anti-enumeration responses
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { CONTACT_CONFIG } from '@/config/contact';
import { saveLead, leadStoreConfigured } from '@/lib/leads/store';
import { guardEnquirySubmission } from '@/server/security/enquiry-guard';
import { HONEYPOT_FIELD_NAME } from '@/server/security/honeypot';
import { sanitizeText } from '@/server/security/spam-detector';

const EnquirySchema = z.object({
  name: z.string().min(2, 'Full name is required (min 2 characters)').max(100, 'Name is too long'),
  email: z.string().email('A valid email address is required').max(254, 'Email is too long'),
  phone: z.string().max(40, 'Phone is too long').optional().default(''),
  company: z.string().max(120, 'Company name is too long').optional().default(''),
  service: z.string().max(150, 'Service is too long').optional().default('General Facilities Management'),
  location: z.string().max(150, 'Location is too long').optional().default('National / UK Wide'),
  message: z.string().min(5, 'Message must contain at least 5 characters').max(5000, 'Message is too long (max 5000 characters)'),
  
  // Security Tokens & Telemetry
  turnstile_token: z.string().optional(),
  turnstileToken: z.string().optional(),
  [HONEYPOT_FIELD_NAME]: z.any().optional(),
  fill_duration_ms: z.number().optional(),

  // Lead Attribution Metadata
  landing_page: z.string().max(300).optional().default(''),
  conversion_page: z.string().max(300).optional().default(''),
  page_type: z.string().max(100).optional().default(''),
  first_touch_url: z.string().max(500).optional().default(''),
  last_touch_url: z.string().max(500).optional().default(''),
  first_touch_referrer: z.string().max(500).optional().default(''),
  last_touch_referrer: z.string().max(500).optional().default(''),
  journey_trail: z.array(z.any()).optional().default([]),
  assisted_pages: z.array(z.string()).optional().default([]),
  gclid: z.string().max(200).optional().default(''),
  msclkid: z.string().max(200).optional().default(''),
  session_id: z.string().max(200).optional().default(''),
  form_id: z.string().max(100).optional().default('enquiry-form'),
  form_page: z.string().max(300).optional().default(''),
  sector_interest: z.string().max(150).optional().default(''),
  location_interest: z.string().max(150).optional().default(''),
  utm_source: z.string().max(100).optional().default(''),
  utm_medium: z.string().max(100).optional().default(''),
  utm_campaign: z.string().max(100).optional().default(''),
  utm_term: z.string().max(100).optional().default(''),
  utm_content: z.string().max(100).optional().default(''),
  referrer: z.string().max(500).optional().default(''),
  drone_brief: z.any().optional(),
  asset_scanner_context: z.any().optional(),
  lead_source: z.string().max(100).optional(),
  lead_priority: z.string().max(50).optional(),
  timestamp: z.string().optional().default(() => new Date().toISOString()),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = EnquirySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.error.flatten().fieldErrors,
          message: 'Validation failed. Please check the entered information.',
        },
        { status: 400 }
      );
    }

    const data = result.data;
    const enquiryId = `EFM-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Security & Anti-Abuse Verification
    const turnstileToken = data.turnstile_token || data.turnstileToken;
    const honeypotValue = (data as any)[HONEYPOT_FIELD_NAME];
    const fillDurationMs = data.fill_duration_ms;

    const guardResult = await guardEnquirySubmission({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      message: data.message,
      turnstileToken,
      honeypotValue,
      fillDurationMs,
      enquiryId,
      request,
    });

    // Hard bot rejection (e.g. Honeypot triggered, Turnstile failed, IP rate-limited)
    if (!guardResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: guardResult.blockReason,
          message: guardResult.clientErrorMessage || 'Enquiry verification failed.',
        },
        {
          status: guardResult.blockStatusCode || 400,
        }
      );
    }

    // Sanitize user-facing text
    const cleanName = guardResult.sanitizedName;
    const cleanCompany = guardResult.sanitizedCompany;
    const cleanMessage = guardResult.sanitizedMessage;
    const cleanLocation = sanitizeText(data.location);
    const cleanService = sanitizeText(data.service);

    const leadRecord = {
      ...data,
      enquiryId,
      name: cleanName,
      company: cleanCompany,
      message: cleanMessage,
      service: cleanService,
      location: cleanLocation,
      receivedAt: new Date().toISOString(),
      spam_score: guardResult.riskScore,
      spam_flags: guardResult.spamFlags,
      spam_status: guardResult.spamStatus,
      submission_ip: guardResult.clientIp,
      submission_duration_ms: fillDurationMs || null,
      turnstile_verified: guardResult.turnstileVerified,
      duplicate_of: guardResult.duplicateOf || null,
      notification_dispatched: guardResult.dispatchNotification,
    };

    const resendApiKey = process.env.RESEND_API_KEY;
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    const leadDeliveryEmail = process.env.LEAD_DELIVERY_EMAIL || CONTACT_CONFIG.enquiryEmail;

    let deliveredDurable = false;
    let deliveryMethod = 'none';

    // Method 0: Supabase — durable record of all enquiries (including quarantined spam for review)
    if (leadStoreConfigured()) {
      const stored = await saveLead(leadRecord);
      if (stored) {
        deliveredDurable = true;
        deliveryMethod = 'supabase';
      }
    }

    // Method 1: Resend Alert — ONLY dispatched for legitimate, clean enquiries!
    // Quarantined spam or repeated duplicates MUST NOT trigger staff email alerts.
    if (resendApiKey && guardResult.dispatchNotification) {
      try {
        // Enforce strict header safety on reply-to address (no newlines/carriage returns)
        const safeReplyTo = data.email.replace(/[\r\n]/g, '').trim();

        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'EntireFM Commercial Portal <enquiries@entirefm.com>',
            to: [leadDeliveryEmail],
            reply_to: safeReplyTo,
            subject: data.drone_brief
              ? `[DRONE BRIEF - ${data.drone_brief.leadPriority || 'HIGH'}] ${cleanService} — ${cleanCompany || cleanName} (${cleanLocation})`
              : `[NEW PROPOSAL REQUEST] ${cleanService} — ${cleanCompany || cleanName} (${cleanLocation})`,
            html: `
              <h2>${data.drone_brief ? 'New Drone Inspection Brief Received' : 'New Commercial Enquiry / Proposal Request'}</h2>
              <p><strong>Enquiry ID:</strong> ${enquiryId}</p>
              ${data.drone_brief ? `<p><strong>Drone Brief Ref:</strong> ${data.drone_brief.referenceNumber || 'N/A'} (Priority: <span style="color:#d946ef;font-weight:bold;">${data.drone_brief.leadPriority || 'HIGH'}</span>)</p>` : ''}
              <hr />
              <h3>Contact Details</h3>
              <p><strong>Name:</strong> ${cleanName}</p>
              <p><strong>Email:</strong> <a href="mailto:${safeReplyTo}">${safeReplyTo}</a></p>
              <p><strong>Phone:</strong> ${sanitizeText(data.phone) || 'Not provided'}</p>
              <p><strong>Company:</strong> ${cleanCompany || 'Not provided'}</p>
              <hr />
              <h3>Requirement</h3>
              <p><strong>Service:</strong> ${cleanService}</p>
              <p><strong>Location:</strong> ${cleanLocation}</p>
              <p><strong>Message / Scope:</strong></p>
              <blockquote style="background:#f4f4f4;padding:12px;border-left:4px solid #2563eb;white-space:pre-wrap;">
                ${cleanMessage}
              </blockquote>
              <hr />
              <h3>Attribution &amp; Security</h3>
              <p><strong>Conversion Page:</strong> ${sanitizeText(data.conversion_page) || 'N/A'}</p>
              <p><strong>Landing Page:</strong> ${sanitizeText(data.landing_page) || 'N/A'}</p>
              <p><strong>Spam Score:</strong> ${guardResult.riskScore} (${guardResult.spamStatus})</p>
              <p><strong>Turnstile Verified:</strong> ${guardResult.turnstileVerified ? 'Yes' : 'Simulated / Dev'}</p>
              <p><strong>Timestamp:</strong> ${leadRecord.receivedAt}</p>
            `,
          }),
        });

        if (emailRes.ok) {
          if (!deliveredDurable) deliveryMethod = 'resend_email';
          else deliveryMethod = `${deliveryMethod}+email`;
          deliveredDurable = true;
        }
      } catch (e) {
        console.error('[LEAD_DELIVERY_ERROR: Resend API failed]', e);
      }
    }

    // Method 2: Webhook / CRM Ingestion (clean enquiries only)
    if (!deliveredDurable && webhookUrl && guardResult.dispatchNotification) {
      try {
        const hookRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadRecord),
        });

        if (hookRes.ok) {
          deliveredDurable = true;
          deliveryMethod = 'crm_webhook';
        }
      } catch (e) {
        console.error('[LEAD_DELIVERY_ERROR: Webhook ingestion failed]', e);
      }
    }

    // Local dev mock fallback
    const isDev = process.env.NODE_ENV === 'development';
    if (!deliveredDurable && isDev) {
      console.log('[DEV_MODE_LEAD_CAPTURE]', JSON.stringify(leadRecord, null, 2));
      deliveredDurable = true;
      deliveryMethod = 'local_dev_mock';
    }

    // FAIL-CLOSED
    if (!deliveredDurable) {
      console.error('[CRITICAL: LEAD PERSISTENCE FAILED — NO DURABLE SINK AVAILABLE]', JSON.stringify(leadRecord));
      return NextResponse.json(
        {
          success: false,
          error: 'LEAD_DISPATCH_UNAVAILABLE',
          message: `Our online portal is undergoing scheduled maintenance. Please contact our commercial operations desk directly on ${CONTACT_CONFIG.mainPhone.display} or email ${CONTACT_CONFIG.enquiryEmail}.`,
        },
        { status: 503 }
      );
    }

    // Generic friendly success response — never leak spam score or status to client
    return NextResponse.json(
      {
        success: true,
        enquiryId,
        deliveryMethod,
        message: 'Your proposal request has been successfully received by our commercial operations desk.',
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error('[ENQUIRY_API_ERROR]', err);
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred while processing your enquiry. Please try again.',
      },
      { status: 500 }
    );
  }
}
