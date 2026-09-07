/**
 * ENTIREFM CAFM — JOB CREATED NOTIFICATION PIPELINE
 * ===================================================
 * Multi-channel dispatch hub triggered immediately when a new work order
 * / service request is created.
 *
 * Channels:
 *  1. In-App Admin Notification (memory store + durable Supabase notifications table)
 *  2. Internal Operations Transactional Email (Resend)
 *  3. Emergency Dispatch SMS (Twilio Programmable Messaging — P1_CRITICAL only)
 *
 * Principles:
 *  - Failure isolation: downstream notification failures NEVER fail or rollback job creation.
 *  - Idempotency: dedupe keys prevent duplicate dispatches on retries.
 *  - Full auditability: outbound messages tracked in communication_messages table.
 */

import { createNotification } from './index';
import { dbQuery, isDbConfigured } from '../db/client';

export interface JobCreatedEvent {
  jobId: string; // Work Order UUID
  workOrderNumber: string; // e.g. EFM-10482
  serviceRequestId: string;
  propertyId: string;
  propertyName: string;
  propertyPostcode?: string;
  clientName?: string;
  title: string;
  description: string;
  priority: 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | 'P4_LOW' | 'P5_SCHEDULED' | string;
  isEmergency?: boolean;
  category?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdByUserId?: string;
  createdByUserName?: string;
  createdByEmail?: string;
  createdAt?: string;
}

export interface JobCreatedNotificationResult {
  jobId: string;
  inApp: {
    success: boolean;
    notificationId?: string;
    error?: string;
  };
  email: {
    success: boolean;
    provider: string;
    messageId?: string;
    recipients: string[];
    skipped?: boolean;
    error?: string;
  };
  sms: {
    success: boolean;
    provider: string;
    messageSids?: string[];
    recipients: string[];
    skipped?: boolean;
    reason?: string;
    error?: string;
  };
}

/**
 * Normalise UK and international phone numbers to E.164 format
 */
export function normalisePhoneNumber(raw: string): string | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[\s\-\(\)\.]/g, '');
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  if (cleaned.startsWith('07') && cleaned.length === 11) {
    return `+44${cleaned.slice(1)}`;
  }
  if (cleaned.startsWith('00')) {
    return `+${cleaned.slice(2)}`;
  }
  if (/^\d{10,15}$/.test(cleaned)) {
    return `+${cleaned}`;
  }
  return null;
}

/**
 * Resolve internal personnel email recipients for operations notifications
 */
export async function resolveInternalEmailRecipients(): Promise<string[]> {
  const recipients = new Set<string>();

  // 1. Check primary environment variable fallbacks
  const envAlertEmail = process.env.ADMIN_ALERT_EMAIL || process.env.LEAD_DELIVERY_EMAIL;
  if (envAlertEmail) {
    envAlertEmail
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.includes('@'))
      .forEach((e) => recipients.add(e));
  }

  // 2. Query active internal EntireFM personnel from DB
  if (isDbConfigured()) {
    try {
      const { data: teamMembers } = await dbQuery<any[]>(
        `organisation_memberships?select=person:persons(email,status),organisation:organisations(org_type)&organisation.org_type=eq.ENTIREFM&limit=20`
      );

      if (teamMembers && teamMembers.length > 0) {
        for (const tm of teamMembers) {
          if (tm.person?.status === 'ACTIVE' && tm.person?.email?.includes('@')) {
            recipients.add(tm.person.email.trim().toLowerCase());
          }
        }
      }
    } catch {
      // Non-blocking fallback
    }
  }

  // 3. Absolute default if no recipients resolved
  if (recipients.size === 0) {
    recipients.add('enquiries@entirefm.com');
  }

  return Array.from(recipients);
}

/**
 * Resolve internal personnel mobile phone recipients for emergency SMS
 */
export async function resolveEmergencySmsRecipients(): Promise<string[]> {
  const recipients = new Set<string>();

  // 1. Check environment variables
  const envPhones = process.env.ADMIN_EMERGENCY_SMS_RECIPIENTS || process.env.ADMIN_ALERT_PHONE;
  if (envPhones) {
    envPhones
      .split(',')
      .map((p) => normalisePhoneNumber(p.trim()))
      .filter((p): p is string => Boolean(p))
      .forEach((p) => recipients.add(p));
  }

  // 2. Query active internal EntireFM personnel with phone numbers from DB
  if (isDbConfigured()) {
    try {
      const { data: teamMembers } = await dbQuery<any[]>(
        `organisation_memberships?select=person:persons(phone,status),organisation:organisations(org_type)&organisation.org_type=eq.ENTIREFM&limit=20`
      );

      if (teamMembers && teamMembers.length > 0) {
        for (const tm of teamMembers) {
          if (tm.person?.status === 'ACTIVE' && tm.person?.phone) {
            const formatted = normalisePhoneNumber(tm.person.phone);
            if (formatted) recipients.add(formatted);
          }
        }
      }
    } catch {
      // Non-blocking fallback
    }
  }

  return Array.from(recipients);
}

/**
 * Format plain text and HTML email content
 */
function buildJobCreatedEmailContent(event: JobCreatedEvent, isEmergency: boolean, baseUrl: string) {
  const portalUrl = `${baseUrl}/admin/operations/work-orders/${event?.jobId || ''}`;
  const priorityColor = isEmergency ? '#DC2626' : event?.priority === 'P2_HIGH' ? '#EA580C' : '#2563EB';

  const woNum = event?.workOrderNumber || 'N/A';
  const propName = event?.propertyName || 'Property';
  const prio = event?.priority || 'NORMAL';
  const desc = event?.description || 'No description provided';
  const title = event?.title || 'Service Request';

  const subject = isEmergency
    ? `🚨 [EMERGENCY WORK ORDER] #${woNum} — ${propName}`
    : `[NEW WORK ORDER] #${woNum} — ${propName} (${prio})`;

  const textBody = `
ENTIREFM FACILITIES MANAGEMENT — NEW WORK ORDER LOGGED
=====================================================
${isEmergency ? '*** CRITICAL / EMERGENCY DISPATCH REQUIRED ***\n' : ''}
Work Order Number : #${woNum}
Service Request   : ${event?.serviceRequestId || 'N/A'}
Priority          : ${prio}
Property          : ${propName} ${event?.propertyPostcode ? `(${event.propertyPostcode})` : ''}
Client            : ${event?.clientName || 'Direct Client'}
Trade Category    : ${event?.category || 'General Reactive Maintenance'}
Title             : ${title}

Description:
${desc}

Reported By:
${event?.createdByUserName || 'Authorised Client User'} (${event?.createdByEmail || 'N/A'}${event?.contactPhone ? `, Tel: ${event.contactPhone}` : ''})

View Work Order & Dispatch:
${portalUrl}
`.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background-color: #0f172a; padding: 24px; text-align: left; }
    .header h1 { color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.025em; }
    .header p { color: #94a3b8; margin: 6px 0 0 0; font-size: 13px; }
    .alert-banner { background-color: ${priorityColor}; color: #ffffff; padding: 12px 24px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
    .body { padding: 24px; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .meta-table td { padding: 8px 0; font-size: 14px; vertical-align: top; border-bottom: 1px solid #f1f5f9; }
    .meta-label { width: 35%; color: #64748b; font-weight: 500; }
    .meta-val { width: 65%; color: #0f172a; font-weight: 600; }
    .desc-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 16px 0 24px 0; font-size: 14px; line-height: 1.5; color: #334155; }
    .btn { display: inline-block; background-color: #0f172a; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; font-size: 14px; }
    .footer { padding: 16px 24px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>EntireFM CAFM Platform</h1>
      <p>Automated Helpdesk & Dispatch Notification</p>
    </div>
    ${
      isEmergency
        ? '<div class="alert-banner">🚨 Critical Emergency Dispatch Required</div>'
        : ''
    }
    <div class="body">
      <table class="meta-table">
        <tr>
          <td class="meta-label">Work Order Ref</td>
          <td class="meta-val">#${woNum}</td>
        </tr>
        <tr>
          <td class="meta-label">Priority</td>
          <td class="meta-val"><span style="color: ${priorityColor};">${prio}</span></td>
        </tr>
        <tr>
          <td class="meta-label">Property</td>
          <td class="meta-val">${propName} ${event?.propertyPostcode ? `(${event.propertyPostcode})` : ''}</td>
        </tr>
        <tr>
          <td class="meta-label">Client Account</td>
          <td class="meta-val">${event?.clientName || 'Direct Client'}</td>
        </tr>
        <tr>
          <td class="meta-label">Trade Category</td>
          <td class="meta-val">${event?.category || 'Reactive Maintenance'}</td>
        </tr>
        <tr>
          <td class="meta-label">Reported By</td>
          <td class="meta-val">${event?.createdByUserName || 'Client Portal'} &lt;${event?.createdByEmail || 'N/A'}&gt;</td>
        </tr>
      </table>

      <h3 style="font-size: 14px; margin: 16px 0 6px 0; color: #0f172a;">Issue Summary:</h3>
      <div style="font-weight: 600; font-size: 16px; margin-bottom: 8px; color: #0f172a;">${title}</div>

      <h3 style="font-size: 14px; margin: 16px 0 6px 0; color: #0f172a;">Detailed Description:</h3>
      <div class="desc-box">${desc.replace(/\n/g, '<br/>')}</div>

      <div style="text-align: center; margin-top: 28px;">
        <a href="${portalUrl}" class="btn">View Work Order in Admin &rarr;</a>
      </div>
    </div>
    <div class="footer">
      EntireFM CAFM Central Dispatch Hub &bull; Automatic Notification Engine
    </div>
  </div>
</body>
</html>
`.trim();

  return { subject, textBody, htmlBody };
}



/**
 * Dispatch In-App Notification (Channel 1)
 */
async function dispatchInAppNotification(
  event: JobCreatedEvent,
  isEmergency: boolean
): Promise<{ success: boolean; notificationId?: string; error?: string }> {
  try {
    const title = isEmergency
      ? `🚨 EMERGENCY WORK ORDER: #${event.workOrderNumber}`
      : `New Work Order: #${event.workOrderNumber}`;

    const message = `${event.workOrderNumber} — ${event.propertyName} (${event.priority}). ${event.title}`;

    const notif = await createNotification({
      type: isEmergency ? 'URGENT_WORK_ORDER' : 'NEW_WORK_ORDER',
      category: 'OPERATIONS',
      severity: isEmergency ? 'CRITICAL' : event.priority === 'P2_HIGH' ? 'WARNING' : 'ATTENTION',
      title,
      message,
      entity_type: 'work_order',
      entity_id: event.jobId,
      action_url: `/admin/operations/work-orders/${event.jobId}`,
      dedupe_key: `workorder:${event.jobId}:created`,
      created_at: event.createdAt || new Date().toISOString(),
      metadata: {
        workOrderNumber: event.workOrderNumber,
        priority: event.priority,
        siteId: event.propertyId,
        siteName: event.propertyName,
        isEmergency,
      },
    });

    return { success: true, notificationId: notif.id };
  } catch (err: any) {
    console.error('[IN_APP_NOTIFICATION_ERROR]:', err);
    return { success: false, error: err?.message || 'Failed to create in-app notification' };
  }
}

/**
 * Dispatch Transactional Email via Resend (Channel 2)
 */
async function dispatchEmailNotification(
  event: JobCreatedEvent,
  isEmergency: boolean,
  baseUrl: string
): Promise<{ success: boolean; provider: string; messageId?: string; recipients: string[]; error?: string }> {
  const recipients = await resolveInternalEmailRecipients();
  const idempotencyKey = `JOB_CREATED:${event.jobId}:EMAIL`;

  // 1. Check idempotency in communication_messages
  if (isDbConfigured()) {
    try {
      const { data: existing } = await dbQuery<any[]>(
        `communication_messages?idempotency_key=eq.${encodeURIComponent(idempotencyKey)}&limit=1`
      );
      if (existing && existing.length > 0) {
        return {
          success: true,
          provider: existing[0].provider || 'Resend',
          messageId: existing[0].provider_message_id || existing[0].id,
          recipients,
        };
      }
    } catch {
      // Non-blocking check
    }
  }

  const { subject, textBody, htmlBody } = buildJobCreatedEmailContent(event, isEmergency, baseUrl);
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.warn('[JOB_CREATED_EMAIL_WARN] RESEND_API_KEY is not configured.');
    // Record interface-only message
    if (isDbConfigured()) {
      await dbQuery('communication_messages', {
        method: 'POST',
        body: {
          id: crypto.randomUUID(),
          thread_id: event.jobId,
          work_order_id: event.jobId,
          sender_name: 'EntireFM Helpdesk',
          sender_email: 'operations@entirefm.com',
          channel: 'EMAIL',
          visibility: 'INTERNAL_ONLY',
          body: textBody,
          idempotency_key: idempotencyKey,
          delivery_state: 'INTERFACE_ONLY',
          provider: 'INTERFACE_ONLY',
          recipient_email: recipients.join(', '),
          failure_reason: 'RESEND_API_KEY not configured',
          created_at: new Date().toISOString(),
        },
      }).catch(() => {});
    }
    return { success: false, provider: 'INTERFACE_ONLY', recipients, error: 'RESEND_API_KEY not configured' };
  }

  try {
    // Dynamic sender with sandbox fallback support
    const isDomainVerified = process.env.TRANSACTIONAL_EMAIL_DOMAIN_VERIFIED === 'true';
    const fromAddress =
      process.env.RESEND_FROM_EMAIL ||
      (resendApiKey.startsWith('re_') && !isDomainVerified
        ? 'EntireFM Operations <onboarding@resend.dev>'
        : 'EntireFM Operations <updates@entirefm.com>');

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: recipients,
        subject,
        text: textBody,
        html: htmlBody,
      }),
    });

    const resJson = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = resJson?.message || `Resend API returned HTTP ${res.status}`;
      console.error('[RESEND_DISPATCH_ERROR]:', errorMsg);

      if (isDbConfigured()) {
        await dbQuery('communication_messages', {
          method: 'POST',
          body: {
            id: crypto.randomUUID(),
            thread_id: event.jobId,
            work_order_id: event.jobId,
            sender_name: 'EntireFM Helpdesk',
            sender_email: fromAddress,
            channel: 'EMAIL',
            visibility: 'INTERNAL_ONLY',
            body: textBody,
            idempotency_key: idempotencyKey,
            delivery_state: 'FAILED',
            provider: 'Resend',
            recipient_email: recipients.join(', '),
            failed_at: new Date().toISOString(),
            failure_reason: errorMsg,
          },
        }).catch(() => {});
      }

      return { success: false, provider: 'Resend', recipients, error: errorMsg };
    }

    const resendId = resJson.id;

    // Record successful dispatch in communication_messages
    if (isDbConfigured()) {
      await dbQuery('communication_messages', {
        method: 'POST',
        body: {
          id: crypto.randomUUID(),
          thread_id: event.jobId,
          work_order_id: event.jobId,
          sender_name: 'EntireFM Helpdesk',
          sender_email: fromAddress,
          channel: 'EMAIL',
          visibility: 'INTERNAL_ONLY',
          body: textBody,
          idempotency_key: idempotencyKey,
          delivery_state: 'SENT',
          provider: 'Resend',
          provider_message_id: resendId,
          recipient_email: recipients.join(', '),
          sent_at: new Date().toISOString(),
        },
      }).catch(() => {});
    }

    return { success: true, provider: 'Resend', messageId: resendId, recipients };
  } catch (err: any) {
    console.error('[JOB_CREATED_EMAIL_FATAL]:', err);
    return { success: false, provider: 'Resend', recipients, error: err?.message || 'Network error sending email' };
  }
}

/**
 * Dispatch Emergency SMS via Twilio Programmable Messaging (Channel 3)
 */
async function dispatchEmergencySms(
  event: JobCreatedEvent,
  baseUrl: string
): Promise<{
  success: boolean;
  provider: string;
  messageSids?: string[];
  recipients: string[];
  skipped?: boolean;
  reason?: string;
  error?: string;
}> {
  const recipients = await resolveEmergencySmsRecipients();

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  const fromNumber = process.env.TWILIO_FROM_NUMBER || process.env.TWILIO_PHONE_NUMBER;

  // Verify Twilio credentials
  if (!accountSid || !authToken || (!messagingServiceSid && !fromNumber)) {
    console.warn(
      '[TWILIO_SMS_NOTICE] Twilio credentials not configured in environment. Recording state as SKIPPED_NOT_CONFIGURED.'
    );

    if (isDbConfigured()) {
      await dbQuery('communication_messages', {
        method: 'POST',
        body: {
          id: crypto.randomUUID(),
          thread_id: event.jobId,
          work_order_id: event.jobId,
          sender_name: 'EntireFM Emergency Dispatch',
          sender_email: 'operations@entirefm.com',
          channel: 'SMS',
          visibility: 'INTERNAL_ONLY',
          body: `🚨 EMERGENCY WORK ORDER #${event.workOrderNumber} at ${event.propertyName}. (Credentials unconfigured)`,
          idempotency_key: `JOB_CREATED:${event.jobId}:SMS:CONFIG_NOTICE`,
          delivery_state: 'INTERFACE_ONLY',
          provider: 'Twilio',
          recipient_email: recipients.join(', ') || 'N/A',
          failure_reason: 'Twilio credentials not configured in environment',
          created_at: new Date().toISOString(),
        },
      }).catch(() => {});
    }

    return {
      success: false,
      provider: 'Twilio',
      recipients,
      skipped: true,
      reason: 'NOT_CONFIGURED',
      error: 'Twilio credentials not configured in environment',
    };
  }

  if (recipients.length === 0) {
    console.warn('[TWILIO_SMS_NOTICE] No emergency phone recipients resolved.');
    return {
      success: false,
      provider: 'Twilio',
      recipients: [],
      skipped: true,
      reason: 'NO_RECIPIENTS',
      error: 'No active mobile phone numbers found for emergency broadcast',
    };
  }

  // Load Twilio SDK dynamically
  let twilio: any;
  try {
    const twilioModule = await import('twilio');
    twilio = twilioModule.default || twilioModule;
  } catch (err: any) {
    console.error('[TWILIO_IMPORT_ERROR]:', err);
    return {
      success: false,
      provider: 'Twilio',
      recipients,
      error: 'Twilio module not available',
    };
  }

  const client = twilio(accountSid, authToken);
  const statusCallback = `${baseUrl}/api/webhooks/twilio/message-status`;

  // Concise emergency text
  const smsBody = `🚨 ENTIREFM EMERGENCY WORK ORDER #${event.workOrderNumber}\nProperty: ${event.propertyName}${event.propertyPostcode ? ` (${event.propertyPostcode})` : ''}\nTitle: ${event.title}\nPriority: P1 CRITICAL\nPortal: ${baseUrl}/admin/operations/work-orders/${event.jobId}`;

  const messageSids: string[] = [];
  const errors: string[] = [];

  for (const toPhone of recipients) {
    const idempotencyKey = `JOB_CREATED:${event.jobId}:SMS:${toPhone}`;

    // Idempotency check
    if (isDbConfigured()) {
      try {
        const { data: existing } = await dbQuery<any[]>(
          `communication_messages?idempotency_key=eq.${encodeURIComponent(idempotencyKey)}&limit=1`
        );
        if (existing && existing.length > 0) {
          if (existing[0].provider_message_id) {
            messageSids.push(existing[0].provider_message_id);
          }
          continue;
        }
      } catch {
        // Non-blocking
      }
    }

    try {
      const msgOptions: Record<string, any> = {
        to: toPhone,
        body: smsBody,
        statusCallback,
      };

      if (messagingServiceSid) {
        msgOptions.messagingServiceSid = messagingServiceSid;
      } else if (fromNumber) {
        msgOptions.from = fromNumber;
      }

      const twilioMsg = await client.messages.create(msgOptions);
      messageSids.push(twilioMsg.sid);

      // Record queued message in communication_messages
      if (isDbConfigured()) {
        await dbQuery('communication_messages', {
          method: 'POST',
          body: {
            id: crypto.randomUUID(),
            thread_id: event.jobId,
            work_order_id: event.jobId,
            sender_name: 'EntireFM Emergency Dispatch',
            sender_email: 'operations@entirefm.com',
            channel: 'SMS',
            visibility: 'INTERNAL_ONLY',
            body: smsBody,
            idempotency_key: idempotencyKey,
            delivery_state: 'QUEUED',
            provider: 'Twilio',
            provider_message_id: twilioMsg.sid,
            recipient_email: toPhone,
            queued_at: new Date().toISOString(),
          },
        }).catch(() => {});
      }
    } catch (err: any) {
      console.error(`[TWILIO_SMS_SEND_ERROR] Recipient ${toPhone}:`, err?.message);
      errors.push(`${toPhone}: ${err?.message}`);

      if (isDbConfigured()) {
        await dbQuery('communication_messages', {
          method: 'POST',
          body: {
            id: crypto.randomUUID(),
            thread_id: event.jobId,
            work_order_id: event.jobId,
            sender_name: 'EntireFM Emergency Dispatch',
            sender_email: 'operations@entirefm.com',
            channel: 'SMS',
            visibility: 'INTERNAL_ONLY',
            body: smsBody,
            idempotency_key: idempotencyKey,
            delivery_state: 'FAILED',
            provider: 'Twilio',
            recipient_email: toPhone,
            failed_at: new Date().toISOString(),
            failure_reason: err?.message,
          },
        }).catch(() => {});
      }
    }
  }

  return {
    success: messageSids.length > 0,
    provider: 'Twilio',
    messageSids,
    recipients,
    error: errors.length > 0 ? errors.join('; ') : undefined,
  };
}

/**
 * Main Canonical Entry Point: Dispatch Job Created Notification Pipeline
 *
 * Guaranteed failure isolation: errors in in-app, email, or SMS channels are logged
 * and returned in the structured result, never throwing an uncaught exception.
 */
export async function dispatchJobCreatedNotificationPipeline(
  event: JobCreatedEvent
): Promise<JobCreatedNotificationResult> {
  const defaultResult: JobCreatedNotificationResult = {
    jobId: event?.jobId || 'UNKNOWN',
    inApp: { success: false, error: 'Not executed' },
    email: { success: false, provider: 'NONE', recipients: [], error: 'Not executed' },
    sms: { success: false, provider: 'NONE', recipients: [], skipped: true, error: 'Not executed' },
  };

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.entirefm.com';
    const isEmergency = Boolean(event?.isEmergency || event?.priority === 'P1_CRITICAL');

    // Channel 1: In-App Admin Notification
    const inAppResult = await dispatchInAppNotification(event, isEmergency);

    // Channel 2: Operations Transactional Email (Resend)
    const emailResult = await dispatchEmailNotification(event, isEmergency, baseUrl);

    // Channel 3: Emergency SMS (Twilio — P1_CRITICAL only)
    let smsResult: {
      success: boolean;
      provider: string;
      messageSids?: string[];
      recipients: string[];
      skipped?: boolean;
      reason?: string;
      error?: string;
    };

    if (isEmergency) {
      smsResult = await dispatchEmergencySms(event, baseUrl);
    } else {
      smsResult = {
        success: true,
        provider: 'Twilio',
        recipients: [],
        skipped: true,
        reason: 'NOT_EMERGENCY',
      };
    }

    return {
      jobId: event?.jobId || 'UNKNOWN',
      inApp: inAppResult,
      email: emailResult,
      sms: smsResult,
    };
  } catch (fatalErr: any) {
    console.error('[NOTIFICATION_PIPELINE_UNCAUGHT_FATAL]:', fatalErr);
    return {
      ...defaultResult,
      inApp: { success: false, error: fatalErr?.message || 'Fatal error' },
    };
  }
}
