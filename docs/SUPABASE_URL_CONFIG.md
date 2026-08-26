# Supabase Authentication — URL Configuration

This document defines the required Supabase Auth URL configuration for the EntireFM platform.
These settings must be applied in the **Supabase Dashboard → Authentication → URL Configuration**.

Incorrect configuration here is the root cause of the password reset email redirecting to the homepage
instead of the EntireFM password reset interface.

---

## Site URL

| Environment | Value |
| :--- | :--- |
| **Production** | `https://www.entirefm.com` |
| **Local Development** | `http://localhost:3000` |

Set the **Site URL** to the **production** value. Supabase uses this as the base for all auth emails
when no `redirect_to` is provided.

> **Important**: Setting Site URL to `https://www.entirefm.com/` (with trailing slash) instead of
> `https://www.entirefm.com` can cause redirect mismatches. Use no trailing slash.

---

## Redirect URLs (Allowlist)

All `redirect_to` values passed to Supabase must be explicitly whitelisted here.
Add **all** of the following:

### Production

```
https://www.entirefm.com/auth/confirm
https://www.entirefm.com/supplier-portal/reset-password
https://www.entirefm.com/supplier-portal/sign-in
https://www.entirefm.com/supplier-portal/verify-email
https://www.entirefm.com/supplier-portal/org-setup
```

### Vercel Preview Deployments

Vercel preview URLs follow the pattern `https://<project-name>-<hash>-<team>.vercel.app`.
Use wildcard patterns to cover all previews:

```
https://entirefm-ag-v002-*.vercel.app/auth/confirm
https://entirefm-ag-v002-*.vercel.app/supplier-portal/reset-password
https://entirefm-ag-v002-*.vercel.app/supplier-portal/sign-in
https://entirefm-ag-v002-*.vercel.app/supplier-portal/verify-email
```

> **Note**: Supabase supports `*` wildcards in redirect URLs. The asterisk matches any subdomain
> or path segment at that position.

### Local Development

```
http://localhost:3000/auth/confirm
http://localhost:3000/supplier-portal/reset-password
http://localhost:3000/supplier-portal/sign-in
http://localhost:3000/supplier-portal/verify-email
```

---

## How the Password Reset Flow Uses These URLs

```
User requests reset at /supplier-portal/forgot-password
  ↓
POST /api/supplier/auth/forgot-password
  → calls supabaseRecoverPassword(email, redirectTo)
  → redirectTo = {SITE_URL}/auth/confirm          ← Must be whitelisted
  ↓
Supabase sends recovery email containing:
  {SITE_URL}/auth/confirm?token_hash=<hash>&type=recovery
  ↓
User clicks email link → browser opens:
  /auth/confirm?token_hash=<hash>&type=recovery
  ↓
GET /auth/confirm verifies token_hash server-side with Supabase
  → stores access_token in encrypted HTTP-only cookie (efm_recovery, 5-min TTL)
  → redirects to /supplier-portal/reset-password
  ↓
/supplier-portal/reset-password page loads
  → calls GET /api/supplier/auth/reset-password/session
  → session endpoint reads + immediately deletes the efm_recovery cookie
  → returns access_token to the reset page
  ↓
User enters new password
  → POST /api/supplier/auth/reset-password { accessToken, password }
  → supabaseUpdatePassword(accessToken, newPassword)
  ↓
Success → user sees confirmation → signs in normally
```

---

## Email Verification Flow

```
User registers at /supplier-portal/register
  ↓
POST /api/supplier/auth/register
  → calls supabaseSignUp(email, password, metadata, redirectTo)
  → redirectTo = {SITE_URL}/auth/confirm          ← Must be whitelisted
  ↓
Supabase sends verification email containing:
  {SITE_URL}/auth/confirm?token_hash=<hash>&type=signup
  ↓
User clicks email link → browser opens:
  /auth/confirm?token_hash=<hash>&type=signup
  ↓
GET /auth/confirm verifies token_hash
  → marks supplier domain user as email_verified
  → redirects to /supplier-portal/sign-in?verified=1
  ↓
User signs in → lifecycle-aware routing → portal or onboarding
```

---

## Environment Variables

Ensure these are set in Vercel (and `.env.local` for development):

| Variable | Description | Required |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project REST/Auth URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | ✅ |
| `SITE_URL` | Canonical site URL e.g. `https://www.entirefm.com` | ✅ Strongly recommended |
| `AUTH_HMAC_SECRET` | Secret for signing recovery cookies (min 32 chars) | ✅ Strongly recommended |

`AUTH_HMAC_SECRET` should be a random 32+ character string. If not set, the system falls back to
`ADMIN_PASSWORD` — set it explicitly in production for isolation.

Generate a suitable value with:
```bash
openssl rand -hex 32
```

---

## Verification Checklist

After updating the Supabase Dashboard:

- [ ] Site URL set to `https://www.entirefm.com` (no trailing slash)
- [ ] `/auth/confirm` whitelisted for production
- [ ] `/auth/confirm` whitelisted for Vercel preview pattern
- [ ] `/auth/confirm` whitelisted for localhost
- [ ] `/supplier-portal/reset-password` whitelisted for production
- [ ] `/supplier-portal/sign-in` whitelisted for production
- [ ] `SITE_URL` environment variable set in Vercel
- [ ] `AUTH_HMAC_SECRET` environment variable set in Vercel
- [ ] Password reset email tested end-to-end in production domain
- [ ] Email verification tested end-to-end in production domain
