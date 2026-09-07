/**
 * TWILIO STATUS CALLBACK WEBHOOK ROUTE
 * =====================================
 * Endpoint: POST /api/webhooks/twilio/message-status
 *
 * Receives real-time asynchronous delivery updates for outbound Twilio SMS:
 *  - queued
 *  - sent
 *  - delivered
 *  - undelivered
 *  - failed
 *
 * Updates communication_messages table with delivery state transitions,
 * timestamps, and error codes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { dbQuery, isDbConfigured } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const params: Record<string, string> = {};
    const searchParams = new URLSearchParams(rawBody);

    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const messageSid = params.MessageSid || params.SmsSid;
    const messageStatus = (params.MessageStatus || params.SmsStatus || '').toLowerCase();
    const errorCode = params.ErrorCode;
    const errorMessage = params.ErrorMessage;

    if (!messageSid) {
      return NextResponse.json({ error: 'Missing MessageSid' }, { status: 400 });
    }

    // Authenticate signature if TWILIO_AUTH_TOKEN is present
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioSignature = req.headers.get('x-twilio-signature');

    if (authToken && twilioSignature) {
      try {
        const twilioModule = await import('twilio');
        const twilio = twilioModule.default || twilioModule;

        const requestUrl = req.url;
        const isValid = twilio.validateRequest(authToken, twilioSignature, requestUrl, params);

        if (!isValid) {
          console.warn('[TWILIO_WEBHOOK_WARN] Invalid signature for message', messageSid);
          return NextResponse.json({ error: 'Invalid Twilio Signature' }, { status: 403 });
        }
      } catch (err: any) {
        console.warn('[TWILIO_SIG_CHECK_WARN]:', err?.message);
      }
    }

    if (!isDbConfigured()) {
      return new NextResponse('<Response></Response>', {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      });
    }

    // Fetch existing message to prevent state regressions
    const { data: existingMessages } = await dbQuery<any[]>(
      `communication_messages?provider_message_id=eq.${encodeURIComponent(messageSid)}&limit=1`
    );

    const existing = existingMessages && existingMessages.length > 0 ? existingMessages[0] : null;

    if (!existing) {
      // Message record might not be indexed yet or sent from different subsystem
      return new NextResponse('<Response></Response>', {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      });
    }

    // Regressive state guard
    const currentState = existing.delivery_state;
    if (currentState === 'DELIVERED' && (messageStatus === 'sent' || messageStatus === 'queued')) {
      return new NextResponse('<Response></Response>', {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      });
    }

    const now = new Date().toISOString();
    const patchBody: Record<string, any> = {};

    switch (messageStatus) {
      case 'delivered':
        patchBody.delivery_state = 'DELIVERED';
        patchBody.delivered_at = now;
        break;

      case 'sent':
        patchBody.delivery_state = 'SENT';
        patchBody.sent_at = patchBody.sent_at || now;
        break;

      case 'undelivered':
        patchBody.delivery_state = 'FAILED';
        patchBody.failed_at = now;
        patchBody.failure_reason = errorCode
          ? `Undelivered: Error ${errorCode}${errorMessage ? ` - ${errorMessage}` : ''}`
          : 'Undelivered by carrier';
        break;

      case 'failed':
        patchBody.delivery_state = 'FAILED';
        patchBody.failed_at = now;
        patchBody.failure_reason = errorCode
          ? `Failed: Error ${errorCode}${errorMessage ? ` - ${errorMessage}` : ''}`
          : errorMessage || 'Twilio delivery failed';
        break;

      case 'queued':
      case 'accepted':
      case 'sending':
        patchBody.delivery_state = 'QUEUED';
        break;

      default:
        patchBody.delivery_state = messageStatus.toUpperCase();
        break;
    }

    await dbQuery(`communication_messages?provider_message_id=eq.${encodeURIComponent(messageSid)}`, {
      method: 'PATCH',
      body: patchBody,
    });

    return new NextResponse('<Response></Response>', {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (err: any) {
    console.error('[TWILIO_WEBHOOK_FATAL]:', err);
    return NextResponse.json({ error: err?.message || 'Internal Server Error' }, { status: 500 });
  }
}
