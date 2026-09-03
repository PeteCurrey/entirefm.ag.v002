/**
 * ENTIREFM REGISTRATION SECURITY — CLOUDFLARE TURNSTILE SERVER VALIDATOR
 * ========================================================================
 * Validates Turnstile tokens server-side using the Cloudflare siteverify API.
 *
 * NEVER call this from client-side code.
 * The TURNSTILE_SECRET_KEY must NEVER be exposed to the browser.
 *
 * Required environment variables (server-side only):
 *   TURNSTILE_SECRET_KEY — from Cloudflare Dashboard → Turnstile → your site
 *
 * Public environment variable (safe for browser):
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY — widget site key
 */

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface TurnstileVerifyResult {
  success: boolean;
  errorCodes: string[];
  /** Whether to reveal the failure to the client (always use generic message) */
  shouldBlock: boolean;
}

/**
 * Verifies a Cloudflare Turnstile challenge response token server-side.
 *
 * @param token   - The cf-turnstile-response value submitted by the client form
 * @param remoteIp - Optional: the client IP address for additional signal
 */
export async function verifyTurnstileToken(
  token: string | undefined | null,
  remoteIp?: string
): Promise<TurnstileVerifyResult> {
  // No token provided at all - must always block
  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    return { success: false, errorCodes: ['missing-input-response'], shouldBlock: true };
  }

  // Local development mock token support
  if (process.env.NODE_ENV !== 'production' && token === 'dev-bypass-token') {
    return { success: true, errorCodes: [], shouldBlock: false };
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;

  // If not configured in production, block; in local dev, warn and allow non-empty tokens
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error(
        '[TURNSTILE] TURNSTILE_SECRET_KEY is not configured. ' +
          'All registrations will be BLOCKED in production without it.'
      );
      return { success: false, errorCodes: ['secret-not-configured'], shouldBlock: true };
    }
    // Development: allow non-empty token
    return { success: true, errorCodes: [], shouldBlock: false };
  }

  try {
    const body = new URLSearchParams({
      secret,
      response: token.trim(),
    });
    if (remoteIp) {
      body.append('remoteip', remoteIp);
    }

    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (!res.ok) {
      console.error('[TURNSTILE] Siteverify API returned non-200:', res.status);
      // Fail open on Cloudflare API errors to avoid blocking legitimate users
      // if Cloudflare itself has an outage. Log and allow.
      return { success: true, errorCodes: ['api-error-fail-open'], shouldBlock: false };
    }

    const json = (await res.json()) as {
      success: boolean;
      'error-codes'?: string[];
      challenge_ts?: string;
      hostname?: string;
    };

    const errorCodes = json['error-codes'] ?? [];

    if (!json.success) {
      return { success: false, errorCodes, shouldBlock: true };
    }

    return { success: true, errorCodes: [], shouldBlock: false };
  } catch (err: any) {
    console.error('[TURNSTILE] Verification exception:', err?.message);
    // Fail open on network errors — Cloudflare unreachable
    return { success: true, errorCodes: ['network-error-fail-open'], shouldBlock: false };
  }
}
