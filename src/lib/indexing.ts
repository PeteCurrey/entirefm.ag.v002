/**
 * SEARCH INDEXING AUTHORITY
 * ==========================
 * Governs whether search crawlers may index pages.
 *
 * Production canonical site is www.entirefm.com.
 * Public marketing, SEO, and contractor acquisition pages are fully indexable.
 *
 * Staging / preview environments (e.g. *.vercel.app) or explicit DISALLOW_SEARCH_INDEXING
 * are protected from indexing to prevent duplicate content.
 */

import { PRODUCTION_HOSTNAME } from '@/config/site';

/**
 * Determine whether search indexing is permitted for a given hostname.
 * Allows www.entirefm.com, entirefm.com, and local development.
 * Blocks non-production preview hostnames (e.g. *.vercel.app) unless explicitly overridden.
 */
export function canIndexRequest(hostname?: string): boolean {
  if (process.env.DISALLOW_SEARCH_INDEXING === 'true') {
    return false;
  }
  if (!hostname) {
    return true;
  }
  const cleanHost = hostname.split(':')[0].toLowerCase();
  if (
    cleanHost === PRODUCTION_HOSTNAME ||
    cleanHost === 'entirefm.com' ||
    cleanHost === 'localhost' ||
    cleanHost === '127.0.0.1'
  ) {
    return true;
  }
  // Vercel preview or other staging domains
  if (cleanHost.endsWith('.vercel.app')) {
    return process.env.ALLOW_SEARCH_INDEXING === 'true';
  }
  return true;
}

/**
 * Static build-time indexing gate.
 * For generateMetadata() and static HTML generation.
 * Default is TRUE so all public static pages are emitted with indexable robots directives.
 */
export function canIndexStaticBuild(): boolean {
  if (process.env.DISALLOW_SEARCH_INDEXING === 'true') {
    return false;
  }
  // If explicitly in a preview deployment without production override
  if (process.env.VERCEL_ENV === 'preview' && process.env.ALLOW_SEARCH_INDEXING !== 'true') {
    return false;
  }
  return true;
}

