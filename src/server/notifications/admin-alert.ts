/**
 * ENTIREFM ADMIN REGISTRATION ALERT SERVICE
 * ==========================================
 * Dispatches immediate email notifications (via Resend) and creates in-app
 * admin notification records whenever a new signup occurs across any of
 * the three platform entry points (Contractor, Client, Lobby Member).
 */

import { createNotification } from './index';

export type SignupNotificationType =
  | 'CONTRACTOR_STARTED'
  | 'CONTRACTOR_SUBMITTED'
  | 'CLIENT_CREATED'
  | 'LOBBY_MEMBER_JOINED';

export interface SignupNotificationPayload {
  type: SignupNotificationType;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  roleOrTrade?: string;
  details?: Record<string, string | number | boolean | undefined>;
  referenceId?: string;
  actionUrl: string;
}

const ADMIN_ALERT_EMAIL =
  process.env.ADMIN_ALERT_EMAIL ||
  process.env.LEAD_DELIVERY_EMAIL ||
  'enquiries@entirefm.com';

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || 'EntireFM Alerts <updates@entirefm.com>';

export function getAdminAlertEmailAddress(): string {
  return ADMIN_ALERT_EMAIL;
}

/**
 * Builds the subject line and header for the notification email.
 */
function getSubjectAndHeader(payload: SignupNotificationPayload): { subject: string; title: string; badge: string; badgeColor: string } {
  switch (payload.type) {
    case 'CONTRACTOR_STARTED':
      return {
        subject: `[CONTRACTOR SIGNUP STARTED] ${payload.name} (${payload.email})`,
        title: 'New Contractor Onboarding Started',
        badge: 'Contractor Registration',
        badgeColor: '#D97706',
      };
    case 'CONTRACTOR_SUBMITTED':
      return {
        subject: `[CONTRACTOR APPLICATION SUBMITTED] ${payload.company || payload.name} (${payload.name})`,
        title: 'Contractor Application Submitted for Review',
        badge: 'Ready for Review',
        badgeColor: '#EA580C',
      };
    case 'CLIENT_CREATED':
      return {
        subject: `[NEW CLIENT ACCOUNT CREATED] ${payload.company || payload.name} (${payload.referenceId || 'New Client'})`,
        title: 'Client Account Provisioned',
        badge: 'Client Account',
        badgeColor: '#2563EB',
      };
    case 'LOBBY_MEMBER_JOINED':
      return {
        subject: `[NEW LOBBY MEMBER] ${payload.name} — ${payload.company || 'Independent'}`,
        title: 'New Lobby Community Member Joined',
        badge: 'Lobby Member',
        badgeColor: '#7C3AED',
      };
  }
}

/**
 * Sends an email notification to EntireFM Admin via Resend.
 */
export async function sendAdminSignupAlert(payload: SignupNotificationPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { subject, title, badge, badgeColor } = getSubjectAndHeader(payload);
  const now = new Date().toUTCString();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.entirefm.com';
  const fullActionUrl = payload.actionUrl.startsWith('http') ? payload.actionUrl : `${baseUrl}${payload.actionUrl}`;

  // 1. Create In-App Notification Record for the Admin Top-Nav / Notification Center
  try {
    await createNotification({
      type: 'SYSTEM_ALERT',
      category: payload.type === 'LOBBY_MEMBER_JOINED' ? 'LEADS' : 'OPERATIONS',
      severity: payload.type === 'CONTRACTOR_SUBMITTED' ? 'CRITICAL' : 'ATTENTION',
      title: subject,
      message: `${payload.name} (${payload.email}) ${payload.company ? '— ' + payload.company : ''}`,
      entity_type: 'system',
      entity_id: payload.referenceId || payload.email,
      action_url: payload.actionUrl,
      metadata: {
        signupType: payload.type,
        email: payload.email,
        company: payload.company,
        name: payload.name,
        roleOrTrade: payload.roleOrTrade,
      },
    });
  } catch (err) {
    console.error('[ADMIN_ALERT: In-App Notification Error]', err);
  }

  // 2. Dispatch Email via Resend
  const resendApiKey = process.env.RESEND_API_KEY;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${subject}</title>
  <style>
    body { font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF9F7; color: #121826; margin: 0; padding: 32px 16px; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #E5E7EB; border-radius: 8px; padding: 32px; }
    .badge { display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 4px; color: #ffffff; background-color: ${badgeColor}; margin-bottom: 16px; }
    h1 { font-size: 20px; font-weight: 400; color: #0F172A; margin: 0 0 8px 0; }
    .subtitle { font-size: 13px; color: #64748B; margin-bottom: 24px; }
    .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .table td { padding: 10px 12px; font-size: 13.5px; border-bottom: 1px solid #F1F5F9; }
    .table td.label { width: 35%; color: #64748B; font-weight: 400; }
    .table td.value { color: #0F172A; font-weight: 400; }
    .btn-wrapper { margin: 28px 0 12px 0; }
    .btn { display: inline-block; background-color: #0F172A; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 12.5px; font-weight: 500; letter-spacing: 0.03em; }
    .footer { margin-top: 24px; font-size: 11.5px; color: #94A3B8; border-top: 1px solid #F1F5F9; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">${badge}</div>
    <h1>${title}</h1>
    <div class="subtitle">A new signup event was recorded on EntireFM at ${now}.</div>

    <table class="table">
      <tr>
        <td class="label">Name</td>
        <td class="value"><strong>${payload.name}</strong></td>
      </tr>
      <tr>
        <td class="label">Email</td>
        <td class="value"><a href="mailto:${payload.email}" style="color: #2563EB;">${payload.email}</a></td>
      </tr>
      ${payload.company ? `
      <tr>
        <td class="label">Company / Organisation</td>
        <td class="value">${payload.company}</td>
      </tr>
      ` : ''}
      ${payload.phone ? `
      <tr>
        <td class="label">Phone</td>
        <td class="value">${payload.phone}</td>
      </tr>
      ` : ''}
      ${payload.roleOrTrade ? `
      <tr>
        <td class="label">Role / Primary Trade</td>
        <td class="value">${payload.roleOrTrade}</td>
      </tr>
      ` : ''}
      ${payload.referenceId ? `
      <tr>
        <td class="label">Reference ID</td>
        <td class="value">${payload.referenceId}</td>
      </tr>
      ` : ''}
      ${payload.details ? Object.entries(payload.details).filter(([_, v]) => v !== undefined).map(([k, v]) => `
      <tr>
        <td class="label">${k}</td>
        <td class="value">${v}</td>
      </tr>
      `).join('') : ''}
    </table>

    <div class="btn-wrapper">
      <a href="${fullActionUrl}" class="btn">Open in Admin Control Desk →</a>
    </div>

    <div class="footer">
      <p>EntireFM Internal Automated Notification · Destination: ${ADMIN_ALERT_EMAIL}</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
${title.toUpperCase()}
========================================
Type: ${badge}
Name: ${payload.name}
Email: ${payload.email}
${payload.company ? `Company: ${payload.company}\n` : ''}${payload.phone ? `Phone: ${payload.phone}\n` : ''}${payload.roleOrTrade ? `Role/Trade: ${payload.roleOrTrade}\n` : ''}${payload.referenceId ? `Reference ID: ${payload.referenceId}\n` : ''}
Time: ${now}

Review in Admin:
${fullActionUrl}

--
EntireFM Internal Automated Notification · Destination: ${ADMIN_ALERT_EMAIL}
  `.trim();

  if (!resendApiKey) {
    console.info(`[ADMIN_ALERT_DEV] (Simulated Send to ${ADMIN_ALERT_EMAIL}):\nSubject: ${subject}\n${text}`);
    return { success: true, messageId: `sim_${Date.now()}` };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_ALERT_EMAIL],
        subject,
        html,
        text,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('[ADMIN_ALERT_ERROR: Resend API failed]', data);
      return { success: false, error: data.message || 'Resend delivery failed' };
    }

    return { success: true, messageId: data.id };
  } catch (err: any) {
    console.error('[ADMIN_ALERT_EXCEPTION]', err);
    return { success: false, error: err.message || 'Delivery exception' };
  }
}

export interface OperationalAlertPayload {
  title: string;
  category?: 'OPERATIONS' | 'COMPLIANCE' | 'SYSTEM' | 'FINANCE';
  severity?: 'INFO' | 'ATTENTION' | 'WARNING' | 'CRITICAL';
  workOrderNumber?: string;
  workOrderId?: string;
  reason: string;
  details?: Record<string, string | number | boolean | undefined>;
  actionUrl: string;
}

/**
 * Dispatches an immediate operational escalation alert to EntireFM operators via email and in-app notification.
 */
export async function sendAdminOperationalAlert(
  payload: OperationalAlertPayload
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // 1. Create In-App Notification Record
  try {
    await createNotification({
      type: 'SLA_RISK',
      category: payload.category || 'OPERATIONS',
      severity: payload.severity || 'CRITICAL',
      title: payload.title,
      message: payload.reason,
      entity_type: 'work_order',
      entity_id: payload.workOrderId || payload.workOrderNumber || 'system',
      action_url: payload.actionUrl,
      dedupe_key: `operational-alert:${payload.workOrderId || payload.title}:${payload.workOrderNumber || ''}`,
      metadata: {
        ...payload.details,
        workOrderNumber: payload.workOrderNumber,
      },
    });
  } catch (err) {
    console.error('[ADMIN_OPERATIONAL_ALERT: In-App Notification Error]', err);
  }

  // 2. Dispatch Email via Resend
  const resendApiKey = process.env.RESEND_API_KEY;
  const adminEmail = getAdminAlertEmailAddress();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.entirefm.com';
  const fullActionUrl = payload.actionUrl.startsWith('http') ? payload.actionUrl : `${baseUrl}${payload.actionUrl}`;

  const subject = `[ESCALATION] ${payload.title}`;
  const text = `
OPERATIONAL ESCALATION REQUIRED
========================================
Title: ${payload.title}
Reason: ${payload.reason}
${payload.workOrderNumber ? `Work Order: ${payload.workOrderNumber}\n` : ''}
Review in Admin:
${fullActionUrl}

--
EntireFM Operations Autopilot · Destination: ${adminEmail}
  `.trim();

  if (!resendApiKey) {
    console.info(`[ADMIN_ALERT_DEV] Simulated operational alert to ${adminEmail}: ${subject}`);
    return { success: true, messageId: `sim_${Date.now()}` };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [adminEmail],
        subject,
        text,
      }),
    });

    const data = await res.json();
    return { success: res.ok, messageId: data?.id };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}
