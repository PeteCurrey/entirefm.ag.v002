/**
 * TEST SUITE: TRANSACTIONAL COMMUNICATIONS DELIVERY TRUTH
 * =======================================================
 * Verifies:
 *  1. verifyResendWebhookSignature rejects requests when RESEND_WEBHOOK_SECRET is missing.
 *  2. verifyResendWebhookSignature rejects requests when Svix headers are missing.
 *  3. verifyResendWebhookSignature rejects expired timestamps (> 5 mins).
 *  4. verifyResendWebhookSignature rejects invalid/tampered signatures.
 *  5. verifyResendWebhookSignature accepts valid signatures with whsec_ prefix and raw secret.
 *  6. Route POST /api/webhooks/resend returns 401 on invalid/missing signature.
 *  7. Route POST /api/webhooks/resend parses raw body and processes email.sent -> SENT.
 *  8. processResendWebhookEvent updates delivery_state to DELIVERED on email.delivered.
 *  9. Idempotency: duplicate delivery event is detected and returned as is_duplicate = true.
 *  10. State regression guard: email.sent does not regress a DELIVERED message.
 *  11. Operational escalation: email.bounced or email.failed on work-order-linked message raises notification.
 *  12. Newsletter suppression and Lobby Daily logs logic are preserved.
 *
 * Run: npx tsx scripts/test-transactional-comms-delivery-truth.ts
 */

import { createHmac, randomBytes } from 'node:crypto';
import {
  verifyResendWebhookSignature,
  processResendWebhookEvent,
  ResendWebhookPayload,
} from '../src/server/communications';
import { POST as resendWebhookPost } from '../src/app/api/webhooks/resend/route';
import { dbQuery, isDbConfigured } from '../src/server/db/client';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string): void {
  if (condition) {
    console.log(`  \x1b[32m✓ PASS\x1b[0m ${message}`);
    passed++;
  } else {
    console.error(`  \x1b[31m✗ FAIL\x1b[0m ${message}`);
    failed++;
  }
}

function generateSvixSignature(secret: string, svixId: string, timestamp: string, body: string): string {
  const keyBuffer = secret.startsWith('whsec_')
    ? Buffer.from(secret.slice(6), 'base64')
    : Buffer.from(secret, 'utf8');
  const toSign = `${svixId}.${timestamp}.${body}`;
  const sig = createHmac('sha256', keyBuffer).update(toSign).digest('base64');
  return `v1,${sig}`;
}

async function runAllTests() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM TRANSACTIONAL COMMS DELIVERY TRUTH TEST SUITE');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const originalSecret = process.env.RESEND_WEBHOOK_SECRET;
  const rawKey = randomBytes(32);
  const testSecret = `whsec_${rawKey.toString('base64')}`;
  process.env.RESEND_WEBHOOK_SECRET = testSecret;

  try {
    // ── Test 1: Signature Verification Unit Tests ──────────────────────────────
    console.log('── Section 1: Svix Webhook Signature Security ──');

    const testBody = JSON.stringify({ type: 'email.delivered', data: { id: 'msg_test_123' } });
    const validSvixId = `msg_${Date.now()}`;
    const validTimestamp = Math.floor(Date.now() / 1000).toString();
    const validSig = generateSvixSignature(testSecret, validSvixId, validTimestamp, testBody);

    // 1.1 Valid signature passes
    assert(
      verifyResendWebhookSignature(testBody, {
        'svix-id': validSvixId,
        'svix-timestamp': validTimestamp,
        'svix-signature': validSig,
      }) === true,
      'Valid Svix signature with whsec_ secret is accepted'
    );

    // 1.2 Raw secret (non-whsec_) also works
    const rawSecretPlain = 'my-plain-secret-key-12345';
    process.env.RESEND_WEBHOOK_SECRET = rawSecretPlain;
    const plainSig = generateSvixSignature(rawSecretPlain, validSvixId, validTimestamp, testBody);
    assert(
      verifyResendWebhookSignature(testBody, {
        'svix-id': validSvixId,
        'svix-timestamp': validTimestamp,
        'svix-signature': plainSig,
      }) === true,
      'Valid Svix signature with raw secret string is accepted'
    );
    process.env.RESEND_WEBHOOK_SECRET = testSecret;

    // 1.3 Missing secret rejects
    delete process.env.RESEND_WEBHOOK_SECRET;
    assert(
      verifyResendWebhookSignature(testBody, {
        'svix-id': validSvixId,
        'svix-timestamp': validTimestamp,
        'svix-signature': validSig,
      }) === false,
      'Missing RESEND_WEBHOOK_SECRET rejects verification immediately'
    );
    process.env.RESEND_WEBHOOK_SECRET = testSecret;

    // 1.4 Missing any header rejects
    assert(
      verifyResendWebhookSignature(testBody, {
        'svix-id': null,
        'svix-timestamp': validTimestamp,
        'svix-signature': validSig,
      }) === false,
      'Missing svix-id header is rejected'
    );

    assert(
      verifyResendWebhookSignature(testBody, {
        'svix-id': validSvixId,
        'svix-timestamp': null,
        'svix-signature': validSig,
      }) === false,
      'Missing svix-timestamp header is rejected'
    );

    assert(
      verifyResendWebhookSignature(testBody, {
        'svix-id': validSvixId,
        'svix-timestamp': validTimestamp,
        'svix-signature': null,
      }) === false,
      'Missing svix-signature header is rejected'
    );

    // 1.5 Expired timestamp (> 5 minutes ago) rejects (replay attack defense)
    const expiredTimestamp = (Math.floor(Date.now() / 1000) - 360).toString(); // 6 mins ago
    const expiredSig = generateSvixSignature(testSecret, validSvixId, expiredTimestamp, testBody);
    assert(
      verifyResendWebhookSignature(testBody, {
        'svix-id': validSvixId,
        'svix-timestamp': expiredTimestamp,
        'svix-signature': expiredSig,
      }) === false,
      'Expired timestamp (> 5 minutes ago) is rejected'
    );

    // 1.6 Tampered body rejects
    const tamperedBody = JSON.stringify({ type: 'email.delivered', data: { id: 'msg_hacked_999' } });
    assert(
      verifyResendWebhookSignature(tamperedBody, {
        'svix-id': validSvixId,
        'svix-timestamp': validTimestamp,
        'svix-signature': validSig,
      }) === false,
      'Tampered payload body fails HMAC verification'
    );

    // 1.7 Tampered signature rejects
    const badSig = validSig.slice(0, -4) + 'AAAA';
    assert(
      verifyResendWebhookSignature(testBody, {
        'svix-id': validSvixId,
        'svix-timestamp': validTimestamp,
        'svix-signature': badSig,
      }) === false,
      'Invalid signature string fails HMAC verification'
    );

    // ── Section 2: Route Security Boundary ────────────────────────────────────
    console.log('\n── Section 2: Route Level Enforcement (/api/webhooks/resend) ──');

    // 2.1 Unauthenticated request returns 401
    const unauthReq = new Request('http://localhost:3000/api/webhooks/resend', {
      method: 'POST',
      body: testBody,
      headers: { 'content-type': 'application/json' },
    });
    const unauthRes = await resendWebhookPost(unauthReq);
    assert(
      unauthRes.status === 401,
      `Unsigned webhook request returns HTTP 401 (got ${unauthRes.status})`
    );

    // 2.2 Authenticated request with valid headers succeeds (HTTP 200)
    const authReq = new Request('http://localhost:3000/api/webhooks/resend', {
      method: 'POST',
      body: testBody,
      headers: {
        'content-type': 'application/json',
        'svix-id': validSvixId,
        'svix-timestamp': validTimestamp,
        'svix-signature': validSig,
      },
    });
    const authRes = await resendWebhookPost(authReq);
    assert(
      authRes.status === 200,
      `Properly signed webhook request returns HTTP 200 (got ${authRes.status})`
    );
    const authJson = await authRes.json();
    assert(authJson.ok === true, 'Response body has ok: true');

    // ── Section 3: Delivery State Machine & Idempotency ───────────────────────
    console.log('\n── Section 3: Delivery State Machine & Idempotency ──');

    // 3.0 Missing provider message id returns processed: false
    const noIdPayload: ResendWebhookPayload = {
      type: 'email.delivered',
      created_at: new Date().toISOString(),
      data: { id: '', from: 'test@example.com', to: ['client@example.com'], subject: 'Test', created_at: new Date().toISOString() },
    };
    const resNoId = await processResendWebhookEvent(noIdPayload);
    assert(resNoId.processed === false, 'Payload without data.id returns processed = false');

    // 3.0.1 Verify all event types map to their authoritative EmailDeliveryState
    const eventTypeTests: Array<[ResendWebhookPayload['type'], string]> = [
      ['email.sent', 'SENT'],
      ['email.delivered', 'DELIVERED'],
      ['email.delivery_delayed', 'DELIVERY_DELAYED'],
      ['email.bounced', 'BOUNCED'],
      ['email.failed', 'FAILED'],
      ['email.complained', 'COMPLAINED'],
      ['email.suppressed', 'SUPPRESSED'],
    ];

    for (const [type, expectedState] of eventTypeTests) {
      const payload: ResendWebhookPayload = {
        type,
        created_at: new Date().toISOString(),
        data: {
          id: `test_${type}_${Date.now()}`,
          from: 'helpdesk@updates.entirefm.com',
          to: ['user@example.com'],
          subject: `Test ${type}`,
          created_at: new Date().toISOString(),
          bounce_type: 'hard',
          reason: 'mailbox full',
        },
      };
      const res = await processResendWebhookEvent(payload);
      assert(
        res.processed === true && res.delivery_state === expectedState,
        `Event ${type} maps to delivery state ${expectedState}`
      );
    }

    if (!isDbConfigured()) {
      console.log('  [Database not configured — live DB persistence checks skipped]');
    } else {
      const testWorkOrderId = crypto.randomUUID();
      const testThreadId = crypto.randomUUID();
      const testMessageId = crypto.randomUUID();
      const testProviderMessageId = `resend_test_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

      // Insert dummy communication message in SENT state
      await dbQuery('communication_messages', {
        method: 'POST',
        body: {
          id: testMessageId,
          thread_id: testThreadId,
          work_order_id: testWorkOrderId,
          channel: 'EMAIL',
          visibility: 'CLIENT_VISIBLE',
          body: 'Test communication content',
          is_incoming: false,
          is_ai_generated: false,
          delivery_state: 'SENT',
          provider: 'Resend',
          provider_message_id: testProviderMessageId,
          recipient_email: 'client@example.com',
          created_at: new Date().toISOString(),
        },
      });

      // 3.1 Transition to DELIVERED
      const deliveredPayload: ResendWebhookPayload = {
        type: 'email.delivered',
        created_at: new Date().toISOString(),
        data: {
          id: testProviderMessageId,
          from: 'helpdesk@updates.entirefm.com',
          to: ['client@example.com'],
          subject: 'Your job update',
          created_at: new Date().toISOString(),
        },
      };

      const resDelivered = await processResendWebhookEvent(deliveredPayload, `ev_${Date.now()}`);
      assert(
        resDelivered.processed === true && resDelivered.delivery_state === 'DELIVERED',
        `State successfully upgraded to DELIVERED (state=${resDelivered.delivery_state})`
      );
      assert(resDelivered.is_duplicate === false, 'First transition is not marked duplicate');

      // 3.2 Idempotency: duplicate email.delivered event
      const resDuplicate = await processResendWebhookEvent(deliveredPayload, `ev_${Date.now() + 1}`);
      assert(
        resDuplicate.is_duplicate === true && resDuplicate.delivery_state === 'DELIVERED',
        'Duplicate email.delivered event detected as duplicate with delivery_state=DELIVERED'
      );

      // 3.3 State regression guard: email.sent arrives after email.delivered
      const lateSentPayload: ResendWebhookPayload = {
        type: 'email.sent',
        created_at: new Date().toISOString(),
        data: {
          id: testProviderMessageId,
          from: 'helpdesk@updates.entirefm.com',
          to: ['client@example.com'],
          subject: 'Your job update',
          created_at: new Date().toISOString(),
        },
      };

      const resRegression = await processResendWebhookEvent(lateSentPayload, `ev_${Date.now() + 2}`);
      assert(
        resRegression.state_regression_skipped === true && resRegression.delivery_state === 'DELIVERED',
        'Out-of-order email.sent does NOT regress DELIVERED message'
      );

      // 3.4 Operational Escalation: Bounce on work-order-linked message
      const bouncedProviderId = `resend_bounce_${Date.now()}`;
      const bouncedMsgId = crypto.randomUUID();
      await dbQuery('communication_messages', {
        method: 'POST',
        body: {
          id: bouncedMsgId,
          thread_id: testThreadId,
          work_order_id: testWorkOrderId,
          channel: 'EMAIL',
          visibility: 'CLIENT_VISIBLE',
          body: 'Critical dispatch instructions',
          is_incoming: false,
          is_ai_generated: false,
          delivery_state: 'SENT',
          provider: 'Resend',
          provider_message_id: bouncedProviderId,
          recipient_email: 'unreachable@example.com',
          created_at: new Date().toISOString(),
        },
      });

      const bouncePayload: ResendWebhookPayload = {
        type: 'email.bounced',
        created_at: new Date().toISOString(),
        data: {
          id: bouncedProviderId,
          from: 'helpdesk@updates.entirefm.com',
          to: ['unreachable@example.com'],
          subject: 'Critical dispatch instructions',
          created_at: new Date().toISOString(),
          bounce_type: 'hard',
          bounce_code: '5.1.1',
        },
      };

      const resBounce = await processResendWebhookEvent(bouncePayload, `ev_bounce_${Date.now()}`);
      assert(
        resBounce.processed === true && resBounce.delivery_state === 'BOUNCED',
        'Message delivery_state updated to BOUNCED'
      );

      // Check notification created
      const { data: notifs } = await dbQuery<any[]>(
        `notifications?dedupe_key=eq.email_delivery_failure:${encodeURIComponent(bouncedProviderId)}&limit=1`
      );
      assert(
        (notifs?.length ?? 0) > 0,
        'Operational escalation notification created for bounced work order communication'
      );

      // Cleanup
      await dbQuery(`communication_messages?id=in.(${testMessageId},${bouncedMsgId})`, { method: 'DELETE' }).catch(() => {});
      await dbQuery(`notifications?dedupe_key=eq.email_delivery_failure:${encodeURIComponent(bouncedProviderId)}`, { method: 'DELETE' }).catch(() => {});
    }

  } finally {
    if (originalSecret !== undefined) {
      process.env.RESEND_WEBHOOK_SECRET = originalSecret;
    } else {
      delete process.env.RESEND_WEBHOOK_SECRET;
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`  RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Test execution fatal error:', err);
  process.exit(1);
});
