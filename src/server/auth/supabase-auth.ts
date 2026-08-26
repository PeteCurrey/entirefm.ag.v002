/**
 * ENTIREFM SUPABASE AUTHENTICATION CLIENT & WRAPPER
 * =================================================
 * Canonical identity provider interface for EntireFM.
 * Supabase Auth is the single authority for:
 *   - User credentials & passwords
 *   - Account registration & sign-up
 *   - Sign-in & token exchange
 *   - Email verification & resend
 *   - Password recovery & reset
 *   - Session authentication
 *
 * EntireFM application code NEVER stores or hashes passwords.
 */

import { getDbConfig } from '../db/client';

export interface SupabaseAuthUser {
  id: string;
  email: string;
  email_confirmed_at: string | null;
  phone?: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    user_type?: string;
    [key: string]: any;
  };
  app_metadata?: {
    provider?: string;
    providers?: string[];
    [key: string]: any;
  };
  created_at: string;
  updated_at?: string;
}

export interface SupabaseAuthSession {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  user: SupabaseAuthUser;
}

export interface SupabaseAuthResponse<T = any> {
  data: T | null;
  error: { message: string; status?: number; code?: string } | null;
}

function getAuthHeaders(anonOrServiceKey?: string) {
  const cfg = getDbConfig();
  const key = anonOrServiceKey || cfg?.key || '';
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };
}

function getAuthUrl(): string {
  const cfg = getDbConfig();
  if (!cfg?.url) {
    throw new Error('Supabase URL is not configured in environment variables.');
  }
  return cfg.url.replace(/\/$/, '');
}

/**
 * 1. Sign Up a new user with Supabase Auth
 */
export async function supabaseSignUp(
  email: string,
  password: string,
  metadata?: {
    first_name?: string;
    last_name?: string;
    user_type?: string;
    [key: string]: any;
  },
  redirectTo?: string
): Promise<SupabaseAuthResponse<{ user: SupabaseAuthUser | null; session: SupabaseAuthSession | null }>> {
  try {
    const url = `${getAuthUrl()}/auth/v1/signup`;
    const cfg = getDbConfig();
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || cfg?.key || '';

    const body: Record<string, any> = {
      email: email.trim().toLowerCase(),
      password,
      data: metadata || {},
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(anonKey),
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = json.msg || json.error_description || json.message || `Sign up failed (${res.status})`;
      return {
        data: null,
        error: { message: msg, status: res.status, code: json.error_code || json.code },
      };
    }

    // Supabase returns user and optionally session
    const user: SupabaseAuthUser | null = json.user || (json.id ? json : null);
    const session: SupabaseAuthSession | null = json.session || (json.access_token ? json : null);

    return {
      data: { user, session },
      error: null,
    };
  } catch (err: any) {
    console.error('[SUPABASE_AUTH] Sign up exception:', err);
    return {
      data: null,
      error: { message: err?.message || 'Authentication service unreachable', status: 500 },
    };
  }
}

/**
 * 2. Sign In an existing user with Supabase Auth (Password Grant)
 */
export async function supabaseSignIn(
  email: string,
  password: string
): Promise<SupabaseAuthResponse<SupabaseAuthSession>> {
  try {
    const url = `${getAuthUrl()}/auth/v1/token?grant_type=password`;
    const cfg = getDbConfig();
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || cfg?.key || '';

    const res = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(anonKey),
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
      }),
      cache: 'no-store',
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = json.error_description || json.msg || json.message || 'Invalid login credentials';
      return {
        data: null,
        error: { message: msg, status: res.status, code: json.error || json.code },
      };
    }

    const session: SupabaseAuthSession = {
      access_token: json.access_token,
      token_type: json.token_type || 'bearer',
      expires_in: json.expires_in || 3600,
      refresh_token: json.refresh_token,
      user: json.user,
    };

    return { data: session, error: null };
  } catch (err: any) {
    console.error('[SUPABASE_AUTH] Sign in exception:', err);
    return {
      data: null,
      error: { message: err?.message || 'Authentication service unreachable', status: 500 },
    };
  }
}

/**
 * 3. Trigger Password Recovery Email via Supabase Auth
 */
export async function supabaseRecoverPassword(
  email: string,
  redirectTo?: string
): Promise<SupabaseAuthResponse<{ message: string }>> {
  try {
    const url = `${getAuthUrl()}/auth/v1/recover`;
    const cfg = getDbConfig();
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || cfg?.key || '';

    const body: Record<string, any> = {
      email: email.trim().toLowerCase(),
    };
    if (redirectTo) {
      body.redirect_to = redirectTo;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(anonKey),
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    // Supabase returns 200 or empty object even if user does not exist (enumeration prevention)
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      return {
        data: null,
        error: {
          message: json.msg || json.message || 'Failed to send recovery email',
          status: res.status,
        },
      };
    }

    return { data: { message: 'Recovery email sent' }, error: null };
  } catch (err: any) {
    console.error('[SUPABASE_AUTH] Password recovery exception:', err);
    return {
      data: null,
      error: { message: err?.message || 'Authentication service unreachable', status: 500 },
    };
  }
}

/**
 * 4. Resend Confirmation Email via Supabase Auth
 */
export async function supabaseResendVerification(
  email: string,
  redirectTo?: string
): Promise<SupabaseAuthResponse<{ message: string }>> {
  try {
    const url = `${getAuthUrl()}/auth/v1/resend`;
    const cfg = getDbConfig();
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || cfg?.key || '';

    const body: Record<string, any> = {
      type: 'signup',
      email: email.trim().toLowerCase(),
    };
    if (redirectTo) {
      body.redirect_to = redirectTo;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(anonKey),
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      return {
        data: null,
        error: {
          message: json.msg || json.message || 'Failed to resend confirmation email',
          status: res.status,
        },
      };
    }

    return { data: { message: 'Confirmation email resent' }, error: null };
  } catch (err: any) {
    console.error('[SUPABASE_AUTH] Resend verification exception:', err);
    return {
      data: null,
      error: { message: err?.message || 'Authentication service unreachable', status: 500 },
    };
  }
}

/**
 * 5. Update User Password using active access token (e.g. from password recovery session)
 */
export async function supabaseUpdatePassword(
  accessToken: string,
  newPassword: string
): Promise<SupabaseAuthResponse<SupabaseAuthUser>> {
  try {
    const url = `${getAuthUrl()}/auth/v1/user`;

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: newPassword }),
      cache: 'no-store',
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        data: null,
        error: {
          message: json.msg || json.message || 'Password update failed',
          status: res.status,
        },
      };
    }

    return { data: json, error: null };
  } catch (err: any) {
    console.error('[SUPABASE_AUTH] Update password exception:', err);
    return {
      data: null,
      error: { message: err?.message || 'Authentication service unreachable', status: 500 },
    };
  }
}

/**
 * 6. Get User details from Supabase Auth Access Token
 */
export async function supabaseGetUser(
  accessToken: string
): Promise<SupabaseAuthResponse<SupabaseAuthUser>> {
  try {
    const url = `${getAuthUrl()}/auth/v1/user`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        data: null,
        error: {
          message: json.msg || json.message || 'Invalid or expired token',
          status: res.status,
        },
      };
    }

    return { data: json, error: null };
  } catch (err: any) {
    console.error('[SUPABASE_AUTH] Get user exception:', err);
    return {
      data: null,
      error: { message: err?.message || 'Authentication service unreachable', status: 500 },
    };
  }
}

/**
 * 7. Admin: Get or verify user by UUID using Service Role Key
 */
export async function supabaseAdminGetUser(
  userId: string
): Promise<SupabaseAuthResponse<SupabaseAuthUser>> {
  try {
    const url = `${getAuthUrl()}/auth/v1/admin/users/${userId}`;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      return { data: null, error: { message: 'Service role key not configured', status: 500 } };
    }

    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(serviceKey),
      cache: 'no-store',
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        data: null,
        error: {
          message: json.msg || json.message || 'User not found in Supabase Auth',
          status: res.status,
        },
      };
    }

    return { data: json, error: null };
  } catch (err: any) {
    console.error('[SUPABASE_AUTH] Admin get user exception:', err);
    return {
      data: null,
      error: { message: err?.message || 'Authentication service unreachable', status: 500 },
    };
  }
}

/**
 * 8. Verify Token Hash / OTP (Email Confirmation, Signup, Recovery, MagicLink)
 */
export type EmailOtpType = 'signup' | 'invite' | 'magiclink' | 'recovery' | 'email_change' | 'email';

export async function supabaseVerifyOtp(
  token_hash: string,
  type: EmailOtpType | string = 'email'
): Promise<SupabaseAuthResponse<{ user: SupabaseAuthUser | null; session: SupabaseAuthSession | null }>> {
  try {
    const url = `${getAuthUrl()}/auth/v1/verify`;
    const cfg = getDbConfig();
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || cfg?.key || '';

    const body: Record<string, any> = {
      token_hash,
      type: type || 'email',
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(anonKey),
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = json.msg || json.error_description || json.message || 'Invalid or expired verification link';
      return {
        data: null,
        error: { message: msg, status: res.status, code: json.error_code || json.code },
      };
    }

    const user: SupabaseAuthUser | null = json.user || (json.id ? json : null);
    const session: SupabaseAuthSession | null = json.session || (json.access_token ? json : null);

    return {
      data: { user, session },
      error: null,
    };
  } catch (err: any) {
    console.error('[SUPABASE_AUTH] Verify OTP exception:', err);
    return {
      data: null,
      error: { message: err?.message || 'Authentication service unreachable', status: 500 },
    };
  }
}
