/**
 * STRUCTURED DATA INFRASTRUCTURE
 * ================================
 * JSON-LD schema.org structured data generators.
 *
 * IMPORTANT: Only VERIFIED business claims may be populated.
 * Unverified claims must remain as TODO comments until confirmed
 * in /docs/content/BUSINESS-CLAIMS-VERIFICATION.md
 *
 * See: /docs/content/BUSINESS-CLAIMS-VERIFICATION.md
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://entirefm.com';

// ─────────────────────────────────────────────────────────────────────────────
// ORGANIZATION
// Populate only with VERIFIED claims.
// ─────────────────────────────────────────────────────────────────────────────

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Entire FM',
    url: SITE_URL,
    // TODO: Add logo URL once confirmed
    // TODO: Add telephone once verified (see BUSINESS-CLAIMS-VERIFICATION.md)
    // TODO: Add address once verified
    // TODO: Add founding date once verified (reportedly 2009)
    // TODO: Add sameAs social links once confirmed
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL BUSINESS
// Only populate address/telephone for VERIFIED locations.
// ─────────────────────────────────────────────────────────────────────────────

export function generateLocalBusinessSchema(options?: {
  city?: string;
  areaServed?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Entire FM',
    url: SITE_URL,
    // TODO: addressLocality: options?.city — only add once address verified
    // TODO: telephone — only add once regional numbers verified
    areaServed: options?.areaServed ?? 'United Kingdom',
    priceRange: '££',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export function generateServiceSchema(options: {
  name: string;
  description: string;
  url: string;
  areaServed?: string;
  serviceType?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: options.name,
    description: options.description,
    url: options.url,
    provider: {
      '@type': 'Organization',
      name: 'Entire FM',
      url: SITE_URL,
    },
    areaServed: options.areaServed ?? 'United Kingdom',
    serviceType: options.serviceType ?? 'Facilities Management',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BREADCRUMB LIST
// ─────────────────────────────────────────────────────────────────────────────

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ARTICLE (for blog posts)
// ─────────────────────────────────────────────────────────────────────────────

export function generateArticleSchema(options: {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.headline,
    description: options.description,
    url: options.url,
    publisher: {
      '@type': 'Organization',
      name: 'Entire FM',
      url: SITE_URL,
    },
    datePublished: options.datePublished,
    dateModified: options.dateModified ?? options.datePublished,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ PAGE
// ─────────────────────────────────────────────────────────────────────────────

export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// WEB PAGE
// ─────────────────────────────────────────────────────────────────────────────

export function generateWebPageSchema(options: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: options.name,
    description: options.description,
    url: options.url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Entire FM',
      url: SITE_URL,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD SCRIPT TAG HELPER
// ─────────────────────────────────────────────────────────────────────────────

export function jsonLdScript(schema: Record<string, unknown>): string {
  return JSON.stringify(schema);
}
