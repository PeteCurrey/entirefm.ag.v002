/**
 * ENTIREFM COMMERCIAL & LEAD SECURITY — UNIFIED ENQUIRY GUARD
 * ===========================================================
 * Single authoritative anti-abuse orchestrator for public enquiries,
 * lead generation forms, quote requests, and partner/job applications.
 *
 * Functions:
 * 1. IP Rate Limiting (Sliding Window)
 * 2. Cloudflare Turnstile Server Verification
 * 3. Invisible Honeypot Field Verification
 * 4. Disposable Email Domain Analysis
 * 5. Spam Content Analysis & Script Sanitization
 * 6. Rapid Duplicate Submission Detection & Suppression
 * 7. Intelligent Routing:
 *    - CLEAN           -> Store + Email Staff + Alert
 *    - NEEDS_REVIEW    -> Store (status: NEEDS_REVIEW) + Suppress Immediate Email
 *    - SPAM_SUSPECTED  -> Store (status: SPAM_SUSPECTED) + Suppress All Alerts
 *    - HARD_BOT_BLOCK  -> Return 400 immediately (Turnstile failed / Honeypot)
 */

import { checkRateLimit, getClientIp, RATE_LIMITS, RateLimitConfig } from './rate-limiter';
import { verifyTurnstileToken, TurnstileVerifyResult } from './turnstile';
import { checkHoneypot, HONEYPOT_FIELD_NAME } from './honeypot';
import { checkEmailDomain } from './disposable-email';
import { analyzeEnquirySpam, sanitizeText, SpamAnalysisResult } from './spam-detector';
import { checkDuplicateEnquiry, DuplicateCheckResult } from './duplicate-detector';
import { logSecurityEvent } from './security-logger';

export interface GuardEnquiryInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  turnstileToken?: string;
  honeypotValue?: unknown;
  fillDurationMs?: number;
  rateLimitConfig?: RateLimitConfig;
  enquiryId: string;
  request: Request;
}

export interface GuardEnquiryResult {
  allowed: boolean;
  blockStatusCode?: number;
  blockReason?: string;
  clientErrorMessage?: string;
  riskScore: number;
  spamStatus: 'CLEAN' | 'NEEDS_REVIEW' | 'SPAM_SUSPECTED';
  spamFlags: string[];
  sanitizedMessage: string;
  sanitizedName: string;
  sanitizedCompany: string;
  turnstileVerified: boolean;
  isDuplicate: boolean;
  duplicateOf?: string;
  dispatchNotification: boolean; // false when quarantined or duplicate
  clientIp: string;
}

export async function guardEnquirySubmission(input: GuardEnquiryInput): Promise<GuardEnquiryResult> {
  const { request, enquiryId } = input;
  const clientIp = getClientIp(request);
  const userAgent = request.headers.get('user-agent') || undefined;

  // 1. IP-Based Sliding Window Rate Limiting
  const rateConfig = input.rateLimitConfig || RATE_LIMITS.ENQUIRY;
  const rateCheck = checkRateLimit(`enquiry:${clientIp}`, rateConfig);

  if (!rateCheck.allowed) {
    await logSecurityEvent({
      eventType: 'RATE_LIMITED',
      ipAddress: clientIp,
      userAgent,
      email: input.email,
      details: {
        endpoint: 'enquiry_submission',
        retryAfterSeconds: rateCheck.retryAfterSeconds,
      },
    });

    return {
      allowed: false,
      blockStatusCode: 429,
      blockReason: 'Rate limit exceeded for IP address.',
      clientErrorMessage: 'Too many requests from your connection. Please wait before submitting another enquiry.',
      riskScore: 100,
      spamStatus: 'SPAM_SUSPECTED',
      spamFlags: ['IP_RATE_LIMITED'],
      sanitizedMessage: sanitizeText(input.message),
      sanitizedName: sanitizeText(input.name),
      sanitizedCompany: sanitizeText(input.company || ''),
      turnstileVerified: false,
      isDuplicate: false,
      dispatchNotification: false,
      clientIp,
    };
  }

  // 2. Invisible Honeypot Validation
  const honeypot = checkHoneypot(input.honeypotValue);
  if (honeypot.triggered) {
    await logSecurityEvent({
      eventType: 'HONEYPOT_TRIGGERED',
      ipAddress: clientIp,
      userAgent,
      email: input.email,
      riskScore: 100,
      details: { field: HONEYPOT_FIELD_NAME },
    });

    return {
      allowed: false,
      blockStatusCode: 400,
      blockReason: 'Honeypot field populated by bot.',
      clientErrorMessage: 'Enquiry submission failed verification. Please try again.',
      riskScore: 100,
      spamStatus: 'SPAM_SUSPECTED',
      spamFlags: ['HONEYPOT_TRIGGERED'],
      sanitizedMessage: sanitizeText(input.message),
      sanitizedName: sanitizeText(input.name),
      sanitizedCompany: sanitizeText(input.company || ''),
      turnstileVerified: false,
      isDuplicate: false,
      dispatchNotification: false,
      clientIp,
    };
  }

  // 3. Cloudflare Turnstile Server-Side Token Validation
  const turnstile = await verifyTurnstileToken(input.turnstileToken, clientIp);
  if (turnstile.shouldBlock) {
    await logSecurityEvent({
      eventType: 'TURNSTILE_FAILED',
      ipAddress: clientIp,
      userAgent,
      email: input.email,
      riskScore: 100,
      details: { errorCodes: turnstile.errorCodes },
    });

    return {
      allowed: false,
      blockStatusCode: 400,
      blockReason: 'Turnstile anti-bot challenge validation failed.',
      clientErrorMessage: 'Anti-bot verification was not completed. Please refresh and submit again.',
      riskScore: 100,
      spamStatus: 'SPAM_SUSPECTED',
      spamFlags: ['TURNSTILE_FAILED'],
      sanitizedMessage: sanitizeText(input.message),
      sanitizedName: sanitizeText(input.name),
      sanitizedCompany: sanitizeText(input.company || ''),
      turnstileVerified: false,
      isDuplicate: false,
      dispatchNotification: false,
      clientIp,
    };
  }

  // 4. Content Spam Analysis & Sanitization
  const spamAnalysis = analyzeEnquirySpam({
    name: input.name,
    email: input.email,
    message: input.message,
    company: input.company,
  });

  let compositeScore = spamAnalysis.score;
  const flags = [...spamAnalysis.flags];

  // 5. Disposable Email Domain Check
  const emailCheck = checkEmailDomain(input.email);
  if (emailCheck.isDisposable) {
    compositeScore += 50;
    flags.push('DISPOSABLE_EMAIL');
  }

  // 6. Superhuman Form Fill Velocity (< 2.5 seconds)
  if (typeof input.fillDurationMs === 'number' && input.fillDurationMs > 0 && input.fillDurationMs < 2500) {
    compositeScore += 35;
    flags.push('SUPERHUMAN_FILL_VELOCITY');
  }

  compositeScore = Math.min(100, compositeScore);

  // 7. Duplicate Submission Check
  const duplicateCheck = checkDuplicateEnquiry({
    email: input.email,
    message: input.message,
    phone: input.phone,
    enquiryId,
  });

  if (duplicateCheck.isDuplicate) {
    compositeScore += 30;
    flags.push(`DUPLICATE_OF_${duplicateCheck.priorEnquiryId}`);
  }

  // Determine Final Quarantine / Action Status
  let spamStatus: 'CLEAN' | 'NEEDS_REVIEW' | 'SPAM_SUSPECTED' = 'CLEAN';
  if (compositeScore >= 65) {
    spamStatus = 'SPAM_SUSPECTED';
  } else if (compositeScore >= 30) {
    spamStatus = 'NEEDS_REVIEW';
  }

  // Determine whether to dispatch immediate notifications (email & in-app alerts)
  // Quarantined spam or duplicates MUST NOT flood staff inboxes
  const dispatchNotification = spamStatus === 'CLEAN' && !duplicateCheck.isDuplicate;

  return {
    allowed: true,
    riskScore: compositeScore,
    spamStatus,
    spamFlags: flags,
    sanitizedMessage: spamAnalysis.sanitizedMessage,
    sanitizedName: sanitizeText(input.name),
    sanitizedCompany: sanitizeText(input.company || ''),
    turnstileVerified: turnstile.success,
    isDuplicate: duplicateCheck.isDuplicate,
    duplicateOf: duplicateCheck.priorEnquiryId,
    dispatchNotification,
    clientIp,
  };
}
