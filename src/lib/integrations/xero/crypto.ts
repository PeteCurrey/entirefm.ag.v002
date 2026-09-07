/**
 * ENTIREFM XERO CRYPTO UTILITIES
 * ===============================
 * Production-grade cryptographic operations:
 * 1. AES-256-GCM encryption & decryption for OAuth access/refresh tokens at rest.
 * 2. HMAC-SHA256 signature verification for Xero Webhooks (constant-time).
 * 3. Secure OAuth CSRF state generation.
 */

import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
  timingSafeEqual,
  createHash,
} from 'node:crypto';
import { XeroAuthError, XeroWebhookError } from './errors';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96-bit IV recommended for GCM

/**
 * Derives a deterministic 32-byte (256-bit) encryption key from environment secrets.
 */
function getEncryptionKey(): Buffer {
  const customKey = process.env.XERO_ENCRYPTION_KEY;
  if (customKey && customKey.length >= 32) {
    return createHash('sha256').update(customKey).digest();
  }

  const fallback = process.env.AUTH_HMAC_SECRET || process.env.MEMBER_AUTH_SECRET || process.env.CRON_SECRET;
  if (fallback && fallback.length >= 16) {
    return createHash('sha256').update(`efm-xero-token-encryption:${fallback}`).digest();
  }

  // If no environment secret is set in local/test, generate deterministic warning fallback
  console.warn('[XERO_CRYPTO] WARNING: Neither XERO_ENCRYPTION_KEY nor AUTH_HMAC_SECRET is set. Using system salt.');
  return createHash('sha256').update('entirefm-default-xero-salt-key-must-override-in-prod').digest();
}

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  tag: string;
}

/**
 * Encrypts a plaintext string (e.g. OAuth token) using AES-256-GCM with authentication tag.
 */
export function encryptToken(plaintext: string): EncryptedPayload {
  if (!plaintext) {
    return { ciphertext: '', iv: '', tag: '' };
  }

  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const tag = cipher.getAuthTag();

  return {
    ciphertext: encrypted,
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
  };
}

/**
 * Decrypts an AES-256-GCM encrypted payload back to plaintext.
 * Throws XeroAuthError if tampered or key mismatch occurs.
 */
export function decryptToken(ciphertext: string, ivBase64: string, tagBase64: string): string {
  if (!ciphertext) return '';

  try {
    const key = getEncryptionKey();
    const iv = Buffer.from(ivBase64, 'base64');
    const tag = Buffer.from(tagBase64, 'base64');

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err: any) {
    throw new XeroAuthError('Failed to decrypt OAuth credentials. Encryption key or auth tag mismatch.');
  }
}

/**
 * Generates an unguessable cryptographically secure OAuth 2.0 state string (32 bytes = 64 hex chars).
 */
export function generateOAuthState(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Verifies the Xero webhook signature using HMAC-SHA256 and constant-time comparison.
 * Xero signs the raw body using the Webhook Key from Developer Portal and puts Base64 in x-xero-signature header.
 */
export function verifyXeroWebhookSignature(
  rawBody: string | Buffer,
  signatureHeader: string | null,
  webhookKey?: string
): boolean {
  const key = webhookKey || process.env.XERO_WEBHOOK_KEY;
  if (!key) {
    throw new XeroWebhookError('XERO_WEBHOOK_KEY is not configured in server environment.');
  }
  if (!signatureHeader) {
    return false;
  }

  const expectedHmac = createHmac('sha256', key)
    .update(rawBody)
    .digest('base64');

  const signatureBuf = Buffer.from(signatureHeader.trim());
  const expectedBuf = Buffer.from(expectedHmac);

  if (signatureBuf.length !== expectedBuf.length) {
    return false;
  }

  return timingSafeEqual(signatureBuf, expectedBuf);
}
