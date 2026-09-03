import type { MetadataRoute } from 'next';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

/**
 * ROBOTS.TXT
 * ===========
 * Provides search engine crawling instructions.
 *
 * Public SEO, facilities management services, and contractor acquisition
 * routes are fully open for crawling.
 *
 * Private admin, client dashboards, contractor portals, engineer workspaces,
 * authentication endpoints, and internal APIs are strictly disallowed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin',
          '/admin/',
          '/client',
          '/client/',
          '/clients',
          '/clients/',
          '/client-portal',
          '/client-portal/',
          '/contractor',
          '/contractor/',
          '/engineer',
          '/engineer/',
          '/member',
          '/member/',
          '/lobby/messages',
          '/lobby/messages/',
          '/lobby/notifications',
          '/lobby/notifications/',
          '/lobby/preferences',
          '/lobby/preferences/',
          '/login',
          '/sign-in',
          '/forgot-password',
          '/reset-password',
          '/verify-email',
          '/supplier-portal/sign-in',
          '/supplier-portal/forgot-password',
          '/supplier-portal/reset-password',
          '/supplier-portal/verify-email',
          '/supplier-portal/actions',
          '/supplier-portal/approvals',
          '/supplier-portal/availability',
          '/supplier-portal/billing',
          '/supplier-portal/company',
          '/supplier-portal/compliance',
          '/supplier-portal/coverage',
          '/supplier-portal/documents',
          '/supplier-portal/events',
          '/supplier-portal/jobs',
          '/supplier-portal/membership',
          '/supplier-portal/onboarding',
          '/supplier-portal/opportunities',
          '/supplier-portal/org-setup',
          '/supplier-portal/performance',
          '/supplier-portal/relationship',
          '/supplier-portal/resources',
          '/supplier-portal/resume',
          '/supplier-portal/services',
          '/supplier-portal/support',
          '/supplier-portal/users',
          '/helpdesk-registration',
          '/fm-supply-form',
        ],
      },
    ],
    sitemap: `${PRODUCTION_CANONICAL_HOST}/sitemap.xml`,
    host: PRODUCTION_CANONICAL_HOST,
  };
}

