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

/** Paths currently served by bespoke Tier 1 content. */
export const TIER1_PATHS: ReadonlySet<string> = new Set(Object.keys(TIER1_CONTENT));

/** Load a content record for a given path */
export function loadContentRecord(path: string): ContentRecord | null {
  if (TIER1_CONTENT[path]) return TIER1_CONTENT[path];
  if (RECOVERED_CONTENT[path]) return RECOVERED_CONTENT[path];

  const rec = getContentRecord(path);
  if (rec) return rec;

  try {
    const decoded = decodeURIComponent(path);
    if (TIER1_CONTENT[decoded]) return TIER1_CONTENT[decoded];
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
