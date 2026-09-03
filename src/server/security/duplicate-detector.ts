/**
 * ENTIREFM COMMERCIAL & LEAD SECURITY — DUPLICATE SUBMISSION DETECTOR
 * ===================================================================
 * In-memory sliding-window fingerprint store to detect and mitigate rapid
 * automated duplicate enquiry flooding.
 *
 * Requirements:
 * - Generates content fingerprint based on normalized email, phone, and message body.
 * - Detects rapid bursts (< 3 minutes) with identical content from the same or different IPs.
 * - Allows genuine follow-ups after cooldown.
 * - Returns whether submission is a duplicate and the prior reference ID.
 */

import crypto from 'crypto';

interface DuplicateEntry {
  enquiryId: string;
  fingerprint: string;
  timestamp: number;
}

// In-memory window store (keys: fingerprint -> entry)
const fingerprintCache = new Map<string, DuplicateEntry>();

// Cooldown window: 3 minutes for identical content
const DUPLICATE_WINDOW_MS = 3 * 60 * 1000;

function cleanupStaleEntries(): void {
  const now = Date.now();
  for (const [key, entry] of fingerprintCache.entries()) {
    if (now - entry.timestamp > DUPLICATE_WINDOW_MS) {
      fingerprintCache.delete(key);
    }
  }
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  priorEnquiryId?: string;
}

/**
 * Checks whether an incoming enquiry is an identical duplicate within the recent time window.
 */
export function checkDuplicateEnquiry(options: {
  email: string;
  message: string;
  phone?: string;
  enquiryId: string;
}): DuplicateCheckResult {
  cleanupStaleEntries();

  const { email, message, phone = '', enquiryId } = options;

  // Normalize inputs to generate deterministic hash
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone.replace(/[^0-9+]/g, '');
  const normalizedMessage = message.trim().toLowerCase().replace(/\s+/g, ' ');

  const hash = crypto
    .createHash('sha256')
    .update(`${normalizedEmail}|${normalizedPhone}|${normalizedMessage}`)
    .digest('hex');

  const existing = fingerprintCache.get(hash);
  const now = Date.now();

  if (existing && now - existing.timestamp < DUPLICATE_WINDOW_MS) {
    return {
      isDuplicate: true,
      priorEnquiryId: existing.enquiryId,
    };
  }

  // Record this submission
  fingerprintCache.set(hash, {
    enquiryId,
    fingerprint: hash,
    timestamp: now,
  });

  return { isDuplicate: false };
}
