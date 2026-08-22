/**
 * SEARCH INDEXING AUTHORITY
 * ==========================
 * Single function governing whether search crawlers may index any page.
 *
 * ALL THREE conditions must be true for indexing to be permitted:
 *   1. ALLOW_SEARCH_INDEXING === 'true'  (explicit production opt-in flag)
 *   2. VERCEL_ENV === 'production'        (not a preview or staging deployment)
 *   3. actual request hostname === 'www.entirefm.com'
 *      (NOT a SITE_URL env var check — the actual hostname of the request)
 *
 * A Vercel deployment at entirefmagv002.vercel.app, even if VERCEL_ENV is
 * 'production', will always produce noindex because hostname does not match.
 *
 * Import and use canIndexRequest() in:
 *   - src/lib/metadata/generate-metadata.ts
 *   - src/app/robots.ts
 *   - Any future response headers middleware
 */

import { PRODUCTION_HOSTNAME } from '@/config/site';

/**
 * Determine whether search indexing is permitted for a given hostname.
 * Pass the actual request hostname (e.g. from headers().get('host')).
 * For static generation contexts where hostname is unknown, pass undefined
 * — this will default to BLOCKED (safe fail).
 */
export function canIndexRequest(hostname?: string): boolean {
  const allowFlag = process.env.ALLOW_SEARCH_INDEXING === 'true';
  const isVercelProd = process.env.VERCEL_ENV === 'production';
  const isHostMatch = hostname === PRODUCTION_HOSTNAME;

  return allowFlag && isVercelProd && isHostMatch;
}

/**
 * Static build-time indexing gate.
 * For generateMetadata() calls (no request context available).
 * Uses env vars only — NEVER allows indexing on staging builds
 * because SITE_URL env var is not used.
 *
 * Note: A correct production build must set:
 *   ALLOW_SEARCH_INDEXING=true
 *   VERCEL_ENV=production
 *   NEXT_PUBLIC_SITE_URL=https://www.entirefm.com
 */
export function canIndexStaticBuild(): boolean {
  const allowFlag = process.env.ALLOW_SEARCH_INDEXING === 'true';
  const isVercelProd = process.env.VERCEL_ENV === 'production';
  // For static builds, we also require NEXT_PUBLIC_SITE_URL to match
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const isSiteUrlProd = siteUrl.includes(PRODUCTION_HOSTNAME);

  return allowFlag && isVercelProd && isSiteUrlProd;
}
