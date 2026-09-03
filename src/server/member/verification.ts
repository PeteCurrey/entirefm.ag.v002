/**
 * ENTIREFM LOBBY MEMBER EMAIL VERIFICATION SERVICE
 * =================================================
 * Secure token generation, verification, rate limiting, and branded email delivery.
 */

import crypto from 'crypto';

const VERIFICATION_SECRET =
  process.env.MEMBER_AUTH_SECRET ||
  process.env.SESSION_SECRET ||
  'entirefm-member-email-verification-secret-2026-v1';

// Server-side in-memory rate limiting: identifier -> timestamp (ms)
const RATE_LIMITS: Map<string, number> = new Map();
const COOLDOWN_MS = 60 * 1000; // 60 seconds

export interface VerificationTokenPayload {
  memberId: string;
  email: string;
  expiresAt: number;
}

/**
 * Creates a signed, tamper-proof email verification token (valid for 24h).
 */
export function createMemberVerificationToken(memberId: string, email: string): string {
  const payload: VerificationTokenPayload = {
    memberId,
    email: email.trim().toLowerCase(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', VERIFICATION_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  return `${payloadBase64}.${signature}`;
}

/**
 * Verifies an HMAC-signed email verification token.
 * Returns payload if valid and unexpired; null otherwise.
 */
export function verifyMemberVerificationToken(token: string | undefined | null): VerificationTokenPayload | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadBase64, providedSignature] = parts;

  const expectedSignature = crypto
    .createHmac('sha256', VERIFICATION_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  const sigA = Buffer.from(providedSignature);
  const sigB = Buffer.from(expectedSignature);

  if (sigA.length !== sigB.length || !crypto.timingSafeEqual(sigA, sigB)) {
    return null;
  }

  try {
    const jsonStr = Buffer.from(payloadBase64, 'base64url').toString('utf8');
    const payload = JSON.parse(jsonStr) as VerificationTokenPayload;

    if (!payload.memberId || !payload.email || !payload.expiresAt) return null;
    if (payload.expiresAt < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Checks and records rate limits for verification emails.
 */
export function checkVerificationRateLimit(identifier: string): { allowed: boolean; remainingSeconds: number } {
  const now = Date.now();
  const lastTime = RATE_LIMITS.get(identifier);

  if (lastTime && now - lastTime < COOLDOWN_MS) {
    const remainingSeconds = Math.ceil((COOLDOWN_MS - (now - lastTime)) / 1000);
    return { allowed: false, remainingSeconds };
  }

  RATE_LIMITS.set(identifier, now);
  return { allowed: true, remainingSeconds: 0 };
}

/**
 * Sends a branded EntireFM verification email.
 */
export async function sendMemberVerificationEmail(
  email: string,
  firstName: string,
  verificationUrl: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'EntireFM Lobby <updates@entirefm.com>';

  const subject = 'Confirm your EntireFM Lobby Membership';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${subject}</title>
  <style>
    body { font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF9F7; color: #121826; margin: 0; padding: 40px 20px; }
    .container { max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #E5E7EB; border-radius: 8px; padding: 40px; }
    .logo { font-size: 16px; font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase; color: #1E293B; margin-bottom: 24px; }
    .logo span { font-weight: 600; color: #2563EB; }
    h1 { font-size: 24px; font-weight: 300; letter-spacing: -0.02em; color: #0F172A; margin: 0 0 16px 0; }
    p { font-size: 15px; font-weight: 300; line-height: 1.6; color: #475569; margin: 0 0 20px 0; }
    .btn-wrapper { margin: 32px 0; text-align: left; }
    .btn { display: inline-block; background-color: #0F172A; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-size: 13px; font-weight: 400; letter-spacing: 0.05em; text-transform: uppercase; }
    .alt-link { font-size: 12px; color: #64748B; word-break: break-all; margin-top: 24px; padding-top: 20px; border-top: 1px solid #F1F5F9; }
    .footer { margin-top: 32px; font-size: 12px; color: #94A3B8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">THE <span>LOBBY</span> · ENTIREFM</div>
    <h1>Confirm your email address</h1>
    <p>Hello ${firstName || 'there'},</p>
    <p>Thank you for registering to join <strong>The Lobby</strong>, the professional facilities management intelligence community.</p>
    <p>Please confirm your email address to activate your Member profile and participate in discussions, compliance watch, and grounded FM research.</p>
    <div class="btn-wrapper">
      <a href="${verificationUrl}" class="btn">Confirm Email Address →</a>
    </div>
    <p class="alt-link">
      If the button above does not work, copy and paste this link into your browser:<br>
      <a href="${verificationUrl}" style="color: #2563EB;">${verificationUrl}</a>
    </p>
    <div class="footer">
      <p>This verification link will expire in 24 hours. If you did not create this account, you can safely ignore this email.</p>
      <p>&copy; 2026 Entire Facilities Management Ltd.</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Confirm your EntireFM Lobby Membership

Hello ${firstName || 'there'},

Thank you for registering to join The Lobby, the professional facilities management intelligence community.

Please confirm your email address to activate your Member profile:
${verificationUrl}

This verification link will expire in 24 hours. If you did not create this account, you can safely ignore this email.

© 2026 Entire Facilities Management Ltd.
  `.trim();

  if (!resendApiKey) {
    console.info(`[MEMBER_VERIFICATION] (Simulated Send) Verification link for ${email}: ${verificationUrl}`);
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
        from: fromEmail,
        to: email,
        subject,
        html,
        text,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('[MEMBER_VERIFICATION] Resend API error:', data);
      return { success: false, error: data.message || 'Email delivery failed' };
    }

    return { success: true, messageId: data.id };
  } catch (err: any) {
    console.error('[MEMBER_VERIFICATION] Delivery exception:', err);
    return { success: false, error: err.message || 'Delivery exception' };
  }
}

/**
 * Sends a branded EntireFM Lobby password reset email.
 */
export async function sendMemberPasswordResetEmail(
  email: string,
  firstName: string,
  resetUrl: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'EntireFM Security <security@entirefm.com>';

  const subject = 'Reset your EntireFM Lobby Password';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${subject}</title>
  <style>
    body { font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF9F7; color: #121826; margin: 0; padding: 40px 20px; }
    .container { max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #E5E7EB; border-radius: 8px; padding: 40px; }
    .logo { font-size: 16px; font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase; color: #1E293B; margin-bottom: 24px; }
    .logo span { font-weight: 600; color: #2563EB; }
    h1 { font-size: 24px; font-weight: 300; letter-spacing: -0.02em; color: #0F172A; margin: 0 0 16px 0; }
    p { font-size: 15px; font-weight: 300; line-height: 1.6; color: #475569; margin: 0 0 20px 0; }
    .btn-wrapper { margin: 32px 0; text-align: left; }
    .btn { display: inline-block; background-color: #0F172A; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-size: 13px; font-weight: 400; letter-spacing: 0.05em; text-transform: uppercase; }
    .alt-link { font-size: 12px; color: #64748B; word-break: break-all; margin-top: 24px; padding-top: 20px; border-top: 1px solid #F1F5F9; }
    .footer { margin-top: 32px; font-size: 12px; color: #94A3B8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">THE <span>LOBBY</span> · ENTIREFM</div>
    <h1>Password Reset Request</h1>
    <p>Hello ${firstName || 'there'},</p>
    <p>We received a request to reset the password for your EntireFM Lobby account.</p>
    <p>Click the button below to choose a new, secure password:</p>
    <div class="btn-wrapper">
      <a href="${resetUrl}" class="btn">Reset Password →</a>
    </div>
    <p class="alt-link">
      If the button above does not work, copy and paste this link into your browser:<br>
      <a href="${resetUrl}" style="color: #2563EB;">${resetUrl}</a>
    </p>
    <div class="footer">
      <p>This password reset link will expire in 24 hours. If you did not request a password reset, you can safely ignore this email — your account remains secure.</p>
      <p>&copy; 2026 Entire Facilities Management Ltd.</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Reset your EntireFM Lobby Password

Hello ${firstName || 'there'},

We received a request to reset the password for your EntireFM Lobby account.
Please visit the following link to choose a new password:
${resetUrl}

This link will expire in 24 hours. If you did not request this, you can safely ignore this email.

© 2026 Entire Facilities Management Ltd.
  `.trim();

  if (!resendApiKey) {
    console.info(`[MEMBER_PASSWORD_RESET] (Simulated Send) Reset link for ${email}: ${resetUrl}`);
    return { success: true, messageId: `sim_reset_${Date.now()}` };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: email,
        subject,
        html,
        text,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('[MEMBER_PASSWORD_RESET] Resend API error:', data);
      return { success: false, error: data.message || 'Email delivery failed' };
    }

    return { success: true, messageId: data.id };
  } catch (err: any) {
    console.error('[MEMBER_PASSWORD_RESET] Delivery exception:', err);
    return { success: false, error: err.message || 'Delivery exception' };
  }
}

