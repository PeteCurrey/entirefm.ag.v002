/**
 * ENTIREFM REGISTRATION SECURITY — LAYERED RISK SCORER
 * =====================================================
 * Pragmatic multi-signal scoring model to evaluate registration requests.
 *
 * Scoring model:
 *   0 - 29 : LOW RISK    -> Normal registration with standard email verification
 *  30 - 69 : MEDIUM RISK -> Flagged for admin review, pending verification
 *  70 - 100: HIGH RISK   -> Blocked / Rejected with generic response
 *
 * Signals evaluated:
 *  - Turnstile validation result
 *  - Honeypot trigger
 *  - Disposable / temporary email domain
 *  - Suspicious / automated User-Agent (curl, python, headless, script)
 *  - Form submission velocity (fill duration < 2.5 seconds)
 */

import { checkHoneypot } from './honeypot';
import { checkEmailDomain } from './disposable-email';
import type { TurnstileVerifyResult } from './turnstile';

export interface AssessRiskInput {
  email: string;
  turnstileResult: TurnstileVerifyResult;
  honeypotValue?: unknown;
  userAgent?: string;
  formElapsedSeconds?: number;
}

export interface RiskAssessment {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  flags: string[];
  shouldBlock: boolean;
  blockReason?: string;
}

const AUTOMATED_UA_PATTERNS = [
  /curl\//i,
  /python-requests/i,
  /aiohttp/i,
  /go-http-client/i,
  /node-fetch/i,
  /axios\//i,
  /postmanruntime/i,
  /headlesschrome/i,
  /phantomjs/i,
  /puppeteer/i,
  /playwright/i,
  /selenium/i,
  /bot\b/i,
  /spider\b/i,
  /crawler\b/i,
];

export function assessRegistrationRisk(input: AssessRiskInput): RiskAssessment {
  let score = 0;
  const flags: string[] = [];

  // 1. Turnstile Check (Hard requirement in production)
  if (input.turnstileResult.shouldBlock) {
    flags.push('TURNSTILE_FAILED');
    return {
      score: 100,
      level: 'HIGH',
      flags,
      shouldBlock: true,
      blockReason: 'Anti-bot challenge verification failed.',
    };
  }

  // 2. Honeypot Check
  const honeypot = checkHoneypot(input.honeypotValue);
  if (honeypot.triggered) {
    flags.push('HONEYPOT_TRIGGERED');
    return {
      score: 100,
      level: 'HIGH',
      flags,
      shouldBlock: true,
      blockReason: 'Bot behavior detected.',
    };
  }

  // 3. Email Domain Analysis
  const emailCheck = checkEmailDomain(input.email);
  if (emailCheck.isDisposable) {
    score += 90;
    flags.push('DISPOSABLE_EMAIL');
  } else if (emailCheck.riskLevel === 'medium') {
    score += 35;
    flags.push(...emailCheck.flags);
  }

  // 4. User-Agent Analysis
  const ua = input.userAgent || '';
  if (!ua || ua.length < 10) {
    score += 40;
    flags.push('EMPTY_OR_ANOMALOUS_USER_AGENT');
  } else {
    for (const pattern of AUTOMATED_UA_PATTERNS) {
      if (pattern.test(ua)) {
        score += 60;
        flags.push('AUTOMATED_USER_AGENT');
        break;
      }
    }
  }

  // 5. Form Fill Elapsed Time (if provided by client)
  if (typeof input.formElapsedSeconds === 'number' && input.formElapsedSeconds > 0) {
    if (input.formElapsedSeconds < 2.5) {
      // Humans take at least 3-5 seconds to fill 5 fields including password
      score += 40;
      flags.push('SUPERHUMAN_FILL_VELOCITY');
    }
  }

  // Normalize max score
  score = Math.min(score, 100);

  let level: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (score >= 70) {
    level = 'HIGH';
  } else if (score >= 30) {
    level = 'MEDIUM';
  }

  const shouldBlock = level === 'HIGH';

  return {
    score,
    level,
    flags,
    shouldBlock,
    blockReason: shouldBlock ? 'Registration blocked due to elevated risk.' : undefined,
  };
}
