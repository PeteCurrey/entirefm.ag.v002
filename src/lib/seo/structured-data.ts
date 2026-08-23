/**
 * STRUCTURED DATA (JSON-LD)
 * =========================
 * schema.org generators, emitted as a single @graph per page by
 * <JsonLd> (src/components/seo/JsonLd.tsx).
 *
 * CLAIM GOVERNANCE
 * ----------------
 * Only factual, verified data may enter a schema graph. Schema is a
 * machine-readable assertion to search engines — an unverifiable claim here
 * is worse than the same claim in body copy, because it is consumed literally.
 *
 * Two rules follow from /config/verified-claims.json:
 *
 *  1. GEO_REGIONAL_CENTRES is DO_NOT_USE. EntireFM has no verified physical
 *     premises in the cities it serves, so location pages must NOT emit
 *     LocalBusiness. LocalBusiness asserts a visitable place of business, and
 *     Google treats a fabricated one as a spam signal. Location pages instead
 *     emit Service with areaServed: City, provided by the single Organization —
 *     which is both true and sufficient for local relevance.
 *
 *  2. Accreditations (ISO 9001, NICEIC, Gas Safe, CHAS, SafeContractor, BESA,
 *     F-Gas) are all TO_VERIFY. None may appear as hasCredential until the
 *     registry marks them VERIFIED. addAccreditations() is wired and will
 *     populate itself automatically when that happens.
 */

import { PRODUCTION_CANONICAL_HOST } from '@/config/site';
import { ORGANIZATION_CONFIG } from '@/config/organization';
import { CONTACT_CONFIG } from '@/config/contact';
import { getVerifiedAccreditations } from '@/config/verified-claims';

const SITE = PRODUCTION_CANONICAL_HOST;

/** Stable @id anchors so nodes reference each other instead of repeating. */
export const SCHEMA_IDS = {
  organization: `${SITE}/#organization`,
  website: `${SITE}/#website`,
} as const;

const abs = (p: string) => (p.startsWith('http') ? p : `${SITE}${p.startsWith('/') ? p : `/${p}`}`);

type Node = Record<string, unknown>;

// ─────────────────────────────────────────────────────────────────────────────
// ORGANIZATION — emitted once per page, referenced by every other node
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Accreditations are only emitted once the claims registry verifies them.
 * Until then this returns nothing and the property is omitted entirely.
 */
function accreditations(): Node[] | undefined {
  const verified = getVerifiedAccreditations();
  if (!verified.length) return undefined;
  return verified.map((claim) => ({
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'Accreditation',
    name: claim.approvedWording ?? claim.claim,
  }));
}

export function generateOrganizationSchema(): Node {
  const node: Node = {
    '@type': 'Organization',
    '@id': SCHEMA_IDS.organization,
    name: ORGANIZATION_CONFIG.brandName,
    legalName: ORGANIZATION_CONFIG.legalName,
    url: SITE,
    description: ORGANIZATION_CONFIG.headquarters.description,
    foundingDate: String(ORGANIZATION_CONFIG.foundingYear),
    logo: {
      '@type': 'ImageObject',
      url: abs('/logos/01-wireframe-full-lockup.png'),
    },
    // Country only. No street address or regional premises are claimed —
    // see GEO_REGIONAL_CENTRES in the claims registry.
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GB',
    },
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: CONTACT_CONFIG.mainPhone.display,
        email: CONTACT_CONFIG.enquiryEmail,
        areaServed: 'GB',
        availableLanguage: 'English',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'technical support',
        email: CONTACT_CONFIG.helpdeskEmail,
        areaServed: 'GB',
        availableLanguage: 'English',
      },
    ],
    knowsAbout: [...ORGANIZATION_CONFIG.sectors],
  };

  const creds = accreditations();
  if (creds) node.hasCredential = creds;

  return node;
}

// ─────────────────────────────────────────────────────────────────────────────
// WEBSITE
// ─────────────────────────────────────────────────────────────────────────────

export function generateWebSiteSchema(): Node {
  return {
    '@type': 'WebSite',
    '@id': SCHEMA_IDS.website,
    url: SITE,
    name: ORGANIZATION_CONFIG.brandName,
    publisher: { '@id': SCHEMA_IDS.organization },
    inLanguage: 'en-GB',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// WEBPAGE
// ─────────────────────────────────────────────────────────────────────────────

export function generateWebPageSchema(options: {
  name: string;
  description: string;
  path: string;
  primaryImage?: string;
}): Node {
  const node: Node = {
    '@type': 'WebPage',
    '@id': `${abs(options.path)}#webpage`,
    url: abs(options.path),
    name: options.name,
    description: options.description,
    isPartOf: { '@id': SCHEMA_IDS.website },
    about: { '@id': SCHEMA_IDS.organization },
    inLanguage: 'en-GB',
  };
  if (options.primaryImage) {
    node.primaryImageOfPage = { '@type': 'ImageObject', url: abs(options.primaryImage) };
  }
  return node;
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE
// Used for both service pages and location pages. On a location page the
// areaServed City is what carries the local signal — not a fabricated address.
// ─────────────────────────────────────────────────────────────────────────────

export function generateServiceSchema(options: {
  name: string;
  description: string;
  path: string;
  /** City name for location-scoped pages. Omit for national service pages. */
  city?: string | null;
  serviceType?: string;
  /** Named sub-services, rendered as an offer catalogue. */
  offers?: Array<{ name: string; description?: string }>;
}): Node {
  const node: Node = {
    '@type': 'Service',
    '@id': `${abs(options.path)}#service`,
    name: options.name,
    description: options.description,
    serviceType: options.serviceType ?? 'Facilities Management',
    provider: { '@id': SCHEMA_IDS.organization },
    areaServed: options.city
      ? { '@type': 'City', name: options.city, containedInPlace: { '@type': 'Country', name: 'United Kingdom' } }
      : { '@type': 'Country', name: 'United Kingdom' },
  };

  if (options.offers?.length) {
    node.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: options.name,
      itemListElement: options.offers.map((o) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: o.name,
          ...(o.description ? { description: o.description } : {}),
        },
      })),
    };
  }

  return node;
}

// ─────────────────────────────────────────────────────────────────────────────
// BREADCRUMBS
// ─────────────────────────────────────────────────────────────────────────────

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): Node {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.url),
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────────────────────

export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
  path: string
): Node | null {
  if (!faqs.length) return null;
  return {
    '@type': 'FAQPage',
    '@id': `${abs(path)}#faq`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ARTICLE
// ─────────────────────────────────────────────────────────────────────────────

export function generateArticleSchema(options: {
  headline: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
}): Node {
  const node: Node = {
    '@type': 'Article',
    '@id': `${abs(options.path)}#article`,
    headline: options.headline,
    description: options.description,
    mainEntityOfPage: { '@id': `${abs(options.path)}#webpage` },
    publisher: { '@id': SCHEMA_IDS.organization },
    author: { '@id': SCHEMA_IDS.organization },
    inLanguage: 'en-GB',
  };
  // Historic publication dates carry ranking history — never substitute today's date.
  if (options.datePublished) {
    node.datePublished = options.datePublished;
    node.dateModified = options.dateModified ?? options.datePublished;
  }
  if (options.image) node.image = abs(options.image);
  return node;
}

// ─────────────────────────────────────────────────────────────────────────────
// GRAPH ASSEMBLY
// ─────────────────────────────────────────────────────────────────────────────

/** Wrap nodes into one @graph document, dropping nulls. */
export function buildGraph(nodes: Array<Node | null | undefined>) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean) as Node[],
  };
}
