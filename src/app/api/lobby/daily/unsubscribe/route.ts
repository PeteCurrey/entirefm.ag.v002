import { NextResponse } from 'next/server';
import { unsubscribeByToken, addSuppression, getSubscriberByEmail } from '@/server/newsletter/store';

export const dynamic = 'force-dynamic';

// ─────────────────────────────────────────────────────────────────────────────
// POST  /api/lobby/daily/unsubscribe
// Handles both JSON bodies (manual form) and form-urlencoded (RFC 8058 POST).
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    let token: string | undefined;
    let email: string | undefined;
    let reason = 'User requested unsubscribe';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const body = await req.json().catch(() => ({}));
      token = body.token;
      email = body.email;
      if (body.reason) reason = body.reason;
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await req.text().catch(() => '');
      const params = new URLSearchParams(text);
      token = params.get('token') ?? undefined;
      email = params.get('email') ?? undefined;
    }

    // Also accept query-string params as fallback
    const { searchParams } = new URL(req.url);
    if (!token) token = searchParams.get('token') ?? undefined;
    if (!email) email = searchParams.get('email') ?? undefined;

    if (token) {
      const result = await unsubscribeByToken(token, reason);
      if (result.success && result.email) {
        // addSuppression: positional args (email, reason, source, notes?)
        await addSuppression(result.email, 'UNSUBSCRIBED', 'ONE_CLICK_LIST_UNSUBSCRIBE');
        return NextResponse.json({ success: true, email: result.email, message: 'Unsubscribed successfully.' });
      }
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 400 });
    }

    if (email) {
      const clean = email.trim().toLowerCase();
      const existing = await getSubscriberByEmail(clean);
      if (existing) {
        await unsubscribeByToken(existing.unsubscribeToken!, reason);
      }
      await addSuppression(clean, 'UNSUBSCRIBED', 'MANUAL_FORM_UNSUBSCRIBE');
      return NextResponse.json({ success: true, email: clean, message: 'Unsubscribed successfully.' });
    }

    return NextResponse.json({ error: 'Token or email required.' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/lobby/daily/unsubscribe?token=...
// Handles one-click mailto unsubscribe links and redirects to the confirmation page.
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  if (token) {
    const result = await unsubscribeByToken(token, 'One-click link unsubscribe');
    if (result.success && result.email) {
      await addSuppression(result.email, 'UNSUBSCRIBED', 'ONE_CLICK_GET');
    }
  } else if (email) {
    const clean = email.trim().toLowerCase();
    const existing = await getSubscriberByEmail(clean);
    if (existing?.unsubscribeToken) {
      await unsubscribeByToken(existing.unsubscribeToken, 'GET link unsubscribe');
    }
    await addSuppression(clean, 'UNSUBSCRIBED', 'MANUAL_GET');
  }

  return NextResponse.redirect(`${origin}/lobby/unsubscribe?confirmed=1`);
}
