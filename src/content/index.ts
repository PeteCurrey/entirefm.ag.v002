/**
 * CONTENT RECORDS — TYPE AND LOADER
 * ====================================
 * Every protected route has its own dedicated content record.
 * Records are stored in /src/content/pages/ and indexed in /src/content/registry.ts.
 *
 * TIER 1 OVERRIDES
 * ----------------
 * The generated records in /src/content/pages are one template with the city
 * name substituted, which measures at ~74% identical across location pages.
 * /src/content/locations rebuilds the highest-value city URLs as genuinely
 * distinct pages and takes precedence here.
 *
 * Overrides only apply to paths that already exist in the route registry, so
 * this changes what a legacy URL says — never whether it exists.
 */

import type { ContentRecord } from '@/lib/routes/route-schema';
import { getAllPaths } from '@/lib/routes/route-registry';
import { CONTENT_DATABASE, getContentRecord } from './registry';
import { buildTier1Records } from './locations/build-tier1';
import { RECOVERED_PAGES } from './locations/recovered-pages';
import aboutRecord from './company/about';
import { COMPLIANCE_CONTENT } from './compliance/records';
import { BLOG_CONTENT } from './blog/records';
import { UTILITY_CONTENT } from './company/utility';
import { GLOSSARY_CONTENT } from './glossary/records';
import { RESOURCES_CONTENT } from './resources/records';
import { AI_RESOURCES_CONTENT } from './resources/ai-records';
import { CLIENT_PORTAL_CONTENT } from './client-portal/records';
import { WORKING_AT_HEIGHT_CONTENT } from './services/working-at-height';
import { DRONE_SERVICES_CONTENT } from './drone-services';
import { GEO_EXPANSION_CONTENT } from './locations/geo-expansion';
import { BATCH1_GEO_CONTENT } from './locations/batch1-services';

export type { ContentRecord };

const REGISTRY_PATHS = new Set(getAllPaths());

/** Bespoke records that supersede the generated ones. */
export const TIER1_CONTENT: Record<string, ContentRecord> = buildTier1Records(REGISTRY_PATHS);

/**
 * Legacy Wix URLs recovered from Wix's internal page manifest — pages neither
 * sitemap listed. These have no generated record at all, so they are the only
 * source of content for their paths.
 */
export const RECOVERED_CONTENT: Record<string, ContentRecord> = RECOVERED_PAGES;

/**
 * Company, editorial, and utility content defined statically. These take
 * precedence over the generated content records.
 */
export const COMPANY_CONTENT: Record<string, ContentRecord> = {
  [aboutRecord.path]: aboutRecord,
  ...COMPLIANCE_CONTENT,
  // The seventeen legacy blog and post URLs. Every one of them was serving a
  // titleised-slug placeholder before this: thin, near-identical pages under
  // URLs Google had indexed since 2019.
  ...BLOG_CONTENT,
  // HTML sitemap, and distinct identities for the four Wix homepage
  // artefacts that were all serving one title string.
  ...UTILITY_CONTENT,
  // FM Glossary estate: national A–Z hub and 21 location-specific glossary pages.
  ...GLOSSARY_CONTENT,
  // Restored & upgraded interactive FM tools, resource hubs, Academy & Intelligence.
  ...RESOURCES_CONTENT,
  // AI in Facilities Management Resource Centre & supporting guides.
  ...AI_RESOURCES_CONTENT,
  // EntireCAFM Client Portal pages & interactive tour architecture
  ...CLIENT_PORTAL_CONTENT,
  // Working at Height, Rope Access & BMU Services
  ...WORKING_AT_HEIGHT_CONTENT,
  // EntireFM Drone Services Division & Sub-Services
  ...DRONE_SERVICES_CONTENT,
  // Geo SEO Expansion Phase 1: 21 Location Hubs & 21 Service Overviews
  ...GEO_EXPANSION_CONTENT,
  // Geo SEO Expansion Phase 2B: 10 High-Intent Batch 1 Service x City Pages
  ...BATCH1_GEO_CONTENT,
};


/** Paths currently served by bespoke Tier 1 content. */
export const TIER1_PATHS: ReadonlySet<string> = new Set(Object.keys(TIER1_CONTENT));

/** Load a content record for a given path */
export function loadContentRecord(path: string): ContentRecord | null {
  if (TIER1_CONTENT[path]) return TIER1_CONTENT[path];
  if (COMPANY_CONTENT[path]) return COMPANY_CONTENT[path];
  if (RECOVERED_CONTENT[path]) return RECOVERED_CONTENT[path];

  const rec = getContentRecord(path);
  if (rec) return rec;

  try {
    const decoded = decodeURIComponent(path);
    if (TIER1_CONTENT[decoded]) return TIER1_CONTENT[decoded];
    if (COMPANY_CONTENT[decoded]) return COMPANY_CONTENT[decoded];
    if (RECOVERED_CONTENT[decoded]) return RECOVERED_CONTENT[decoded];
    const recDecoded = getContentRecord(decoded);
    if (recDecoded) return recDecoded;
    const encoded = encodeURI(path);
    const recEncoded = getContentRecord(encoded);
    if (recEncoded) return recEncoded;
  } catch {}

  return null;
}

export { CONTENT_DATABASE };
