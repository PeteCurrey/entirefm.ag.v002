/**
 * ENTIREFM REGISTRATION SECURITY — SECURITY EVENT LOGGER
 * =======================================================
 * Persists security events to public.registration_security_events.
 *
 * Privacy / GDPR Minimisation:
 * - Full email address is NEVER logged; only the domain component is recorded.
 * - Passwords, secret tokens, and raw Turnstile secrets are NEVER passed here.
 * - User-Agent string is hashed via SHA-256 to allow bot clustering without
 *   storing excessive device fingerprint telemetry.
 */

import crypto from 'crypto';
import { dbQuery, getDbConfig } from '../db/client';

export type SecurityEventType =
  | 'REGISTRATION_ATTEMPTED'
  | 'REGISTRATION_SUCCESSFUL'
  | 'REGISTRATION_BLOCKED'
  | 'TURNSTILE_FAILED'
  | 'HONEYPOT_TRIGGERED'
  | 'RATE_LIMITED'
  | 'DISPOSABLE_EMAIL_BLOCKED'
  | 'SUSPICIOUS_REGISTRATION'
  | 'SIGNIN_RATE_LIMITED'
  | 'PASSWORD_RESET_RATE_LIMITED'
  | 'VERIFICATION_RESEND_RATE_LIMITED'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT';

export interface LogSecurityEventInput {
  eventType: SecurityEventType;
  ipAddress?: string;
  userAgent?: string;
  email?: string;
  authUserId?: string;
  memberId?: string;
  riskScore?: number;
  details?: Record<string, any>;
}

export async function logSecurityEvent(input: LogSecurityEventInput): Promise<void> {
  const cfg = getDbConfig();

  // Extract domain only from email to preserve GDPR data minimisation
  let emailDomain: string | undefined = undefined;
  if (input.email && input.email.includes('@')) {
    emailDomain = input.email.split('@')[1]?.toLowerCase().trim();
  }

  // Hash user agent
  let userAgentHash: string | undefined = undefined;
  if (input.userAgent) {
    userAgentHash = crypto
      .createHash('sha256')
      .update(input.userAgent)
      .digest('hex');
  }

  // Clean details: ensure no password or secret fields sneak into details jsonb
  const sanitizedDetails = { ...(input.details || {}) };
  delete sanitizedDetails.password;
  delete sanitizedDetails.token;
  delete sanitizedDetails.turnstileToken;
  delete sanitizedDetails.secret;

  if (!cfg) {
    // In test environment or unconfigured DB, log to console
    console.info('[SECURITY_EVENT]', {
      eventType: input.eventType,
      emailDomain,
      riskScore: input.riskScore,
      ipAddress: input.ipAddress,
      details: sanitizedDetails,
    });
    return;
  }

  try {
    await dbQuery('registration_security_events', {
      method: 'POST',
      body: {
        event_type: input.eventType,
        ip_address: input.ipAddress || null,
        user_agent_hash: userAgentHash || null,
        email_domain: emailDomain || null,
        auth_user_id: input.authUserId || null,
        member_id: input.memberId || null,
        risk_score: typeof input.riskScore === 'number' ? input.riskScore : null,
        details: sanitizedDetails,
      },
    });
  } catch (err) {
    // Never allow failure of security event logging to crash core user flows
    console.error('[SECURITY_LOGGER_ERROR] Failed to persist security event:', err);
  }
}
