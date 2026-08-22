/**
 * PRODUCTION SITE CONFIGURATION
 * ==============================
 * Single canonical source for the production domain.
 * All canonical URL generation must use PRODUCTION_CANONICAL_HOST.
 * Do NOT use process.env.NEXT_PUBLIC_SITE_URL for canonical generation —
 * that env var may be overridden to a staging or preview URL.
 */

export const PRODUCTION_CANONICAL_HOST = 'https://www.entirefm.com' as const;
export const PRODUCTION_HOSTNAME = 'www.entirefm.com' as const;
