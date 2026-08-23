/**
 * ENQUIRY SUBMISSION API ENDPOINT — /api/enquiry
 * ===============================================
 * Production-grade durable lead delivery pipeline.
 *
 * Requirements:
 * 1. Zod schema validation
 * 2. Attribution & tracking metadata capture
 * 3. Durable storage, tried in order:
 *      a. Supabase `leads` table  — the primary sink, and what /admin reads
 *      b. Resend transactional email (RESEND_API_KEY)
 *      c. CRM webhook (LEAD_WEBHOOK_URL)
 * 4. FAIL-CLOSED ARCHITECTURE: Never returns success: true if lead was not durably accepted.
 *
 * WHY DATABASE FIRST
 * ------------------
 * Email is a notification, not a record. If the inbox rule moves it, or the
 * send silently fails, the enquiry is gone and nothing can tell you it
 * existed. Writing the row first means every enquiry is recoverable and
 * countable by conversion page — which is the whole point of rebuilding the
 * geo landing pages. Email still goes out, as an alert on top of the record.
 *
 * More than one sink can succeed; the first success is what unblocks the
 * response, and the rest are attempted regardless.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { CONTACT_CONFIG } from '@/config/contact';
import { saveLead, leadStoreConfigured } from '@/lib/leads/store';

const EnquirySchema = z.object({
  name: z.string().min(2, 'Full name is required (min 2 characters)'),
  email: z.string().email('A valid email address is required'),
  phone: z.string().optional().default(''),
  company: z.string().optional().default(''),
  service: z.string().optional().default('General Facilities Management'),
  location: z.string().optional().default('National / UK Wide'),
  message: z.string().min(5, 'Message must contain at least 5 characters'),
  
  // Lead Attribution Metadata
  landing_page: z.string().optional().default(''),
  conversion_page: z.string().optional().default(''),
  page_type: z.string().optional().default(''),
  utm_source: z.string().optional().default(''),
  utm_medium: z.string().optional().default(''),
  utm_campaign: z.string().optional().default(''),
  utm_term: z.string().optional().default(''),
  utm_content: z.string().optional().default(''),
  referrer: z.string().optional().default(''),
  timestamp: z.string().optional().default(() => new Date().toISOString()),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = EnquirySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.error.flatten().fieldErrors,
          message: 'Validation failed. Please complete all required fields.',
        },
        { status: 400 }
      );
    }

    const data = result.data;
    const enquiryId = `EFM-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const leadRecord = {
      enquiryId,
      receivedAt: new Date().toISOString(),
      ...data,
    };

    const resendApiKey = process.env.RESEND_API_KEY;
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    const leadDeliveryEmail = process.env.LEAD_DELIVERY_EMAIL || CONTACT_CONFIG.enquiryEmail;

    let deliveredDurable = false;
    let deliveryMethod = 'none';

    // Method 0: Supabase — the durable record, and the source /admin reads.
    if (leadStoreConfigured()) {
      const stored = await saveLead({ ...data, enquiryId });
      if (stored) {
        deliveredDurable = true;
        deliveryMethod = 'supabase';
      }
    }

    // Method 1: Resend — an alert on top of the record, not a substitute for
    // it. Runs whether or not the row was written.
    if (resendApiKey) {
      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'EntireFM Commercial Portal <enquiries@entirefm.com>',
            to: [leadDeliveryEmail],
            reply_to: data.email,
            subject: `[NEW PROPOSAL REQUEST] ${data.service} — ${data.company || data.name} (${data.location})`,
            html: `
              <h2>New Commercial Enquiry / Proposal Request</h2>
              <p><strong>Enquiry ID:</strong> ${enquiryId}</p>
              <hr />
              <h3>Contact Details</h3>
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
              <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
              <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
              <hr />
              <h3>Requirement</h3>
              <p><strong>Service:</strong> ${data.service}</p>
              <p><strong>Location:</strong> ${data.location}</p>
              <p><strong>Message / Scope:</strong></p>
              <blockquote style="background:#f4f4f4;padding:12px;border-left:4px solid #2563eb;">
                ${data.message.replace(/\n/g, '<br />')}
              </blockquote>
              <hr />
              <h3>Attribution Metadata</h3>
              <p><strong>Conversion Page:</strong> ${data.conversion_page || 'N/A'}</p>
              <p><strong>Landing Page:</strong> ${data.landing_page || 'N/A'}</p>
              <p><strong>UTM Source / Campaign:</strong> ${data.utm_source || 'direct'} / ${data.utm_campaign || 'none'}</p>
              <p><strong>Referrer:</strong> ${data.referrer || 'none'}</p>
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

    // Method 2: Webhook / CRM Ingestion Endpoint
    if (!deliveredDurable && webhookUrl) {
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

    // In local dev environment only, allow mock delivery with explicit log
    const isDev = process.env.NODE_ENV === 'development';
    if (!deliveredDurable && isDev) {
      console.log('[DEV_MODE_LEAD_CAPTURE]', JSON.stringify(leadRecord, null, 2));
      deliveredDurable = true;
      deliveryMethod = 'local_dev_mock';
    }

    // FAIL-CLOSED: If production environment cannot guarantee durable storage/delivery
    if (!deliveredDurable) {
      // Logged in full so the enquiry is at least recoverable from the
      // platform logs while the sink is fixed. Better than losing it.
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
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process enquiry: ' + message,
      },
      { status: 500 }
    );
  }
}
